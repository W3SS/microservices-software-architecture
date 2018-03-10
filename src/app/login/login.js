import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import template from './login.html';
import './login.css';

const moduleName = "login";
const loginModule = angular.module(moduleName, [uiRouter]).config(["$stateProvider", function ($stateProvider) {
  $stateProvider.state({
    name: 'login',
    url: '/login',
    component: 'loginComponent'
  });
}]);

loginModule.component("loginComponent", {
  template,
  controller: function () {
      
  }
});

export default moduleName;
