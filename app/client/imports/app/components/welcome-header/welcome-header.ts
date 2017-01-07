import {Component} from '@angular/core';
import {TranslateService} from 'ng2-translate';

import template from './welcome-header.html';
@Component({
    selector: 'welcome-header',
    template
})
export class WelcomeHeaderComponent {
    constructor(public translate:TranslateService) {
    }
}