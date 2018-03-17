import angular from 'angular';

const moduleName = "apiService";

angular.module(moduleName, []).service(moduleName, function ($http, $q, $timeout) {
    let sportsList = [
        {
            title: "Volleyball"
        },
        {
            title: "Basketball"
        }
    ];

    this.fetchSportsList = () => {
        return $q((resolve) => {
            $timeout(() => {
                resolve(sportsList);
            }, 1000);
        });
    }
});

export default moduleName;