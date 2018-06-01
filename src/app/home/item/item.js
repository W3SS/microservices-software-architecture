import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import template from './item.html';
import './item.css';


class Item {
    constructor($state, authService) {
        this.editItem = () => {
            $state.go('editItem', { itemId: this.itemId });
        };

        this.deleteItem = () => {
            $state.go('deleteItem', { itemId: this.itemId });
        };

        this.isAccessible = () => {
            return !authService.isUserAuthenticated();
        }
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
            },
            itemId: function ($stateParams) {
                return $stateParams.itemId;
            }
        }
    });
}]);

loginModule.component("itemComponent", {
    template,
    bindings: {
        itemDescription: "<",
        itemId: "<"
    },
    controller: Item
});

export default moduleName;