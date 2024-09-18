
$(document).ready(function () {

    function ReportLedgerVM() {
        var self = this;
        var currentDate = (new Date()).toISOString().split('T')[0];

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

        self.Id = ko.observable();
        self.FromDate = ko.observable(currentDate);
        self.ToDate = ko.observable(currentDate);
        self.VoucherDate = ko.observable('');
        self.AccHeads = ko.observableArray([]);
        self.accountHeadName = ko.observable();
        self.AccountHeadCode = ko.observable();
        self.selectedAccountHeadCode = ko.observable(0.00);
        self.reportLedgerData = ko.observableArray([]);
        self.ReportTypeId = ko.observable();

        self.AccGroupId = ko.observable();
        self.AccountGroups = ko.observableArray([]);
        self.AccSubGroupId = ko.observable();
        self.AccountSubGroups = ko.observableArray([]);
        self.AccHeadGroupId = ko.observable();
        self.AccountHeadGroups = ko.observableArray([]);
        self.AccHeadSubGroupId = ko.observable();
        self.AccountHeadSubGroups = ko.observableArray([]);

        self.CurrentCode = ko.observable('');

        self.CompanyList = ko.observableArray(Companies);
        self.CompanyProfileId = ko.observable(userCompanyId);

        self.Link1 = ko.observable();
        self.Link2 = ko.observable();
        self.Link3 = ko.observable();


        self.Title1 = ko.observable('PDF');
        self.Title2 = ko.observable('Excel');
        self.Title3 = ko.observable('Word');


        self.getReportLedgerList = function () {
            var currentCompany = self.CompanyProfileId() > 0 ? self.CompanyProfileId() : 1;
            self.pendingItemsIncrement();
            return $.ajax({
                        type: "GET",
                        url: '/Accounts/ReportAccount/GetGroupLedgers?fromDate=' + self.FromDate() + '&toDate=' + self.ToDate() + '&code=' + self.CurrentCode() + '&companyProfileId=' + currentCompany,
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (data) {
                            self.reportLedgerData(data); //Put the response in ObservableArray
                        },
                        error: function (error) {
                            alert(error.status + "<--and--> " + error.statusText);
                        },
                        complete: function () {
                            self.pendingItemsDecrement();
                        }
                    });
        }

        self.getAllAccountGroups = function () {
            self.pendingItemsIncrement();
            return $.ajax({
                type: "GET",
                url: '/Accounts/Accounts/GetAllAccGroups',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    //return data;
                    self.AccountGroups(data);
                    self.AccSubGroupId('');
                    self.AccountSubGroups([]);
                    self.AccHeadGroupId('');
                    self.AccountHeadGroups([]);
                    self.AccHeadSubGroupId('');
                    self.AccountHeadSubGroups([]);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                },
                complete: function () {
                    self.pendingItemsDecrement();
                }
            });
        }

        self.getAccountSubGroupsByGroupId = function () {
            var groupId = self.AccGroupId() ? self.AccGroupId() : 0;
            if (groupId > 0) {
                self.pendingItemsIncrement();
                return $.ajax({
                    type: "GET",
                    url: '/Accounts/Accounts/GetAccSubGroupsByAccGroupId?accGroupId=' + groupId,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        //return data;
                        self.AccountSubGroups(data);

                        self.AccHeadGroupId('');
                        self.AccountHeadGroups([]);
                        self.AccHeadSubGroupId('');
                        self.AccountHeadSubGroups([]);
                    },
                    error: function (error) {
                        alert(error.status + "<--and--> " + error.statusText);
                    },
                    complete: function () {
                        self.pendingItemsDecrement();
                    }
                });
            }

        }

        self.getAccountHeadGroupsBySubGroupId = function () {
            var subGroupId = self.AccSubGroupId() ? self.AccSubGroupId() : 0;
            if (subGroupId > 0) {
                self.pendingItemsIncrement();
                return $.ajax({
                    type: "GET",
                    url: '/Accounts/Accounts/GetAccHeadGroupsByAccSubGroupId?accSubGroupId=' + subGroupId,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        //return data;
                        self.AccountHeadGroups(data);
                        self.AccHeadSubGroupId('');
                        self.AccountHeadSubGroups([]);
                    },
                    error: function (error) {
                        alert(error.status + "<--and--> " + error.statusText);
                    },
                    complete: function () {
                        self.pendingItemsDecrement();
                    }
                });
            }

        }

        self.getAccountHeadSubGroupsByHeadGroupId = function () {
            var headGroupId = self.AccHeadGroupId() ? self.AccHeadGroupId() : 0;
            if (headGroupId > 0) {
                self.pendingItemsIncrement();
                return $.ajax({
                    type: "GET",
                    url: '/Accounts/Accounts/GetAccHeadSubGroupsByAccHeadGroupId?accHeadGroupId=' + headGroupId,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        //return data;
                        self.AccountHeadSubGroups(data);
                    },
                    error: function (error) {
                        alert(error.status + "<--and--> " + error.statusText);
                    },
                    complete: function () {
                        self.pendingItemsDecrement();
                    }
                });
            }

        }

        self.getAllAccHeadsByStartCode = function () {
            var code = self.CurrentCode() ? self.CurrentCode() : 0;
            self.pendingItemsIncrement();
            if (code > 0) {
                $.ajax({
                    type: "GET",
                    url: '/Accounts/Accounts/GetAccountHeadsByStartWithCode?code=' + code + '&officeId=' + self.CompanyProfileId(),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        //return data;
                        self.AccHeads(data);
                        //console.log(self.AccountGroups());
                    },
                    error: function (error) {
                        alert(error.status + "<--and--> " + error.statusText);
                    },
                    complete: function () {
                        self.pendingItemsDecrement();
                    }
                });
            }

        }
        //self.getAccHeads = function () {

        //    //
        //    //
        //    $.ajax({
        //        type: "GET",
        //        url: '/Accounts/GetAllAccHeads',
        //        contentType: "application/json; charset=utf-8",
        //        dataType: "json",
        //        success: function (data) {

        //            self.accountHeads(data);
        //        },
        //        error: function (error) {
        //            alert(error.status + "<--and--> " + error.statusText);
        //        }
        //    });
        //}

        self.getAccGroupCode = function () {
            for (var i = 0, len = self.AccountGroups().length; i < len; i++) {
                if (self.AccountGroups()[i].Id === self.AccGroupId()) {

                    self.CurrentCode(self.AccountGroups()[i].AccountGroupCode);
                    self.getAccountSubGroupsByGroupId();
                    self.getAllAccHeadsByStartCode();
                    self.accountHeadName('');
                }
            }
        };

        self.getAccSubGroupCode = function () {
            for (var i = 0, len = self.AccountSubGroups().length; i < len; i++) {
                if (self.AccountSubGroups()[i].Id === self.AccSubGroupId()) {

                    self.CurrentCode(self.AccountSubGroups()[i].AccountSubGroupCode);
                    self.getAccountHeadGroupsBySubGroupId();
                    self.getAllAccHeadsByStartCode();
                    self.accountHeadName('');

                }
            }
        };

        self.getAccHeadGroupCode = function () {
            for (var i = 0, len = self.AccountHeadGroups().length; i < len; i++) {
                if (self.AccountHeadGroups()[i].Id === self.AccHeadGroupId()) {

                    self.CurrentCode(self.AccountHeadGroups()[i].AccountHeadGroupCode);
                    self.getAccountHeadSubGroupsByHeadGroupId();
                    self.getAllAccHeadsByStartCode();
                    self.accountHeadName('');

                }
            }
        };

        self.getAccHeadSubGroupCode = function () {
            for (var i = 0, len = self.AccountHeadSubGroups().length; i < len; i++) {
                if (self.AccountHeadSubGroups()[i].Id === self.AccHeadSubGroupId()) {

                    self.CurrentCode(self.AccountHeadSubGroups()[i].AccountHeadSubGroupCode);
                    self.getAllAccHeadsByStartCode();
                    self.accountHeadName('');

                }
            }
        };


        self.setUrl = ko.computed(function () {
            self.Link1('/Accounts/ReportAccount/GetGroupLedgerReport?reportTypeId=PDF&fromDate=' + self.FromDate() + '&toDate=' + self.ToDate() + '&accHeadCode=' + self.CurrentCode() + '&companyProfileId=' + self.CompanyProfileId());
            self.Link2('/Accounts/ReportAccount/GetGroupLedgerReport?reportTypeId=Excel&fromDate=' + self.FromDate() + '&toDate=' + self.ToDate() + '&accHeadCode=' + self.CurrentCode() + '&companyProfileId=' + self.CompanyProfileId());
            self.Link3('/Accounts/ReportAccount/GetGroupLedgerReport?reportTypeId=Word&fromDate=' + self.FromDate() + '&toDate=' + self.ToDate() + '&accHeadCode=' + self.CurrentCode() + '&companyProfileId=' + self.CompanyProfileId());
        });

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

        self.loadInitialData = function () {
            self.setUrl();
            self.getAllAccountGroups();
            //self.getAllCompanies();
            //self.getAccHeads();

        }
    }

    var vm = new ReportLedgerVM();
    vm.loadInitialData();
    ko.applyBindings(vm, $('#rptGroupLedger')[0]);
});