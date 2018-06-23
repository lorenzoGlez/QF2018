module app{
    export interface ITeam{
        group: string;
        rank: number;
        team: string;
        teamId: number;
        playedGames: number;
        crestURI: string;
        wonGames: number;
        lostGames: number;
        tiedGames: number;
        points: number;
        goals: number;
        goalsAgainst: number;
        goalDifference: number;
        owner: string;
        eliminated: boolean;

        //playGame(game: app.IGame){};
    }

    

    /*export class Team implements ITeam{
        group: string;
        rank: number;
        team: string;
        teamId: number;
        playedGames: number;
        crestURI: string;
        wonGames: number = 0;
        lostGames: number = 0;
        tiedGames: number = 0;
        points: number = 0;
        goals: number = 0;
        goalsAgainst: number = 0;
        goalDifference: number;
        owner: string;

        
        $playGame (game: app.IGame){
            if(game.homeTeamName == this.team){
                if(game.result.goalsHomeTeam > game.result.goalsAwayTeam){
                    this.wonGames++;
                }else{
                    if (game.result.goalsHomeTeam < game.result.goalsAwayTeam){
                        this.lostGames++;
                    }else{
                        this.tiedGames++;
                    }
                }
                this.goals += game.result.goalsHomeTeam;
                this.goalsAgainst += game.result.goalsAwayTeam;
            }
            if(game.awayTeamName == this.team){
                if(game.result.goalsHomeTeam > game.result.goalsAwayTeam){
                    this.lostGames++;
                }else{
                    if (game.result.goalsHomeTeam < game.result.goalsAwayTeam){
                        this.wonGames++;
                    }else{
                        this.tiedGames++;
                    }
                }
                this.goalsAgainst += game.result.goalsHomeTeam;
                this.goals += game.result.goalsAwayTeam;
            }
            this.playedGames++;
            this.goalDifference = this.goals - this.goalsAgainst;
            return this;
            
        }
    }*/
}