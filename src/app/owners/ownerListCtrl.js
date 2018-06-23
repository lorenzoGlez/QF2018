var app;
(function (app) {
    var ownerList;
    (function (ownerList_1) {
        var OwnerListCtrl = /** @class */ (function () {
            function OwnerListCtrl(dataAccessService) {
                this.dataAccessService = dataAccessService;
                this.chartSeries = new app.ChartSeries();
            }
            OwnerListCtrl.prototype.getOwnersPromise = function (price) {
                var ownerResource = this.dataAccessService.getOwnerResource();
                var x = ownerResource.query().$promise.then(function (data) {
                    return data;
                });
                return x;
            };
            OwnerListCtrl.prototype.getOwnerList = function (price) {
                var _this = this;
                var ownerResource = this.dataAccessService.getOwnerResource();
                ownerResource.query(function (data) {
                    _this.owners = data.filter(function (owner) {
                        return owner.quiniela == price;
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
                    });
                });
                return this.owners;
            };
            OwnerListCtrl.prototype.setResults = function (games, teams, price, func) {
                var _this = this;
                var ownerResource = this.dataAccessService.getOwnerResource();
                ownerResource.query(function (data) {
                    _this.owners = data.filter(function (owner) {
                        return owner.quiniela == price;
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
                            var teamObj = teams.filter(function (team) {
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
                        app.Common.setNextGame(teams, games, ownerObj, owner.name);
                        _this.chartSeries.addLabel(owner.name);
                        _this.chartSeries.addPoints(owner.points);
                        _this.chartSeries.addGoals(owner.goals);
                        _this.chartSeries.addWonGames(owner.wonGames);
                        _this.chartSeries.addLostGames(owner.lostGames);
                        _this.chartSeries.addTiedGames(owner.tiedGames);
                    });
                    func();
                });
            };
            OwnerListCtrl.$inject = ["dataAccessService"];
            return OwnerListCtrl;
        }());
        ownerList_1.OwnerListCtrl = OwnerListCtrl;
    })(ownerList = app.ownerList || (app.ownerList = {}));
})(app || (app = {}));
