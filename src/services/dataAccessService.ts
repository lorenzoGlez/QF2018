module app.service{
    interface IDataAccessService{
        getGameResource():ng.resource.IResourceClass<IGameResource>;
        getTeamResource(): ng.resource.IResourceClass<ITeamResource>;
        getOwnerResource(): ng.resource.IResourceClass<IOwnerResource>;
        getPreferencesResource(): ng.resource.IResourceClass<IPreferencesResource>;
    }

    interface IGameResource extends ng.resource.IResource<IFixture>{}

    interface ITeamResource extends ng.resource.IResource<IStanding>{}

    interface IOwnerResource extends ng.resource.IResource<IOwner>{}

    interface IPreferencesResource extends ng.resource.IResource<IPreferences>{}

    export class DataAccessService 
        implements IDataAccessService{
            static apiToken:string = "393287c72ec0479186e4aabc20caab86"
            static $inject = ["$resource"];
            

            constructor(private $resource: ng.resource.IResourceService){
                
            }


            getGameResource():ng.resource.IResourceClass<IGameResource>{
                //return this.$resource("/api/games/:gameId");
                return this.$resource("https://api.football-data.org/v1/competitions/467/fixtures",{},{
                    get:{method:'GET', headers: {"X-Auth-Token": "393287c72ec0479186e4aabc20caab86"}
                }});
                //return this.$resource("/src/app/games/games.json");
                //return this.$resource("/src/app/games/Fixtures2.json");
                //return this.$resource("/src/app/games/Fixtures.json",);
                //return this.$resource("/src/app/games/convertcsv.json");
                //return this.$resource("http://api.football-data.org/v1/competitions/467/fixtures");
            }

            getGameFixedResource(url:string):ng.resource.IResourceClass<IGameResource>{
                //return this.$resource("https://jsonblob.com/api/jsonBlob/c947e059-7667-11e8-af14-f133ce27f174",{},{
                //return this.$resource("https://quiniela-fifa-2018.firebaseio.com/x.json",{},{
                return this.$resource(url,{},{
                    get:{method:'GET'}
                });
            }

            getTeamResource():ng.resource.IResourceClass<ITeamResource>{
                var standing = this.$resource("src/app/teams/teams.json");
                /*standing.prototype.test = function(){
                    return this.leagueCaption;
                }*/
                return standing;
            }

            getOwnerResource():ng.resource.IResourceClass<IOwnerResource>{
                return this.$resource("src/app/owners/owners.json");
            }

            getPreferencesResource():ng.resource.IResourceClass<IPreferencesResource>{
                return this.$resource("https://quiniela-fifa-2018.firebaseio.com/Preferences.json")
            }
        }
        angular.module("fifa").service("dataAccessService", DataAccessService);
}