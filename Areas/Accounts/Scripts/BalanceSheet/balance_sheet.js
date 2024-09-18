/// <reference path="../knockout-3.4.0.debug.js" />
/// <reference path="../jquery-2.1.4.js" />
/// <reference path="../finix.util.js" />
/// <reference path="~/Scripts/knockout.validation.min.js" />
var currentDate = (new Date()).toISOString().split('T')[0];
$(document).ready(function () {
    function employeelistVm() {

        var self = this;

        self.CompanyList = ko.observableArray(Companies);
        self.CompanyProfileIds = ko.observableArray([]);
        self.CompanyProfileIds.push(userCompanyId);

        self.pendingItems = ko.observable(0);
        self.pendingItemPreviousCount = ko.observable('');
        self.pendingItems.subscribe(function () {
            if (self.pendingItems() === 1 && self.pendingItemPreviousCount() === 0) {
                $('#loadingModal').modal('show');
            }
            else if (self.pendingItems() === 0 && self.pendingItemPreviousCount() === 1) {
                $('#loadingModal').modal('hide');
                $('.modal-backdrop').remove();
            }
        });
        self.pendingItemsIncrement = function () {
            self.pendingItemPreviousCount(self.pendingItems());
            self.pendingItems(self.pendingItems() + 1);
        };

        self.pendingItemsDecrement = function () {
            self.pendingItemPreviousCount(self.pendingItems());
            self.pendingItems(self.pendingItems() - 1);
        };


        self.ToDate = ko.observable(currentDate);
        self.Records = ko.observableArray([]);
        self.Link1 = ko.observable();
        self.Link2 = ko.observable();
        self.Link3 = ko.observable();
        self.Title1 = ko.observable('PDF');
        self.Title2 = ko.observable('Excel');
        self.Title3 = ko.observable('Word');

        self.getAllBalanceSheet = function () {
            url = "/Accounts/BalanceSheet/GetAllBalanceSheetReport?reportTypeId=PDF&toDate=" + moment(self.ToDate()).format("DD/MM/YYYY");
            $.each(self.CompanyProfileIds(), function (index, value) {
                url += "&CompanyProfileIds=" + value;
            })
            window.open(url, '_blank');
            //$.ajax({
            //    type: "GET",
            //    url: '/Accounts/BalanceSheet/GetAllBalanceSheet?toDate=' + moment(self.ToDate()).format("DD/MM/YYYY"),
            //    contentType: "application/json; charset=utf-8",
            //    dataType: "json",
            //    success: function (data) {
            //        self.Employees(data); //Put the response in ObservableArray
            //    },
            //    error: function (error) {
            //        alert(error.status + "<--and--> " + error.statusText);
            //    }
            //});
            //self.pendingItemsIncrement();
            //var queryData = {
            //    ToDateText: moment(self.ToDate()).format("DD/MM/YYYY"),
            //    CompanyProfileIds: self.CompanyProfileIds()
            //}
            //return $.ajax({
            //    type: "POST",
            //    url: "/Accounts/BalanceSheet/GetAllBalanceSheet",
            //    contentType: "application/json; charset=utf-8",
            //    dataType: "json",
            //    data: ko.toJSON(queryData),
            //    success: function (data) {
            //        self.Records(data);
            //    },
            //    error: function (error) {
            //        alert(error.status + "<--and--> " + error.statusText);
            //    },
            //    complete: function () {
            //        self.pendingItemsDecrement();
            //    }
            //});
        }

        self.setUrl = ko.computed(function () {
            self.Link1('/Accounts/BalanceSheet/GetAllBalanceSheetReport?reportTypeId=PDF&toDate=' + moment(self.ToDate()).format("DD/MM/YYYY"));
            self.Link2('/Accounts/BalanceSheet/GetAllBalanceSheetReport?reportTypeId=Excel&toDate=' + moment(self.ToDate()).format("DD/MM/YYYY"));
            self.Link3('/Accounts/BalanceSheet/GetAllBalanceSheetReport?reportTypeId=Word&toDate=' + moment(self.ToDate()).format("DD/MM/YYYY"));
            $.each(self.CompanyProfileIds(), function (index, value) {
                self.Link1(self.Link1() + "&CompanyProfileIds=" + value);
                self.Link2(self.Link2() + "&CompanyProfileIds=" + value);
                self.Link3(self.Link3() + "&CompanyProfileIds=" + value);
            });
        });
                
    }
    var vm = new employeelistVm();
    //vm.getAllBalanceSheet();
    ko.applyBindings(vm, $('#balanceSheet')[0]);
});
