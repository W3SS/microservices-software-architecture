import angular from 'angular';

const moduleName = "authHelper";
const baseUrl = 'http://localhost:5000';

const authHelper = angular.module(moduleName, ['ngCookies']);

authHelper.service(moduleName, function ($cookies) {
    this.isUserAuthenticated = () => {
        let token = $cookies.get('exp');

        if (token) {

        } else {
            return false;
        }
    }
});

export default moduleName;