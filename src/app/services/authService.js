import angular from 'angular';

const moduleName = "authService";

const authService = angular.module(moduleName, ['ngCookies']);

authService.service(moduleName, function ($cookies) {
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
    };

    this.logout = () => {

    }
});

export default moduleName;