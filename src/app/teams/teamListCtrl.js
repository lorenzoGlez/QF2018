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
                this.chartSeries = new app.ChartSeries();
                this.isChartVisible = false;
                this.ownerListCtrl = new app.ownerList.OwnerListCtrl(this.dataAccessService);
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
                                _this.updateTeamStats(homeTeam, awayTeam, game);
                            }
                            else {
                                console.log(game.homeTeamName + " or " + game.awayTeamName + " was/were not found in teams");
                            }
                        }
                    });
                    console.log("Games retrieved");
                    _this.rankTeams();
                    _this.calcOwnersResults(dataAccessService);
                });
            };
            TeamListCtrl.prototype.rankTeams = function () {
                this.teams.sort(function (s1, s2) {
                    var sortResult = s1.group < s2.group ? -1 : 1;
                    if (s1.group == s2.group) {
                        sortResult = s1.points > s2.points ? -1 : 1;
                        if (s1.points == s2.points) {
                            sortResult = s1.goals > s2.goals ? -1 : 1;
                            if (s1.goals == s2.goals) {
                                sortResult = s1.goalDifference > s2.goalDifference ? -1 : 1;
                            }
                        }
                    }
                    return sortResult;
                });
                for (var index = 0; index < this.teams.length; index += 4) {
                    this.teams[index].rank = 1;
                    this.teams[index + 1].rank = 2;
                    this.teams[index + 2].eliminated = this.teams[index + 2].playedGames > 2;
                    this.teams[index + 3].eliminated = this.teams[index + 3].playedGames > 2;
                }
            };
            TeamListCtrl.prototype.calcOwnersResults = function (dataAccessService) {
                var _this = this;
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
                            owner.playedGames += app.Common.getZeroIfNull(teamObj.playedGames);
                            owner.lostGames += app.Common.getZeroIfNull(teamObj.lostGames);
                            owner.wonGames += app.Common.getZeroIfNull(teamObj.wonGames);
                            owner.tiedGames += app.Common.getZeroIfNull(teamObj.tiedGames);
                            owner.goals += app.Common.getZeroIfNull(teamObj.goals);
                            owner.goalsDifference += app.Common.getZeroIfNull(teamObj.goalDifference);
                            owner.goalsAgainst += app.Common.getZeroIfNull(teamObj.goalsAgainst);
                            owner.points += app.Common.getZeroIfNull(teamObj.points);
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
                        app.Common.setNextGame(_this.teams, _this.games, ownerObj, owner.name);
                        _this.chartSeries.addLabel(owner.name);
                        _this.chartSeries.addPoints(owner.points);
                        _this.chartSeries.addGoals(owner.goals);
                        _this.chartSeries.addWonGames(owner.wonGames);
                        _this.chartSeries.addLostGames(owner.lostGames);
                        _this.chartSeries.addTiedGames(owner.tiedGames);
                    });
                    console.log("Owners retrieved");
                    _this.showChart();
                });
            };
            TeamListCtrl.prototype.showChart = function () {
                this.isChartVisible = !this.isChartVisible;
                if (this.isChartVisible) {
                    var statsChart = new Chart(app.Common.getCanvasContext('mixed-chart'), {
                        type: 'bar',
                        data: {
                            labels: this.chartSeries.labels,
                            datasets: [{
                                    label: "Puntos",
                                    type: "bar",
                                    //borderColor: "lightgray",
                                    //backgroundColor: "lightblue",                        
                                    data: this.chartSeries.points,
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
                                    data: this.chartSeries.goals,
                                    yAxisID: "first-y-axis"
                                },
                                {
                                    label: "Juegos Perdidos",
                                    type: "line",
                                    borderColor: "red",
                                    backgroundColor: "tomato",
                                    data: this.chartSeries.lostGames,
                                    fill: true,
                                    yAxisID: "first-y-axis"
                                },
                                {
                                    label: "Juegos Empatados",
                                    type: "line",
                                    borderColor: "orange",
                                    backgroundColor: "yellow",
                                    data: this.chartSeries.tiedGames,
                                    fill: true,
                                    yAxisID: "first-y-axis"
                                },
                                {
                                    label: "Juegos Ganados",
                                    type: "line",
                                    borderColor: "green",
                                    backgroundColor: "lightgreen",
                                    data: this.chartSeries.wonGames,
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
                    labels: this.chartSeries.labels,
                    datasets: [{
                            type: 'bubble',
                            label: 'Goles a Favor',
                            borderColor: "black",
                            backgroundColor: "white",
                            borderWidth: 4,
                            pointRadius: 20,
                            data: this.chartSeries.goals
                        }, {
                            type: 'bar',
                            label: 'P. Perdidos',
                            //borderColor: "red",
                            backgroundColor: "tomato",
                            data: this.chartSeries.lostGames
                        }, {
                            type: 'bar',
                            label: 'P. Empatados',
                            //borderColor: "orange",
                            backgroundColor: "yellow",
                            data: this.chartSeries.tiedGames
                        }, {
                            type: 'bar',
                            label: 'P. Ganados',
                            //borderColor: "green",
                            backgroundColor: "lightgreen",
                            data: this.chartSeries.wonGames
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
            TeamListCtrl.prototype.updateTeamStats = function (homeTeam, awayTeam, game) {
                if (game.status != "TIMED") {
                    homeTeam.eliminated = awayTeam.eliminated = false;
                    if (game.result.goalsHomeTeam > game.result.goalsAwayTeam) {
                        homeTeam.wonGames ? homeTeam.wonGames++ : homeTeam.wonGames = 1;
                        awayTeam.lostGames ? awayTeam.lostGames++ : awayTeam.lostGames = 1;
                        homeTeam.points += 3;
                        awayTeam.eliminated = awayTeam.playedGames > 3;
                    }
                    else {
                        if (game.result.goalsAwayTeam > game.result.goalsHomeTeam) {
                            awayTeam.wonGames ? awayTeam.wonGames++ : awayTeam.wonGames = 1;
                            homeTeam.lostGames ? homeTeam.lostGames++ : homeTeam.lostGames = 1;
                            awayTeam.points += 3;
                            homeTeam.eliminated = homeTeam.playedGames > 3;
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
