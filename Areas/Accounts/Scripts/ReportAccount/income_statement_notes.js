
$(document).ready(function () {

    function reportIncomeStatementNotesVM() {
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
        //self.pendingItemsIncrement();
        //self.pendingItemsDecrement();

        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        var firstDay = new Date(y, m, 1);
        var lastDay = new Date(y, m + 1, 0);
        var startDate = (firstDay).toISOString().split('T')[0];
        var currentDate = (lastDay).toISOString().split('T')[0];
        self.FromDate = ko.observable(startDate);
        self.ToDate = ko.observable(currentDate);
        self.Id = ko.observable();
        self.IncomeStatementNotesData = ko.observableArray([]);
        self.ReportTypeId = ko.observable();
        self.Link1 = ko.observable();
        self.Link2 = ko.observable();
        self.Link3 = ko.observable();
        self.Title1 = ko.observable("PDF");
        self.Title2 = ko.observable("Excel");
        self.Title3 = ko.observable("Word");


        self.getIncomeStatementNotes = function () {
            self.pendingItemsIncrement();
            var queryData = {
                FromDateText: moment(self.FromDate()).format("DD/MM/YYYY"),
                ToDateText: moment(self.ToDate()).format("DD/MM/YYYY"),
                CompanyProfileIds: self.CompanyProfileIds()
            }
            return $.ajax({
                type: "POST",
                url: "/Accounts/ReportAccount/GetIncomeStatementNotes",//?fromDate=" + self.FromDate() + "&toDate=" + self.ToDate() + "&CompanyProfileIds=" + self.CompanyProfileIds(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: ko.toJSON(queryData),
                success: function (data) {
                    self.IncomeStatementNotesData(data);
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
            self.Link1("/Accounts/ReportAccount/GetIncomeStatementNotesReport?reportTypeId=PDF&fromDate=" + moment(self.FromDate()).format("DD/MM/YYYY") + "&toDate=" + moment(self.ToDate()).format("DD/MM/YYYY"));
            self.Link2("/Accounts/ReportAccount/GetIncomeStatementNotesReport?reportTypeId=Excel&fromDate=" + moment(self.FromDate()).format("DD/MM/YYYY") + "&toDate=" + moment(self.ToDate()).format("DD/MM/YYYY"));
            self.Link3("/Accounts/ReportAccount/GetIncomeStatementNotesReport?reportTypeId=Word&fromDate=" + moment(self.FromDate()).format("DD/MM/YYYY") + "&toDate=" + moment(self.ToDate()).format("DD/MM/YYYY"));
            $.each(self.CompanyProfileIds(), function (index, value) {
                self.Link1(self.Link1() + "&CompanyProfileIds=" + value);
                self.Link2(self.Link2() + "&CompanyProfileIds=" + value);
                self.Link3(self.Link3() + "&CompanyProfileIds=" + value);
            })
        });


        self.loadInitialData = function () {
            self.setUrl();

        }
    }


    var vm = new reportIncomeStatementNotesVM();
    vm.loadInitialData();
    ko.applyBindings(vm, $('#rptIncomeStatementNotesDiv')[0]);
});