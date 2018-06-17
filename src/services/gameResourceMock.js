var app;
(function (app) {
    var mockResource = angular
        .module("gameResourceMock", ["ngMockE2E"]);
    mockResource.run(mockRun);
    mockRun.$inject = ["$httpBackend"];
    function mockRun($httpBackend) {
        var games = [];
        var game;
        game = new app.Game({ "href": "http://api.football-data.org/v1/fixtures/165069" }, "2018-06-14T15:00:00Z", "TIMED", "Russia-XYZ", "SaudiArabia", "owner1", "owner2", { "goalsHomeTeam": 1, "goalsAwayTeam": 0 });
        games.push(game);
        game = new app.Game({ "href": "http://api.football-data.org/v1/fixtures/165084" }, "2018-06-15T12:00:00Z", "TIMED", "Egypt", "SaudiArabiaUruguay", "owner1", "owner2", { "goalsHomeTeam": 2, "goalsAwayTeam": 4 });
        games.push(game);
        game = new app.Game({ "href": "http://api.football-data.org/v1/fixtures/165083" }, "2018-06-15T15:00:00Z", "TIMED", "Morocco", "Iran", "owner1", "owner2", { "goalsHomeTeam": null, "goalsAwayTeam": null });
        games.push(game);
        var gameUrl = "/api/games";
        $httpBackend.whenGET(gameUrl).respond(games);
        var editingRegex = new RegExp(gameUrl + "/[0-9][0-9]*", '');
        $httpBackend.whenGET(editingRegex).respond(function (method, url, data) {
            var game = { "self": { "href": "" } };
            var parameters = url.split('/');
            var length = parameters.length;
            var id = +parameters[length - 1];
            //var gameResults:app.IGame[] = [];
            if (id > 0) {
                for (var i = 0; i < games.length; i++) {
                    if (games[i].self.href.indexOf("/" + id) > 0) {
                        //gameResults.push(games[i]);
                        game = games[i];
                        break;
                    }
                }
            }
            return [200, game, {}];
        });
        // Catch all for testing purposes
        $httpBackend.whenGET(/api/).respond(function (method, url, data) {
            return [200, game, {}];
        });
        // Pass through any requests for application files
        $httpBackend.whenGET(/app/).passThrough();
    }
    /*    require('fs');
    
        function getData():any[]{
            // Declare your variables
            var fs = require('fs');
            var menObject;
    
            // Read the file, and pass it to your callback
            fs.readFile('./men.json, handleJSONFile);
    
            // Handle the data
            var handleJSONFile = function (err, data) {
                if (err) {
                    throw err;
                }
                menObject = JSON.parse(data);
            }
        }*/
})(app || (app = {}));
