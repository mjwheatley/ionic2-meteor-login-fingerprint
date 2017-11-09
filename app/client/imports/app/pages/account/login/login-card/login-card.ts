import {Component, OnInit, NgZone} from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';
import {FormBuilder, Validators, AbstractControl, FormGroup} from '@angular/forms';
import {MeteorComponent} from 'angular2-meteor';
import {HomePage} from '../../../home/home';
import {Constants} from "../../../../../../../both/Constants";
import {FormValidator} from "../../../../utils/FormValidator";
import {ToastMessenger} from "../../../../utils/ToastMessenger";
import {TranslateService} from 'ng2-translate';
import {FingerprintHelper} from "../../../../utils/FingerprintHelper";

declare var device;

@Component({
    selector: "login-card",
    templateUrl: "login-card.html"
})
export class LoginCardComponent extends MeteorComponent implements OnInit {
    public loginForm:FormGroup;
    public formControl:{
        email:AbstractControl,
        password:AbstractControl
    };
    public loginInputs:{
        email:string,
        password:string
    };
    public isCordova:boolean;
    private fingerprintHelper:FingerprintHelper;

    constructor(public nav:NavController,
                public alertCtrl:AlertController,
                public fb:FormBuilder,
                public zone:NgZone,
                public translate:TranslateService) {
        super();
    }

    ngOnInit() {
        this.isCordova = Meteor.isCordova;
        this.fingerprintHelper = new FingerprintHelper();
        this.loginInputs = {
            email: Constants.EMPTY_STRING,
            password: Constants.EMPTY_STRING
        };
        this.loginForm = this.fb.group({
            'email': [Constants.EMPTY_STRING, Validators.compose([
                Validators.required,
                FormValidator.validEmail,
                FormValidator.registered
            ])],
            "password": [Constants.EMPTY_STRING, Validators.compose([
                Validators.required,
                FormValidator.validPassword
            ])]
        });

        this.formControl = {
            email: this.loginForm.controls['email'],
            password: this.loginForm.controls['password']
        };

        this.autorun(() => {
            if (Meteor.user()) {
                this.nav.setRoot(HomePage);
            }
        });

        this.autorun(() => this.zone.run(() => {
            Session.get(Constants.SESSION.REGISTERED_ERROR);
            Session.get(Constants.SESSION.INCORRECT_PASSWORD);
            this.loginInputs.email = Session.get(Constants.SESSION.EMAIL) || null;
        }));
    }

    public onSubmit():void {
        var self = this;
        if (self.loginForm.valid) {
            Session.set(Constants.SESSION.EMAIL, self.loginInputs.email);
            Session.set(Constants.SESSION.LOADING, true);
            Meteor.loginWithPassword({
                    email: self.loginInputs.email.toLowerCase()
                },
                self.loginInputs.password,
                (error) => {
                    Session.set(Constants.SESSION.LOADING, false);
                    if (error) {
                        console.log("loginWithPassword Error: " + JSON.stringify(error));
                        var toastMessage = null;
                        if (error.reason) {
                            if (error.reason === Constants.METEOR_ERRORS.INCORRECT_PASSWORD) {
                                console.log("Incorrect password");
                                Session.set(Constants.SESSION.INCORRECT_PASSWORD, true);
                                self.formControl.password.updateValueAndValidity(true);
                            } else if (error.reason === Constants.METEOR_ERRORS.USER_NOT_FOUND) {
                                console.log("User not found");
                                Session.set(Constants.SESSION.REGISTERED_ERROR, true);
                                self.formControl.email.updateValueAndValidity(true);
                            } else if (error.reason === Constants.METEOR_ERRORS.NO_PASSWORD) {
                                toastMessage = self.translate.instant("login-card.errors.socialSignIn");
                            } else {
                                toastMessage = error.reason;
                            }
                        } else {
                            toastMessage = error.message;
                        }
                        if (toastMessage) {
                            new ToastMessenger().toast({
                                type: "error",
                                message: toastMessage,
                                title: self.translate.instant("login-card.errors.signIn")
                            });
                        }
                    } else {
                        console.log("Successfully logged in with password.");
                    }
                }
            );
        }
    }

    public fingerprintLogin():void {
        var self = this;
        if (self.formControl.email.valid) {
            Session.set(Constants.SESSION.EMAIL, self.loginInputs.email);
            Session.set(Constants.SESSION.LOADING, true);
            self.getFingerprintToken();
        }
    }

