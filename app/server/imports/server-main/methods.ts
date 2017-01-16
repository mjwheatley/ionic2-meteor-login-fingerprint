import {Constants} from "../../../both/Constants";
var Future = Npm.require('fibers/future');
var bcrypt = Npm.require('bcrypt');

declare var console;
declare var Accounts;

export class MeteorMethods {
    private readonly bcryptSaltRounds = 13;

    public init():void {
        Meteor.methods({
            '/auth/fingerprint/android/credentials/secret': (data:{deviceId:string}) => {
                var self = this;
                var user:Meteor.User = self.checkForUser();  // throws errors
                if (user) {
                    var future = new Future();
                    var secret = bcrypt.hashSync(user._id + data.deviceId, self.bcryptSaltRounds);
                    var hash = bcrypt.hashSync(secret, self.bcryptSaltRounds);
                    // Store hash in your password DB.
                    Meteor.users.update(user._id, {
                        $set: {
                            "services.fingerprint.bcrypt": hash
                        }
                    }, (error, result) => {
                        if (error) {
                            console.log("Error saving fingerprint services: ", error);
                            future.throw(error);
                        } else {
                            future.return({secret: secret});
                        }
                    });

                    try {
                        return future.wait();
                    } catch (error) {
                        throw error;
                    }
                }
            },
            '/auth/fingerprint/android/credentials/secret/verify': (data:{
                email:string,
                secret:string
            }) => {
                var self = this;
                var user:Meteor.User = Accounts.findUserByEmail(data.email);
                if (!user) {
                    throw new Meteor.Error("account-not-found", "Email not found.");
                } else {
                    var hash = null;
                    var verified = false;
                    if (user.services.fingerprint && user.services.fingerprint.bcrypt) {
                        hash = user.services.fingerprint.bcrypt;
                    }
                    if (hash) {
                        verified = bcrypt.compareSync(data.secret, hash);
                    }

                    var loginToken:string;
                    if (verified) {
                        var stampedLoginToken = Accounts._generateStampedLoginToken();
                        Accounts._insertLoginToken(user._id, stampedLoginToken);
                        loginToken = stampedLoginToken.token;
                    }

                    return {isVerified: verified, loginToken: loginToken};
                }
            },
            '/auth/fingerprint/android/credentials/token/save': (data:{deviceId:string, token:string}) => {
                var self = this;
                var user:Meteor.User = self.checkForUser();  // throws errors
                if (user) {
                    var future = new Future();
                    Meteor.users.update(user._id, {
                        $set: {
                            "services.fingerprint.token": data.token,
                            "profile.deviceId": data.deviceId
                        }
                    }, (error, result) => {
                        if (error) {
                            console.log("Error saving fingerprint token: ", error);
                            future.throw(error);
                        } else {
                            future.return(true);
                        }
                    });

                    try {
                        return future.wait();
                    } catch (error) {
                        throw error;
                    }
                }
            },
            '/auth/fingerprint/android/credentials/token': (data:{email:string, deviceId:string}) => {
                var self = this;
                var user:Meteor.User = Accounts.findUserByEmail(data.email);
                if (!user) {
                    throw new Meteor.Error("account-not-found", "Email not found.");
                } else {
                    if (user.profile.deviceId === data.deviceId &&
                        user.services.fingerprint &&
                        user.services.fingerprint.token) {
                        return {token: user.services.fingerprint.token};
                    } else {
                        throw new Meteor.Error(Constants.METEOR_ERRORS.FINGERPRINT_NOT_ENABLED,
                            "Fingerprint authentication is not enabled for this user.");
                    }
                }
            },
            '/auth/fingerprint/disable': () => {
                var self = this;
                var user:Meteor.User = self.checkForUser();  // throws errors
                if (user) {
                    var future = new Future();

                    Meteor.users.update(user._id, {
                        $set: {
                            "profile.deviceId": null
                        }
                    }, (error, result) => {
                        if (error) {
                            console.log("Error disabling fingerprintAuthentication: ", error);
                            future.throw(error);
                        } else {
                            future.return(true);
                        }
                    });

                    try {
                        return future.wait();
                    } catch (error) {
                        throw error;
                    }
                }
            }
        });
    }

    private checkForUser():Meteor.User {
        var currentUserId = Meteor.userId();
        var user:Meteor.User;
        if (!currentUserId) {
            throw new Meteor.Error("sign-in", "Please sign in.");
        } else {
            user = Meteor.users.findOne(currentUserId);
            if (!user) {
                throw new Meteor.Error("account-not-found", "Invalid User ID");
            }
        }
        return user;
    }
}