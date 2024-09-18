var months = [{ 'Id': 1, 'Name': 'January' },
              { 'Id': 2, 'Name': 'February' },
              { 'Id': 3, 'Name': 'March' },
              { 'Id': 4, 'Name': 'April' },
              { 'Id': 5, 'Name': 'May' },
              { 'Id': 6, 'Name': 'June' },
              { 'Id': 7, 'Name': 'July' },
              { 'Id': 8, 'Name': 'August' },
              { 'Id': 9, 'Name': 'September' },
              { 'Id': 10, 'Name': 'October' },
              { 'Id': 11, 'Name': 'November' },
              { 'Id': 12, 'Name': 'December' }
];
$(document).ready(function () {

    function receiveVM() {
        var self = this;

        self.Details = ko.observableArray([]);
      
        self.officeId = ko.observable();
        self.OfficeList = ko.observableArray([]);
        //self.Employees = ko.observableArray([]);

        self.Link1 = ko.observable();
        self.Link2 = ko.observable();
        self.Link3 = ko.observable();

        self.Title1 = ko.observable('PDF');
        self.Title2 = ko.observable('Excel');
        self.Title3 = ko.observable('Word');

        self.LoadInitial = function () {
        };

        self.pageReload = function () {
            window.location.href = "/HRM/Production/Receive";
        };

        self.Search = function () {
            //self.DateDetails([]);
            return $.ajax({
                type: "GET",
                url: '/HRM/LeaveApplication/GetLeaveApplicationsForOfficeReport?officeId=' + self.officeId() ,
                contentType: "application/json",
                success: function (data) {
                    self.Details(data);
                    console.log(data);
                },
                error: function () {
                    alert(error.status + "<--and-->" + error.statusText);
                }
            });
        }

        self.getAllOffices = function () {

            return $.ajax({
                type: "GET",
                url: '/HRM/Employee/GetEmployeeChildOffices',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.OfficeList(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        };

        //self.getAllOffices = function () {
        //    $.ajax({
        //        type: "GET",
        //        url: '/HRM/Office/GetAllActiveOffices',
        //        contentType: "application/json; charset=utf-8",
        //        dataType: "json",
        //        success: function (data) {
        //            self.OfficeList(data);
        //            console.log(data);
        //        },
        //        error: function (error) {
        //            alert(error.status + "<--and--> " + error.statusText);
        //        }
        //    });
        //    //Ends Here
        //};

   

        self.Reset = function () {
            self.DateDetails('');

        };
        self.setUrl = ko.computed(function () {
            self.Link1('/HRM/LeaveApplication/GetLeaveApplicationReportOfficeWise?reportTypeId=PDF&officeId=' + self.officeId());
            self.Link2('/HRM/LeaveApplication/GetLeaveApplicationReportOfficeWise?reportTypeId=Excel&officeId=' + self.officeId());
            self.Link3('/HRM/LeaveApplication/GetLeaveApplicationReportOfficeWise?reportTypeId=Word&officeId=' + self.officeId());
        });


        self.IsSave = function () {
            return true;
        };

    }

    var vm = new receiveVM();
    vm.LoadInitial();
    vm.getAllOffices();
    ko.applyBindings(vm, $("#receiveDiv")[0]);
});