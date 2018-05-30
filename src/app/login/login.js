import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import template from './login.html';
import './login.css';


class Login {
    constructor(apiService, authHelper, $state, $cookies) {
        this.password = '';
        this.email = '';

        this.login = () => {
            apiService.fetchToken(this.email, this.password).then((response) => {
                if (response.data.token && response.data.exp) {
                    $cookies.put('token', response.data.token);
                    $cookies.put('exp', response.data.exp);
                    console.log('user auth = ' + authHelper.isUserAuthenticated());
                    $state.go('home');
                } else {
                    console.log('no token');
                }
            }).catch((error) => {
                console.log(error);
            });
        };

        this.register = () => {
            $state.go('register');
        };

        this.isNotAuthenticated = () => {
            return !authHelper.isUserAuthenticated();
        }
    }
}

const moduleName = "login";
const loginModule = angular.module(moduleName, [uiRouter, 'ngCookies']);

loginModule.config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state({
        name: 'login',
        url: '/login',
        component: 'loginComponent'
    });
}]);

loginModule.component("loginComponent", {
    template,
    controller: Login
});

export default moduleName;
