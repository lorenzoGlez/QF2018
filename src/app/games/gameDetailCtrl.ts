module app.gameDetail{
    interface IGameDetailModel{
        title: string;
        game: app.IGame;
    }

    interface IGameParams extends ng.route.IRouteParamsService {
        gameId: string;
    }

    class GameDetailCtrl implements IGameDetailModel{
        title: string;
        game: app.IGame;

        static $inject = ["$routeParams","dataAccessService"];
        constructor(private $routeParams: IGameParams,
                    private dataAccessService: app.service.DataAccessService){
            this.title = "Game Details";

            var gameResource = dataAccessService.getGameResource();
            gameResource.get({gameId: $routeParams.gameId},
                            (data: app.IGame)=>{
                this.game = data;
            });
        }
    }
    angular.module("fifa").controller("GameDetailCtrl", GameDetailCtrl);
}