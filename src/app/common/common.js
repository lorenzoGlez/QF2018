var app;
(function (app) {
    var Common = /** @class */ (function () {
        function Common() {
        }
        Common.setButtonsReferences = function (price) {
            var btnGames = this.getElementById('btnPartidos');
            btnGames.setAttribute("href", "#gameList/" + price);
            var btnStats = this.getElementById('btnEstadsticas');
            btnStats.setAttribute("href", "#teamList/" + price);
        };
        Common.getElementById = function (id) {
            return document.getElementById(id);
        };
        Common.getCanvasContext = function (elementId) {
            var canvas = Common.getElementById(elementId);
            var ctx = canvas.getContext("2d");
            return ctx;
        };
        return Common;
    }());
    app.Common = Common;
})(app || (app = {}));
