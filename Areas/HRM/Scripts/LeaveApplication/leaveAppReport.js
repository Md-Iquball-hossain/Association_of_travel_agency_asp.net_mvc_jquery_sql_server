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
        self.FromDate = ko.observable();
        self.ToDate = ko.observable();
        self.monthId = ko.observable();
        self.MonthList = ko.observableArray(months);
        self.leaveTypeId = ko.observable();
        self.LeaveTypeList = ko.observableArray([]);
        //self.Employees = ko.observableArray([]);
        

        self.Link1 = ko.observable();
        self.Link2 = ko.observable();
        self.Link3 = ko.observable();

        self.Title1 = ko.observable('PDF');
        self.Title2 = ko.observable('Excel');
        self.Title3 = ko.observable('Word');

        self.LoadInitial = function () {
        };

        //self.pageReload = function () {
        //    window.location.href = "/Production/Receive";
        //};

        self.Search = function () {
            //self.DateDetails([]);
            return $.ajax({
                type: "GET",
                url: '/HRM/LeaveApplication/GetLeaveApplicationsForReport?monthId=' + self.monthId() + '&leaveId=' + self.leaveTypeId() + '&fromDate=' + self.FromDate() + '&toDate=' + self.ToDate(),
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

        self.getAllLeaveTypes = function () {
            $.ajax({
                type: "GET",
                url: '/HRM/LeaveType/GetLeaveTypes',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.LeaveTypeList(data);
                    console.log(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
            //Ends Here
        };

        //self.getAllMonths = function () {
        //    $.ajax({
        //        type: "GET",
        //        url: '/LeaveApplication/GetAllMonths',
        //        contentType: "application/json; charset=utf-8",
        //        dataType: "json",
        //        success: function (data) {
        //            self.MonthList(data);
        //            console.log(data);
        //        },
        //        error: function (error) {
        //            alert(error.status + "<--and--> " + error.statusText);
        //        }
        //    });
        //    //Ends Here
        //};

        //self.removeDetail = function (receiveDetail) {
        //    self.ReceiveDetails.remove(receiveDetail);
        //};

        self.Reset = function () {
            self.DateDetails('');

        };
        self.setUrl = ko.computed(function () {
            self.Link1('/HRM/LeaveApplication/GetLeaveApplicationReport?reportTypeId=PDF&monthId=' + self.monthId() + '&leaveId=' + self.leaveTypeId());
            self.Link2('/HRM/LeaveApplication/GetLeaveApplicationReport?reportTypeId=Excel&monthId=' + self.monthId() + '&leaveId=' + self.leaveTypeId());
            self.Link3('/HRM/LeaveApplication/GetLeaveApplicationReport?reportTypeId=Word&monthId=' + self.monthId() + '&leaveId=' + self.leaveTypeId());
        });


        self.IsSave = function () {
            return true;
        };

    }

    var vm = new receiveVM();
    vm.LoadInitial();
    vm.getAllLeaveTypes();
    ko.applyBindings(vm, $("#receiveDiv")[0]);
});