
module app.ownerList{
    
    export class OwnerListCtrl{
        owners: app.IOwner[];
        chartSeries: app.ChartSeries = new app.ChartSeries();

        static $inject = ["dataAccessService"];
        constructor(private dataAccessService: app.service.DataAccessService){}

        getOwnersPromise(price:number): Promise<any[]> {
            var ownerResource = this.dataAccessService.getOwnerResource();
            var x = ownerResource.query().$promise.then((data:any[]) => {
                return data;
            });
            return <Promise<any>>x;
        }

        public getOwnerList(price: number):app.IOwner[]{

            var ownerResource = this.dataAccessService.getOwnerResource();
            ownerResource.query((data:IOwner[]) => {
                this.owners = data.filter((owner)=>{
                    return owner.quiniela == price;
                });

                var ownerList = [];

                this.owners.forEach((owner)=>{
                    
                    owner.playedGames = 0;
                    owner.wonGames = 0;
                    owner.lostGames = 0;
                    owner.tiedGames = 0;
                    owner.goals = 0;
                    owner.goalsAgainst = 0;
                    owner.goalsDifference = 0;
                    owner.points = 0;
                    owner.teamList = [];
                });
            });
            return this.owners;
        }

        public setResults(games:app.IGame[], teams: app.ITeam[], price: number, func:Function){

            var ownerResource = this.dataAccessService.getOwnerResource();
            ownerResource.query((data:IOwner[]) => {
                this.owners = data.filter((owner)=>{
                    return owner.quiniela == price;
                });

                var ownerList = [];

                this.owners.forEach((owner)=>{
                    
                    owner.playedGames = 0;
                    owner.wonGames = 0;
                    owner.lostGames = 0;
                    owner.tiedGames = 0;
                    owner.goals = 0;
                    owner.goalsAgainst = 0;
                    owner.goalsDifference = 0;
                    owner.points = 0;
                    owner.teamList = [];
                });            

                var ownerList = [];

                this.owners.forEach((owner)=>{
                    
                    owner.playedGames = 0;
                    owner.wonGames = 0;
                    owner.lostGames = 0;
                    owner.tiedGames = 0;
                    owner.goals = 0;
                    owner.goalsAgainst = 0;
                    owner.goalsDifference = 0;
                    owner.points = 0;
                    owner.teamList = [];

                    owner.teams.forEach((teamName)=>{
                        let teamObj = teams.filter((team)=>{
                            return team.team == teamName;
                        })[0];
                        teamObj.owner = owner.ownerName;
                        
                        owner.teamList.push(teamObj);
                        owner.playedGames += Common.getZeroIfNull(teamObj.playedGames);
                        owner.lostGames += Common.getZeroIfNull(teamObj.lostGames);
                        owner.wonGames += Common.getZeroIfNull(teamObj.wonGames);
                        owner.tiedGames += Common.getZeroIfNull(teamObj.tiedGames);
                        owner.goals += Common.getZeroIfNull(teamObj.goals);
                        owner.goalsDifference += Common.getZeroIfNull(teamObj.goalDifference);
                        owner.goalsAgainst += Common.getZeroIfNull(teamObj.goalsAgainst);
                        owner.points += Common.getZeroIfNull(teamObj.points);
                        
                    });
                    

                    ownerList.push({
                        'name': owner.ownerName,
                        'points': owner.points,
                        'goals': owner.goals,
                        'wonGames' :owner.wonGames,
                        'lostGames' :owner.lostGames,
                        'tiedGames' :owner.tiedGames,
                    })


                });

                ownerList.sort((o1, o2) => {
                    var sortResult = o1.points > o2.points ? -1 : 1;
                    if(o1.points == o2.points){
                        sortResult = o1.goals > o2.goals ? -1 : 1;
                        if (o1.goals == o2.goals){
                            sortResult = o1.goalDifference > o2.goalDifference ? -1 : 1
                        }
                    }
                    return sortResult
                })

                
                ownerList.forEach((owner) => {
                    var ownerObj = this.owners.filter((ow) =>{
                        return ow.ownerName == owner.name;
                    })[0];

                    Common.setNextGame(teams, games, ownerObj, owner.name);
                    this.chartSeries.addLabel(owner.name);
                    this.chartSeries.addPoints(owner.points);
                    this.chartSeries.addGoals(owner.goals);
                    this.chartSeries.addWonGames(owner.wonGames);
                    this.chartSeries.addLostGames(owner.lostGames);
                    this.chartSeries.addTiedGames(owner.tiedGames);

                });
                func();
            });

        }
    }
}