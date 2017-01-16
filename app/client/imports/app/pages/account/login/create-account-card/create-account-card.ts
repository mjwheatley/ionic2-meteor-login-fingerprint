import {Component, OnInit} from '@angular/core';
import {NavController, Alert} from 'ionic-angular';
import {FormBuilder, Validators, AbstractControl, FormGroup} from '@angular/forms';
import {MeteorComponent} from 'angular2-meteor';
import {HomePage} from '../../../home/home';
import {Constants} from "../../../../../../../both/Constants";
import {FormValidator} from "../../../../utils/FormValidator";
import {ToastMessenger} from "../../../../utils/ToastMessenger";
import {TranslateService} from "ng2-translate";

import template from "./create-account-card.html";
@Component({
    selector: 'create-account-card',
    template
})
export class CreateAccountCardComponent extends MeteorComponent implements OnInit {
    public createAccountForm:FormGroup;
    public formControl:{
        givenName:AbstractControl,
        familyName:AbstractControl,
        email:AbstractControl,
        confirmEmail:AbstractControl,
        password:AbstractControl,
        confirmPassword:AbstractControl
    };

    public user:{
        email:string,
        password:string,
        profile:{
            name:{
                given:string,
                family:string,
                display:string
            }
        }
    };

    constructor(public nav:NavController,
                public fb:FormBuilder, public translate:TranslateService) {
        super();
    }

    ngOnInit() {
        /* Setup form controls */
        this.createAccountForm = this.fb.group({
            'givenName': [Constants.EMPTY_STRING, Validators.compose([
                Validators.required,
            ])],
            'familyName': [Constants.EMPTY_STRING, Validators.compose([
                Validators.required,
            ])],
            'email': [Constants.EMPTY_STRING, Validators.compose([
                Validators.required,
                FormValidator.validEmail,
                FormValidator.notRegistered
            ])],
            'confirmEmail': [Constants.EMPTY_STRING, Validators.compose([
                Validators.required,
                FormValidator.validEmail
            ])],
            'password': [Constants.EMPTY_STRING, Validators.compose([
                Validators.required
            ])],
            'confirmPassword': [Constants.EMPTY_STRING, Validators.compose([
                Validators.required
            ])]
        }, {
            validator: Validators.compose([
                FormValidator.matchingFields('mismatchedPasswords', 'password', 'confirmPassword'),
                FormValidator.matchingFields('mismatchedEmails', 'email', 'confirmEmail')
            ])
        });

        this.formControl = {
            givenName: this.createAccountForm.controls['givenName'],
            familyName: this.createAccountForm.controls['familyName'],
            email: this.createAccountForm.controls['email'],
            confirmEmail: this.createAccountForm.controls['confirmEmail'],
            password: this.createAccountForm.controls['password'],
            confirmPassword: this.createAccountForm.controls['confirmPassword']
        };
        /* End for control */

        this.user = {
            email: Constants.EMPTY_STRING,
            password: Constants.EMPTY_STRING,
            profile: {
                name: {
                    given: Constants.EMPTY_STRING,
                    family: Constants.EMPTY_STRING,
                    display: Constants.EMPTY_STRING
                }
            }
        };

        this.autorun(() => {
            this.user.email = Session.get(Constants.SESSION.EMAIL);
            Session.get(Constants.SESSION.NOT_REGISTERED_ERROR);
        });
    }

    public createAccount():void {
        if (this.createAccountForm.valid) {
            var component = this;
            Session.set(Constants.SESSION.EMAIL, component.user.email);
            Accounts.createUser({
                email: component.user.email,
                password: component.user.password,
                profile: {
                    name: {
                        display: component.user.profile.name.given + " " + component.user.profile.name.family,
                        given: component.user.profile.name.given,
                        family: component.user.profile.name.family
                    }
                }
            }, function (error) {
                if (error) {
                    console.log("Error creating user: " + JSON.stringify(error));
                    var toastMessage = Constants.EMPTY_STRING;
                    if (error.reason) {
                        if (error.reason === Constants.METEOR_ERRORS.EMAIL_EXISTS) {
                            Session.set(Constants.SESSION.NOT_REGISTERED_ERROR, true);
                            component.formControl.email.updateValueAndValidity(true);
                            error.reason = component.translate.instant(
                                "create-account-card.errors.alreadyRegistered");
                        }
                        toastMessage = error.reason;
                    } else {
                        toastMessage = error.message;
                    }
                    new ToastMessenger().toast({
                        type: "error",
                        message: toastMessage,
                        title: component.translate.instant(
                            "create-account-card.errors.createAccount")
                    });
                } else {
                    console.log("Successfully created a new user account.");
                    // TODO show a welcome alert dialog
                    component.nav.setRoot(HomePage);
                }
            });
        }
    }

    public showSignInCard() {
        Session.set(Constants.SESSION.CREATE_ACCOUNT, !Session.get(Constants.SESSION.CREATE_ACCOUNT));
        Session.set(Constants.SESSION.EMAIL, this.user.email);
    }
}