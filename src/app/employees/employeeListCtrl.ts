
module app.employeeList{


    class EmployeeListCtrl{
        employees:app.service.IEmployee[];
        empName:string;
        empCity: string;
        empState: string;
        searchName:string;

        static $inject = ["employeeDataAccessService"];
        constructor(employeeService: app.service.IEmployeeService){
            /*this.employees = [
                {
                  "name": "Ramesh",
                  "city": "Hackensack",
                  "state": "NJ"
                },
                {
                  "name": "Pradeep",
                  "city": "Hackensack",
                  "state": "NJ"
                },
                {
                  "name": "Prabhu",
                  "city": "Fairlawn",
                  "state": "NJ"
                },
                {
                  "name": "Prajwa",
                  "city": "Manhatten",
                  "state": "NY"
                },
                {
                  "name": "Sashi",
                  "city": "Toranto",
                  "state": "CA"
                }
          ];*/

          this.employees = [];
          employeeService.getAll()
            .then((employees: app.service.IEmployee[]): void =>{
                this.employees = employees;

            });
          

        }

        getTotalEmployees():number{
            return this.employees.length;
        }

        /*addEmp():void {
            this.employees.push({
                name: this.empName,
                city: this.empCity,
                state: this.empState
            });
        }*/

    }
    angular.module("fifa").controller("EmployeeListCtrl", EmployeeListCtrl);
}