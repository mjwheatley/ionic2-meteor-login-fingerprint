import {Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {MeteorComponent} from 'angular2-meteor';
import {TranslateService} from "ng2-translate";
import {FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';
import {Constants} from "../../../../../../../both/Constants";
import {ToastMessenger} from "../../../../utils/ToastMessenger";
import {FormValidator} from "../../../../utils/FormValidator";

import template from "./change-password.html";
@Component({
    selector: "page-change-password",
    template
})
export class ChangePasswordPage extends MeteorComponent implements OnInit {
    public changePasswordForm:FormGroup;
    public formControl:{
        password:AbstractControl,
        newPassword:AbstractControl,
        confirmPassword:AbstractControl
    };

    public incorrectPassword:boolean = false;

    constructor(public nav:NavController,
                public translate:TranslateService,
                public fb:FormBuilder) {
        super();
    }

    ngOnInit() {
        this.changePasswordForm = this.fb.group({
            'password': [Constants.EMPTY_STRING, Validators.compose([
                Validators.required,
                FormValidator.validPassword
            ])],
            'newPassword': [Constants.EMPTY_STRING, Validators.compose([
                Validators.required
            ])],
            'confirmPassword': [Constants.EMPTY_STRING, Validators.compose([
                Validators.required
            ])]
        }, {
            validator: Validators.compose([
                FormValidator.matchingFields('mismatchedPasswords', 'newPassword', 'confirmPassword')
            ])
        });

        this.formControl = {
            password: this.changePasswordForm.controls['password'],
            newPassword: this.changePasswordForm.controls['newPassword'],
            confirmPassword: this.changePasswordForm.controls['confirmPassword']
        };

        this.autorun(() => {
            this.incorrectPassword = Session.get(Constants.SESSION.INCORRECT_PASSWORD);
        });
    }

    public changePassword(form:{
        password:string,
        newPassword:string,
        confirmPassword:string
    }):void {
        var self = this;
        if (this.changePasswordForm.valid) {
            Accounts.changePassword(
                form.password,
                form.newPassword,
                function (error) {
                    if (error) {
                        if (error.reason) {
                            var message = error.reason;
                            if (error.reason === Constants.METEOR_ERRORS.INCORRECT_PASSWORD) {
                                console.log("Incorrect password");
                                Session.set(Constants.SESSION.INCORRECT_PASSWORD, true);
                                self.formControl.password.updateValueAndValidity(true);
                            } else if (error.reason === Constants.METEOR_ERRORS.NO_PASSWORD) {
                                message = self.translate.instant("login-card.errors.socialSignIn");
                            }
                            new ToastMessenger().toast({
                                type: "error", 
                                message: message
                            });
                        }
                    } else {
                        new ToastMessenger().toast({
                            type: "success", 
                            message: self.translate.instant("page-change-password.success")
                        });
                        self.nav.pop();
                    }
                }
            )
        }
    }

    /*Life Cycle*/
    ionViewWillEnter() {
        Session.set(Constants.SESSION.INCORRECT_PASSWORD, false);
    }
}