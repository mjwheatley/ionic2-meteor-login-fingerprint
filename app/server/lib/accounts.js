Accounts.validateNewUser(function (user) {
    var email;
    if (user && user.services) {
        if (user.services.google && user.services.google.email) {
            email = user.services.google.emailControl;
        } else if (user.services.facebook && user.services.facebook.email) {
            email = user.services.facebook.emailControl;
        }
    }
    if (email) {
        var meteorUser = Accounts.findUserByEmail(email);
        if (meteorUser) {
            var provider;
            if (meteorUser.services.password) {
                provider = Meteor.settings.public["appName"];
            } else if (meteorUser.services.google) {
                provider = "Google";
            } else if (meteorUser.services.facebook) {
                provider = "Facebook";
            }
            throw new Meteor.Error("email-registered", "This account signs in with " + provider + ".");
        }
    }
    return true;
});

Accounts.onCreateUser(function (options, user) {
    if (options.profile) {
        user.profile = options.profile;
    }
    // Copy oauth information to meteor profile
    if (user && user.services) {
        if (user.services.google) {
            var google = user.services.google;
            user.emails = [{
                address: google.email,
                verified: google.verified_email
            }];
            user.profile.name = {
                display: google.name,
                given: google.given_name,
                family: google.family_name
            };
            user.profile.picture = google.picture;
        } else if (user.services.facebook) {
            var facebook = user.services.facebook;
            user.emails = [{
                address: facebook.email,
                verified: false
            }];
            user.profile.name = {
                display: facebook.name,
                given: facebook.first_name,
                family: facebook.last_name
            };
        }
    }
    return user;
});

Accounts.emailTemplates.siteName = Meteor.settings.public["appName"];
Accounts.emailTemplates.from = "Ionic2-Meteor-Login Accounts <contact@localhost.com>";
Accounts.emailTemplates.resetPassword.subject = function (user) {
    return "Password Reset Requested";
};
Accounts.emailTemplates.resetPassword.html = function (user, url) {
    var token = url.split("reset-password/")[1];
    console.log("token: " + token);
    return "Hello " + user.profile.name.display + ", \n\nTo reset your password, copy and paste the following password reset code into the prompt.\n\nPassword Rest Code: " + token +
        "\n\nThanks for using " + Meteor.settings.public["appName"] + "!"
};