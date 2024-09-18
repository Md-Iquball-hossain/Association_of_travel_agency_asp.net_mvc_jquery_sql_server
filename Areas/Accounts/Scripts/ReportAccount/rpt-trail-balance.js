$(document).ready(function () { 
    function ReportTrailBalanceVM() {
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
        self.trailBalanceData = ko.observableArray([]);

        self.CompanyList = ko.observableArray(Companies);
        self.CompanyProfileId = ko.observable(userCompanyId);

        self.ReportTypeId = ko.observable();
        self.Link1 = ko.observable();
        self.Link2 = ko.observable();
        self.Link3 = ko.observable();
        self.Title1 = ko.observable('PDF');
        self.Title2 = ko.observable('Excel');
        self.Title3 = ko.observable('Word');

        //Commented by Maruf
        //self.getReportTrailBalance = function () {
        //    //var fromDate = self.FromDate() ? self.FromDate() : '01/01/0001';
        //    var toDate = self.ToDate() ? self.ToDate() : '01/01/2016';
        //    self.pendingItemsIncrement();
        //    $.ajax({
        //        type: "GET",
        //        url: '/Accounts/ReportAccount/GetTrailBalanceReport?&toDate=' + toDate + '&CompanyProfileId=' + self.CompanyProfileId(),
        //        contentType: "application/json; charset=utf-8",
        //        dataType: "json",
        //        success: function (data) {
        //            self.trailBalanceData(data); //Put the response in ObservableArray
        //        },
        //        error: function (error) {
        //            alert(error.status + "<--and--> " + error.statusText);
        //        },
        //        complete: function () {
        //            self.pendingItemsDecrement();
        //        }
        //    });
        //}

        //Code by Maruf
        self.getReportTrailBalance = function () {
            var fromDate = self.FromDate() ? self.FromDate() : '01/01/0001';
            var toDate = self.ToDate() ? self.ToDate() : '01/01/2021';
            self.pendingItemsIncrement();
            $.ajax({
                type: "GET",
                url: '/Accounts/ReportAccount/GetTrailBalanceReportNew?&fromDate=' + fromDate + '&toDate=' + toDate + '&CompanyProfileId=' + self.CompanyProfileId(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.trailBalanceData(data); //Put the response in ObservableArray
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
            var toDate = self.ToDate() ? self.ToDate() : '01/01/2022';
            self.Link1('/Accounts/ReportAccount/GetReportTrailBalanceNew?reportTypeId=PDF&fromDate=' + fromDate + '&toDate=' + toDate + '&CompanyProfileId=' + self.CompanyProfileId());
            self.Link2('/Accounts/ReportAccount/GetReportTrailBalanceNew?reportTypeId=Excel&fromDate=' + fromDate + '&toDate=' + toDate + '&CompanyProfileId=' + self.CompanyProfileId());
            self.Link3('/Accounts/ReportAccount/GetReportTrailBalanceNew?reportTypeId=Word&fromDate=' + fromDate + '&toDate=' + toDate + '&CompanyProfileId=' + self.CompanyProfileId());
        });

        //Commented by Maruf
        //self.setUrl = ko.computed(function () {
        //    var fromDate = self.FromDate() ? self.FromDate() : '01/01/0001';
        //    var toDate = self.ToDate() ? self.ToDate() : '01/01/0001';
        //    self.Link1('/Accounts/ReportAccount/GetReportTrailBalance?reportTypeId=PDF&fromDate=' + fromDate + '&toDate=' + toDate + '&CompanyProfileId=' + self.CompanyProfileId());
        //    self.Link2('/Accounts/ReportAccount/GetReportTrailBalance?reportTypeId=Excel&fromDate=' + fromDate + 'toDate=' + toDate + '&CompanyProfileId=' + self.CompanyProfileId());
        //    self.Link3('/Accounts/ReportAccount/GetReportTrailBalance?reportTypeId=Word&fromDate=' + fromDate + 'toDate=' + toDate + '&CompanyProfileId=' + self.CompanyProfileId());
        //});

        self.loadInitialData = function () {
            self.setUrl();
        }
    }


    var vm = new ReportTrailBalanceVM();
    vm.loadInitialData();
    ko.applyBindings(vm, $('#rptTrailBalanceDiv')[0]);
});