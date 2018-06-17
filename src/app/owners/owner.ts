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

    }
}