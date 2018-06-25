var app;
(function (app) {
    var gameList;
    (function (gameList) {
        var GameListCtrl = /** @class */ (function () {
            function GameListCtrl($routeParams, dataAccessService) {
                var _this = this;
                this.$routeParams = $routeParams;
                this.dataAccessService = dataAccessService;
                this.errorTextAlert = "";
                this.title = "Juegos";
                this.games = [];
                this.price = this.$routeParams.price ? this.$routeParams.price : 400;
                this.price = Math.abs(this.price);
                var ownerResource = dataAccessService.getOwnerResource();
                ownerResource.query(function (data) {
                    _this.owners = data.filter(function (owner) {
                        return owner.quiniela == _this.price;
                    });
                    var gameResource = dataAccessService.getGameResource();
                    gameResource.get(function (data) {
                        _this.games = data.fixtures;
                    }).$promise.then(function (value) {
                        _this.combineFixData();
                    }).catch(function (error) {
                        _this.errorTextAlert = "La API de resultados esta fuera de servicio. Se usará último respaldo";
                        _this.combineFixData(true);
                    });
                });
                app.Common.setButtonsReferences(this.price);
            }
            GameListCtrl.prototype.combineFixData = function (replaceWholeFixData) {
                var _this = this;
                if (replaceWholeFixData === void 0) { replaceWholeFixData = false; }
                var gameFixedResource = this.dataAccessService.getGameFixedResource();
                gameFixedResource.get(function (dataFixed) {
                    if (replaceWholeFixData) {
                        _this.games = dataFixed.fixtures;
                    }
                    else {
                        var gamesFixed = dataFixed.fixtures;
                        var fixingGames = _this.price >= 0;
                        if (fixingGames) {
                            app.Common.fixGames(gamesFixed, _this.games);
                        }
                    }
                    _this.games.forEach(function (game) {
                        game.awayOwner = _this.owners.filter(function (owner) { return owner.teams.indexOf(game.awayTeamName) >= 0; })[0].ownerName;
                        game.homeOwner = _this.owners.filter(function (owner) { return owner.teams.indexOf(game.homeTeamName) >= 0; })[0].ownerName;
                    });
                });
            };
            GameListCtrl.prototype.getTotalGames = function () {
                //console.log(JSON.stringify(this.games));
                return this.games.filter(function (game) { return game.homeTeamName != ""; }).length;
            };
            GameListCtrl.$inject = ["$routeParams", "dataAccessService"];
            return GameListCtrl;
        }());
        angular.module("fifa").controller("GameListCtrl", GameListCtrl);
    })(gameList = app.gameList || (app.gameList = {}));
})(app || (app = {}));
