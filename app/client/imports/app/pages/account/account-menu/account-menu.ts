import {Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {MeteorComponent} from 'angular2-meteor';
import {TranslateService} from "ng2-translate";
import {INavigationMenuPage} from "../../../app.component";
import {Constants} from "../../../../../../both/Constants";

//Pages
import {EditProfilePage} from './edit-profile/edit-profile';
import {ChangePasswordPage} from './change-password/change-password';

import template from "./account-menu.html";
@Component({
    selector: "page-account-menu",
    template
})
export class AccountMenuPage extends MeteorComponent implements OnInit {
    public user:Meteor.User;
    public pages:Array<INavigationMenuPage>;

    constructor(public nav:NavController,
                public translate:TranslateService) {
        super();
    }

    ngOnInit():void {
        this.pages = [{
            icon: "create",
            title: "page-edit-profile.title",
            component: EditProfilePage
        }, {
            icon: "swap",
            title: "page-change-password.title",
            component: ChangePasswordPage
        }];

        this.autorun(() => {
            this.user = Meteor.user();
        });
    }

    public openPage(page):void {
        this.nav.push(page.component);
    }
}