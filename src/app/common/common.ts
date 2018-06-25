module app{

    export class Common{
    
        static setButtonsReferences(price: number){
            var btnGames = this.getElementById('btnPartidos');
            btnGames.setAttribute("href","#gameList/" + price);
            var btnStats = this.getElementById('btnEstadsticas');
            btnStats.setAttribute("href","#teamList/" + price);

        }

        static getElementById(id: string): HTMLElement{
            return document.getElementById(id);
        }
        
        static getCanvasContext(elementId: string): CanvasRenderingContext2D{
            var canvas = <HTMLCanvasElement> Common.getElementById(elementId);
            var ctx = canvas.getContext("2d");
            return ctx;
        }

        static getZeroIfNull(value:number):number{
            return value ? value : 0;
        }
        
        static setNextGame(teams: app.ITeam[], games: app.IGame[], owner: IOwner, ownerName: string){
            
            games.forEach((game) => {
                if ( owner.nextGame == null && game.status == "TIMED"){
                    var homeOwner = Common.getOwnerName(teams, game.homeTeamName);
                    var awayOwner = Common.getOwnerName(teams, game.awayTeamName);
                    if (homeOwner == ownerName){
                        owner.nextGame = new app.OwnerNextGame(game.homeTeamName, 
                            game.awayTeamName, awayOwner, game.date);
                    }else{ 
                        if(awayOwner == ownerName){
                            owner.nextGame = new app.OwnerNextGame(game.awayTeamName, 
                                game.homeTeamName, homeOwner, game.date);
                        }
                    }
                }
            });
        }

        static getOwnerName(teams: app.ITeam[], teamName:string):string{
            return teams.filter((team) => {
                return team.team == teamName;
            })[0].owner;
        }
        
        static fixGames(gamesFixed: IGame[], games: IGame[]){
            let gamesToFix = games.filter((game) => {return game.status != 'FINISHED';});
            gamesFixed.filter((game) => {return game.status !='TIMED';})
                .forEach((gameFix) => {
                    for (let i = 0; i < gamesToFix.length; i++) {
                        const game = gamesToFix[i];
                        if (gameFix.date == game.date 
                            && gameFix.homeTeamName == game.homeTeamName 
                            && gameFix.awayTeamName == game.awayTeamName){
                                game.result.goalsAwayTeam = gameFix.result.goalsAwayTeam;
                                game.result.goalsHomeTeam = gameFix.result.goalsHomeTeam;
                                game.status = gameFix.status;
                                i = games.length;
                            }
                    }

                });
        }

    }
}