
$(document).ready(function () {

    function ReportCashBookVM() {
        var self = this;

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

        self.CompanyList = ko.observableArray(Companies);
        self.CompanyProfileId = ko.observable(userCompanyId);

        self.ReportTypeId = ko.observable();
        self.Link1 = ko.observable();
        self.Banks = ko.observableArray([]);
        self.Code = ko.observable();
        self.Link2 = ko.observable();
        self.Link3 = ko.observable();
        self.Title1 = ko.observable('PDF');
        self.Title2 = ko.observable('Excel');
        self.Title3 = ko.observable('Word');

        self.reportCashBookData = ko.observableArray([]);

        self.getReporCashBookList = function () {
            var fromDate = self.FromDate() ? self.FromDate() : '';
            var toDate = self.ToDate() ? self.ToDate() : '';
            var accHeadCode = self.AccountHeadCode()?self.AccountHeadCode():'';
            if (fromDate.length > 0 && toDate.length > 0 && accHeadCode.length > 0) {
                self.pendingItemsIncrement();
                $.ajax({
                    type: "GET",
                    url: '/Accounts/ReportAccount/GetBankBookReport?fromDate=' + self.FromDate() + '&toDate=' + self.ToDate() + '&accHeadCode=' + self.AccountHeadCode() + '&officeId=' + self.CompanyProfileId(),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(data) {

                        self.reportCashBookData(data); //Put the response in ObservableArray
                        if (data.length === 0) {

                            $('#successModal').modal('show');
                            $('#successModalText').text("No Entry Found");

                        }
                    },
                    error: function(error) {
                        alert(error.status + "<--and--> " + error.statusText);
                    },
                    complete: function () {
                        self.pendingItemsDecrement();
                    }
                });
            } else {
                $('#successModal').modal('show');
                $('#successModalText').text("Please Provide Account Head With a Suitable Timeperiod");
            }

        }
        
        self.getAllBanks = function () {
            var currentCompany = self.CompanyProfileId() > 0 ? self.CompanyProfileId() : null;
            self.pendingItemsIncrement();
            return $.ajax({
                type: "GET",
                url: '/Accounts/Accounts/GetBankAccHeads?companyProfileId=' + currentCompany,//GetAccountHeadsByStartWithCode?code=10202',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {

                    self.Banks(data);
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
            self.Link1('/Accounts/ReportAccount/GetBankBookReports?reportTypeId=PDF&fromDate=' + self.FromDate() + '&toDate=' + self.ToDate() + '&accHeadCode=' + self.AccountHeadCode() + '&officeId=' + self.CompanyProfileId());
            self.Link2('/Accounts/ReportAccount/GetBankBookReports?reportTypeId=Excel&fromDate=' + self.FromDate() + '&toDate=' + self.ToDate() + '&accHeadCode=' + self.AccountHeadCode() + '&officeId=' + self.CompanyProfileId());
            self.Link3('/Accounts/ReportAccount/GetBankBookReports?reportTypeId=Word&fromDate=' + self.FromDate() + '&toDate=' + self.ToDate() + '&accHeadCode=' + self.AccountHeadCode() + '&officeId=' + self.CompanyProfileId());
        });


        self.loadInitialData = function () {
            self.getAllBanks();
            self.setUrl();
        }
    }

    var vm = new ReportCashBookVM();
    vm.loadInitialData();
    ko.applyBindings(vm, $('#rptBankBook')[0]);
});