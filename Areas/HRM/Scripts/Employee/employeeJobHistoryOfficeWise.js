$(document).ready(function () {
    function historyVM() {
        var self = this;

        self.EmployeeId = ko.observable();
        self.EmployeeList = ko.observableArray([]);
        self.Employees = ko.observableArray([]);
        self.Link1 = ko.observable();
        self.Link2 = ko.observable();
        self.Link3 = ko.observable();
        self.OfficeId = ko.observable();
        self.OfficeList = ko.observableArray([]);

        self.Title1 = ko.observable('PDF');
        self.Title2 = ko.observable('Excel');
        self.Title3 = ko.observable('Word');
       
        self.pageReload = function () {
            window.location.href = "/HRM/Employee/EmployeeJobHistoryOfficeWise";
        };

        self.getAllEmployees = function() {
            $.ajax({
                type: "GET",
                url: '/HRM/Employee/GetAllActiveEmployees',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data) {
                    self.EmployeeList(data);
                    console.log(data);
                },
                error: function(error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
            //Ends Here
        };

        self.getAllChildOffices = function () {
            $.ajax({
                type: "GET",
                url: '/HRM/Employee/GetEmployeeChildOffices',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.OfficeList(data);
                    //console.log(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
            //Ends Here
        };

        self.Search = function () {
            $.ajax({
                type: "GET",
                url: '/HRM/Employee/GetEmployeeDetails?id=' + self.EmployeeId(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    self.Employees(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }

        self.LoadInitial = function () {
            self.getAllEmployees();
        };

        self.Reset = function () {
            self.DateDetails('');

        };
        self.IsSave = function () {
            return true;
        };
        self.setUrl = ko.computed(function () {
            self.Link1('/HRM/Employee/GetReceivedReport?reportTypeId=PDF&id=' + self.EmployeeId());
            self.Link2('/HRM/Employee/GetReceivedReport?reportTypeId=Excel&id=' + self.EmployeeId());
            self.Link3('/HRM/Employee/GetReceivedReport?reportTypeId=Word&id=' + self.EmployeeId());
        });
    };
 

    var vm = new historyVM();
    vm.LoadInitial();
    ko.applyBindings(vm, $("#historyDiv")[0]);
});