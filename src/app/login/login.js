import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import template from './login.html';
import './login.css';


class Login {
    constructor(apiService, authService, $state, $cookies, $rootScope) {
        this.password = '';
        this.email = '';

        this.login = () => {
            apiService.fetchToken(this.email, this.password).then((response) => {
                if (response.data.token && response.data.exp) {
                    $cookies.put('token', response.data.token);
                    $cookies.put('exp', response.data.exp);
                    console.log('token = ' + response.data.token);
                    console.log('exp = ' + response.data.exp);
                    console.log('user auth = ' + authService.isUserAuthenticated());
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

        this.isAuthenticated = () => {
            return authService.isUserAuthenticated();
        };

        let succeededLogin = $rootScope.$on('event:social-sign-in-success', function(event, userDetails) {
            apiService.oauth2Login(userDetails).then((response) => {
                $cookies.put('token', response.data.token);
                $cookies.put('providerToken', userDetails.token);
                $cookies.put('exp', response.data.exp);
                $cookies.put('provider', 'google');
                console.log('exp = ' + response.data.exp);
                console.log('user auth = ' + authService.isUserAuthenticated());
                $state.go('home');
            }).catch((error)=> {
                console.log(error);
            });
        });

        // unsubscribe on destroy
        this.$onDestroy = () => {
            succeededLogin();
        };
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
