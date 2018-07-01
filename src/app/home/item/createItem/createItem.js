import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import template from './createItem.html';
import './createItem.css';

const moduleName = "createItem";
const loginModule = angular.module(moduleName, [uiRouter]).config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state({
        name: 'createItem',
        url: '/catalog/item/create',
        component: 'createItemComponent'
    });
}]);

loginModule.component("createItemComponent", {
    template,
    controller: function ($state) {

    }
});

export default moduleName;