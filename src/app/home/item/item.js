import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import template from './item.html';
import './item.css';


class Item {
    constructor($state, authService, $stateParams) {
        const ctrl = this;

        ctrl.editItem = () => {
            $state.go('editItem', {
                itemId: $stateParams.itemId,
                category: $stateParams.categoryTitle
            });
        };

        ctrl.deleteItem = () => {
            $state.go('deleteItem', {
                itemId: $stateParams.itemId,
                category: $stateParams.categoryTitle
            });
        };

        ctrl.isAccessible = () => {
            return !authService.isUserAuthenticated();
        };
    }
}

const moduleName = "item";
const loginModule = angular.module(moduleName, [uiRouter]);

loginModule.config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state({
        name: 'item',
        url: '/catalog/:categoryName/:itemName',
        component: 'itemComponent',
        params: {
            itemId: null
        },
        resolve: {
            item: function (apiService, $stateParams) {
                if ($stateParams.itemId) {
                    apiService.fetchItemById($stateParams.itemId).then((response) => {
                        if (response.data.item) {
                            return response.data.item;
                        } else {
                            return [];
                        }
                    }).catch((error) => {
                        console.log(error);
                        return [];
                    })
                }
            }
        }
    });
}]);

loginModule.component("itemComponent", {
    template,
    bindings: {
        item: "<"
    },
    controller: Item
});

export default moduleName;