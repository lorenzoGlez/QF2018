module app.gameList{
    interface IGameModel{
        title: string;
        games: app.IGame[];
    }
    
    interface IGameParams extends ng.route.IRouteParamsService{
        price: number;
    }

    class GameListCtrl implements IGameModel{
        title: string;
        games: app.IGame[];
        owners: app.IOwner[];
        price:  number;

        static $inject=["$routeParams","dataAccessService"];
        constructor(private $routeParams: IGameParams, private dataAccessService: app.service.DataAccessService){
            this.title = "Juegos";
            this.games = [];
            this.price = this.$routeParams.price ? this.$routeParams.price : 400;

            var ownerResource = dataAccessService.getOwnerResource();
            ownerResource.query((data:app.IOwner[]) =>{
                
                this.owners = data.filter((owner)=>{
                    return owner.quiniela == this.price;
                });
            });


            var gameResource = dataAccessService.getGameResource();
            gameResource.get((data: app.IFixture) => {
                this.games = data.fixtures;

                var gameFixedResource = dataAccessService.getGameFixedResource();
                gameFixedResource.get((dataFixed: app.IFixture) => {
                    let gamesFixed = dataFixed.fixtures;

                    Common.fixGames(gamesFixed, this.games);

                    this.games.forEach((game)=>{
                        game.awayOwner = this.owners.filter((owner)=>{return owner.teams.indexOf(game.awayTeamName)>=0;})[0].ownerName;
                        game.homeOwner = this.owners.filter((owner)=>{return owner.teams.indexOf(game.homeTeamName)>=0;})[0].ownerName;
                    })
                });
            });            
            Common.setButtonsReferences(this.price);
          
        }

        getTotalGames():number{
            //console.log(JSON.stringify(this.games));
            return this.games.filter((game) => {return game.homeTeamName != ""}).length;
        }
    }
    angular.module("fifa").controller("GameListCtrl", GameListCtrl);
}