import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import template from './createItem.html';
import './createItem.css';

const moduleName = "createItem";
const loginModule = angular.module(moduleName, [uiRouter]).config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state({
        name: 'createItem',
        url: '/catalog/item/create',
        component: 'createItemComponent',
        resolve: {
            test: function (apiService) {
                return apiService.fetchCategoryItemDescription();
            }
        }
    });
}]);

loginModule.component("createItemComponent", {
    template,
    bindings: {
        test: "<"
    },
    controller: function ($state) {

    }
});

export default moduleName;