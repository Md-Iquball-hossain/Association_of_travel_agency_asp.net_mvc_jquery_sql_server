
$(document).ready(function () {
    function historyVM() {
        var self = this;

        self.FromDate = ko.observable();
        self.ToDate = ko.observable();

        self.salaryItemId = ko.observable();
        self.Month = ko.observable('');
        //self.EmpHistoryType = ko.observableArray(empHistoryTypes);

        self.SalaryItems = ko.observableArray([]);
        self.Employees = ko.observableArray([]);

        self.Link1 = ko.observable();
        self.Link2 = ko.observable();
        self.Link3 = ko.observable();

        self.Title1 = ko.observable('PDF');
        self.Title2 = ko.observable('Excel');
        self.Title3 = ko.observable('Word');

        self.pageReload = function () {
            window.location.href = "/HRM/Employee/EmployeeJobHistoryOfficeWise";
        };


        self.Search = function () {
            $.ajax({
                type: "GET",
                url: '/HRM/SalaryProcess/GetSalaryProcesses?salaryItemId=' + self.salaryItemId() + '&year=' + moment(self.Month()).format("YYYY") + '&month=' + moment(self.Month()).format("MM"),
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

        self.getSalaryItems = function () {
            $.ajax({
                type: "GET",
                url: '/HRM/SalaryProcess/GetSalaryItems',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.SalaryItems(data);
                    console.log(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
            //Ends Here
        };

        self.LoadInitial = function () {
            //self.getAllTrainings();GetSalaryItems
            self.getSalaryItems();
        };

        self.Reset = function () {
            self.DateDetails('');

        };
        self.IsSave = function () {
            return true;
        };
        self.setUrl = ko.computed(function () {
            self.Link1('/HRM/SalaryProcess/GetSalaryProcessReport?reportTypeId=PDF&salaryItemId=' + self.salaryItemId() + '&year=' + moment(self.Month()).format("YYYY") + '&month=' + moment(self.Month()).format("MM"));
            self.Link2('/HRM/SalaryProcess/GetSalaryProcessReport?reportTypeId=Excel&salaryItemId=' + self.salaryItemId() + '&year=' + moment(self.Month()).format("YYYY") + '&month=' + moment(self.Month()).format("MM"));
            self.Link3('/HRM/SalaryProcess/GetSalaryProcessReport?reportTypeId=Word&salaryItemId=' + self.salaryItemId() + '&year=' + moment(self.Month()).format("YYYY") + '&month=' + moment(self.Month()).format("MM"));
        });
    };


    var vm = new historyVM();
    vm.LoadInitial();
    ko.applyBindings(vm, $("#historyDiv")[0]);
});