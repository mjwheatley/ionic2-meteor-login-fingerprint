import {TranslateService} from 'ng2-translate';
import {Constants} from "../../../../both/Constants";

declare var device;
declare var FingerprintAuth;
declare var window;

export class FingerprintHelper {
    private callback:Function;
    private secret:string;
    private cipherMode:string = Constants.CIPHER_MODE.ENCRYPT;
    private dialogMessage:string;

    constructor() {

    }

    /**
     * Fingerprint Availability
     */
    public isFingerprintAvailable(callback:Function):void {
        this.callback = callback;
        if (device.platform === Constants.DEVICE.ANDROID) {
            FingerprintAuth.isAvailable(
                this.fpAuthIsAvailableSuccess.bind(this),
                this.fpAuthIsAvailableError.bind(this)
            );
        } else if (device.platform == Constants.DEVICE.IOS) {
            window.plugins.touchid.isAvailable(
                this.touchIdIsAvailableSuccess.bind(this),
                this.touchIdIsAvailableError.bind(this)
            );
        }
    }

    private fpAuthIsAvailableSuccess(result):void {
        console.log("FingerprintAuth available: " + JSON.stringify(result));
        this.callback(null, result);
    }

    private fpAuthIsAvailableError(message):void {
        console.log("fpAuthIsAvailableError(): " + message);
        this.callback(message);
    }

    private touchIdIsAvailableSuccess(result):void {
        console.log("TouchId available: " + JSON.stringify(result));
        result = {isAvailable: true};
        this.callback(null, result);
    }

    private touchIdIsAvailableError(error):void {
        console.log("TouchId error: " + JSON.stringify(error));
        this.callback(error.localizedDescription);
    }

    // End

    /**
     * Authentication
     * */
    public authenticate(options:{
        secret:string,
        mode?:string,
        ios?: {
            message?:string
        }
    }, callback:Function):void {
        this.callback = callback;
        this.secret = options.secret;
        if (options.ios) {
            this.dialogMessage = options.ios.message;
        }

        if (options.mode) {
            this.cipherMode = options.mode;
        }
        if (device.platform === Constants.DEVICE.ANDROID) {
            this.androidAuthentication();
        } else if (device.platform == Constants.DEVICE.IOS) {
            this.iosAuthentication();
        }
    }

    private androidAuthentication():void {
        FingerprintAuth.isAvailable(this.androidAuthIsAvailableSuccess.bind(this),
            this.androidAuthIsAvailableError.bind(this));
    }

    private iosAuthentication():void {
        window.plugins.touchid.isAvailable(
            this.iosAuthIsAvailableSuccess.bind(this),
            this.iosAuthIsAvailableError.bind(this)
        );
    }

    private androidAuthIsAvailableSuccess(result):void {
        if (result.isAvailable) {
            var config = {
                clientId: Meteor.settings.public["fingerprint"]["appId"],
                username: Meteor.userId,
                password: this.secret,
                token: this.secret,
                locale: Session.get(Constants.SESSION.LANGUAGE)
            };
            if (this.cipherMode === Constants.CIPHER_MODE.ENCRYPT) {
                FingerprintAuth.encrypt(config,
                    this.fpAuthEncryptSuccess.bind(this),
                    this.fpAuthEncryptError.bind(this)
                );
            } else if (this.cipherMode === Constants.CIPHER_MODE.DECRYPT) {
                FingerprintAuth.decrypt(config,
                    this.fpAuthDecryptSuccess.bind(this),
                    this.fpAuthDecryptError.bind(this)
                );
            }

        } else {
            this.callback(null, result);
        }
    }

    private androidAuthIsAvailableError(message):void {
        this.callback(message);
    }

    private iosAuthIsAvailableSuccess(result):void {
        window.plugins.touchid.verifyFingerprint(
            this.dialogMessage,
            this.touchIdVerifySuccess.bind(this),
            this.touchIdVerifyError.bind(this)
        );
    }

    private iosAuthIsAvailableError(error):void {
        this.callback(error.localizedDescription);
    }

    private fpAuthEncryptSuccess(result):void {
        this.callback(null, result);
    }

    private fpAuthEncryptError(message):void {
        this.callback(message);
    }

    private fpAuthDecryptSuccess(result):void {
        this.callback(null, result);
    }

    private fpAuthDecryptError(message):void {
        this.callback(message);
    }

    private touchIdVerifySuccess(result):void {
        result = {success: true};
        this.callback(null, result);
    }

    private touchIdVerifyError(error):void {
        this.callback(error.localizedDescription);
    }
    // End
}