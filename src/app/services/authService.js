import angular from 'angular';

const moduleName = "authService";
const authService = angular.module(moduleName, ['ngCookies']);


class AuthService {
    constructor($cookies, socialLoginService, $rootScope) {
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
                this.removeRevokedToken();
            }
        };

        this.removeRevokedToken = () => {
            $cookies.remove('token');
            $cookies.remove('exp');
        };

        $rootScope.$on('event:social-sign-out-success', function(event, logoutStatus){
            let auth2 = gapi.auth2.getAuthInstance();

            auth2.signOut().then(() => {
                this.removeRevokedToken();
                $cookies.remove('provider');
                console.log('User signed out.');
            });
        });
    }
}

authService.service(moduleName, AuthService);

export default moduleName;