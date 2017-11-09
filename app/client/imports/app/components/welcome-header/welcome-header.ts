import {Component} from '@angular/core';
import {TranslateService} from 'ng2-translate';

@Component({
    selector: "welcome-header",
    templateUrl: "welcome-header.html"
})
export class WelcomeHeaderComponent {
    constructor(public translate:TranslateService) {
    }
}