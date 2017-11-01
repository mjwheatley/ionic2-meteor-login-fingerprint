import {TranslateService} from "ng2-translate";
import {ToastMessenger} from "./ToastMessenger";
import {Constants} from "../../../../both/Constants";
import {FileUtil} from "../../../../both/FileUtil";
/*
 * Meteor & Cordova packages are available but typescript does not know about them.
 * By declaring variables you tell typescript that they exists and it won't complain when compiling.
 * */
declare var MeteorCamera;
declare var Camera;
declare var navigator;

export class ImageHandler {
    private MAX_FILE_SIZE:number = 102400;

    constructor(private translate:TranslateService) {
    }

    public takePicture():void {
        var self = this;
        if (Meteor.isCordova) { // Use cordova-plugin-camera
            //console.log("screen width: " + window.screen.width);
            //console.log("screen height: " + window.screen.height);
            //console.log("physicalScreen width: " + window.screen.width * window.devicePixelRatio);
            //console.log("physicalScreen height: " + window.screen.height * window.devicePixelRatio);
            let cameraOptions = {
                destinationType: Camera.DestinationType.DATA_URL,
                // targetWidth: window.screen.width * window.devicePixelRatio,
                // targetHeight: window.screen.height * window.devicePixelRatio,

                // Reduced quality and dimensions to keep image under 100Kbs
                targetWidth: 400,
                targetHeight: 400,
                correctOrientation: true,
                sourceType: Camera.PictureSourceType.CAMERA,
                quality: 50
            };
            navigator.camera.getPicture(self.cameraSuccess.bind(self), self.cameraError.bind(self), cameraOptions);
        } else { // use mdg:camera
            let cameraOptions = {
                width: 400,
                height: 400,
                quality: 50
            };
            MeteorCamera.getPicture(cameraOptions, function (error, data) {
                if (error) {
                    console.log("MeteorCamera.getPicture() Error: " + JSON.stringify(error));
                    if (error.error != "cancel") {
                        new ToastMessenger().toast({
                            type: "error",
                            message: error.reason,
                            title: self.translate.instant("image-handler.errors.camera")
                        });
                    }
                } else {
                    self.cameraSuccess(data);
                }
            });
        }
    }

    public selectPhoto():void {
        var self = this;
        if (Meteor.isCordova) { // Use cordova-plugin-camera
            let cameraOptions = {
                destinationType: Camera.DestinationType.DATA_URL,
                targetWidth: 400,
                targetHeight: 400,
                correctOrientation: true,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                quality: 50
            };
            navigator.camera.getPicture(self.cameraSuccess.bind(self), self.cameraError.bind(self), cameraOptions);
        }
    }

    private cameraSuccess(imageData) {
        var self = this;
        var imageDataUri = imageData;
        if (Meteor.isCordova) {
            imageDataUri = Constants.IMAGE_URI_PREFIX + imageData;
        }
        var file:File = FileUtil.dataUriToFile(imageDataUri, "tmpImg.jpg");
        if (file) {
            self.processImage({
                file: file,
                dataUri: imageDataUri
            });
        } else {
            new ToastMessenger().toast({
                type: "error",
                message: self.translate.instant("image-handler.errors.invalidScheme")
            });
        }
    }

    private cameraError(error) {
        var self = this;
        console.log("cameraError: ", JSON.stringify(error));
        if (error.error !== "cancelled") {
            new ToastMessenger().toast({
                type: "error",
                message: error.reason,
                title: self.translate.instant("image-handler.errors.camera")
            });
        }
    }

    public processImage(data):void {
        var self = this;
        var img = new Image();
        img.onload = function () {
            console.log("file size: " + data.file.size);
            if (data.file.size > self.MAX_FILE_SIZE) {
                console.log("img.width: ", img.width);
                console.log("img.height: ", img.height);
                console.log("File size too large (max 100KB).");
                // new ToastMessenger().toast({
                //     type: "error",
                //     message: self.translate.instant("image-handler.errors.resizeImage"),
                //     title: self.translate.instant("image-handler.errors.tooBig")
                // });
                self.reduceImageQuality(img);
            } else {
                Session.set(Constants.SESSION.imageUri, data.dataUri);
            }
        };
        img.onerror = function () {
            new ToastMessenger().toast({
                type: "error",
                message: self.translate.instant("image-handler.errors.notAnImage"),
                title: self.translate.instant("image-handler.errors.invalidFileType")
            });
        };
        img.src = data.dataUri;
    }

    public resizeImage(image):void {
        console.log("resizing image...");
        var self = this;
        var canvas = document.createElement('canvas');
        var canvasContext = canvas.getContext('2d');

        canvas.width = image.width * 0.75;
        canvas.height = image.height * 0.75;
        canvasContext.drawImage(image, 0, 0, canvas.width, canvas.height);

        var dataUri = canvas.toDataURL('image/jpeg', 0.5);
        self.cameraSuccess(dataUri);
    }

    public reduceImageQuality(image):void {
        console.log("reduce image quality");
        var self = this;
        var canvas = document.createElement('canvas');
        var canvasContext = canvas.getContext('2d');

        canvas.width = image.width * 0.75;
        canvas.height = image.height * 0.75;
        canvasContext.drawImage(image, 0, 0, canvas.width, canvas.height);

        var dataUri = canvas.toDataURL('image/jpeg', 0.5);

        //Check file size
        var file:File = FileUtil.dataUriToFile(dataUri, "tmpImg.jpg");
        console.log("file size: " + file.size);
        if (file.size > self.MAX_FILE_SIZE) {
            console.log("Image file still too big.");
            self.resizeImage(image);
        } else {
            self.cameraSuccess(dataUri);
        }
    }
}