var empTypes = [{ 'Id': 0, 'Name': 'Contractual' },
              { 'Id': 1, 'Name': 'Permanent' }

];
$(document).ready(function () {
    function historyVM() {
        var self = this;

      
        self.FromAmount = ko.observable();
        self.ToAmount = ko.observable();
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
                url: '/HRM/Employee/GetSalaryWiseEmployee?fromAmount=' + self.FromAmount() + '&toAmount=' + self.ToAmount(),
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
            //self.getAllEmployees();
        };

        self.Reset = function () {
            self.DateDetails('');

        };
        self.IsSave = function () {
            return true;
        };
        self.setUrl = ko.computed(function () {
            self.Link1('/HRM/Employee/GetSalaryRangeWiseEmp?reportTypeId=PDF&fromAmount=' + self.FromAmount() + '&toAmount=' + self.ToAmount());
            self.Link2('/HRM/Employee/GetSalaryRangeWiseEmp?reportTypeId=Excel&fromAmount=' + self.FromAmount() + '&toAmount=' + self.ToAmount());
            self.Link3('/HRM/Employee/GetSalaryRangeWiseEmp?reportTypeId=Word&fromAmount=' + self.FromAmount() + '&toAmount=' + self.ToAmount());
        });
    };


    var vm = new historyVM();
    vm.LoadInitial();
    ko.applyBindings(vm, $("#historyDiv")[0]);
});