var app;
(function (app) {
    var gameList;
    (function (gameList) {
        var GameListCtrl = /** @class */ (function () {
            function GameListCtrl($routeParams, dataAccessService) {
                var _this = this;
                this.$routeParams = $routeParams;
                this.dataAccessService = dataAccessService;
                this.title = "Juegos";
                this.games = [];
                this.price = this.$routeParams.price ? this.$routeParams.price : 400;
                var ownerResource = dataAccessService.getOwnerResource();
                ownerResource.query(function (data) {
                    _this.owners = data.filter(function (owner) {
                        return owner.quiniela == _this.price;
                    });
                });
                var gameResource = dataAccessService.getGameResource();
                gameResource.get(function (data) {
                    _this.games = data.fixtures;
                    _this.games.forEach(function (game) {
                        game.awayOwner = _this.owners.filter(function (owner) { return owner.teams.indexOf(game.awayTeamName) >= 0; })[0].ownerName;
                        game.homeOwner = _this.owners.filter(function (owner) { return owner.teams.indexOf(game.homeTeamName) >= 0; })[0].ownerName;
                    });
                });
                app.Common.setButtonsReferences(this.price);
            }
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
