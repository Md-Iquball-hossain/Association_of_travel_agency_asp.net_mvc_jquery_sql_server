
$(document).ready(function () {

    function ReportCashBookVM() {
        var self = this;

        self.CompanyList = ko.observableArray(Companies);
        self.CompanyProfileId = ko.observable(userCompanyId);

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
        //self.pendingItemsIncrement();
        //self.pendingItemsDecrement();

        var currentDate = (new Date()).toISOString().split('T')[0];
        self.Id = ko.observable();
        self.FromDate = ko.observable(currentDate);
        self.ToDate = ko.observable(currentDate);
        self.VoucherDate = ko.observable('');
        self.accountHeads = ko.observableArray([]);
        self.accountHeadName = ko.observable();
        self.AccountHeadCode = ko.observable();
        self.selectedAccountHeadCode = ko.observable(0.00);
        self.reportLedgerData = ko.observableArray([]);
        self.ReportTypeId = ko.observable();
        self.Link1 = ko.observable();
        self.Link2 = ko.observable();
        self.Link3 = ko.observable();
        self.Title1 = ko.observable('PDF');
        self.Title2 = ko.observable('Excel');
        self.Title3 = ko.observable('Word');

        self.reportCashBookData = ko.observableArray([]);

        self.getReporCashBookList = function () {
            var fromDate = self.FromDate() ? self.FromDate() : '01/01/0001';
            var toDate = self.ToDate() ? self.ToDate() : '01/01/0001';
            
            self.pendingItemsIncrement();

            return $.ajax({
                type: "GET",
                url: '/Accounts/ReportAccount/GetCashBookReport?fromDate=' + fromDate + '&toDate=' + toDate + '&CompanyProfileId=' + self.CompanyProfileId(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.reportCashBookData(data); //Put the response in ObservableArray
                    if (data.length === 0) {

                        $('#successModal').modal('show');
                        $('#successModalText').text("No Entry Found");

                    }
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                },
                complete: function () {
                    self.pendingItemsDecrement();
                }
            });
        }

        self.setUrl = ko.computed(function () {
            var fromDate = self.FromDate() ? self.FromDate() : '01/01/0001';
            var toDate = self.ToDate() ? self.ToDate() : '01/01/0001';
            self.Link1('/Accounts/ReportAccount/GetCashBookReports?reportTypeId=PDF&fromDate=' + fromDate + '&toDate=' + toDate + '&CompanyProfileId=' + self.CompanyProfileId());
            self.Link2('/Accounts/ReportAccount/GetCashBookReports?reportTypeId=Excel&fromDate=' + fromDate + '&toDate=' + toDate + '&CompanyProfileId=' + self.CompanyProfileId());
            self.Link3('/Accounts/ReportAccount/GetCashBookReports?reportTypeId=Word&fromDate=' + fromDate + '&toDate=' + toDate + '&CompanyProfileId=' + self.CompanyProfileId());
        });


        self.loadInitialData = function () {
            self.setUrl();
        }
    }

    var vm = new ReportCashBookVM();
    vm.loadInitialData();
    ko.applyBindings(vm, $('#rptCashBook')[0]);
});