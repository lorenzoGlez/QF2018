module app.service{
    interface IDataAccessService{
        getGameResource():ng.resource.IResourceClass<IGameResource>;
        getTeamResource(): ng.resource.IResourceClass<ITeamResource>;
        getOwnerResource(): ng.resource.IResourceClass<IWonerResource>;
    }

    interface IGameResource extends ng.resource.IResource<IFixture>{}

    interface ITeamResource extends ng.resource.IResource<IStanding>{}

    interface IWonerResource extends ng.resource.IResource<IOwner>{}

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

            getTeamResource():ng.resource.IResourceClass<ITeamResource>{
                var standing = this.$resource("src/app/teams/teams.json");
                /*standing.prototype.test = function(){
                    return this.leagueCaption;
                }*/
                return standing;
            }

            getOwnerResource():ng.resource.IResourceClass<IWonerResource>{
                return this.$resource("src/app/owners/owners.json");
            }
        }
        angular.module("fifa").service("dataAccessService", DataAccessService);
}