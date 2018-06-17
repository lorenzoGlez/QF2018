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
                this.isChartVisible = false;
                this.title = "Estadísticas";
                this.teams = [];
                var games = [];
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
                this.getGamesRaults(dataAccessService, games);
                app.Common.setButtonsReferences(this.price);
            }
            TeamListCtrl.prototype.getGamesRaults = function (dataAccessService, games) {
                var _this = this;
                var gameResource = dataAccessService.getGameResource();
                gameResource.get(function (data) {
                    games = data.fixtures;
                    games.forEach(function (game) {
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
                this.charLabels = [];
                this.charData = [[], [], [], [], []];
                var ownerResource = dataAccessService.getOwnerResource();
                ownerResource.query(function (data) {
                    _this.owners = data.filter(function (owner) {
                        return owner.quiniela == _this.price;
                    });
                    _this.owners.forEach(function (owner) {
                        _this.charLabels.push(owner.ownerName);
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
                        _this.charData[0].push(owner.points);
                        _this.charData[1].push(owner.goals);
                        _this.charData[2].push(owner.wonGames);
                        _this.charData[3].push(owner.lostGames);
                        _this.charData[4].push(owner.tiedGames);
                    });
                    console.log("Owners retrieved");
                });
            };
            TeamListCtrl.prototype.getNonNull = function (value) {
                return value ? value : 0;
            };
            TeamListCtrl.prototype.showChart = function () {
                if (!this.isChartVisible) {
                    var statsChart = new Chart(app.Common.getElementById('mixed-chart'), {
                        type: 'bar',
                        data: {
                            labels: this.charLabels,
                            datasets: [{
                                    label: "Puntos",
                                    type: "bar",
                                    //borderColor: "lightgray",
                                    //backgroundColor: "lightblue",                        
                                    data: this.charData[0],
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
                                    data: this.charData[1],
                                    yAxisID: "first-y-axis"
                                },
                                {
                                    label: "Juegos Perdidos",
                                    type: "line",
                                    borderColor: "red",
                                    backgroundColor: "tomato",
                                    data: this.charData[3],
                                    fill: true,
                                    yAxisID: "first-y-axis"
                                },
                                {
                                    label: "Juegos Empatados",
                                    type: "line",
                                    borderColor: "orange",
                                    backgroundColor: "yellow",
                                    data: this.charData[4],
                                    fill: true,
                                    yAxisID: "first-y-axis"
                                },
                                {
                                    label: "Juegos Ganados",
                                    type: "line",
                                    borderColor: "green",
                                    backgroundColor: "lightgreen",
                                    data: this.charData[2],
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
                                            stepSize: 2
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
                this.isChartVisible = !this.isChartVisible;
            };
            TeamListCtrl.prototype.sampleChart = function () {
                var char = new Chart(document.getElementById("bar"), {
                    type: 'bar',
                    data: {
                        labels: ["1901", "1950", "1999", "2050"],
                        datasets: [{
                                label: "Europe",
                                type: "line",
                                borderColor: "#8e5ea2",
                                data: [408, 547, 675, 734],
                                fill: true
                            }, {
                                label: "Africa",
                                type: "line",
                                borderColor: "#3e95cd",
                                data: [133, 221, 783, 2478],
                                fill: false
                            }, {
                                label: "Europe",
                                type: "bar",
                                backgroundColor: "rgba(0,0,0,0.2)",
                                data: [408, 547, 675, 734],
                            }, {
                                label: "Africa",
                                type: "bar",
                                backgroundColor: "rgba(0,0,0,0.2)",
                                backgroundColorHover: "#3e95cd",
                                data: [133, 221, 783, 2478]
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
            };
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
                //console.log(JSON.stringify(this.games));
                //console.log(this.teams);
                return this.teams.length;
            };
            TeamListCtrl.$inject = ["$routeParams", "dataAccessService"];
            return TeamListCtrl;
        }());
        angular.module("fifa").controller("TeamListCtrl", TeamListCtrl);
    })(teamList = app.teamList || (app.teamList = {}));
})(app || (app = {}));