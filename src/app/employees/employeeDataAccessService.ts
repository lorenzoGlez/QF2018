module app.service{

    export interface IEmployeeService{
        getById(uniqueId: number): ng.IPromise<IEmployee>;
        getAll();
    }

    export interface IEmployee{
        id: number;
        name: string;
        city: string;
        state: string;
    }

    class EmployeeDataAccessService implements IEmployeeService{

        static $inject = ['$http'];
        constructor (private $http: ng.IHttpService){}
        
        getAll():ng.IPromise<IEmployee[]>{
            return this.$http.get('/src/app/employees/employees.json')
                .then((response: ng.IHttpPromiseCallbackArg<IEmployee[]>): IEmployee[] =>{
                    return response.data;
                })
        }
        getById(uniqueId: number): ng.IPromise<IEmployee>{
            return this.$http.get('./emplojees.json')
                .then((response: ng.IHttpPromiseCallbackArg<IEmployee>): IEmployee => {
                    return response.data;
                });
        }

    }
    angular.module("fifa").service("employeeDataAccessService", EmployeeDataAccessService);
}