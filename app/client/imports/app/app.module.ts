import { NgModule, ErrorHandler } from "@angular/core";
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule } from '@angular/http';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { Constants } from "../../../both/Constants";
import { AppComponent } from "./app.component";
import { HomePage } from "./pages/home/home";
import { DemoComponent } from "./components/demo/demo.component";
import { DemoDataService } from "./components/demo/demo-data.service";
import {WelcomeHeaderComponent} from "./components/welcome-header/welcome-header";
import {LanguageSelectComponent} from "./components/language-select/language-select";
import {AboutPage} from "./pages/about/about";

// Login components
import {LoginPage} from "./pages/account/login/login";
import {LoginCardComponent} from "./pages/account/login/login-card/login-card";
import {CreateAccountCardComponent} from "./pages/account/login/create-account-card/create-account-card";
import {ForgotPasswordCardComponent} from "./pages/account/login/forgot-password-card/forgot-password-card";
import {PasswordResetCardComponent} from "./pages/account/login/password-reset-card/password-reset-card";
import {OauthProviderComponent} from "./pages/account/login/oauth/oauth-provider";

// Account management components
import {AccountMenuPage} from "./pages/account/account-menu/account-menu";
import {ChangePasswordPage} from "./pages/account/account-menu/change-password/change-password";
import {EditProfilePage} from "./pages/account/account-menu/edit-profile/edit-profile";
import {AddImageComponent} from "./components/add-image/add-image";


@NgModule({
    // Components(Pages), Pipes, Directive
    declarations: [
        AppComponent,
        HomePage,
        DemoComponent,
        WelcomeHeaderComponent,
        LanguageSelectComponent,
        AboutPage,
        LoginPage,
        LoginCardComponent,
        CreateAccountCardComponent,
        ForgotPasswordCardComponent,
        PasswordResetCardComponent,
        OauthProviderComponent,
        AccountMenuPage,
        ChangePasswordPage,
        EditProfilePage,
        AddImageComponent
    ],
    // Pages
    entryComponents: [
        AppComponent,
        HomePage,
        LoginPage,
        AboutPage,
        AccountMenuPage,
        ChangePasswordPage,
        EditProfilePage
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
