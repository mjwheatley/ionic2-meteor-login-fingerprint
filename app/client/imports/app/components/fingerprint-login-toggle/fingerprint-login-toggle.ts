import {Component, OnInit} from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';
import {MeteorComponent} from 'angular2-meteor';
import {TranslateService} from 'ng2-translate';
import {Constants} from "../../../../../both/Constants";
import {ToastMessenger} from "../../utils/ToastMessenger";
import {FingerprintHelper} from "../../utils/FingerprintHelper";

declare var device;
declare var FingerprintAuth; // cordova-plugin-android-fingerprint-auth

import template from './fingerprint-login-toggle.html';
@Component({
    selector: 'fingerprint-login-toggle',
    template
})
export class FingerprintLoginToggleComponent extends MeteorComponent implements OnInit {
    public user:Meteor.User;
    public isCordova:boolean;
    public isFingerprintEnabled:boolean = false;
    private isInit:boolean = false;
    private initFingerprintLoginToggle:boolean = false;
    private fingerprintHelper:FingerprintHelper;
    private secret:string;

    constructor(public nav:NavController,
                public alertCtrl:AlertController,
                public translate:TranslateService) {
        super();
    }

    ngOnInit():void {
        this.isCordova = Meteor.isCordova;
        this.fingerprintHelper = new FingerprintHelper();
        this.autorun(() => {
            this.user = Meteor.user();
            if (!this.isInit) {
                this.isInit = true;
                var isFingerprintEnabled:boolean = (this.user.profile.deviceId);
                if (isFingerprintEnabled) {
                    this.initFingerprintLoginToggle = true;
                }
                var deviceId:string = this.user.profile.deviceId;
                this.isFingerprintEnabled = (deviceId && deviceId === device.uuid);
            }
        });
    }

    public toggleFingerprintEnabled():void {
        var self = this;
        if (self.isInit && self.isFingerprintEnabled && !self.initFingerprintLoginToggle) {
            self.openFingerprintLoginDialog();
        } else {
            self.disableFingerprintAuthentication();
        }

        if (self.initFingerprintLoginToggle) {
            self.initFingerprintLoginToggle = false;
        }
    }

    private disableFingerprintAuthentication():void {
        var self = this;
        Meteor.call("/auth/fingerprint/disable", (error, result) => {
            if (error) {
                new ToastMessenger().toast({
                    type: "error",
                    message: self.translate.instant("fingerprint-helper.errors.disable")
                });
            }
        });
    }

    private openFingerprintLoginDialog():void {
        var self = this;

        let alert = self.alertCtrl.create({
            title: self.translate.instant("fingerprint-login-toggle.title"),
            subTitle: self.translate.instant("fingerprint-login-toggle.alerts.fingerprintLogin.subTitle"),
            message: self.translate.instant("fingerprint-login-toggle.alerts.fingerprintLogin.message"),
            buttons: [{
                text: self.translate.instant("general.cancel"),
                handler: data => {
                    self.isFingerprintEnabled = false;
                }
            }, {
                text: self.translate.instant("general.ok"),
                handler: data => {
                    alert.dismiss().then(() => {
                        if (Meteor.isCordova) {
                            self.startFingerprintAuthFlow();
                        }
                    });
                    return false;
                }
            }],
            enableBackdropDismiss: false
        });
        alert.present();
    }

    private startFingerprintAuthFlow():void {
        var self = this;

        self.fingerprintHelper.isFingerprintAvailable((error, result) => {
            var errorMsg = Constants.EMPTY_STRING;
            if (error) {
                console.log("error: " + JSON.stringify(error));
                self.isFingerprintEnabled = false;
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
                    self.isFingerprintEnabled = false;
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

                self.getFingerprintCredentialsToEncrypt();
            }
        });
    }

    private getFingerprintCredentialsToEncrypt():void {
        var self = this;
        if (Meteor.isCordova) {
            Session.set(Constants.SESSION.LOADING, true);
            Meteor.call("/auth/fingerprint/android/credentials/secret", {
                deviceId: device.uuid
            }, (error, result) => {
                Session.set(Constants.SESSION.LOADING, false);
                if (error) {
                    console.log("error: " + JSON.stringify(error));
                    self.isFingerprintEnabled = false;
                    let alert = self.alertCtrl.create({
                        title: self.translate.instant("fingerprint-helper.errors.authenticationError"),
                        message: error.reason,
                        buttons: [self.translate.instant("general.ok")]
                    });
                    alert.present();
                } else {
                    console.log("getFingerprintCredentialsToEncrypt() result: " + JSON.stringify(result));
                    self.secret = result.secret;
                    self.doFingerprintAuthentication(self.secret);
                }
            });
        }
    }

    private doFingerprintAuthentication(secret:string):void {
        var self = this;
        if (Meteor.isCordova) {
            var options:any = {
                secret: secret
            };
            if (device.platform === Constants.DEVICE.IOS) {
                options.message = self.translate.instant("fingerprint-helper.touchId.scanFingerprint");
            }
            self.fingerprintHelper.authenticate({
                secret: secret
            }, (error, result) => {
                if (error) {
                    console.log("authentication error: " + error);
                    self.isFingerprintEnabled = false;
                    if (error !== FingerprintAuth.ERRORS.FINGERPRINT_CANCELLED) {
                        let alert = self.alertCtrl.create({
                            title: self.translate.instant("fingerprint-helper.errors.authenticationError"),
                            message: error,
                            buttons: [self.translate.instant("general.ok")]
                        });
                        alert.present();
                    }
                } else {
                    console.log("authentication result: " + JSON.stringify(result));
                    if (device.platform === Constants.DEVICE.ANDROID) {
                        if (!result.withFingerprint && !result.token) {
                            self.isFingerprintEnabled = false;
                            let alert = self.alertCtrl.create({
                                title: self.translate.instant("fingerprint-helper.errors.authenticationError"),
                                message: self.translate.instant("fingerprint-helper.enableAuthentication.failure"),
                                buttons: [self.translate.instant("general.ok")]
                            });
                            alert.present();
                            return;
                        }
                    } else if (device.platform === Constants.DEVICE.IOS) {
                        result.token = self.secret;
                    }
                    self.saveEncryptedToken(result.token);
                }
            });
        }
    }

    private saveEncryptedToken(token:string):void {
        var self = this;
        Session.set(Constants.SESSION.LOADING, true);
        Meteor.call("/auth/fingerprint/android/credentials/token/save", {
            deviceId: device.uuid,
            token: token
        }, (error, result) => {
            Session.set(Constants.SESSION.LOADING, false);
            if (error) {
                console.log("saveEncryptedToken() Error: " + JSON.stringify(error));
                self.isFingerprintEnabled = false;
            } else {
                console.log("saveEncryptedToken() result: " + JSON.stringify(result));
                new ToastMessenger().toast({
                    type: "success",
                    message: self.translate.instant("fingerprint-helper.enableAuthentication.success")
                });
            }
        });
    }
}