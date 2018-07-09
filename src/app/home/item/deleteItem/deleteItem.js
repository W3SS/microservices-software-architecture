import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import template from './deleteItem.html';
import './deleteItem.css';


class DeleteItem {
    constructor($state, $stateParams, $mdToast, apiService, $element) {
        const ctrl = this;
        ctrl.isItemDeleted = false;

        ctrl.submit = (ev) => {
            apiService.deleteItemById(ctrl.item.id).then(() => {
                ctrl.isItemDeleted = true;

                const toast = $mdToast.simple()
                .textContent('Item has been successfully deleted')
                .action('OK')
                .parent($element[0].querySelector('#card'))
                .highlightAction(true)
                .highlightClass('md-accent')
                .hideDelay(4000)
                .position('bottom');

                $mdToast.show(toast);
                $state.go('home');
            }).catch((error) => {
                console.log(error)
            });
        };

        ctrl.cancel = () => {
            apiService.fetchCategoryById(ctrl.item.cat_id).then((response) => {
                $state.go('item', {
                    categoryName: response.data.category.name,
                    itemName: $stateParams.itemName
                });
            }).catch((error) => {
                console.log(error)
            })
        };
    }
}

const moduleName = "deleteItem";
const loginModule = angular.module(moduleName, [uiRouter, 'ngMaterial']);

loginModule.config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state({
        name: 'deleteItem',
        url: '/catalog/:itemName/delete',
        component: 'deleteItemComponent',
        params: {
            category: null
        },
        resolve: {
            item: function (apiService, $stateParams) {
                if ($stateParams.itemName) {
                    return apiService.fetchItemByName($stateParams.itemName).then((response)=> {
                        if (response.data.item) {
                            return response.data.item;
                        } else {
                            return null;
                        }
                    }).catch((error) => {
                        console.log(error);
                        return null;
                    })
                }
            }
        }
    });
}]);

loginModule.component("deleteItemComponent", {
    template,
    bindings: {
        item: "<"
    },
    controller: DeleteItem
});

export default moduleName;