var app;
(function (app) {
    var Owner = /** @class */ (function () {
        function Owner(ownerName, quiniela, teams, teamList, rank, playedGames, wonGames, lostGames, tiedGames, points, goals, goalsAgainst, goalsDifference, nextGame) {
            this.ownerName = ownerName;
            this.quiniela = quiniela;
            this.teams = teams;
            this.teamList = teamList;
            this.rank = rank;
            this.playedGames = playedGames;
            this.wonGames = wonGames;
            this.lostGames = lostGames;
            this.tiedGames = tiedGames;
            this.points = points;
            this.goals = goals;
            this.goalsAgainst = goalsAgainst;
            this.goalsDifference = goalsDifference;
            this.nextGame = nextGame;
        }
        Owner.prototype.initStats = function () {
            this.playedGames = 0;
            this.wonGames = 0;
            this.lostGames = 0;
            this.tiedGames = 0;
            this.goals = 0;
            this.goalsAgainst = 0;
            this.goalsDifference = 0;
            this.points = 0;
            this.teamList = [];
        };
        return Owner;
    }());
    app.Owner = Owner;
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
    var ChartSeries = /** @class */ (function () {
        function ChartSeries() {
            this.init();
        }
        ChartSeries.prototype.init = function () {
            this.labels = [];
            this.points = [];
            this.goals = [];
            this.wonGames = [];
            this.lostGames = [];
            this.tiedGames = [];
        };
        ChartSeries.prototype.addData = function (label, points, goals, wonGames, lostGames, tiedGames) {
            this.labels.push(label);
            this.points.push(points);
            this.goals.push(goals);
            this.wonGames.push(wonGames);
            this.wonGames.push(wonGames);
            this.tiedGames.push(tiedGames);
        };
        ChartSeries.prototype.addLabel = function (label) {
            this.labels.push(label);
        };
        ChartSeries.prototype.addPoints = function (points) {
            this.points.push(points);
        };
        ChartSeries.prototype.addGoals = function (goals) {
            this.goals.push(goals);
        };
        ChartSeries.prototype.addWonGames = function (wonGames) {
            this.wonGames.push(wonGames);
        };
        ChartSeries.prototype.addLostGames = function (lostGames) {
            this.lostGames.push(lostGames);
        };
        ChartSeries.prototype.addTiedGames = function (tiedGames) {
            this.tiedGames.push(tiedGames);
        };
        return ChartSeries;
    }());
    app.ChartSeries = ChartSeries;
})(app || (app = {}));
