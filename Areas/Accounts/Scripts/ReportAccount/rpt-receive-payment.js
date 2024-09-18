$(document).ready(function () { 
    function ReportReceivePaymentVM() {
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
        self.Link1 =  ko.observable();
        self.Link2 =  ko.observable();
        self.Link3 =  ko.observable();
        self.Title1 = ko.observable('PDF');
        self.Title2 = ko.observable('Excel');
        self.Title3 = ko.observable('Word');
      
        self.ShowReport = function () {
            window.open('/Accounts/ReportAccount/GetReceivePaymentReport?reportTypeId=PDF&fromDate=' + moment(self.FromDate()).format("DD/MM/YYYY") + '&toDate=' + moment(self.ToDate()).format("DD/MM/YYYY") + '&CompanyProfileId=' + self.CompanyProfileId(), '_blank');
        }
        self.ShowDetailedReport = function () {
            window.open('/Accounts/ReportAccount/GetReceivePaymentTransactionalReport?reportTypeId=PDF&fromDate=' + moment(self.FromDate()).format("DD/MM/YYYY") + '&toDate=' + moment(self.ToDate()).format("DD/MM/YYYY") + '&CompanyProfileId=' + self.CompanyProfileId(), '_blank');
        }
        self.FeeCollectionBreakdown = function () {
            window.open('/Membership/MembershipReport/GetFeeWiseReceiveBreakdown?reportTypeId=PDF&fromDate=' + moment(self.FromDate()).format("DD/MM/YYYY") + '&toDate=' + moment(self.ToDate()).format("DD/MM/YYYY") , '_blank');
        }
    }
    var vm = new ReportReceivePaymentVM();
    ko.applyBindings(vm, $('#rptReceiveDiv')[0]);
});