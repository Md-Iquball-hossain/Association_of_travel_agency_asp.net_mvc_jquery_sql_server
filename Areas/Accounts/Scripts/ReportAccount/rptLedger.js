
$(document).ready(function() {

    function ReportLedgerVM() {
        var self = this;

        self.pendingItems = ko.observable(0);
        self.pendingItemPreviousCount = ko.observable('');
        self.pendingItems.subscribe(function () {
            //console.log("pending items - " + self.pendingItems())
            if (self.pendingItems() === 1 && self.pendingItemPreviousCount() === 0) {
                //console.log("show loading");
                $('#loadingModal').modal('show');
            }
            else if (self.pendingItems() === 0 && self.pendingItemPreviousCount() === 1) {
                //console.log("hide loading");
                $('#loadingModal').modal('hide');
                $('.modal-backdrop').remove();
            }
        });
        self.pendingItemsIncrement = function () {
            //console.log("increment");
            self.pendingItemPreviousCount(self.pendingItems());
            self.pendingItems(self.pendingItems() + 1);
        };

        self.pendingItemsDecrement = function () {
            //console.log("decrement");
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

        self.CompanyList = ko.observableArray(Companies);
        self.CompanyProfileId = ko.observable(userCompanyId);

        self.Link1 = ko.observable();
        self.Link2 = ko.observable();
        self.Link3 = ko.observable();
        self.Title1 = ko.observable('PDF');
        self.Title2 = ko.observable('Excel');
        self.Title3 = ko.observable('Word');


        self.getReportLedgerList = function () {
            self.pendingItemsIncrement();
            return $.ajax({
                type: "GET",
                url: '/Accounts/ReportAccount/GetLedgerReportByAccHead?fromDate=' + self.FromDate() + '&toDate=' + self.ToDate() + '&accHeadCode=' + self.AccountHeadCode() + '&officeId=' + self.CompanyProfileId(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data) {
                    self.reportLedgerData(data.rptVoucherlst); //Put the response in ObservableArray
                    if (data.rptVoucherlst.length === 0) {
                        $('#successModal').modal('show');
                        $('#successModalText').text("No Entry Found");

                    }
                    if (data.response.Message !== "") {
                        $('#successModal').modal('show');
                        $('#successModalText').text(data.response.Message);

                    }

                },
                error: function(error) {
                    alert(error.status + "<--and--> " + error.statusText);
                },
                complete: function () {
                    self.pendingItemsDecrement();
                }
            });
        }


        self.getAccHeads = function () {
            var currentCompany = self.CompanyProfileId() > 0 ? self.CompanyProfileId() : 1;
            self.pendingItemsIncrement();
            return $.ajax({
                type: "GET",
                url: '/Accounts/Accounts/GetConcatedAccHeads?companyProfileId=' + currentCompany,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    //console.log(ko.toJSON(data));
                    self.accountHeads(data);
                    //self.setFilteredAccHeads();
                },
                error: function (error) {
                    
                    alert(error.status + "<--and--> " + error.statusText);
                },
                complete: function () {
                    self.pendingItemsDecrement();
                }
            });
        }

        //self.getAllCompanies = function () {
        //    if (userCompanyId != null && userCompanyId > 0) {
        //        self.CompanyProfileId(userCompanyId);
        //    } else {
        //        self.CompanyList([]);
        //        self.pendingItemsIncrement();
            
        //        return $.ajax({
        //            type: "GET",
        //            url: '/Auth/CompanyProfile/GetAllCompanyList',
        //            contentType: "application/json; charset=utf-8",
        //            dataType: "json",
        //            success: function (data) {
        //                self.CompanyList(data);
        //            },
        //            error: function (error) {
        //                alert(error.status + "<--and--> " + error.statusText);
        //            },
        //            complete: function () {
        //                self.pendingItemsDecrement();
        //            }
        //        });
        //    }
        //}
    


    self.setUrl = ko.computed(function () {
        self.Link1('/Accounts/ReportAccount/GetLedgerReport?reportTypeId=PDF&fromDate=' + self.FromDate() + '&toDate=' + self.ToDate() + '&accHeadCode=' + self.AccountHeadCode() + '&officeId=' + self.CompanyProfileId());
        self.Link2('/Accounts/ReportAccount/GetLedgerReport?reportTypeId=Excel&fromDate=' + self.FromDate() + '&toDate=' + self.ToDate() + '&accHeadCode=' + self.AccountHeadCode() + '&officeId=' + self.CompanyProfileId());
        self.Link3('/Accounts/ReportAccount/GetLedgerReport?reportTypeId=Word&fromDate=' + self.FromDate() + '&toDate=' + self.ToDate() + '&accHeadCode=' + self.AccountHeadCode() + '&officeId=' + self.CompanyProfileId());
    });


    self.loadInitialData = function() {
        self.setUrl();
        //self.getAllCompanies();
        self.getAccHeads();

    }
}

    var vm = new ReportLedgerVM();
    vm.loadInitialData();
    ko.applyBindings(vm, $('#rptLedgerDiv')[0]);
});