    private getFingerprintToken():void {
        var self = this;
        Meteor.call("/auth/fingerprint/android/credentials/token", {
            email: self.loginInputs.email,
            deviceId: device.uuid
        }, (error, result) => {
            Session.set(Constants.SESSION.LOADING, false);
            if (error) {
                console.log("Error: " + JSON.stringify(error));
                var errorMsg = error;
                if (error.message) {
                    errorMsg = error.message;
                }
                if (error.reason) {
                    errorMsg = error.reason;
                }
                if (error.error === Constants.METEOR_ERRORS.FINGERPRINT_NOT_ENABLED) {
                    errorMsg = self.translate.instant("fingerprint-helper.errors.notEnabled")
                }

                let alert = self.alertCtrl.create({
                    title: self.translate.instant("fingerprint-helper.errors.authenticationError"),
                    message: errorMsg,
                    buttons: [self.translate.instant("general.ok")]
                });
                alert.present();
            } else {
                self.isFingerprintAuthAvailable(result.token);
            }
        });
    }

    private isFingerprintAuthAvailable(secret:string):void {
        var self = this;

        self.fingerprintHelper.isFingerprintAvailable((error, result) => {
            var errorMsg = Constants.EMPTY_STRING;
            if (error) {
                console.log("error: " + error);

                errorMsg = error;
                let alert = self.alertCtrl.create({
                    title: self.translate.instant("fingerprint-helper.errors.authenticationError"),
                    message: errorMsg,
                    buttons: [self.translate.instant("general.ok")]
                });
                alert.present();
            } else {
                console.log("isFingerprintAvailable() result: " + JSON.stringify(result));

                if (!result.isAvailable) {
                    if (!result.isHardwareDetected) {
                        errorMsg = self.translate.instant("fingerprint-helper.errors.hardwareRequired");
                    } else if (!result.hasEnrolledFingerprints) {
                        errorMsg = self.translate.instant("fingerprint-helper.errors.noFingerprints");
                    }
                    let alert = self.alertCtrl.create({
                        title: self.translate.instant("fingerprint-helper.errors.notAvailable"),
                        message: errorMsg,
                        buttons: [self.translate.instant("general.ok")]
                    });
                    alert.present();
                }

                self.doFingerprintAuthentication(secret);
            }
        });
    }

    private doFingerprintAuthentication(secret:string):void {
        var self = this;
        var options:any = {
            secret: secret,
            mode: Constants.CIPHER_MODE.DECRYPT
        };
        if (device.platform === Constants.DEVICE.IOS) {
            options.ios = {
                message: self.translate.instant("fingerprint-helper.touchId.scanFingerprint")
            };
        }
        self.fingerprintHelper.authenticate(options, (error, result) => {
            if (error) {
                console.log("error: " + JSON.stringify(error));
                let alert = self.alertCtrl.create({
                    title: self.translate.instant("fingerprint-helper.errors.authenticationError"),
                    message: error,
                    buttons: [self.translate.instant("general.ok")]
                });
                alert.present();
            } else {
                console.log("result: " + JSON.stringify(result));
                if (device.platform === Constants.DEVICE.ANDROID) {
                    if (!result.withFingerprint && !result.password) {
                        let alert = self.alertCtrl.create({
                            title: self.translate.instant("fingerprint-helper.login.authenticationError"),
                            message: self.translate.instant("fingerprint-helper.login.failure"),
                            buttons: [self.translate.instant("general.ok")]
                        });
                        return;
                    }
                    secret = result.password;
                }

                Session.set(Constants.SESSION.LOADING, true);
                self.verifyCredentials(secret);
            }
        });
    }

    private verifyCredentials(secret:string):void {
        var self = this;
        Meteor.call("/auth/fingerprint/android/credentials/secret/verify", {
            email: self.loginInputs.email,
            secret: secret
        }, (error, result) => {
            Session.set(Constants.SESSION.LOADING, false);
            if (error) {
                console.log("Error verifying credentials: " + JSON.stringify(error));
                var errorMsg = error;
                if (error.message) {
                    errorMsg = error.message;
                }
                if (error.reason) {
                    errorMsg = error.reason;
                }

                let alert = self.alertCtrl.create({
                    title: self.translate.instant("fingerprint-helper.errors.authenticationError"),
                    message: errorMsg,
                    buttons: [self.translate.instant("general.ok")]
                });
            } else {
                console.log("Verify credentials result: " + JSON.stringify(result));
                if (result.isVerified && result.loginToken) {
                    Meteor.loginWithToken(result.loginToken);
                } else {
                    new ToastMessenger().toast({
                        type: "error",
                        message: self.translate.instant("fingerprint-helper.login.failure")
                    });
                }
            }
        });
    }

    public showForgotPasswordCard():void {
        Session.set(Constants.SESSION.FORGOT_PASSWORD, true);
        Session.set(Constants.SESSION.EMAIL, this.loginInputs.email);
    }

    public showCreateAccountCard():void {
        Session.set(Constants.SESSION.CREATE_ACCOUNT, true);
        Session.set(Constants.SESSION.EMAIL, this.loginInputs.email);
    }
}