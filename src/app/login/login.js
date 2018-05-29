import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import template from './login.html';
import './login.css';


class Login {
    constructor(apiService, $state) {
        this.password = '';
        this.email = '';

        this.login = () => {
            apiService.fetchToken(this.email, this.password).then((response) => {
                if (response.data.token) {
                    console.log('token = ' + response.data.token);
                    $state.go('home');
                } else {
                    console.log('no token');
                }
            }).catch((error) => {
                console.log(error);
            });
        };
    }
}

const moduleName = "login";
const loginModule = angular.module(moduleName, [uiRouter]).config(["$stateProvider", function ($stateProvider) {
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
