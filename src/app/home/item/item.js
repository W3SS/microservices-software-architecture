import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import template from './item.html';
import './item.css';


class Item {
    constructor($state, authService, $stateParams) {
        this.editItem = () => {
            $state.go('editItem', {
                itemId: $stateParams.itemId,
                category: $stateParams.categoryTitle
            });
        };

        this.deleteItem = () => {
            $state.go('deleteItem', {
                itemId: $stateParams.itemId,
                category: $stateParams.categoryTitle
            });
        };

        this.isAccessible = () => {
            return !authService.isUserAuthenticated();
        };
    }
}

const moduleName = "item";
const loginModule = angular.module(moduleName, [uiRouter]);

loginModule.config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state({
        name: 'item',
        url: '/catalog/:categoryTitle/:itemId',
        component: 'itemComponent',
        resolve: {
            itemDescription: function (apiService) {
                return apiService.fetchCategoryItemDescription();
            }
        }
    });
}]);

loginModule.component("itemComponent", {
    template,
    bindings: {
        itemDescription: "<"
    },
    controller: Item
});

export default moduleName;