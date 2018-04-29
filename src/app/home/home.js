import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import template from './home.html';
import './home.css';

import items from './items/items';

const moduleName = "home";
const homeModule = angular.module(moduleName, [uiRouter, items]).config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state({
        name: 'home',
        url: '/catalog',
        component: 'homeComponent',
        resolve: {
            sportsList: function (apiService) {
                return apiService.fetchSportsList();
            }
        }
    });

    $urlRouterProvider.otherwise('/catalog');
}]);

homeModule.component("homeComponent", {
    template,
    bindings: {
        sportsList: "<"
    },
    controller: function () {
    }
});

export default moduleName;
