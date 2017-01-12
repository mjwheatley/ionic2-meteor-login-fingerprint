export class Constants {
    public static EMPTY_STRING = "";

    public static SESSION:any = {
        LANGUAGE: "language",
        LOADING: "isLoading",
        PLATFORM_READY: "platformReady",
        TRANSLATIONS_READY: "translationsReady",
        INCORRECT_PASSWORD: "incorrectPassword",
        FORGOT_PASSWORD: "forgotPassword",
        CREATE_ACCOUNT: "createAccount",
        RESET_PASSWORD: "resetPassword",
        REGISTERED_ERROR: "registeredError",
        NOT_REGISTERED_ERROR: "notRegisteredError",
        RESET_PASSWORD_ERROR: "resetPasswordError",
        RESET_PASSWORD_ERROR_MESSAGE: "resetPasswordErrorMessage",
        RESET_PASSWORD_TOKEN: "resetPasswordToken",
        WAS_PASSWORD_RESET: "wasPasswordReset",
        EMAIL: "email"
    };

    public static DEVICE:any = {
        IOS: "iOS",
        ANDROID: "Android"
    };

    public static STYLE:any = {
        IOS: "ios",
        MD: "md"
    };

    public static METEOR_ERRORS:any = {
        NO_PASSWORD: "User has no password set",
        USER_NOT_FOUND: "User not found",
        INCORRECT_PASSWORD: "Incorrect password",
        EMAIL_EXISTS: "Email already exists.",
        TOKEN_EXPIRED: "Token expired"
    };

    public static ADD_IMAGE_PLACEHOLDER_URI:string = "/images/add_image_camera_photo.png";
    public static IMAGE_URI_PREFIX:string = "data:image/jpeg;base64,"
}