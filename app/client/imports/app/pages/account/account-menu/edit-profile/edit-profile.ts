import {Component, OnInit, NgZone} from '@angular/core';
import {NavController} from 'ionic-angular';
import {MeteorComponent} from 'angular2-meteor';
import {FormBuilder, Validators, AbstractControl, FormGroup} from '@angular/forms';
import {TranslateService} from 'ng2-translate';
import {ToastMessenger} from "../../../../utils/ToastMessenger";
import {Constants} from "../../../../../../../both/Constants";
// import {AddImageComponent} from '../../../../components/add-image/add-image';

import template from './edit-profile.html';
@Component({
    selector: "page-edit-profile",
    template
})
export class EditProfilePage extends MeteorComponent implements OnInit {
    public editProfileForm:FormGroup;
    public formControl:{
        givenName:AbstractControl;
        familyName:AbstractControl;
    };

    public user:Meteor.User;
    public imageUri:string;
    public placeholderImageUri:string = Constants.ADD_IMAGE_PLACEHOLDER_URI;
    public tracker:any;
    public initProfilePic:boolean = true;

    constructor(public nav:NavController,
                public zone:NgZone,
                public translate:TranslateService,
                public fb:FormBuilder) {
        super();
    }

    ngOnInit() {
        this.editProfileForm = this.fb.group({
            'givenName': [Constants.EMPTY_STRING, Validators.compose([
                Validators.required,
            ])],
            'familyName': [Constants.EMPTY_STRING, Validators.compose([
                Validators.required,
            ])]
        });

        this.formControl = {
            givenName: this.editProfileForm.controls['givenName'],
            familyName: this.editProfileForm.controls['familyName']
        };


        this.tracker = Tracker.autorun(() => this.zone.run(() => {
            this.user = Meteor.user();
            if (this.user && this.initProfilePic) {
                this.initProfilePic = false;
                Session.set(Constants.SESSION.imageUri, this.user.profile.picture);
            }
            this.imageUri = Session.get(Constants.SESSION.imageUri);
        }));
    }

    public updateProfile():void {
        var self = this;
        if (this.editProfileForm.valid) {
            Meteor.users.update(Meteor.userId(), {
                $set: {
                    "profile.name.given": this.user.profile.name.given,
                    "profile.name.family": this.user.profile.name.family,
                    "profile.name.display": this.user.profile.name.given + " " + this.user.profile.name.family,
                    "profile.picture": Session.get(Constants.SESSION.imageUri)
                }
            }, function (error, result) {
                if (error) {
                    console.log("Error updating user profile: " + error.reason);
                    new ToastMessenger().toast({
                        type: "error",
                        message: error.reason,
                        title: self.translate.instant("page-edit-profile.errors.updateProfile")
                    });
                } else {
                    new ToastMessenger().toast({
                        type: "success",
                        message: self.translate.instant("page-edit-profile.updateProfileSuccess")
                    });
                    self.nav.pop();
                }
            });
        }
    }

    /*Life Cycle*/
    ionViewWillLeave() {
        // stop tracker so item does not continue to update
        this.tracker.stop();
    }
}