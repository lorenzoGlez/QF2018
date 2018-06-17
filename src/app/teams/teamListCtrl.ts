//import { ChartConfiguration } from "../../../typings/modules/chartjs";

module app.teamList{
    interface ITeamModel{
        title: string;
        teams: app.ITeam[];
    }

    interface ITeamParams extends ng.route.IRouteParamsService{
        price: number;
    }

    class TeamListCtrl implements ITeamModel{
        title: string;
        teams: app.ITeam[];
        owners: app.IOwner[];

        charLabels: string[];
        charSeries: string[];
        charData: number[][];
        isChartVisible:boolean = false;
        price:  number;

        static $inject=["$routeParams","dataAccessService"];
        constructor(private $routeParams: ITeamParams, private dataAccessService: app.service.DataAccessService){
            this.title = "Estadísticas";
            this.teams = [];
            var games:app.IGame[] = [];
            
            this.price = this.$routeParams.price ? this.$routeParams.price : 400;
            
            var teamResource = dataAccessService.getTeamResource();
            teamResource.get((data: app.IStanding) => {
                this.teams = data.standings.A;
                this.teams = this.teams.concat(data.standings.B);
                this.teams = this.teams.concat(data.standings.C);
                this.teams = this.teams.concat(data.standings.D);
                this.teams = this.teams.concat(data.standings.E);
                this.teams = this.teams.concat(data.standings.F);
                this.teams = this.teams.concat(data.standings.G);
                this.teams = this.teams.concat(data.standings.H);
                console.log("Standings retrieved")
            });

            this.getGamesRaults(dataAccessService, games);

            Common.setButtonsReferences(this.price);
        }

        private getGamesRaults(dataAccessService: app.service.DataAccessService, games:app.IGame[]){
            var gameResource = dataAccessService.getGameResource();
            gameResource.get((data: app.IFixture) => {
                games = data.fixtures;

                games.forEach((game) => {
                    if (game.status != "TIMED" && game.homeTeamName != "" && game.homeTeamName != "" ){
                        var homeTeam: app.ITeam = this.teams.filter((team) =>{
                            return team.team == game.homeTeamName;
                        })[0];
                        var awayTeam: app.ITeam = this.teams.filter((team) =>{
                            return team.team == game.awayTeamName;
                        })[0];

                        if (homeTeam && awayTeam){
                            this.playGame(homeTeam, awayTeam,game);
                        }else{
                            console.log(game.homeTeamName + " or " + game.awayTeamName + " was/were not found in teams");
                        }
                    }
                    
                })
                console.log("Games retrieved")
                this.calcOwnersResults(dataAccessService);
            });

        }

