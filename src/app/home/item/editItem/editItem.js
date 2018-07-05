import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import template from './editItem.html';
import './editItem.css';


class EditItem {
    constructor($state, $stateParams, authService) {
        const ctrl = this;

        ctrl.$onInit = () => {
            ctrl.item.currentCategory = 'Football';
            ctrl.states = ctrl.categories
                .map((category) => { return category.name })
                .map((state) => { return {abbrev: state} });
        };

        ctrl.home = () => {
            $state.go('home');
        };

        ctrl.cancel = () => {
            console.log(ctrl)
            /*$state.go('item', {
                categoryTitle: $stateParams.category,
                itemId: $stateParams.itemId
            });*/
        };

        ctrl.isUserLoggedIn = () => {
            return authService.isUserAuthenticated();
        };
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
            item: function (apiService, $stateParams) {
                if ($stateParams.itemName) {
                    return apiService.fetchItemByName($stateParams.itemName).then((response)=> {
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
            },
            categories: function (apiService) {
                return apiService.fetchCategories().then((response)=> {
                    if (response.data.categories) {
                        return response.data.categories;
                    } else {
                        return [];
                    }
                }).catch((error) => {
                    console.log(error);
                    return [];
                })
            }
        }
    });
}]);

loginModule.component("editItemComponent", {
    template,
    bindings: {
        item: "<",
        categories: "<"
    },
    controller: EditItem
});

export default moduleName;