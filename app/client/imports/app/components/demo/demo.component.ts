import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { DemoDataService } from "./demo-data.service";
import { Demo } from "../../../../../both/models/demo.model";
import { MeteorComponent } from 'angular2-meteor';
import {TranslateService} from 'ng2-translate';
import {Constants} from "../../../../../both/Constants";

import template from "./demo.component.html";
import style from "./demo.component.scss";
@Component({
    selector: "demo",
    template,
    styles: [style]
})
export class DemoComponent extends MeteorComponent implements OnInit {
    public greeting:string;
    data:Observable<Demo[]>;

    constructor(private demoDataService:DemoDataService,
                public translate:TranslateService) {
        super();
        this.greeting = Constants.EMPTY_STRING;
    }

    ngOnInit() {
        this.data = this.demoDataService.getData();

        // Use MeteorComponent autorun to respond to reactive session variables.
        this.autorun(() => {
            // Wait for translations to be ready
            // in case component loads before the language is set
            // or the language is changed after the component has been rendered.
            if (Session.get(Constants.SESSION.TRANSLATIONS_READY)) {
                this.translate.get('demo.greeting').subscribe((translation:string) => {
                    console.log("translate subscription callback: ", translation);
                    this.greeting = translation;
                });
            }
        });
    }
}
