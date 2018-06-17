/*
module app.data{
    export class Fixture{
        http;

        constructor($http){
            this.http = $http;
        }

        getData(): any{
            return $http.get('/client.json')
                .map((response: Response) => {
                    console.log("mock data" + response.json());
                    return response.json();
                }
    )
    .catch(this.handleError);
}
        }
    }
}
*/