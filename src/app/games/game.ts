module app{
    export class IFixture{
        _links: {
            self: {
                href: string;
            },
            competition: {
                href: string;
            }
        };
        count: number;
        fixtures: IGame[];
    }
    
    export class IGame{
        self: {href: string};
        date: string;
        status: string;
        homeTeamName : string;
        awayTeamName : string;
        homeOwner: string;
        awayOwner: string;
        result: {
            goalsHomeTeam: number,
            goalsAwayTeam: number
        }
    }
    

    export class Game implements IGame {
        
        getId:string;

        constructor( public self: {href: string},
                     public date: string,
                     public status: string,
                     public homeTeamName : string,
                     public awayTeamName : string,
                     public homeOwner: string,
                     public awayOwner: string,                     
                     public result: {
                        goalsHomeTeam: number,
                        goalsAwayTeam: number}){
            
            this.getId = this.self.href.match(/([^\/]*)\/*$/)[1];
        }
        
    }
}