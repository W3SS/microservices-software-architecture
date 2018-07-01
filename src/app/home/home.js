import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import template from './home.html';
import './home.css';

import items from './items/items';


class Home {
    constructor(apiService, authService, $state) {
        this.getResource = () => {
            apiService.getResource().then((response) => {
                console.log(response)
            }).catch((error) => {
                console.log(error)
            })
        };

        this.isHome = () => {
            return $state.is(moduleName);
        };

        this.isLoggedIn = () => {
            return authService.isUserAuthenticated();
        }
    }
}

const moduleName = "home";
const homeModule = angular.module(moduleName, [uiRouter, items]);

homeModule.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state({
        name: 'home',
        url: '/catalog',
        component: 'homeComponent',
        resolve: {
            sportsList: function (apiService) {
                return apiService.fetchSportsList();
            },
            items: function (apiService) {
                return apiService.fetchLatestItems();
            }
        }
    });

    $urlRouterProvider.otherwise('/catalog');
}]);

homeModule.component("homeComponent", {
    template,
    bindings: {
        sportsList: "<",
        items: "<"
    },
    controller: Home
});

export default moduleName;
