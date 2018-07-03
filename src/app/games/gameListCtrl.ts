module app.gameList{
    interface IGameModel{
        title: string;
        games: app.IGame[];
    }
    
    export interface IGameParams extends ng.route.IRouteParamsService{
        price: number;
    }

    export class GameListCtrl implements IGameModel{
        public title: string;
        games: app.IGame[];
        owners: app.IOwner[];
        preferences: app.IPreferences;
        price:  number;
        errorTextAlert: string = "";

        static $inject=["$routeParams","dataAccessService"];
        constructor(private $routeParams: IGameParams, private dataAccessService: app.service.DataAccessService){
            this.title = "Juegos";
            this.games = [];
            this.price = this.$routeParams.price ? this.$routeParams.price : 400;

            
            this.price = Math.abs(this.price);

            var preferencesResource = dataAccessService.getPreferencesResource();
            preferencesResource.get((dataPreferences:app.IPreferences) =>{
                this.preferences = dataPreferences;

                var ownerResource = dataAccessService.getOwnerResource();
                ownerResource.query((data:app.IOwner[]) =>{
                    
                    this.owners = data.filter((owner)=>{
                        return owner.quiniela == this.price;
                    });            

                    var gameResource = dataAccessService.getGameResource();
                    gameResource.get((data: app.IFixture) => {
                        this.games = data.fixtures;
                    }).$promise.then((value)=>{
                        this.combineFixData();
                    }).catch((error) => {
                        this.errorTextAlert = "La API de resultados esta fuera de servicio. Se usará último respaldo";
                        this.combineFixData(true);
                    });            
                });
            });
            Common.setButtonsReferences(this.price);
          
        }

        private combineFixData(replaceWholeFixData: boolean = false){
            var gameFixedResource = this.dataAccessService.getGameFixedResource(this.preferences.backupURL);
            gameFixedResource.get((dataFixed: app.IFixture) => {
                if (replaceWholeFixData){
                    this.games=dataFixed.fixtures;
                }else{
                    let gamesFixed = dataFixed.fixtures;
                    let fixingGames: boolean = this.price >= 0;

                    if(fixingGames){Common.fixGames(gamesFixed, this.games);}
                }

                this.games.forEach((game)=>{
                    game.awayOwner = this.owners.filter((owner)=>{return owner.teams.indexOf(game.awayTeamName)>=0;})[0].ownerName;
                    game.homeOwner = this.owners.filter((owner)=>{return owner.teams.indexOf(game.homeTeamName)>=0;})[0].ownerName;
                })
            });
        }

        getTotalGames():number{
            //console.log(JSON.stringify(this.games));
            return this.games.filter((game) => {return game.homeTeamName != ""}).length;
        }
    }
    angular.module("fifa").controller("GameListCtrl", GameListCtrl);
}