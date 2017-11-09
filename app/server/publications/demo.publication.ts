import {Meteor} from "meteor/meteor";
import {DemoCollection} from "../../both/collections/demo.collection.ts";

Meteor.publish('demoList', function () {
    return DemoCollection.find({});
});
