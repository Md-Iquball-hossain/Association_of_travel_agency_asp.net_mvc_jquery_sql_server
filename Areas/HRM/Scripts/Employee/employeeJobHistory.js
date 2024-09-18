$(document).ready(function () {
    function historyVM() {
        var self = this;

        self.OfficeId = ko.observable();
        self.OfficeList = ko.observableArray([]);
        self.Offices = ko.observableArray([]);
        self.Link1 = ko.observable();
        self.Link2 = ko.observable();
        self.Link3 = ko.observable();

        self.Title1 = ko.observable('PDF');
        self.Title2 = ko.observable('Excel');
        self.Title3 = ko.observable('Word');

        self.pageReload = function () {
            window.location.href = "/HRM/Employee/EmployeeJobHistoryOfficeWise";
        };

        self.getAllOffices = function () {
            $.ajax({
                type: "GET",
                url: '/HRM/Office/GetAllActiveOffices',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.OfficeList(data);
                    console.log(data);
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
                url: '/HRM/Employee/GetEmployeeDetailsOfficewise?id=' + self.OfficeId(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    self.Offices(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }

        self.LoadInitial = function () {
            self.getAllOffices();
        };

        self.Reset = function () {
            self.DateDetails('');

        };
        self.IsSave = function () {
            return true;
        };
        self.setUrl = ko.computed(function () {
            self.Link1('/HRM/Employee/GetJobHistoryReport?reportTypeId=PDF&id=' + self.OfficeId());
            self.Link2('/HRM/Employee/GetJobHistoryReport?reportTypeId=Excel&id=' + self.OfficeId());
            self.Link3('/HRM/Employee/GetJobHistoryReport?reportTypeId=Word&id=' + self.OfficeId());
        });
    };


    var vm = new historyVM();
    vm.LoadInitial();
    ko.applyBindings(vm, $("#historyDiv")[0]);
});