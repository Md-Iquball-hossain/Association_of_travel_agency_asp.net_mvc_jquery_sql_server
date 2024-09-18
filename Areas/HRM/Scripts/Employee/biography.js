
$(document).ready(function () {
    function BiographyVM() {
        var self = this;

        self.Id = ko.observable();
        self.EmployeeId = ko.observable();
        self.EmployeeName = ko.observable();
        self.EmployeeTypeName = ko.observable();
        self.DesignationName = ko.observable();
        self.OfficeUnitName = ko.observable();
        self.OfficeName = ko.observable();

        self.officeUnitId = ko.observable();
        self.OfficeUnitList = ko.observableArray([]);
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
        //url: '/HRM/Office/GetAllOffices?officeLayerId=' + officeLayerId,

        self.getAllOffices = function () {
            var officeLayerId =  1;
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
          return  $.ajax({
                type: "GET",
                url: '/HRM/EmployeeReports/GetOfficeUnits?officeid=' + self.officeId(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.OfficeUnitList(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
           
        };

        self.Search = function () {
            return $.ajax({
                type: "GET",
                url: '/HRM/EmployeeReports/GetEmployeeDepartmentWise?officeid='+ self.officeId() +'&officeUnitId=' + self.officeUnitId(),
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
        };

        self.LoadInitial = function () {
            self.getAllOffices();
            
            //self.getAllDepartments();
           // self.getAllEmployees();

        };

        self.Reset = function () {
            self.DateDetails('');

        };
        self.IsSave = function () {
            return true;
        };
        self.SetAppId = function (data) {
            self.EmployeeId(data.EmployeeId);
            window.open('/HRM/EmployeeReports/EmployeeBiography?reportTypeId=PDF&employeeId=' + self.EmployeeId(), '_blank');
             }
        //self.setUrl = ko.computed(function () {
        //    self.Link1('/HRM/Employee/GetDepartmentWiseEmployee?reportTypeId=PDF&officeId=' + self.officeUnitId() + '&empType=' + self.empTypeId());
        //    self.Link2('/HRM/Employee/GetDepartmentWiseEmployee?reportTypeId=Excel&officeId=' + self.officeUnitId() + '&empType=' + self.empTypeId());
        //    self.Link3('/HRM/Employee/GetDepartmentWiseEmployee?reportTypeId=Word&officeId=' + self.officeUnitId() + '&empType=' + self.empTypeId());
        //});
    };


    var vm = new BiographyVM();
    vm.LoadInitial();
    ko.applyBindings(vm, $("#historyDiv")[0]);
});