        private calcOwnersResults(dataAccessService: app.service.DataAccessService){
            this.charLabels = [];
            this.charData=[[],[],[],[],[]];

            var ownerResource = dataAccessService.getOwnerResource();
            ownerResource.query((data:app.IOwner[]) =>{
                
                
                this.owners = data.filter((owner)=>{
                    return owner.quiniela == this.price;
                });

                this.owners.forEach((owner)=>{
                    this.charLabels.push(owner.ownerName);
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
                        let teamObj = this.teams.filter((team)=>{
                            return team.team == teamName;
                        })[0];

                        owner.teamList.push(teamObj);
                        owner.playedGames += this.getNonNull(teamObj.playedGames);
                        owner.lostGames += this.getNonNull(teamObj.lostGames);
                        owner.wonGames += this.getNonNull(teamObj.wonGames);
                        owner.tiedGames += this.getNonNull(teamObj.tiedGames);
                        owner.goals += this.getNonNull(teamObj.goals);
                        owner.goalsDifference += this.getNonNull(teamObj.goalDifference);
                        owner.goalsAgainst += this.getNonNull(teamObj.goalsAgainst);
                        owner.points += this.getNonNull(teamObj.points);
                        
                    });
                    this.charData[0].push(owner.points);
                    this.charData[1].push(owner.goals);
                    this.charData[2].push(owner.wonGames);
                    this.charData[3].push(owner.lostGames);
                    this.charData[4].push(owner.tiedGames);
                });
                console.log("Owners retrieved")
            }); 

        }

        private getNonNull(value:number):number{
            return value ? value : 0;
        }

        private showChart(){
            if (!this.isChartVisible){
                var statsChart = new Chart(Common.getElementById('mixed-chart'),{
                    type: 'bar',
                    data: {
                        labels: this.charLabels,
                        datasets: [{
                            label: "Puntos",
                            type: "bar",
                            //borderColor: "lightgray",
                            //backgroundColor: "lightblue",                        
                            data: this.charData[0],
                            yAxisID:"first-y-axis",
                            
                        },
                        {
                            label: "Goles Favor",
                            type: "bubble",
                            borderWidth: 4,
                            pointRadius: 20,
                            borderColor: "black",
                            backgroundColor: "white",
                            pointBackgroundColor: 'red',
                            data: this.charData[1],
                            yAxisID:"first-y-axis"
                        },                    
                        {
                            label: "Juegos Perdidos",
                            type: "line",
                            borderColor: "red",
                            backgroundColor: "tomato",
                            data: this.charData[3],
                            fill: true,
                            yAxisID:"first-y-axis"                        
                        },
                        {
                            label: "Juegos Empatados",
                            type: "line",
                            borderColor: "orange",
                            backgroundColor: "yellow",
                            data: this.charData[4],
                            fill: true,
                            yAxisID:"first-y-axis"                       
                        },
                        {
                            label: "Juegos Ganados",
                            type: "line",
                            borderColor: "green",
                            backgroundColor: "lightgreen",
                            data: this.charData[2],
                            fill: true,
                            yAxisID:"first-y-axis"                       
                        }                    
                    ]
                    },
                    options: {
                    scales:{
                        yAxes:[{
                            id: "first-y-axis",
                            type: 'linear',
                            stacked: true,
                            scaleLabel:{
                                labelString: "Puntos & Juegos",
                                display: false
                            }
                        },{
                            id:"second-y-axis",
                            stacked: true,
                            type: 'linear',
                            position: "right",
                            ticks:{
                                stepSize: 2
                            },
                            scaleLabel:{ 
                                labelString: "Goles",
                                display: false
                            }
                        }

                    ],
                    },
                    responsive: true,
                    maintainAspectRatio: true,
                    title: {
                        display: true,
                        text: 'Puntos & Juegos y Goles'
                    },
                    legend: { display: true }
                    }
                }); 
                
            }
            this.isChartVisible = !this.isChartVisible;
        }

        private sampleChart(){
            var char = new Chart(document.getElementById("bar"), {
                type: 'bar',
                data: {
                  labels: ["1901", "1950", "1999", "2050"],
                  datasets: [{
                      label: "Europe",
                      type: "line",
                      borderColor: "#8e5ea2",
                      data: [408,547,675,734],
                      fill: true
                    }, {
                      label: "Africa",
                      type: "line",
                      borderColor: "#3e95cd",
                      data: [133,221,783,2478],
                      fill: false
                    }, {
                      label: "Europe",
                      type: "bar",
                      backgroundColor: "rgba(0,0,0,0.2)",
                      data: [408,547,675,734],
                    }, {
                      label: "Africa",
                      type: "bar",
                      backgroundColor: "rgba(0,0,0,0.2)",
                      backgroundColorHover: "#3e95cd",
                      data: [133,221,783,2478]
                    }
                  ]
                },
                options: {
                  title: {
                    display: true,
                    text: 'Population growth (millions): Europe & Africa'
                  },
                  legend: { display: false }
                }
            }); 
        }

        toggleShowTeams(owner){
            owner.showTeams = !owner.showTeams;
        }

        private playGame(homeTeam: ITeam, awayTeam:ITeam, game: IGame):void{
            if (game.status != "TIMED"){
                if(game.result.goalsHomeTeam > game.result.goalsAwayTeam){
                    homeTeam.wonGames ? homeTeam.wonGames++: homeTeam.wonGames = 1;
                    awayTeam.lostGames ? awayTeam.lostGames++: awayTeam.lostGames = 1;
                    homeTeam.points += 3;
                }else{
                    if (game.result.goalsAwayTeam > game.result.goalsHomeTeam){
                        awayTeam.wonGames ? awayTeam.wonGames++: awayTeam.wonGames = 1;
                        homeTeam.lostGames ? homeTeam.lostGames++: homeTeam.lostGames = 1;
                        awayTeam.points += 3;
                    }else{
                        homeTeam.tiedGames ? homeTeam.tiedGames++ : homeTeam.tiedGames=1;
                        awayTeam.tiedGames ? awayTeam.tiedGames++ : awayTeam.tiedGames=1;
                        homeTeam.points ++;
                        awayTeam.points ++;
                    }
                }
                
                homeTeam.playedGames++;
                homeTeam.goals += game.result.goalsHomeTeam;
                homeTeam.goalsAgainst += game.result.goalsAwayTeam;
                homeTeam.goalDifference = homeTeam.goals - homeTeam.goalsAgainst;

                awayTeam.playedGames++;
                awayTeam.goals += game.result.goalsAwayTeam;
                awayTeam.goalsAgainst += game.result.goalsHomeTeam;
                awayTeam.goalDifference = awayTeam.goals - awayTeam.goalsAgainst;            
            }
        }

        getTotalTeams():number{
            //console.log(JSON.stringify(this.games));
            //console.log(this.teams);
            return this.teams.length;
        }



    }
    angular.module("fifa").controller("TeamListCtrl", TeamListCtrl);
}