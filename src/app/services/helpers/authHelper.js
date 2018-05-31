import angular from 'angular';

const moduleName = "authHelper";

const authHelper = angular.module(moduleName, ['ngCookies']);

authHelper.service(moduleName, function ($cookies) {
    this.isUserAuthenticated = () => {
        let expTime = $cookies.get('exp');

        if (expTime) {
            return expTime > (Date.now() / 1000);
        } else {
            return false;
        }
    };

    this.isUserAuthenticatedByGoogle = () => {
        let googleAuth = $cookies.get('google');

        return !!googleAuth;
    }
});

export default moduleName;