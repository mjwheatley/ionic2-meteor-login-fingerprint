import {Component, OnInit, NgZone} from '@angular/core';
import {NavController} from 'ionic-angular';
import {FormBuilder, Validators, AbstractControl, FormGroup} from '@angular/forms';
import {MeteorComponent} from 'angular2-meteor';
import {HomePage} from '../../../home/home';
import {Constants} from "../../../../../../../both/Constants";
import {FormValidator} from "../../../../utils/FormValidator";
import {ToastMessenger} from "../../../../utils/ToastMessenger";
import {TranslateService} from 'ng2-translate';

import template from "./login-card.html";
@Component({
    selector: 'login-card',
    template
})
export class LoginCardComponent extends MeteorComponent implements OnInit {
    public loginForm:FormGroup;
    public formControl:{
        email:AbstractControl,
        password:AbstractControl
    };
    public loginInputs: {
        email:string,
        password:string
    };

    constructor(public nav:NavController,
                public fb:FormBuilder,
                public zone:NgZone,
                public translate:TranslateService) {
        super();
    }

    ngOnInit() {
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
            this.loginInputs.email = Session.get(Constants.SESSION.EMAIL);
        }));
    }

    public onSubmit():void {
        var component = this;
        if (this.loginForm.valid) {
            Session.set(Constants.SESSION.EMAIL, this.loginInputs.email);
            Meteor.loginWithPassword(
                {email: this.loginInputs.email.toLowerCase()},
                this.loginInputs.password,
                function (error) {
                    if (error) {
                        console.log("loginWithPassword Error: " + JSON.stringify(error));
                        var toastMessage = null;
                        if (error.reason) {
                            if (error.reason === Constants.METEOR_ERRORS.INCORRECT_PASSWORD) {
                                console.log("Incorrect password");
                                Session.set(Constants.SESSION.INCORRECT_PASSWORD, true);
                                component.formControl.password.updateValueAndValidity(true);
                            } else if (error.reason === Constants.METEOR_ERRORS.USER_NOT_FOUND) {
                                console.log("User not found");
                                Session.set(Constants.SESSION.REGISTERED_ERROR, true);
                                component.formControl.email.updateValueAndValidity(true);
                            } else if (error.reason === Constants.METEOR_ERRORS.NO_PASSWORD) {
                                toastMessage = component.translate.instant("login-card.errors.socialSignIn");
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
                                title: component.translate.instant("login-card.errors.signIn")
                            });
                        }
                    } else {
                        console.log("Successfully logged in with password.");
                        //component.nav.rootNav.setRoot(HomePage);
                    }
                }
            );
        }
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