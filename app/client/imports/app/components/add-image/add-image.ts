import {Component, ViewChild, Input} from '@angular/core';
import {Platform, ActionSheetController} from 'ionic-angular';
import {TranslateService} from 'ng2-translate';
import {ImageHandler} from "../../utils/ImageHandler";
import {Constants} from "../../../../../both/Constants";

import template from './add-image.html';
@Component({
    selector: 'add-image',
    template
})
export class AddImageComponent {
    @ViewChild("hiddenFileInput") hiddenFileInput;
    @Input() imageUri;
    private _imageHandler:ImageHandler;

    constructor(public actionSheetCtrl:ActionSheetController,
                public platform:Platform,
                public translate:TranslateService) {
        this._imageHandler = new ImageHandler(translate);
    }

    public presentAddImageActionSheet() {
        var self = this;
        let actionSheet = self.actionSheetCtrl.create({
            title: self.translate.instant("add-image.title"),
            buttons: [
                {
                    text: self.translate.instant("add-image.takePicture"),
                    icon: !self.platform.is('ios') ? 'camera' : null,
                    handler: () => {
                        this._imageHandler.takePicture();
                    }
                },
                {
                    text: self.translate.instant("add-image.selectPhoto"),
                    icon: !self.platform.is('ios') ? 'image' : null,
                    handler: () => {
                        if (Meteor.isCordova) {
                            this._imageHandler.selectPhoto();
                        } else {
                            self.hiddenFileInput.nativeElement.value = Constants.EMPTY_STRING;
                            self.hiddenFileInput.nativeElement.click();
                        }
                    }
                },
                {
                    text: self.translate.instant("add-image.removeImage"),
                    icon: !self.platform.is('ios') ? 'trash' : null,
                    handler: () => {
                        Session.set(Constants.SESSION.imageUri, Constants.EMPTY_STRING);
                        self.hiddenFileInput.nativeElement.value = Constants.EMPTY_STRING;
                    }
                },
                {
                    text: self.translate.instant("general.cancel"),
                    role: 'cancel',
                    icon: !self.platform.is('ios') ? 'close' : null,
                    handler: () => {
                    }
                }
            ]
        });

        actionSheet.present();
    }

    public fileInputChangeListener($event):void {
        var self = this;
        var file:File = $event.target.files[0];
        var fileReader:FileReader = new FileReader();
        fileReader.onload = function(evt) {
            var dataUri = (evt as any).target.result;  //casting evt to any to avoid typescript warning message
            self._imageHandler.processImage({
                file: file,
                dataUri: dataUri
            });
        };
        fileReader.readAsDataURL(file);
    }
}