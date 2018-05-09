import angular from 'angular';

const moduleName = "apiService";

angular.module(moduleName, []).service(moduleName, function ($http, $q, $timeout) {
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
        return $q((resolve) => {
            $timeout(() => {
                resolve(sportsList);
            }, 1000);
        });
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
    }
});

export default moduleName;