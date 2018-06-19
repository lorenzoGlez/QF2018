module app{
    var main = angular.module("fifa",["chart.js","ngRoute","servicesX"]);

    main.config(routeConfig);

    function routeConfig($routeProvider: ng.route.IRouteProvider): void{
        $routeProvider
            .when("/gameList",
                {
                    templateUrl: "/src/app/games/gameListView.html",
                    controller: "GameListCtrl as vm"
                })
            .when("/gameList/:price",
                {
                    templateUrl: "/src/app/games/gameListView.html",
                    controller: "GameListCtrl as vm"
                })
            .when("/gameDetail/:gameId",
                {
                    templateUrl: "src/app/games/gameDetailView.html",
                    controller: "GameDetailCtrl as vm"
                })
            .when("/teamList",
                {
                    templateUrl: "/src/app/teams/teamListView.html",
                    controller: "TeamListCtrl as vm"
                })
                .when("/teamList/:price",
                {
                    templateUrl: "/src/app/teams/teamListView.html",
                    controller: "TeamListCtrl as vm"
                })                
            .when("/teamDetail/:gameId",
                {
                    templateUrl: "src/app/games/teamDetailView.html",
                    controller: "TeamDetailCtrl as vm"
                })
            .otherwise({redirectTo: "/gameList"});
    }
}