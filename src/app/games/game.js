var app;
(function (app) {
    var IFixture = /** @class */ (function () {
        function IFixture() {
        }
        return IFixture;
    }());
    app.IFixture = IFixture;
    var IGame = /** @class */ (function () {
        function IGame() {
        }
        return IGame;
    }());
    app.IGame = IGame;
    var Game = /** @class */ (function () {
        function Game(self, date, status, homeTeamName, awayTeamName, homeOwner, awayOwner, result) {
            this.self = self;
            this.date = date;
            this.status = status;
            this.homeTeamName = homeTeamName;
            this.awayTeamName = awayTeamName;
            this.homeOwner = homeOwner;
            this.awayOwner = awayOwner;
            this.result = result;
            this.getId = this.self.href.match(/([^\/]*)\/*$/)[1];
        }
        return Game;
    }());
    app.Game = Game;
})(app || (app = {}));
