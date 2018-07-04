import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import template from './items.html';
import './items.css';


class Items {
    constructor(authService) {
        const ctrl = this;

        ctrl.isLoggedIn = () => {
            return authService.isUserAuthenticated();
        }
    }
}

const moduleName = "items";
const itemsModule = angular.module(moduleName, [uiRouter]);

itemsModule.config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state({
        name: moduleName,
        url: "/{categoryName:string}/items",
        parent: "home",
        component: "itemsComponent",
        resolve: {
            items: function (apiService, $stateParams) {
                return apiService.fetchCategoryItems($stateParams.categoryName);
            },
            categoryTitle: function ($stateParams) {
                return $stateParams.categoryTitle;
            }
        }
    });
}]);

itemsModule.component("itemsComponent", {
    template,
    bindings: {
        items: "<",
        categoryTitle: "<"
    },
    controller: Items
});

export default moduleName;
