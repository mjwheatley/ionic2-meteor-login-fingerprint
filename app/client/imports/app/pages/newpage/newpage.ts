import {Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {MeteorComponent} from 'angular2-meteor';
import {TranslateService} from 'ng2-translate';

// TODO change template path
import template from './newpage.html';
//TODO change selector
@Component({
    selector: 'page-newpage',
    template
})
//TODO change class name
//TODO add component to declarations and entryComponents in app.modulte.ts
export class NewPagePage extends MeteorComponent implements OnInit {
    public user:Meteor.User;

    constructor(public nav:NavController,
                public translate:TranslateService) {
        super();
    }

    ngOnInit():void {
        this.autorun(() => {
            this.user = Meteor.user();
        });
    }
}