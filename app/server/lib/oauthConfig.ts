declare var ServiceConfiguration;  // From Meteor package

export class OauthServiceConfig {
    private oauthProviders = ['google', 'facebook'];

    private createServiceConfiguration(provider) {
        ServiceConfiguration.configurations.remove({service: provider});

        var oauthServiceConfig = {
            google: {
                service: provider,
                clientId: Meteor.settings["private"][provider]["clientId"],
                secret: Meteor.settings["private"][provider]["secret"],
                loginStyle: "popup"
            },
            facebook: {
                service: provider,
                appId: Meteor.settings["private"][provider]["appId"],
                secret: Meteor.settings["private"][provider]["secret"],
                loginStyle: "popup"
            }
        };

        switch (provider) {
            case 'google':
                ServiceConfiguration.configurations.insert(oauthServiceConfig.google);
                break;
            case 'facebook':
                ServiceConfiguration.configurations.insert(oauthServiceConfig.facebook);
                break;
        }
    }

    public initOauthServices() {
        this.oauthProviders.forEach(this.createServiceConfiguration);
    }
}