export interface IToastConfig {
    closeButton?:boolean,
    debug?: boolean,
    newestOnTop?:boolean,
    progressBar?:boolean,
    positionClass?:string,
    preventDuplicates?:boolean,
    onclick?:Function,
    showDuration?:string,
    hideDuration?:string,
    timeOut?:string,
    extendedTimeOut?:string,
    showEasing?:string,
    hideEasing?:string,
    showMethod?:string,
    hideMethod?:string,
    tapToDismiss?:boolean
}
declare var toastr;
export class ToastMessenger {
    private options:IToastConfig = {
        closeButton: false,
        debug: false,
        newestOnTop: false,
        progressBar: false,
        positionClass: "toast-bottom-center",
        preventDuplicates: true,
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        timeOut: "5000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
        tapToDismiss: true
    };
    constructor(options?:IToastConfig) {
        if (options) {
            if (options.hasOwnProperty('closeButton')) {
                this.options.closeButton = options.closeButton;
            }
            if (options.hasOwnProperty('debug')) {
                this.options.debug = options.debug;
            }
            if (options.hasOwnProperty('newestOnTop')) {
                this.options.newestOnTop = options.newestOnTop;
            }
            if (options.hasOwnProperty('progressBar')) {
                this.options.progressBar = options.progressBar;
            }
            if (options.hasOwnProperty('positionClass')) {
                this.options.positionClass = options.positionClass;
            }
            if (options.hasOwnProperty('preventDuplicates')) {
                this.options.preventDuplicates = options.preventDuplicates;
            }
            if (options.hasOwnProperty('onclick')) {
                this.options.onclick = options.onclick;
            }
            if (options.hasOwnProperty('showDuration')) {
                this.options.showDuration = options.showDuration;
            }
            if (options.hasOwnProperty('hideDuration')) {
                this.options.hideDuration = options.hideDuration;
            }
            if (options.hasOwnProperty('extendedTimeOut')) {
                this.options.extendedTimeOut = options.extendedTimeOut;
            }
            if (options.hasOwnProperty('showEasing')) {
                this.options.showEasing = options.showEasing;
            }
            if (options.hasOwnProperty('hideEasing')) {
                this.options.hideEasing = options.hideEasing;
            }
            if (options.hasOwnProperty('showMethod')) {
                this.options.showMethod = options.showMethod;
            }
            if (options.hasOwnProperty('hideMethod')) {
                this.options.hideMethod = options.hideMethod;
            }
            if (options.hasOwnProperty('tapToDismiss')) {
                this.options.tapToDismiss = options.tapToDismiss;
            }
        }
        toastr.options = this.options;
    }
    public toast(params:{type:string, message:string, title?:string}) {
        toastr[params.type](params.message, params.title);
    }
}
