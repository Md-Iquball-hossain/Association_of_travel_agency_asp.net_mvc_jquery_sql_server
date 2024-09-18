$(document).ready(function () {
   
    function receiveVM() {
        var self = this;
     
        self.Year = ko.observable('');
        self.Month = ko.observable('');
        self.DateDetails = ko.observableArray([]);
        self.Month.subscribe(function () {
            self.Year(moment(self.Month()).format("YYYY"));
        });
        //self.Days = ko.observableArray(days); Details
        self.Day = ko.observable('');
        self.DayTwo = ko.observable('');

        self.PresentDate = ko.observable('');
        self.HolidayId = ko.observable();
        self.HolidayType = ko.observableArray([]);
        self.Details = ko.observableArray([]);

        self.EmployeeId = ko.observable();
        self.EmployeeList = ko.observableArray([]);
        


        self.officeUnitId = ko.observable();
        self.OfficeUnitList = ko.observableArray([]);
        self.officeId = ko.observable();
        self.offices = ko.observableArray([]);

        self.Link1 = ko.observable();
        self.Link2 = ko.observable();
        self.Link3 = ko.observable();

        //Fahmida Nina
        self.Link4 = ko.observable();
        self.Link5 = ko.observable();
        self.Link6 = ko.observable();

        self.Title4 = ko.observable('PDF');
        self.Title5 = ko.observable('Excel');
        self.Title6 = ko.observable('Word');

        self.Title1 = ko.observable('PDF');
        self.Title2 = ko.observable('Excel');
        self.Title3 = ko.observable('Word');

        self.officeId.subscribe(function () {
            self.getAllDepartments();
        });
        self.officeUnitId.subscribe(function () {
            self.getAllEmployees();
        });
        //self.EmployeeId.subscribe(function () {
        //    self.EmployeeId(self.EmployeeId());
        //    alert(self.EmployeeId());
        //});

        self.LoadInitial = function () {
            self.getAllOffices();
        };

        self.pageReload = function () {
            window.location.href = "/HRM/Production/Receive";
        };

        self.getAllOffices = function () {
            
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

        //fahmida nina
        self.Search = function () {
           
            //self.DateDetails([]);
            //alert(self.EmployeeId());
            return $.ajax({
                type: "GET",
               // url: '/HRM/Employee/GetPayslipForEmployee?year=' + moment(self.Month()).format("YYYY") + '&month=' + moment(self.Month()).format("MM") + '&id=' + self.EmployeeId(),
                url: '/HRM/Employee/GetPayslipForEmployeeOffice?year=' + moment(self.Month()).format("YYYY") + '&month=' + moment(self.Month()).format("MM") + '&id=' + self.EmployeeId() + '&officeid=' + self.officeId() ,
                contentType: "application/json",
                success: function (data) {
                    self.Details(data);
                    //console.log(data);
                },
                error: function () {
                    alert(error.status + "<--and-->" + error.statusText);
                }
            });
        }

        self.getAllEmployees = function () {
            ///HRM/Employee/GetAllActiveEmployees
          return  $.ajax({
                type: "GET",
                url: '/HRM/Employee/GetEmployeeDepartmentWise?officeId=' + self.officeUnitId(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.EmployeeList(data);
                    //console.log(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
            //Ends Here
        };
     

        self.removeDetail = function (receiveDetail) {
            self.ReceiveDetails.remove(receiveDetail);
        };

        self.Reset = function () {
            self.DateDetails('');

        };
        self.setUrl = ko.computed(function () {

            self.Link4('/HRM/Employee/GetSalaryReport?reportTypeId=PDF&year=' + moment(self.Month()).format("YYYY") + '&month=' + moment(self.Month()).format("MM") + '&officeid=' + self.officeId() + '&id=' + self.EmployeeId());
            self.Link5('/HRM/Employee/GetSalaryReport?reportTypeId=Excel&year=' + moment(self.Month()).format("YYYY") + '&month=' + moment(self.Month()).format("MM") + '&officeid=' + self.officeId() + '&id=' + self.EmployeeId());
            self.Link6('/HRM/Employee/GetSalaryReport?reportTypeId=Word&year=' + moment(self.Month()).format("YYYY") + '&month=' + moment(self.Month()).format("MM") + '&officeid=' + self.officeId() + '&id=' + self.EmployeeId());



            self.Link1('/HRM/Employee/GetPaySlipReport?reportTypeId=PDF&year=' + moment(self.Month()).format("YYYY") + '&month=' + moment(self.Month()).format("MM") + '&id=' + self.EmployeeId());
            self.Link2('/HRM/Employee/GetPaySlipReport?reportTypeId=Excel&year=' + moment(self.Month()).format("YYYY") + '&month=' + moment(self.Month()).format("MM") + '&id=' + self.EmployeeId());
            self.Link3('/HRM/Employee/GetPaySlipReport?reportTypeId=Word&year=' + moment(self.Month()).format("YYYY") + '&month=' + moment(self.Month()).format("MM") + '&id=' + self.EmployeeId());

        });
     

        self.IsSave = function () {
            return true;
        };

    }

    var vm = new receiveVM();
    vm.LoadInitial();
    //vm.getAllEmployees();
    //vm.getAllDepartments();
    ko.applyBindings(vm, $("#receiveDiv")[0]);
});