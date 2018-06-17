var app;
(function (app) {
    var service;
    (function (service) {
        var EmployeeDataAccessService = /** @class */ (function () {
            function EmployeeDataAccessService($http) {
                this.$http = $http;
            }
            EmployeeDataAccessService.prototype.getAll = function () {
                return this.$http.get('/src/app/employees/employees.json')
                    .then(function (response) {
                    return response.data;
                });
            };
            EmployeeDataAccessService.prototype.getById = function (uniqueId) {
                return this.$http.get('./emplojees.json')
                    .then(function (response) {
                    return response.data;
                });
            };
            EmployeeDataAccessService.$inject = ['$http'];
            return EmployeeDataAccessService;
        }());
        angular.module("fifa").service("employeeDataAccessService", EmployeeDataAccessService);
    })(service = app.service || (app.service = {}));
})(app || (app = {}));
