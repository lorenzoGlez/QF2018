//import { ChartConfiguration } from "../../../typings/modules/chartjs";
var app;
(function (app) {
    var teamList;
    (function (teamList) {
        var TeamListCtrl = /** @class */ (function () {
            function TeamListCtrl($routeParams, dataAccessService) {
                var _this = this;
                this.$routeParams = $routeParams;
                this.dataAccessService = dataAccessService;
                this.games = [];
                this.isChartVisible = false;
                this.title = "Estadísticas";
                this.teams = [];
                this.price = this.$routeParams.price ? this.$routeParams.price : 400;
                var teamResource = dataAccessService.getTeamResource();
                teamResource.get(function (data) {
                    _this.teams = data.standings.A;
                    _this.teams = _this.teams.concat(data.standings.B);
                    _this.teams = _this.teams.concat(data.standings.C);
                    _this.teams = _this.teams.concat(data.standings.D);
                    _this.teams = _this.teams.concat(data.standings.E);
                    _this.teams = _this.teams.concat(data.standings.F);
                    _this.teams = _this.teams.concat(data.standings.G);
                    _this.teams = _this.teams.concat(data.standings.H);
                    console.log("Standings retrieved");
                });
                this.getGamesRaults(dataAccessService, this.games);
                app.Common.setButtonsReferences(this.price);
            }
            TeamListCtrl.prototype.getGamesRaults = function (dataAccessService, games) {
                var _this = this;
                var gameResource = dataAccessService.getGameResource();
                gameResource.get(function (data) {
                    _this.games = data.fixtures;
                    _this.games.forEach(function (game) {
                        if (game.status != "TIMED" && game.homeTeamName != "" && game.homeTeamName != "") {
                            var homeTeam = _this.teams.filter(function (team) {
                                return team.team == game.homeTeamName;
                            })[0];
                            var awayTeam = _this.teams.filter(function (team) {
                                return team.team == game.awayTeamName;
                            })[0];
                            if (homeTeam && awayTeam) {
                                _this.playGame(homeTeam, awayTeam, game);
                            }
                            else {
                                console.log(game.homeTeamName + " or " + game.awayTeamName + " was/were not found in teams");
                            }
                        }
                    });
                    console.log("Games retrieved");
                    _this.calcOwnersResults(dataAccessService);
                });
            };
            TeamListCtrl.prototype.calcOwnersResults = function (dataAccessService) {
                var _this = this;
                this.chartLabels = [];
                this.chartData = [[], [], [], [], []];
                var ownerResource = dataAccessService.getOwnerResource();
                ownerResource.query(function (data) {
                    _this.owners = data.filter(function (owner) {
                        return owner.quiniela == _this.price;
                    });
                    var ownerList = [];
                    _this.owners.forEach(function (owner) {
                        owner.playedGames = 0;
                        owner.wonGames = 0;
                        owner.lostGames = 0;
                        owner.tiedGames = 0;
                        owner.goals = 0;
                        owner.goalsAgainst = 0;
                        owner.goalsDifference = 0;
                        owner.points = 0;
                        owner.teamList = [];
                        owner.teams.forEach(function (teamName) {
                            var teamObj = _this.teams.filter(function (team) {
                                return team.team == teamName;
                            })[0];
                            teamObj.owner = owner.ownerName;
                            owner.teamList.push(teamObj);
                            owner.playedGames += _this.getNonNull(teamObj.playedGames);
                            owner.lostGames += _this.getNonNull(teamObj.lostGames);
                            owner.wonGames += _this.getNonNull(teamObj.wonGames);
                            owner.tiedGames += _this.getNonNull(teamObj.tiedGames);
                            owner.goals += _this.getNonNull(teamObj.goals);
                            owner.goalsDifference += _this.getNonNull(teamObj.goalDifference);
                            owner.goalsAgainst += _this.getNonNull(teamObj.goalsAgainst);
                            owner.points += _this.getNonNull(teamObj.points);
                        });
                        ownerList.push({
                            'name': owner.ownerName,
                            'points': owner.points,
                            'goals': owner.goals,
                            'wonGames': owner.wonGames,
                            'lostGames': owner.lostGames,
                            'tiedGames': owner.tiedGames,
                        });
                    });
                    ownerList.sort(function (o1, o2) {
                        var sortResult = o1.points > o2.points ? -1 : 1;
                        if (o1.points == o2.points) {
                            sortResult = o1.goals > o2.goals ? -1 : 1;
                            if (o1.goals == o2.goals) {
                                sortResult = o1.goalDifference > o2.goalDifference ? -1 : 1;
                            }
                        }
                        return sortResult;
                    });
                    ownerList.forEach(function (owner) {
                        var ownerObj = _this.owners.filter(function (ow) {
                            return ow.ownerName == owner.name;
                        })[0];
                        _this.setNextGame(ownerObj, owner.name);
                        _this.chartLabels.push(owner.name);
                        _this.chartData[0].push(owner.points);
                        _this.chartData[1].push(owner.goals);
                        _this.chartData[2].push(owner.wonGames);
                        _this.chartData[3].push(owner.lostGames);
                        _this.chartData[4].push(owner.tiedGames);
                    });
                    console.log("Owners retrieved");
                    _this.showChart();
                });
            };
            TeamListCtrl.prototype.setNextGame = function (owner, ownerName) {
                var _this = this;
                this.games.forEach(function (game) {
                    if (owner.nextGame == null && game.status == "TIMED") {
                        var homeOwner = _this.getOwnerName(game.homeTeamName);
                        var awayOwner = _this.getOwnerName(game.awayTeamName);
                        if (homeOwner == ownerName) {
                            owner.nextGame = new app.OwnerNextGame(game.homeTeamName, game.awayTeamName, awayOwner, game.date);
                        }
                        else {
                            if (awayOwner == ownerName) {
                                owner.nextGame = new app.OwnerNextGame(game.awayTeamName, game.homeTeamName, homeOwner, game.date);
                            }
                        }
                    }
                });
            };
            TeamListCtrl.prototype.getOwnerName = function (teamName) {
                return this.teams.filter(function (team) {
                    return team.team == teamName;
                })[0].owner;
            };
            TeamListCtrl.prototype.getNonNull = function (value) {
                return value ? value : 0;
            };
            TeamListCtrl.prototype.showChart = function () {
                this.isChartVisible = !this.isChartVisible;
                if (this.isChartVisible) {
                    var statsChart = new Chart(app.Common.getCanvasContext('mixed-chart'), {
                        type: 'bar', showToolTips: true,
                        data: {
                            labels: this.chartLabels,
                            datasets: [{
                                    label: "Puntos",
                                    type: "bar",
                                    //borderColor: "lightgray",
                                    //backgroundColor: "lightblue",                        
                                    data: this.chartData[0],
                                    yAxisID: "first-y-axis",
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
                                    yAxisID: "first-y-axis"
                                },
                                {
                                    label: "Juegos Perdidos",
                                    type: "line",
                                    borderColor: "red",
                                    backgroundColor: "tomato",
                                    data: this.chartData[3],
                                    fill: true,
                                    yAxisID: "first-y-axis"
                                },
                                {
                                    label: "Juegos Empatados",
                                    type: "line",
                                    borderColor: "orange",
                                    backgroundColor: "yellow",
                                    data: this.chartData[4],
                                    fill: true,
                                    yAxisID: "first-y-axis"
                                },
                                {
                                    label: "Juegos Ganados",
                                    type: "line",
                                    borderColor: "green",
                                    backgroundColor: "lightgreen",
                                    data: this.chartData[2],
                                    fill: true,
                                    yAxisID: "first-y-axis"
                                }
                            ]
                        },
                        options: {
                            scales: {
                                yAxes: [{
                                        id: "first-y-axis",
                                        type: 'linear',
                                        stacked: true,
                                        scaleLabel: {
                                            labelString: "Puntos & Juegos",
                                            display: false
                                        }
                                    }, {
                                        id: "second-y-axis",
                                        stacked: true,
                                        type: 'linear',
                                        position: "right",
                                        ticks: {
                                        //stepSize: 2
                                        },
                                        scaleLabel: {
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
            };
            TeamListCtrl.prototype.showChartSample = function () {
                var barChartData = {
                    labels: this.chartLabels,
                    datasets: [{
                            type: 'bubble',
                            label: 'Goles a Favor',
                            borderColor: "black",
                            backgroundColor: "white",
                            borderWidth: 4,
                            pointRadius: 20,
                            data: this.chartData[1]
                        }, {
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
                var myBar = new Chart(app.Common.getCanvasContext('barChart'), {
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
            };
            TeamListCtrl.prototype.randomScalingFactor = function () {
                return Math.round(Date.now());
            };
            ;
            TeamListCtrl.prototype.toggleShowTeams = function (owner) {
                owner.showTeams = !owner.showTeams;
            };
            TeamListCtrl.prototype.playGame = function (homeTeam, awayTeam, game) {
                if (game.status != "TIMED") {
                    if (game.result.goalsHomeTeam > game.result.goalsAwayTeam) {
                        homeTeam.wonGames ? homeTeam.wonGames++ : homeTeam.wonGames = 1;
                        awayTeam.lostGames ? awayTeam.lostGames++ : awayTeam.lostGames = 1;
                        homeTeam.points += 3;
                    }
                    else {
                        if (game.result.goalsAwayTeam > game.result.goalsHomeTeam) {
                            awayTeam.wonGames ? awayTeam.wonGames++ : awayTeam.wonGames = 1;
                            homeTeam.lostGames ? homeTeam.lostGames++ : homeTeam.lostGames = 1;
                            awayTeam.points += 3;
                        }
                        else {
                            homeTeam.tiedGames ? homeTeam.tiedGames++ : homeTeam.tiedGames = 1;
                            awayTeam.tiedGames ? awayTeam.tiedGames++ : awayTeam.tiedGames = 1;
                            homeTeam.points++;
                            awayTeam.points++;
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
            };
            TeamListCtrl.prototype.getTotalTeams = function () {
                return this.teams.length;
            };
            TeamListCtrl.$inject = ["$routeParams", "dataAccessService"];
            return TeamListCtrl;
        }());
        angular.module("fifa").controller("TeamListCtrl", TeamListCtrl);
    })(teamList = app.teamList || (app.teamList = {}));
})(app || (app = {}));
