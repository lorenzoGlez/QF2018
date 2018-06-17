var app;
(function (app) {
    var employeeList;
    (function (employeeList) {
        var EmployeeListCtrl = /** @class */ (function () {
            function EmployeeListCtrl(employeeService) {
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
                var _this = this;
                this.employees = [];
                employeeService.getAll()
                    .then(function (employees) {
                    _this.employees = employees;
                });
            }
            EmployeeListCtrl.prototype.getTotalEmployees = function () {
                return this.employees.length;
            };
            EmployeeListCtrl.$inject = ["employeeDataAccessService"];
            return EmployeeListCtrl;
        }());
        angular.module("fifa").controller("EmployeeListCtrl", EmployeeListCtrl);
    })(employeeList = app.employeeList || (app.employeeList = {}));
})(app || (app = {}));
