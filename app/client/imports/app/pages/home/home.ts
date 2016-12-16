import {Component} from '@angular/core';
import {App, NavController} from 'ionic-angular';
import {MeteorComponent} from 'angular2-meteor';
import {TranslateService} from 'ng2-translate';
import {Constants} from "../../../../../both/Constants";
//noinspection TypeScriptCheckImport
import template from './home.html';


//import {WelcomeHeaderComponent} from '../../components/welcome-header/welcome-header';
//import {LanguageSelectComponent} from "../../components/language-select/language-select";

@Component({
    selector: 'page-home',
    template
})
export class HomePage extends MeteorComponent {
    public user:Meteor.User;

    constructor(public app:App,
                public nav:NavController,
                public translate:TranslateService
    ) {
        super();
    }

    ngOnInit():void {
        // Use MeteorComponent autorun to respond to reactive session variables.
        this.autorun(() => {
            this.user = Meteor.user();



            // Wait for translations to be ready
            // in case component loads before the language is set
            // or the language is changed after the component has been rendered.
            // Since this is the home page, this component and any child components
            // will need to wait for translations to be ready.
            if (Session.get(Constants.SESSION.TRANSLATIONS_READY)) {
                this.translate.get('home.title').subscribe((translation:string) => {

                    // Set title of web page in browser
                    this.app.setTitle(translation);
                });
            }
        });
    }
}
