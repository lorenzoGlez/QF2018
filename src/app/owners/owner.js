var app;
(function (app) {
    var OwnerNextGame = /** @class */ (function () {
        function OwnerNextGame(myTeam, vsTeam, vsOwner, date) {
            this.myTeam = myTeam;
            this.vsTeam = vsTeam;
            this.vsOwner = vsOwner;
            this.date = date;
        }
        return OwnerNextGame;
    }());
    app.OwnerNextGame = OwnerNextGame;
})(app || (app = {}));
