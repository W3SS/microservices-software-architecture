import angular from 'angular';
import template from './app.html';
import './app.css';

import loginModule from './login/login';
import homeModule from './home/home';
import itemModule from './item/item';

import apiService from './services/apiService';

class AppCtrl {
    constructor($transitions, $rootScope) {
        this.url = 'https://github.com/preboot/angular-webpack';

        $transitions.onBefore("*", (TransitionService) => {
            $rootScope.isLoading = true;
            TransitionService.promise
                .catch(() => {})
                .finally(() => { $rootScope.isLoading = false; });
        })

    }
}

let app = {
    template: template,
    controller: AppCtrl
};

const MODULE_NAME = 'app';

angular.module(MODULE_NAME, [
    loginModule,
    homeModule,
    apiService,
    itemModule
]).component('app', app);

export default MODULE_NAME;
