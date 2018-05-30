import angular from 'angular';
import template from './app.html';
import './app.css';

import loginModule from './login/login';
import homeModule from './home/home';
import itemModule from './home/item/item';
import editItemModule from './home/item/editItem/editItem';
import deleteItemModule from './home/item/deleteItem/deleteItem';
import userRegisterModule from './register/register';

import apiService from './services/apiService';
import authHelper from './services/helpers/authHelper';

import 'angularjs-social-login';
import 'angular-cookies';


class AppCtrl {
    constructor($transitions, $rootScope, socialLoginService, $cookies, authHelper) {
        this.url = 'https://github.com/preboot/angular-webpack';

        $transitions.onBefore("*", (TransitionService) => {
            $rootScope.isLoading = true;
            TransitionService.promise
                .catch(() => {})
                .finally(() => { $rootScope.isLoading = false; });
        });

        this.logout = () => {
            socialLoginService.logout();
            $cookies.remove('token');
            $cookies.remove('exp');
        };

        $rootScope.$on('event:social-sign-out-success', function(event, logoutStatus){
            let auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(() => {
                console.log('User signed out.');
            });
        });

        this.isAuthenticated = () => {
            return authHelper.isUserAuthenticated();
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
    authHelper,
    itemModule,
    editItemModule,
    deleteItemModule,
    'socialLogin'
]).component('app', app);


export default MODULE_NAME;
