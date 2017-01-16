import {Component, NgZone} from '@angular/core';
import {AlertController} from 'ionic-angular';
import {MeteorComponent} from 'angular2-meteor';
import {TranslateService} from 'ng2-translate';
import {Constants} from "../../../../../both/Constants";

import template from './language-select.html';
@Component({
    selector: 'language-select',
    template
})
export class LanguageSelectComponent extends MeteorComponent {
    public language:string;
    public langCode:string;

    constructor(public zone:NgZone,
                public translate:TranslateService,
                public alertCtrl:AlertController) {
        super();
        this.setLanguage();
    }

    ngOnInit():void {
        // Use MeteorComponent autorun to respond to reactive session variables.
        this.autorun(() => {
            // Wait for translations to be ready
            // in case component loads before the language is set
            // or the language is changed after the component has been rendered.
            if (Session.get(Constants.SESSION.TRANSLATIONS_READY)) {
                this.translate.get('language').subscribe((translation:string) => {
                    this.language = translation;
                });
                if (Session.get(Constants.SESSION.LANGUAGE)) {
                    this.setLanguage();
                }
            }
        });
    }

    private selectLanguage() {
        var self = this;
        let alert = self.alertCtrl.create({
            title: self.translate.instant("language-select.header"),
            inputs: [
                {type: 'radio', label: 'English', value: 'en', checked: (self.langCode === "en")},
                {type: 'radio', label: 'Español', value: 'es', checked: (self.langCode === "es")}
            ],
            buttons: [
                {
                    text: self.translate.instant("general.cancel")
                },
                {
                    text: self.translate.instant("general.ok"),
                    handler: data => {
                        Session.set(Constants.SESSION.TRANSLATIONS_READY, false);
                        Session.set(Constants.SESSION.LANGUAGE, data);
                        self.translate.use(data);
                        self.setLanguage();
                    }
                }
            ]
        });
        alert.present();
    }

    private setLanguage() {
        this.langCode = Session.get(Constants.SESSION.LANGUAGE);
        this.language = this.translate.instant("language");
    }
}