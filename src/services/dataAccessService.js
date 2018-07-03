var app;
(function (app) {
    var service;
    (function (service) {
        var DataAccessService = /** @class */ (function () {
            function DataAccessService($resource) {
                this.$resource = $resource;
            }
            DataAccessService.prototype.getGameResource = function () {
                //return this.$resource("/api/games/:gameId");
                return this.$resource("https://api.football-data.org/v1/competitions/467/fixtures", {}, {
                    get: { method: 'GET', headers: { "X-Auth-Token": "393287c72ec0479186e4aabc20caab86" }
                    }
                });
                //return this.$resource("/src/app/games/games.json");
                //return this.$resource("/src/app/games/Fixtures2.json");
                //return this.$resource("/src/app/games/Fixtures.json",);
                //return this.$resource("/src/app/games/convertcsv.json");
                //return this.$resource("http://api.football-data.org/v1/competitions/467/fixtures");
            };
            DataAccessService.prototype.getGameFixedResource = function (url) {
                //return this.$resource("https://jsonblob.com/api/jsonBlob/c947e059-7667-11e8-af14-f133ce27f174",{},{
                //return this.$resource("https://quiniela-fifa-2018.firebaseio.com/x.json",{},{
                return this.$resource(url, {}, {
                    get: { method: 'GET' }
                });
            };
            DataAccessService.prototype.getTeamResource = function () {
                var standing = this.$resource("src/app/teams/teams.json");
                /*standing.prototype.test = function(){
                    return this.leagueCaption;
                }*/
                return standing;
            };
            DataAccessService.prototype.getOwnerResource = function () {
                return this.$resource("src/app/owners/owners.json");
            };
            DataAccessService.prototype.getPreferencesResource = function () {
                return this.$resource("https://quiniela-fifa-2018.firebaseio.com/Preferences.json");
            };
            DataAccessService.apiToken = "393287c72ec0479186e4aabc20caab86";
            DataAccessService.$inject = ["$resource"];
            return DataAccessService;
        }());
        service.DataAccessService = DataAccessService;
        angular.module("fifa").service("dataAccessService", DataAccessService);
    })(service = app.service || (app.service = {}));
})(app || (app = {}));
