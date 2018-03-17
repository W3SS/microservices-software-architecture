import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import template from './home.html';
import './home.css';

const moduleName = "home";
const homeModule = angular.module(moduleName, [uiRouter]).config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state({
        name: 'home',
        url: '/home',
        component: 'homeComponent'
    });
}]);

homeModule.component("homeComponent", {
    template,
    controller: function () {

    }
});

export default moduleName;
