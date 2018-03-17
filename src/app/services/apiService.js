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

    let items = [
        {
            title: "Ball"
        },
        {
            title: "Shorts"
        }
    ];

    this.fetchSportsList = () => {
        return $q((resolve) => {
            $timeout(() => {
                resolve(sportsList);
            }, 1000);
        });
    };

    this.fetchCategoryItems = (categoryId) => {
        return $q((resolve) => {
            $timeout(() => {
                resolve(items);
            }, 500);
        });
    };
});

export default moduleName;