import {DemoCollection} from "../../../both/collections/demo.collection";
import {Demo} from "../../../both/models/demo.model";
import {OauthServiceConfig} from "../../lib/oauthConfig";

declare var process;

export class Main {
    start():void {
        this.printSettings();
        this.initFakeData();

        var oauthProviderConfig = new OauthServiceConfig();
        oauthProviderConfig.initOauthServices();

    }

    initFakeData():void {
        if (DemoCollection.find({}).cursor.count() === 0) {
            const data:Demo[] = [{
                name: "Dotan",
                age: 25
            }, {
                name: "Liran",
                age: 26
            }, {
                name: "Uri",
                age: 30
            }];
            data.forEach((obj:Demo) => {
                DemoCollection.insert(obj);
            });
        }
    }

    printSettings():void {
        console.log("process.env.ROOT_URL: " + process.env.ROOT_URL);
        console.log("process.env.MOBILE_DDP_URL: " + process.env.MOBILE_DDP_URL);
        console.log("process.env.MOBILE_ROOT_URL: " + process.env.MOBILE_ROOT_URL);
        console.log("process.env.METEOR_ENV: " + process.env.METEOR_ENV);
        console.log("process.env.METEOR_SETTINGS: " + process.env.METEOR_SETTINGS);
        if (!process.env.METEOR_SETTINGS) {
            console.log("No METEOR_SETTINGS found.  Please restart the app with the METEOR_SETTINGS environment variable set.")
        }
    }
}
