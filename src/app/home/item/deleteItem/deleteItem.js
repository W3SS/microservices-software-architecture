import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import template from './deleteItem.html';
import './deleteItem.css';


class DeleteItem {
    constructor($state, $stateParams, $mdDialog) {
        this.submit = (ev) => {
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

        this.cancel = () => {
            $state.go('item', {
                categoryTitle: $stateParams.category,
                itemId: $stateParams.itemId
            });
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
            itemDescription: function (apiService, $stateParams) {
                console.log($stateParams);
                if ($stateParams.name) {
                    return apiService.fetchCategoryItemsByName($stateParams.categoryName).then((response)=> {
                        if (response.data.items) {
                            return response.data.items;
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

loginModule.component("deleteItemComponent", {
    template,
    bindings: {
        itemDescription: "<"
    },
    controller: DeleteItem
});

export default moduleName;