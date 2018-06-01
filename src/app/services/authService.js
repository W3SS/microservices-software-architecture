import angular from 'angular';

const moduleName = "authService";
const authService = angular.module(moduleName, ['ngCookies']);


class AuthService {
    constructor($cookies, socialLoginService, $rootScope, apiService) {
        let self = this;

        this.isUserAuthenticated = () => {
            let expTime = $cookies.get('exp');

            if (expTime) {
                return expTime > (Date.now() / 1000);
            } else {
                return false;
            }
        };

        this.isUserAuthenticatedByGoogle = () => {
            let googleAuth = $cookies.get('provider');

            return !!googleAuth;
        };

        this.logout = () => {
            if (this.isUserAuthenticatedByGoogle()) {
                socialLoginService.logout();
            } else {
                apiService.logout().then((response) => {
                    this.removeRevokedToken();
                    console.log('logged out successfully ')
                }).catch((error) => {
                    console.log('logout error');
                    console.log(error);
                });
            }
        };

        this.removeRevokedToken = () => {
            $cookies.remove('token');
            $cookies.remove('exp');
        };

        $rootScope.$on('event:social-sign-out-success', function(event, logoutStatus){
            let auth2 = gapi.auth2.getAuthInstance();
            let providerToken = $cookies.get('providerToken');
            let provider = $cookies.get('provider');

            auth2.signOut().then(() => {
                apiService.logoutOauth(providerToken, provider).then((response) => {
                    $cookies.remove('token');
                    $cookies.remove('exp');
                    $cookies.remove('provider');
                    $cookies.remove('providerToken');
                    console.log('User signed out.');
                }).catch((error) => {
                    console.log('oauth logout error on the backend');
                    console.log(error);
                });
            });
        });
    }
}

authService.service(moduleName, AuthService);

export default moduleName;