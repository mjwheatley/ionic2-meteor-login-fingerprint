App.info({
    id: 'com.example.meteor.ionic2.login.fingerprint',
    name: 'Ionic2-Meteor-Login-Fingerprint',
    description: 'A boilerplate setup for an Ionic2 styled Angular2-Meteor application with support for Meteor accounts and Oauth services.',
    author: 'Matthew Wheatley',
    email: 'mjwheatley@tanoshiietnertainment.com',
    version: '0.0.1'
});

// App.icons({
//     // iOS
//     'iphone_2x': 'resources/ios/icons/Icon-60@2x.png', // 120x120
//     'iphone_3x': 'resources/ios/icons/Icon-60@3x.png', // 180x180
//     'ipad': 'resources/ios/icons/Icon-76.png', // 76x76
//     'ipad_2x': 'resources/ios/icons/Icon-76@2x.png', // 152x152
//     'ipad_pro': 'resources/ios/icons/Icon-167.png', // 167x167
//     'ios_settings': 'resources/ios/icons/Icon-29.png', // 29x29
//     'ios_settings_2x': 'resources/ios/icons/Icon-29@2x.png', // 58x58
//     'ios_settings_3x': 'resources/ios/icons/Icon-29@3x.png', // 87x87
//
//     // Android
//     'android_mdpi': 'resources/android/icons/ic_launcher_mdpi.png', // 48x48
//     'android_hdpi': 'resources/android/icons/ic_launcher_hdpi.png', // 72x72
//     'android_xhdpi': 'resources/android/icons/ic_launcher_xhdpi.png', // 96x96
//     'android_xxhdpi': 'resources/android/icons/ic_launcher_xxhdpi.png', // 144x144
//     'android_xxxhdpi': 'resources/android/icons/ic_launcher_xxxhdpi.png' // 192x192
// });
//
// App.launchScreens({
//     // iOS
//     'iphone_2x': 'resources/ios/splash/splash-320x480@2x.png', // 640x960
//     'iphone5': 'resources/ios/splash/splash-320x568@2x.png', // 640x1136
//     'iphone6': 'resources/ios/splash/splash-375x667@2x.png', // 750x1334
//     'iphone6p_portrait': 'resources/ios/splash/splash-414x736@3x.png', // 1242x2208
//     'iphone6p_landscape': 'resources/ios/splash/splash-736x414@3x.png', // 2208x1242
//
//     'ipad_portrait': 'resources/ios/splash/splash-768x1024.png', // 768x1024
//     'ipad_portrait_2x': 'resources/ios/splash/splash-768x1024@2x.png', // 1536x2048
//     'ipad_landscape': 'resources/ios/splash/splash-1024x768.png', // 1024x768
//     'ipad_landscape_2x': 'resources/ios/splash/splash-1024x768@2x.png', // 2048x1536
//
//     // Android
//     'android_mdpi_portrait': 'resources/android/splash/splash-320x480.png',
//     'android_mdpi_landscape': 'resources/android/splash/splash-480x320.png',
//     'android_hdpi_portrait': 'resources/android/splash/splash-480x800.png',
//     'android_hdpi_landscape': 'resources/android/splash/splash-800x480.png',
//     'android_xhdpi_portrait': 'resources/android/splash/splash-720x1280.png',
//     'android_xhdpi_landscape': 'resources/android/splash/splash-1280x720.png'

App.setPreference('BackupWebStorage', 'local');
App.setPreference('StatusBarOverlaysWebView', 'true');
//App.setPreference('StatusBarBackgroundColor', '#000000');

App.accessRule('http://localhost:3000/*')
App.accessRule('https://localhost:3000/*');
App.accessRule('http://meteor.local');
App.accessRule('http://localhost:12664/');
App.accessRule('http://10.0.2.2:3000/*');
App.accessRule('http://10.35.3.197:3000/*');
App.accessRule('http://10.35.2.163:3000/*');
App.accessRule('http://192.168.2.4:3000/*');
App.accessRule('*.google.com/*');
App.accessRule('*.googleapis.com/*');
App.accessRule('*.gstatic.com/*');