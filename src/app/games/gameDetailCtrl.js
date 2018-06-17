var app;
(function (app) {
    var gameDetail;
    (function (gameDetail) {
        var GameDetailCtrl = /** @class */ (function () {
            function GameDetailCtrl($routeParams, dataAccessService) {
                var _this = this;
                this.$routeParams = $routeParams;
                this.dataAccessService = dataAccessService;
                this.title = "Game Details";
                var gameResource = dataAccessService.getGameResource();
                gameResource.get({ gameId: $routeParams.gameId }, function (data) {
                    _this.game = data;
                });
            }
            GameDetailCtrl.$inject = ["$routeParams", "dataAccessService"];
            return GameDetailCtrl;
        }());
        angular.module("fifa").controller("GameDetailCtrl", GameDetailCtrl);
    })(gameDetail = app.gameDetail || (app.gameDetail = {}));
})(app || (app = {}));
