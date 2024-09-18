var empHistoryTypes = [{ 'Id': 1, 'Name': 'Transfer' },
                { 'Id': 2, 'Name': 'Promotion' },
                { 'Id': 3, 'Name': 'Resignation' },
                { 'Id': 4, 'Name': 'Join' }
             

];
$(document).ready(function () {
    function historyVM() {
        var self = this;

        self.FromDate = ko.observable();
        self.ToDate = ko.observable();

        self.empHistoryId = ko.observable();
        self.EmpHistoryType = ko.observableArray(empHistoryTypes);

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
                url: '/HRM/Employee/GetJobHisWiseEmployee?empHistoryId=' + self.empHistoryId() + '&fromDate=' + self.FromDate() + '&toDate=' + self.ToDate(),
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
            //self.getAllTrainings();
           // self.getAllEducations();
        };

        self.Reset = function () {
            self.DateDetails('');

        };
        self.IsSave = function () {
            return true;
        };
        self.setUrl = ko.computed(function () {
            self.Link1('/HRM/Employee/GetJobHistoryEmpReport?reportTypeId=PDF&empHistoryId=' + self.empHistoryId() + '&fromDate=' + self.FromDate() + '&toDate=' + self.ToDate());
            self.Link2('/HRM/Employee/GetJobHistoryEmpReport?reportTypeId=Excel&empHistoryId=' + self.empHistoryId() + '&fromDate=' + self.FromDate() + '&toDate=' + self.ToDate());
            self.Link3('/HRM/Employee/GetJobHistoryEmpReport?reportTypeId=Word&empHistoryId=' + self.empHistoryId() + '&fromDate=' + self.FromDate() + '&toDate=' + self.ToDate());
        });
    };


    var vm = new historyVM();
    vm.LoadInitial();
    ko.applyBindings(vm, $("#historyDiv")[0]);
});