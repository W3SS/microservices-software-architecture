import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import template from './editItem.html';
import './editItem.css';


class EditItem {
    constructor($state) {
        this.home = () => {
            $state.go('home');
        }
    }
}

const moduleName = "editItem";
const loginModule = angular.module(moduleName, [uiRouter, 'ngMaterial']);

loginModule.config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state({
        name: 'editItem',
        url: '/catalog/:itemId/edit',
        component: 'editItemComponent',
        resolve: {
            itemDescription: function (apiService) {
                return apiService.fetchCategoryItemDescription();
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