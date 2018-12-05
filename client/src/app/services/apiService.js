import angular from 'angular';

const moduleName = "apiService";
const baseUrl = 'http://localhost:5000';
const inventoryURL = 'http://localhost:5001';
const apiService = angular.module(moduleName, ['ngCookies'])
    .factory('httpRequestInterceptor', function ($cookies) {
        return {
            request: function (config) {
                const token = $cookies.get('token');

                if (token) {
                   config.headers['Authorization'] = 'Bearer ' + token;
                   config.headers['X-Api-Key'] = 'secret.api.key';
                }
                return config;
            }
        };
    }).config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('httpRequestInterceptor');
    }]);


class ApiService {
    constructor($http) {
        this.fetchCategories = () => {
            return $http({
                method: 'GET',
                url: inventoryURL + '/categories'
            });
        };

        this.fetchCategoryById = (id) => {
            return $http({
                method: 'GET',
                params: {id: id},
                url: inventoryURL + '/category'
            });
        };

        this.fetchCategoryItemsById = (categoryId) => {
            return $http({
                method: 'GET',
                params: {categoryId: categoryId},
                url: inventoryURL + '/categoryItems'
            });
        };

        this.fetchCategoryItemsByName = (categoryName) => {
            return $http({
                method: 'GET',
                params: {categoryName: categoryName},
                url: inventoryURL + '/categoryItems'
            });
        };

        this.fetchLatestItems = () => {
            return $http({
                method: 'GET',
                params: {latest: true},
                url: inventoryURL + '/items'
            });
        };

        this.fetchItemById = (itemId) => {
            return $http({
                method: 'GET',
                params: {itemId: itemId},
                url: inventoryURL + '/item'
            });
        };

        this.fetchItemByName = (itemName) => {
            return $http({
                method: 'GET',
                params: {itemName: itemName},
                url: inventoryURL + '/item'
            });
        };

        this.fetchToken = (userName, password) => {
            return $http({
                method: 'POST',
                url: baseUrl + '/login',
                data: JSON.stringify({
                    username: 'test',
                    password: 'test'
                }),
                headers: {
                    'Content-type': 'application/json'
                }
            });
        };

        this.oauth2Login = (userDetails) => {
            if (userDetails) {
                return $http({
                    method: 'POST',
                    url: baseUrl + '/oauth',
                    data: JSON.stringify({
                        token: userDetails.token,
                        email: userDetails.email
                    }),
                    params: {
                        provider: userDetails.provider
                    },
                    headers: {
                        'Content-type': 'application/json'
                    }
                });
            } else {
              console.log('no user data');
            }
        };

        this.logout = () => {
            return $http({
                method: 'DELETE',
                url: baseUrl + '/logout'
            });
        };

        this.logoutOauth = (oauthToken, provider) => {
            if (oauthToken && provider) {
                return $http({
                    method: 'DELETE',
                    url: baseUrl + '/logout/oauth',
                    data: JSON.stringify({
                            token: oauthToken
                    }),
                    params: {
                        provider: provider
                    },
                    headers: {
                        'Content-type': 'application/json'
                    }
                });
            } else {
                console.log('missing parameters');
            }
        };

        this.getResource = () => {
            return $http({
                method: 'GET',
                url: baseUrl + '/protected'
            });
        };

        this.userRegister = (user) => {
            if (user) {
                return $http({
                    method: 'POST',
                    url: baseUrl + '/register',
                    data: JSON.stringify({
                        username: user.username,
                        password: user.password,
                        email: user.email
                    }),
                    headers: {
                        'Content-type': 'application/json'
                    }
                });
            } else {
                console.log('missing parameters');
            }
        };

        this.updateItem = (item) => {
            if (item) {
                return $http({
                    method: 'PUT',
                    url: inventoryURL + '/item',
                    data: JSON.stringify({
                        id: item.id,
                        description: item.description,
                        name: item.name,
                        cat_id: item.cat_id
                    }),
                    headers: {
                        'Content-type': 'application/json'
                    }
                });
            } else {
                console.log('item is missing');
            }
        };

        this.deleteItemById = (id) => {
            if (id) {
                return $http({
                    method: 'DELETE',
                    params: {id: id},
                    url: inventoryURL + '/item',
                });
            } else {
                console.log('no item id');
            }
        };

        this.addItem = (item) => {
            if (item) {
                return $http({
                    method: 'POST',
                    url: inventoryURL + '/item',
                    data: JSON.stringify({
                        description: item.description,
                        name: item.name,
                        cat_id: item.cat_id
                    }),
                    headers: {
                        'Content-type': 'application/json'
                    }
                });
            } else {
                console.log('no item')
            }
        }
    }
}

apiService.service(moduleName, ApiService);

export default moduleName;