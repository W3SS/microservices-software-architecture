import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import template from './item.html';
import './item.css';


class Item {
    constructor($state, authService, $mdDialog, $stateParams) {
        this.editItem = () => {
            $state.go('editItem', { itemId: $stateParams.itemId });
        };

        this.deleteItem = () => {
            $state.go('deleteItem', { itemId: $stateParams.itemId });
        };

        this.isAccessible = () => {
            return !authService.isUserAuthenticated();
        };

        this.showNotification = (ev) => {
            let dialog = $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .textContent('Item has been deleted.')
                .ariaLabel('Alert Dialog Demo')
                .ok('ok')
                .targetEvent(ev);

            $mdDialog.show(dialog).then((result) => {
                $state.go('items', { categoryTitle: $stateParams.categoryTitle });
            }).catch(() => {
                $state.go('items', { categoryTitle: $stateParams.categoryTitle });
            });
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