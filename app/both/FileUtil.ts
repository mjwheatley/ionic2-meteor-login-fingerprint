declare var File;
declare var atob;

export class FileUtil {
    static dataUriToFile(dataUri, fileName):File {
        // https://en.wikipedia.org/wiki/Data_URI_scheme
        // create a pattern to match the data uri
        var file:File = null;
        var patt = /^data:([^\/]+\/[^;]+)?(;charset=([^;]+))?(;base64)?,/i,
            matches = dataUri.match(patt);
        if (matches == null) {
            //throw new Error("data: uri did not match scheme");
            console.log("data: uri did not match scheme");
        } else {
            var
                prefix = matches[0],
                contentType = matches[1],
            // var charset = matches[3]; -- not used.
                isBase64 = matches[4] != null,
            // remove the prefix
                encodedBytes = dataUri.slice(prefix.length),
            // decode the bytes
                decodedBytes = isBase64 ? atob(encodedBytes) : encodedBytes,
            // return the file object
                props = {type: ""};
            if (contentType) {
                props.type = contentType;
            }
            file = new File([decodedBytes], fileName, props);
        }
        return file;
    }

    static getDataUriFileType(dataUri:string):string {
        var contentType = null;
        var patt = /^data:([^\/]+\/[^;]+)?(;charset=([^;]+))?(;base64)?,/i,
            matches = dataUri.match(patt);
        if (matches == null) {
            console.log("data: uri did not match scheme");
        } else {
            contentType = matches[1];
        }
        return contentType;
    }

    static isImageUri(dataUri):boolean {
        let isImageUri = false;
        // Typed :any so typescript doesn't complain about property 'includes' does not exist on type 'string'
        let contentType:any = FileUtil.getDataUriFileType(dataUri);
        if (contentType && contentType.includes("image")) {
            isImageUri = true;
        }
        return isImageUri;
    }
}