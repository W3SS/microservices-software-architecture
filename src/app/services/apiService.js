import angular from 'angular';

const moduleName = "apiService";
const baseUrl = 'http://localhost:5000';
const apiService = angular.module(moduleName, ['ngCookies'])
    .factory('httpRequestInterceptor', function ($cookies) {
        return {
            request: function (config) {
                let token = $cookies.get('token');

                if (token) {
                   config.headers['Authorization'] = 'Bearer ' + token;
                }
                return config;
            }
        };
    }).config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('httpRequestInterceptor');
    }]);


class ApiService {
    constructor($http, $q, $timeout) {
        let sportsList = [
            {
                title: "Volleyball"
            },
            {
                title: "Basketball"
            },
            {
                title: "Snowboarding"
            }
        ];

        let items = [
            {
                title: "Ball"
            },
            {
                title: "Shorts"
            }
        ];

        let items2 = [
            {
                title: "Ball2"
            },
            {
                title: "Shorts2"
            }
        ];

        let items3 = [
            {
                title: "Snowboard"
            },
            {
                title: "Goggles"
            }
        ];

        let categoryDescription = [
            {
                description: "This is a description"
            }
        ];

        this.fetchSportsList = () => {
            /*return $q((resolve) => {
                $timeout(() => {
                    resolve(sportsList);
                }, 1000);
            });*/
            return sportsList;
        };

        this.fetchCategoryItems = (categoryId) => {
            return $q((resolve) => {
                $timeout(() => {
                    switch (categoryId) {
                        case 'Volleyball':
                            resolve(items);
                            break;
                        case 'Basketball':
                            resolve(items2);
                            break;
                        case 'Snowboarding':
                            resolve(items3);
                            break;
                        default:
                            console.log("wrong id");
                    }
                    resolve(items);
                }, 500);
            });
        };

        this.fetchCategoryItemDescription = (itemId) => {
            return $q((resolve) => {
                $timeout(() => {
                    resolve(categoryDescription);
                }, 100);
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
    }
}

apiService.service(moduleName, ApiService);

export default moduleName;