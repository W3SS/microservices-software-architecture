import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import template from './item.html';
import './item.css';


class Item {
    constructor($state, authService, $stateParams) {
        const ctrl = this;

        ctrl.editItem = () => {
            $state.go('editItem', { itemName: ctrl.item.name });
        };

        ctrl.deleteItem = () => {
            $state.go('deleteItem', { itemName: ctrl.item.name });
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
            item: function (apiService, $stateParams, $q) {
                return $q(function (resolve) {
                    if ($stateParams.itemId) {
                        apiService.fetchItemById($stateParams.itemId).then((response) => {
                            resolve(response.data.item);
                        }).catch((error) => {
                            console.log(error);
                            reject();
                        })
                    } else if ($stateParams.itemName) {
                        apiService.fetchItemByName($stateParams.itemName).then((response) => {
                            resolve(response.data.item);
                        }).catch((error) => {
                            console.log(error);
                            reject();
                        })
                    } else {
                        resolve(null);
                    }
                });
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