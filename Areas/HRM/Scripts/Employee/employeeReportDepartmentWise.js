var empTypes = [{ 'Id': 0, 'Name': 'Contractual' },
              { 'Id': 1, 'Name': 'Permanent' }
             
];
$(document).ready(function () {
    function historyVM() {
        var self = this;

        self.officeUnitId = ko.observable();
        self.OfficeUnitList = ko.observableArray([]);
        self.empTypeId = ko.observable();
        self.EmpTypeList = ko.observableArray(empTypes);
        self.officeId = ko.observable();
        self.offices = ko.observableArray([]);

        self.Employees = ko.observableArray([]);
        self.Link1 = ko.observable();
        self.Link2 = ko.observable();
        self.Link3 = ko.observable();

        self.Title1 = ko.observable('PDF');
        self.Title2 = ko.observable('Excel');
        self.Title3 = ko.observable('Word');

        self.officeId.subscribe(function () {
            self.getAllDepartments();
        });

        self.pageReload = function () {
            window.location.href = "/HRM/Employee/EmployeeJobHistoryOfficeWise";
        };

        self.getAllOffices = function () {
            var officeLayerId = 1;
            return $.ajax({
                type: "GET",
                url: '/HRM/Employee/GetEmployeeChildOffices',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.offices(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        };

        self.getAllDepartments = function () {
           return $.ajax({
                type: "GET",
                url: '/HRM/OfficeUnit/GetOfficeUnits?officeid=' + self.officeId(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.OfficeUnitList(data);
                    
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
                url: '/HRM/Employee/GetEmployeeDepartmentWise?officeId=' + self.officeUnitId() + '&empType=' + self.empTypeId(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    //console.log(data);
                    self.Employees(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }

        self.LoadInitial = function () {
            self.getAllOffices();
           // self.getAllDepartments();
            
        };

        self.Reset = function () {
            self.DateDetails('');

        };
        self.IsSave = function () {
            return true;
        };
        self.setUrl = ko.computed(function () {
            self.Link1('/HRM/Employee/GetDepartmentWiseEmployee?reportTypeId=PDF&officeId=' + self.officeUnitId() + '&empType=' + self.empTypeId());
            self.Link2('/HRM/Employee/GetDepartmentWiseEmployee?reportTypeId=Excel&officeId=' + self.officeUnitId() + '&empType=' + self.empTypeId());
            self.Link3('/HRM/Employee/GetDepartmentWiseEmployee?reportTypeId=Word&officeId=' + self.officeUnitId() + '&empType=' + self.empTypeId());
        });
    };


    var vm = new historyVM();
    vm.LoadInitial();
    ko.applyBindings(vm, $("#historyDiv")[0]);
});