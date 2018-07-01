import angular from 'angular';
import template from './app.html';
import './app.css';

import loginModule from './login/login';
import homeModule from './home/home';
import itemModule from './home/item/item';
import editItemModule from './home/item/editItem/editItem';
import createItemModule from './home/item/createItem/createItem';
import userRegisterModule from './register/register';

import apiService from './services/apiService';
import authService from './services/authService';

import 'angular-cookies';
import 'angularjs-social-login';
import 'angular-messages';


class AppCtrl {
    constructor($transitions, $rootScope, $cookies, authService) {
        this.url = 'https://github.com/preboot/angular-webpack';

        $transitions.onBefore("*", (TransitionService) => {
            $rootScope.isLoading = true;
            TransitionService.promise
                .catch(() => {})
                .finally(() => { $rootScope.isLoading = false; });
        });

        this.logout = () => {
            authService.logout();
        };

        this.isAuthenticated = () => {
            return authService.isUserAuthenticated();
        };
    }
}

let app = {
    template: template,
    controller: AppCtrl
};

const MODULE_NAME = 'app';

angular.module(MODULE_NAME, [
    loginModule,
    userRegisterModule,
    homeModule,
    apiService,
    authService,
    itemModule,
    editItemModule,
    createItemModule,
    'socialLogin'
]).component('app', app);


export default MODULE_NAME;
