import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import template from './items.html';
import './items.css';


class Items {
    constructor(authService) {
        const ctrl = this;

        ctrl.isLoggedIn = () => {
            return authService.isUserAuthenticated();
        }
    }
}

const moduleName = "items";
const itemsModule = angular.module(moduleName, [uiRouter]);

itemsModule.config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state({
        name: moduleName,
        url: "{categoryName:string}/items",
        parent: "home",
        component: "itemsComponent",
        params: {
            categoryId: null
        },
        resolve: {
            items: function (apiService, $stateParams) {
                if ($stateParams.categoryId) {
                    return apiService.fetchCategoryItemsById($stateParams.categoryId).then((response)=> {
                        if (response.data.items) {
                            return response.data.items;
                        } else {
                            return [];
                        }
                    }).catch((error) => {
                        console.log(error);
                        return [];
                    })
                } else {
                    return apiService.fetchCategoryItemsByName($stateParams.categoryName).then((response)=> {
                        if (response.data.items) {
                            return response.data.items;
                        } else {
                            return [];
                        }
                    }).catch((error) => {
                        console.log(error);
                        return [];
                    })
                }
            },
            categoryName: function ($stateParams) {
                return $stateParams.categoryName;
            }
        }
    });
}]);

itemsModule.component("itemsComponent", {
    template,
    bindings: {
        items: "<",
        categoryName: "<"
    },
    controller: Items
});

export default moduleName;
