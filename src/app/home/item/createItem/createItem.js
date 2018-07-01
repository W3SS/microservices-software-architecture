import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import template from './createItem.html';
import './createItem.css';

const moduleName = "createItem";
const createModule = angular.module(moduleName, [uiRouter, 'ngMaterial', 'ngMessages']);

class CreateItem {
    constructor($state) {
        this.project = {
            description: 'Nuclear Missile Defense System',
            rate: 500,
            special: true
        };

        this.home = () => {
            $state.go('home');
        }
    }
}

createModule.config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state({
        name: 'createItem',
        url: '/catalog/item/create',
        component: 'createItemComponent'
    });
}]);

createModule.component("createItemComponent", {
    template,
    controller: CreateItem
});

export default moduleName;