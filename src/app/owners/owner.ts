
module app{
    export interface IOwner{
        ownerName: string;
        quiniela: number;
        teams: string[];
        teamList: ITeam[];
        rank: number;
        playedGames: number;
        wonGames: number;
        lostGames: number;
        tiedGames: number;
        points: number;
        goals: number;
        goalsAgainst: number;
        goalsDifference: number;
        nextGame:OwnerNextGame;
        initStats(): void;
    }

    export class Owner implements IOwner{
        constructor(
            public ownerName: string,
            public quiniela: number,
            public teams: string[],
            public teamList: ITeam[],
            public rank: number,
            public playedGames: number,
            public wonGames: number,
            public lostGames: number,
            public tiedGames: number,
            public points: number,
            public goals: number,
            public goalsAgainst: number,
            public goalsDifference: number,
            public nextGame:OwnerNextGame,
        ){}

        public initStats(){
            this.playedGames = 0;
            this.wonGames = 0;
            this.lostGames = 0;
            this.tiedGames = 0;
            this.goals = 0;
            this.goalsAgainst = 0;
            this.goalsDifference = 0;
            this.points = 0;
            this.teamList = [];
        }


    }

    export class OwnerNextGame{
        constructor(
            public myTeam: string,
            public vsTeam: string,
            public vsOwner: string,
            public date: string){}
    }

    export class ChartSeries{
        labels: string[];
        points: number[];
        goals: number[];
        wonGames: number[];
        lostGames: number[];
        tiedGames: number[];

        constructor(){
            this.init()
        }

        public init(){
            this.labels = [];
            this.points = [];
            this.goals = [];
            this. wonGames = [];
            this. lostGames = [];
            this.tiedGames = [];
        }

        public addData(label: string, points: number, goals:number, wonGames:number, lostGames: number, tiedGames:number){
            this.labels.push(label);
            this.points.push(points);
            this.goals.push(goals);
            this.wonGames.push(wonGames);
            this.wonGames.push(wonGames);
            this.tiedGames.push(tiedGames);
        }

        public addLabel(label: string){
            this.labels.push(label);
        }
        public addPoints(points: number){
            this.points.push(points);
        }
        public addGoals(goals: number){
            this.goals.push(goals);
        }
        public addWonGames(wonGames: number){
            this.wonGames.push(wonGames);
        }
        public addLostGames(lostGames: number){
            this.lostGames.push(lostGames);
        }
        public addTiedGames(tiedGames: number){
            this.tiedGames.push(tiedGames);
        }

    }
}