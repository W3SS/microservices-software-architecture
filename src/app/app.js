import angular from 'angular';
import template from './app.html';
import './app.css';

class AppCtrl {
  constructor() {
    this.url = 'https://github.com/preboot/angular-webpack';
  }
}

let app = {
  template: template,
  controller: AppCtrl
};

const MODULE_NAME = 'app';

angular.module(MODULE_NAME, [])
  .component('app', app);

export default MODULE_NAME;
