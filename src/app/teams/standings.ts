module app{
    export class IStanding{
        leagueCaption: string;
        matchday: number;
        standings: {
            A: ITeam[];
            B: ITeam[];
            C: ITeam[];
            D: ITeam[];
            E: ITeam[];
            F: ITeam[];
            G: ITeam[];
            H: ITeam[];
        }
    }
}