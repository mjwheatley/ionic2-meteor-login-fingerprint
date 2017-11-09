import {Component, OnInit} from "@angular/core";
import {Observable, Subscription} from "rxjs";
import {MeteorObservable} from "meteor-rxjs";
import {DemoDataService} from "./demo-data.service";
import {Demo} from "../../../../../both/models/demo.model";
import {MeteorComponent} from "angular2-meteor";
import {TranslateService} from "ng2-translate";
import {Constants} from "../../../../../both/Constants";

@Component({
    selector: "demo",
    templateUrl: "demo.component.html"
})
export class DemoComponent extends MeteorComponent implements OnInit {
    public data:Observable<Demo[]>;
    public demoListSubscription:Subscription;

    constructor(private demoDataService:DemoDataService,
                public translate:TranslateService) {
        super();
        this.greeting = Constants.EMPTY_STRING;
    }

    ngOnInit() {
        this.demoListSubscription = MeteorObservable.subscribe('demoList').subscribe(() => {
            this.data = this.demoDataService.getData();
        });

        // // Use MeteorComponent autorun to respond to reactive session variables.
        // this.autorun(() => {
        //     // Wait for translations to be ready
        //     // in case component loads before the language is set
        //     // or the language is changed after the component has been rendered.
        //     if (Session.get(Constants.SESSION.TRANSLATIONS_READY)) {
        //         this.translate.get('demo.greeting').subscribe((translation:string) => {
        //             this.greeting = translation;
        //         });
        //     }
        // });
    }

    ngOnDestroy() {
        if (this.demoListSubscription) {
            this.demoListSubscription.unsubscribe();
        }
    }
}
