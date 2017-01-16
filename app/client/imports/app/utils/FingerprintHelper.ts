import {TranslateService} from 'ng2-translate';
import {Constants} from "../../../../both/Constants";

declare var device;
declare var FingerprintAuth;

export class FingerprintHelper {
    private callback:Function;
    private secret:string;
    private cipherMode:string = Constants.CIPHER_MODE.ENCRYPT;

    constructor() {

    }

    /**
     * Fingerprint Availability
     */
    public isFingerprintAvailable(callback:Function):void {
        this.callback = callback;
        if (device.platform === Constants.DEVICE.ANDROID) {
            FingerprintAuth.isAvailable(this.fpAuthIsAvailableSuccess.bind(this),
                this.fpAuthIsAvailableError.bind(this));
        } else if (device.platform == Constants.DEVICE.IOS) {

        }
    }

    private fpAuthIsAvailableSuccess(result) {
        console.log("FingerprintAuth available: " + JSON.stringify(result));
        this.callback(null, result);
    }

    private fpAuthIsAvailableError(message) {
        console.log("fpAuthIsAvailableError(): " + message);
        this.callback(message);
    }
    // End

    /**
     * Authentication
     * */
    public authenticate(options:{secret:string, mode?:string}, callback:Function):void {
        this.callback = callback;
        this.secret = options.secret;
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
        this.callback(result);
    }

    private iosAuthIsAvailableError(message):void {
        this.callback(message);
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

    // End
}