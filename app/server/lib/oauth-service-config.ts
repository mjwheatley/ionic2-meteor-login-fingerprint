declare var ServiceConfiguration;  // From Meteor package

export class OauthServiceConfig {
    private oauthProviders = ['google', 'facebook'];

    private createServiceConfiguration(provider) {
        ServiceConfiguration.configurations.remove({service: provider});

        var providers = Meteor.settings["private"]["oauth2"]["providers"];
        var oauthServiceConfig = {
            google: {
                service: provider,
                clientId: providers[provider]["clientId"],
                secret: providers[provider]["secret"],
                loginStyle: "popup"
            },
            facebook: {
                service: provider,
                appId: providers[provider]["appId"],
                secret: providers[provider]["secret"],
                loginStyle: "popup"
            }
        };

        ServiceConfiguration.configurations.insert(oauthServiceConfig[provider]);
    }

    public initOauthServices() {
        this.oauthProviders.forEach(this.createServiceConfiguration);
    }
}