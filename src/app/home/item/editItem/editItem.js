import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import template from './editItem.html';
import './editItem.css';


class EditItem {
    constructor($state, $stateParams, authService) {
        this.home = () => {
            $state.go('home');
        };

        this.cancel = () => {
            $state.go('item', {
                categoryTitle: $stateParams.category,
                itemId: $stateParams.itemId
            });
        };

        this.isUserLoggedIn = () => {
            return authService.isUserAuthenticated();
        }
    }
}

const moduleName = "editItem";
const loginModule = angular.module(moduleName, [uiRouter, 'ngMaterial']);

loginModule.config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state({
        name: 'editItem',
        url: '/catalog/:itemName/edit',
        component: 'editItemComponent',
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

loginModule.component("editItemComponent", {
    template,
    bindings: {
        itemDescription: "<"
    },
    controller: EditItem
});

export default moduleName;