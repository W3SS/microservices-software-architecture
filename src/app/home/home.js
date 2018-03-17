import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import template from './home.html';
import './home.css';

const moduleName = "home";
const homeModule = angular.module(moduleName, [uiRouter]).config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state({
        name: 'home',
        url: '/home',
        component: 'homeComponent',
        resolve: {
            sportsList: function (apiService) {
                return apiService.fetchSportsList();
            }
        }
    });
}]);

homeModule.component("homeComponent", {
    template,
    bindings: {
        sportsList: "<"
    },
    controller: function () {
    }
});

export default moduleName;
