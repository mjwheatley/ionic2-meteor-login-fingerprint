import {Component, OnInit, NgZone} from '@angular/core';
import {IONIC_DIRECTIVES, NavController, Alert} from 'ionic-angular';
import {FormBuilder, Validators, AbstractControl, FormGroup} from '@angular/forms';
import {MeteorComponent} from 'angular2-meteor';
import {TranslateService} from 'ng2-translate';
import {Constants} from "../../../../../../../both/Constants";
import {FormValidator} from "../../../../utils/FormValidator";
import {HomePage} from '../../../home/home';

import template from './password-reset-card.html';
@Component({
    selector: 'password-reset-card',
    template
})
export class PasswordResetCardComponent extends MeteorComponent implements OnInit {
    public user:Meteor.User;
    public passwordResetForm:FormGroup;
    public formControl:{
        passwordResetCode:AbstractControl,
        password:AbstractControl,
        confirmPassword:AbstractControl
    };
    public resetPasswordError:boolean = false;
    public resetPasswordErrorMessage:string;

    constructor(public nav:NavController,
                public fb:FormBuilder,
                public zone:NgZone,
                public translate:TranslateService) {
        super();
    }

    ngOnInit() {
        this.passwordResetForm = this.fb.group({
            'passwordResetCode': [Constants.EMPTY_STRING, Validators.compose([
                Validators.required,
                FormValidator.validPasswordResetToken
            ])],
            'password': [Constants.EMPTY_STRING, Validators.compose([
                Validators.required
            ])],
            'confirmPassword': [Constants.EMPTY_STRING, Validators.compose([
                Validators.required
            ])]
        }, {validator: FormValidator.matchingFields('mismatchedPasswords', 'password', 'confirmPassword')});
        this.formControl = {
            passwordResetCode: this.passwordResetForm.controls['passwordResetCode'],
            password: this.passwordResetForm.controls['password'],
            confirmPassword: this.passwordResetForm.controls['confirmPassword']
        };

        this.autorun(() => this.zone.run(() => {
            this.user = Meteor.user();
            this.resetPasswordError = Session.get(Constants.SESSION.RESET_PASSWORD_ERROR);
            this.resetPasswordErrorMessage = Session.get(Constants.SESSION.RESET_PASSWORD_ERROR_MESSAGE);
        }));
    }

    public resetPassword(form:{passwordResetCode:string, password:string, confirmPassword:string}):void {
        var component = this;
        if (this.passwordResetForm.valid) {
            Accounts.resetPassword(form.passwordResetCode, form.password, function (error) {
                if (error) {
                    console.log("Reset Password Error: " + JSON.stringify(error));
                    if (error.reason === Constants.METEOR_ERRORS.TOKEN_EXPIRED) {
                        Session.set(Constants.SESSION.RESET_PASSWORD_ERROR, true);
                        Session.set(Constants.SESSION.RESET_PASSWORD_ERROR_MESSAGE,
                            component.translate.instant("password-reset-card.errors.passwordResetCode"));
                        component.formControl.passwordResetCode.updateValueAndValidity(true);
                    }
                } else {
                    console.log("Successfully changed password");
                    Session.set(Constants.SESSION.RESET_PASSWORD_TOKEN, null);
                    Session.set(Constants.SESSION.WAS_PASSWORD_RESET, true);
                    component.nav.setRoot(HomePage);
                }
            });
        }
    }

    public showSignInCard() {
        Session.set(Constants.SESSION.RESET_PASSWORD, !Session.get(Constants.SESSION.RESET_PASSWORD));
    }
}