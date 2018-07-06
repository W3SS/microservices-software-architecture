import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import template from './editItem.html';
import toastTemplate from './toastTemlate.html';
import './editItem.css';


class EditItem {
    constructor($state, $stateParams, authService, apiService, $mdToast) {
        const ctrl = this;
        ctrl.states = [];

        ctrl.$onInit = () => {
            angular.copy(ctrl.categories, ctrl.states);

            ctrl.item.currentCategory = ctrl.states
                .find((state)=> { return state.id === ctrl.item.cat_id });

            if (ctrl.item.currentCategory) {
                ctrl.item.cat_id = ctrl.item.currentCategory.id
            }

            ctrl.states = ctrl.states
                .map((category) => { return category.name })
                .map((state) => { return {abbrev: state} });
        };

        ctrl.home = () => {
            $state.go('home');
        };

        ctrl.cancel = () => {
            console.log(ctrl);
            $state.go('home');
            ctrl.showCustomToast();
            /*$state.go('item', {
                categoryTitle: $stateParams.category,
                itemId: $stateParams.itemId
            });*/
        };

        ctrl.isUserLoggedIn = () => {
            return authService.isUserAuthenticated();
        };

        ctrl.save = () => {
            let category = ctrl.categories.find((cat) => {
                return cat.name === ctrl.item.currentCategory.name
            });

            if (category) {
                ctrl.item.cat_id = category.id;
            }

            apiService.updateItem(ctrl.item).then(()=> {
                $state.go('home');
            }).catch((error) => {
                console.log(error);
            })
        };

        ctrl.showCustomToast = () => {
            $mdToast.show({
                hideDelay   : 2500,
                position    : 'top right',
                // controller  : function ($mdToast) {
                //     // this.closeToast = function() {
                //     //     //if (isDlgOpen) return;
                //     //
                //     //     $mdToast
                //     //       .hide()
                //     //       .then(function() {
                //     //         isDlgOpen = false;
                //     //       });
                //     //   };
                // },
                templateUrl : toastTemplate
            });
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