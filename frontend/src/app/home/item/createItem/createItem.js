import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import template from './createItem.html';
import './createItem.css';

const moduleName = "createItem";
const createModule = angular.module(moduleName, [uiRouter, 'ngMaterial', 'ngMessages']);

class CreateItem {
    constructor($state, authService, $stateParams, apiService, $mdToast, $element) {
        const ctrl = this;
        ctrl.states = [];

        ctrl.item = {
            description: '',
            name: '',
            categoryName: '',
            cat_id: null
        };

        ctrl.$onInit = () => {
            angular.copy(ctrl.categories, ctrl.states);

            ctrl.states = ctrl.states
                .map((category) => { return category.name })
                .map((state) => { return {abbrev: state} });
        };

        ctrl.home = () => {
            $state.go('home');
        };

        ctrl.isUserLoggedIn = () => {
            return authService.isUserAuthenticated();
        };

        ctrl.save = () => {
            const category = ctrl.categories.find((cat) => {
                return cat.name === ctrl.item.categoryName
            });

            if (category) {
                ctrl.item.cat_id = category.id;
            }

            console.log(ctrl.item);
            apiService.addItem(ctrl.item).then(()=> {
                const toast = $mdToast.simple()
                .textContent('Item has been successfully added')
                .action('Go Back')
                .parent($element[0].querySelector('#card'))
                .highlightAction(true)
                .highlightClass('md-accent')
                .hideDelay(4000)
                .position('top right');

                $mdToast.show(toast).then(function(response) {
                    if (response === 'ok') {
                        $state.go('home');
                    }
                })
            }).catch((error)=> {
                console.log(error);
            })
        }
    }
}

createModule.config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state({
        name: 'createItem',
        url: '/catalog/item/create',
        component: 'createItemComponent',
        resolve: {
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

createModule.component("createItemComponent", {
    template,
    bindings: {
        categories: "<"
    },
    controller: CreateItem
});

export default moduleName;