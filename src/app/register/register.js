import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import template from './register.html';
import './register.css';


class UserRegistration {
    constructor(apiService, $state) {
        this.user = {};
        this.user.username = '';
        this.user.password = '';
        this.user.email = '';

        this.register = () => {
            apiService.userRegister(this.user).then((response) => {
                 $state.go('login');
            }).catch((error) => {
                console.log(error);
            });
        }
    }
}

const moduleName = "userRegister";
const registerModule = angular.module(moduleName, [uiRouter]).config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state({
        name: 'register',
        url: '/register',
        component: 'registerComponent'
    });
}]);

registerModule.component("registerComponent", {
    template,
    controller: UserRegistration
});

export default moduleName;
