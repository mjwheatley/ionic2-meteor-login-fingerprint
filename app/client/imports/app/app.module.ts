import {NgModule, ErrorHandler} from "@angular/core";
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from '@angular/http';
import {TranslateModule, TranslateLoader, TranslateStaticLoader} from 'ng2-translate';
import {Constants} from "../../../both/Constants";
import {AppComponent} from "./app.component";
import {HomePage} from "./pages/home/home";
import {DemoComponent} from "./components/demo/demo.component";
import {DemoDataService} from "./components/demo/demo-data.service";
import {WelcomeHeaderComponent} from "./components/welcome-header/welcome-header";
import {LanguageSelectComponent} from "./components/language-select/language-select";

@NgModule({
    // Components/Pages, Pipes, Directive
    declarations: [
        AppComponent,
        HomePage,
        DemoComponent,
        WelcomeHeaderComponent,
        LanguageSelectComponent
    ],
    // Pages
    entryComponents: [
        AppComponent,
        HomePage
    ],
    // Providers
    providers: [
        DemoDataService,
        {
            provide: ErrorHandler,
            useClass: IonicErrorHandler
        }
    ],
    // Modules
    imports: [
        BrowserModule,
        HttpModule,
        TranslateModule.forRoot(),
        IonicModule.forRoot(AppComponent, {
            //// http://ionicframework.com/docs/v2/api/config/Config/
            //mode: Constants.STYLE.MD,
            //pageTransition: Constants.STYLE.IOS,
            //swipeBackEnabled: false,
            //tabbarPlacement: 'top'
        }),
    ],
    // Main Component
    bootstrap: [IonicApp]
})
export class AppModule {
    constructor() {

    }
}
