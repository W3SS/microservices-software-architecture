import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import template from './item.html';
import './item.css';

const moduleName = "item";
const loginModule = angular.module(moduleName, [uiRouter]).config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state({
        name: 'item',
        url: '/catalog/:categoryTitle/:itemId',
        component: 'itemComponent',
        resolve: {
            itemDescription: function (apiService) {
                return apiService.fetchCategoryItemDescription();
            },
            itemId: function ($stateParams) {
                return $stateParams.itemId;
            }
        }
    });
}]);

loginModule.component("itemComponent", {
    template,
    bindings: {
        itemDescription: "<",
        itemId: "<"
    },
    controller: function ($state) {
        this.next = () => {
            $state.go('editItem', { itemId: this.itemId });
        }
    }
});

export default moduleName;