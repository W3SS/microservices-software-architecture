import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import template from './deleteItem.html';
import './deleteItem.css';


class DeleteItem {
    constructor($state, $stateParams, $mdDialog, apiService) {
        const ctrl = this;

        ctrl.submit = (ev) => {
            let dialog = $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .textContent('Item has been deleted.')
                .ariaLabel('Alert Dialog Demo')
                .ok('ok')
                .targetEvent(ev);

            $mdDialog.show(dialog).then((result) => {
                $state.go('home');
            }).catch(() => {
                $state.go('home');
            });
        };

        ctrl.cancel = () => {
            console.log(ctrl);
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