import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import template from './deleteItem.html';
import './deleteItem.css';

const moduleName = "deleteItem";
const loginModule = angular.module(moduleName, [uiRouter]).config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state({
        name: 'deleteItem',
        url: '/catalog/:itemId/delete',
        component: 'deleteItemComponent',
        resolve: {
            test: function (apiService) {
                return apiService.fetchCategoryItemDescription();
            }
        }
    });
}]);

loginModule.component("deleteItemComponent", {
    template,
    bindings: {
        test: "<"
    },
    controller: function ($state) {

    }
});

export default moduleName;