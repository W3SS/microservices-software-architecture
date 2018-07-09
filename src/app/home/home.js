import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import template from './home.html';
import './home.css';

import items from './items/items';


class Home {
    constructor(apiService, authService, $state) {
        const ctrl = this;

        ctrl.getResource = () => {
            apiService.getResource().then((response) => {
                console.log(response)
            }).catch((error) => {
                console.log(error)
            })
        };

        ctrl.isHome = () => {
            return $state.is(moduleName);
        };

        ctrl.isLoggedIn = () => {
            return authService.isUserAuthenticated();
        }
    }
}

const moduleName = "home";
const homeModule = angular.module(moduleName, [uiRouter, items]);

homeModule.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state({
        name: 'home',
        url: '/',
        component: 'homeComponent',
        resolve: {
            categories: function (apiService) {
                return apiService.fetchCategories().then((response)=>{
                    if (response.data.categories) {
                        return response.data.categories;
                    } else {
                        return [];
                    }
                }).catch((error) => {
                    console.log(error);
                    return [];
                })
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
        categories: "<",
        items: "<"
    },
    controller: Home
});

export default moduleName;
