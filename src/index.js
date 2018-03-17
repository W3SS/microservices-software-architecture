import angular from 'angular';
import appModule from './app/app';
import angularMaterial from 'angular-material';
import uiRouter from '@uirouter/angularjs';

import '../node_modules/angular-material/angular-material.css';

angular.module("crud", [angularMaterial, uiRouter, appModule]).config(["$compileProvider", function ($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
}]);
