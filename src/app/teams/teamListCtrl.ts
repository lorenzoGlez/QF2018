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
        games:app.IGame[] = [];

        chartLabels: string[];
        chartSeries: string[];
        chartData: number[][];
        isChartVisible:boolean = false;
        price:  number;

        static $inject=["$routeParams","dataAccessService"];
        constructor(private $routeParams: ITeamParams, private dataAccessService: app.service.DataAccessService){
            this.title = "Estadísticas";
            this.teams = [];

            
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

            this.getGamesRaults(dataAccessService, this.games);

            Common.setButtonsReferences(this.price);
        }

        private getGamesRaults(dataAccessService: app.service.DataAccessService, games:app.IGame[]){
            var gameResource = dataAccessService.getGameResource();
            gameResource.get((data: app.IFixture) => {
                this.games = data.fixtures;

                this.games.forEach((game) => {
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
            this.chartLabels = [];
            this.chartData=[[],[],[],[],[]];

            var ownerResource = dataAccessService.getOwnerResource();
            ownerResource.query((data:app.IOwner[]) =>{
                
                this.owners = data.filter((owner)=>{
                    return owner.quiniela == this.price;
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
                        let teamObj = this.teams.filter((team)=>{
                            return team.team == teamName;
                        })[0];
                        teamObj.owner = owner.ownerName;
                        
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

                    this.setNextGame(ownerObj, owner.name);
                    this.chartLabels.push(owner.name);
                    this.chartData[0].push(owner.points);
                    this.chartData[1].push(owner.goals);
                    this.chartData[2].push(owner.wonGames);
                    this.chartData[3].push(owner.lostGames);
                    this.chartData[4].push(owner.tiedGames);                
    
                })

                console.log("Owners retrieved")

                this.showChart();
            }); 

        }

        private setNextGame(owner: IOwner, ownerName: string){
            
            this.games.forEach((game) => {
                if ( owner.nextGame == null && game.status == "TIMED"){
                    var homeOwner = this.getOwnerName(game.homeTeamName);
                    var awayOwner = this.getOwnerName(game.awayTeamName);
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

        private getOwnerName(teamName:string):string{
            return this.teams.filter((team) => {
                return team.team == teamName;
            })[0].owner;
        }

        private getNonNull(value:number):number{
            return value ? value : 0;
        }

        private showChart(){
            this.isChartVisible = !this.isChartVisible;
            if (this.isChartVisible){
                var statsChart = new Chart(Common.getCanvasContext('mixed-chart'),{
                    type: 'bar',showToolTips: true,
                    data: {
                        labels: this.chartLabels,
                        datasets: [{
                            label: "Puntos",
                            type: "bar",
                            //borderColor: "lightgray",
                            //backgroundColor: "lightblue",                        
                            data: this.chartData[0],
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
                            data: this.chartData[1],
                            yAxisID:"first-y-axis"
                        },                    
                        {
                            label: "Juegos Perdidos",
                            type: "line",
                            borderColor: "red",
                            backgroundColor: "tomato",
                            data: this.chartData[3],
                            fill: true,
                            yAxisID:"first-y-axis"                        
                        },
                        {
                            label: "Juegos Empatados",
                            type: "line",
                            borderColor: "orange",
                            backgroundColor: "yellow",
                            data: this.chartData[4],
                            fill: true,
                            yAxisID:"first-y-axis"                       
                        },
                        {
                            label: "Juegos Ganados",
                            type: "line",
                            borderColor: "green",
                            backgroundColor: "lightgreen",
                            data: this.chartData[2],
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
                            ticks: {
                                //stepSize: 2
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
            
            //this.showChartSample()
        }

        private showChartSample(){
      
                var barChartData = {
                    labels: this.chartLabels,
                    datasets: [ {
                        type: 'bubble',
                        label: 'Goles a Favor',
                        borderColor: "black",
                        backgroundColor: "white",
                        borderWidth: 4,
                        pointRadius: 20,                        
                        data: this.chartData[1]
                    },{
                        type: 'bar',
                        label: 'P. Perdidos',
                        //borderColor: "red",
                        backgroundColor: "tomato",
                        data: this.chartData[3]
                    }, {
                        type: 'bar',
                        label: 'P. Empatados',
                        //borderColor: "orange",
                        backgroundColor: "yellow",
                        data: this.chartData[4]
                    }, {
                        type: 'bar',
                        label: 'P. Ganados',
                        //borderColor: "green",
                        backgroundColor: "lightgreen",
                        data: this.chartData[2]
                    }]
        
                };            
                var myBar = new Chart(Common.getCanvasContext('barChart'), {
                    type: 'bar',
                    data: barChartData,
                    options: {
                        title: {
                            display: true,
                            text: 'Chart.js Bar Chart - Stacked'
                        },
                        tooltips: {
                            mode: 'index',
                            intersect: false
                        },
                        responsive: true,
                        scales: {
                            xAxes: [{
                                stacked: true,
                            }],
                            yAxes: [{
                                stacked: true
                            }]
                        },
                        legend: { display: true }
                    }
                });            
          
        }

        randomScalingFactor() {
            return Math.round(Date.now());
        };


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
            return this.teams.length;
        }



    }
    angular.module("fifa").controller("TeamListCtrl", TeamListCtrl);
}