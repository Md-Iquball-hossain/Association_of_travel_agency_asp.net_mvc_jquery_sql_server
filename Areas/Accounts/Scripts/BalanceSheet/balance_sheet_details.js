/// <reference path="../knockout-3.4.0.debug.js" />
/// <reference path="../jquery-2.1.4.js" />
/// <reference path="../finix.util.js" />
/// <reference path="~/Scripts/knockout.validation.min.js" />

$(document).ready(function () {
    var currentDate = (new Date()).toISOString().split('T')[0];

    function employeelistVm() {

        var self = this;
        self.ToDate = ko.observable(currentDate);

        self.Employees = ko.observableArray([]);
        self.Link1 = ko.observable();
        self.Link2 = ko.observable();
        self.Link3 = ko.observable();
        self.Title1 = ko.observable('PDF');
        self.Title2 = ko.observable('Excel');
        self.Title3 = ko.observable('Word');

        self.getAllBalanceSheet = function () {
            $.ajax({
                type: "GET",
                url: '/Accounts/BalanceSheet/GetAllBalanceSheetDetails?toDate=' + moment(self.ToDate()).format("DD/MM/YYYY"),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.Employees(data); //Put the response in ObservableArray

                    // console.log(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }

        self.setUrl = ko.computed(function () {
            self.Link1('/Accounts/BalanceSheet/GetAllBalanceSheetDetailsReport?reportTypeId=PDF&toDate=' + moment(self.ToDate()).format("DD/MM/YYYY"));
            self.Link2('/Accounts/BalanceSheet/GetAllBalanceSheetDetailsReport?reportTypeId=Excel&toDate=' + moment(self.ToDate()).format("DD/MM/YYYY"));
            self.Link3('/Accounts/BalanceSheet/GetAllBalanceSheetDetailsReport?reportTypeId=Word&toDate=' + moment(self.ToDate()).format("DD/MM/YYYY"));
        });
        //Edit Start
        self.getTitle = function (data) {
            //alert("t");
            return self.titleEdit('Edit');
            //console.log(self.urlEdit);

        }
        //End Edid Code
    }
    var vm = new employeelistVm();
    //vm.getAllBalanceSheet();
    ko.applyBindings(vm, $('#balanceSheetDetails')[0]);
});
