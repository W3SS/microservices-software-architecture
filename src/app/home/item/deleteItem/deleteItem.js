import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import template from './deleteItem.html';
import './deleteItem.css';


class DeleteItem {
    constructor($state, $stateParams) {
        /*this.home = () => {
            $state.go('home');
        };

        this.cancel = () => {
            $state.go('items', { categoryTitle: $stateParams.category });
        }*/
    }
}

const moduleName = "deleteItem";
const loginModule = angular.module(moduleName, [uiRouter, 'ngMaterial']);

loginModule.config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state({
        name: 'deleteItem',
        url: '/catalog/:itemId/delete',
        component: 'deleteItemComponent',
        resolve: {
            itemDescription: function (apiService) {
                return apiService.fetchCategoryItemDescription();
            }
        }
    });
}]);

loginModule.component("deleteItemComponent", {
    template,
    bindings: {
        itemDescription: "<"
    },
    controller: DeleteItem
});

export default moduleName;