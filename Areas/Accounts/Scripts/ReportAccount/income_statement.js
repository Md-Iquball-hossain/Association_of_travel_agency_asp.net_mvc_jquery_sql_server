
$(document).ready(function () {


    function reportIncomeStatementVM() {
        var self = this;
        self.CompanyList = ko.observableArray(Companies);
        self.CompanyProfileIds = ko.observableArray([]);
        self.CompanyProfileIds.push(userCompanyId);

        self.isLoading = ko.observable(0);
        self.isLoading.subscribe(function () {
            if (self.isLoading() === 1)
                $('#loadingModal').modal('show');
            else if (self.isLoading() === 0)
                $('#loadingModal').modal('hide');
        });
        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        var firstDay = new Date(y, m, 1);
        var lastDay = new Date(y, m + 1, 0);
        var startDate = (firstDay).toISOString().split('T')[0];
        self.FromDate = ko.observable(startDate);
        var currentDate = (new Date(maxDateText)).toISOString().split('T')[0];
        self.ToDate = ko.observable(currentDate);
        self.MaxToDate = ko.observable(maxDateText);
        self.MinFromDate = ko.observable();
        self.ToDate.subscribe(function () {
            if (moment(self.FromDate()) > moment(self.ToDate())) {
                self.FromDate(moment(moment(self.ToDate()) - 1).format("YYYY-MM-DD"));
            }
            self.MinFromDate(self.ToDate());
        });

        self.IncomeStatementNotesData = ko.observableArray([]);
        self.ReportTypeId = ko.observable();
        self.Link1 = ko.observable();
        self.Link2 = ko.observable();
        self.Link3 = ko.observable();
        self.Title1 = ko.observable("PDF");
        self.Title2 = ko.observable("Excel");
        self.Title3 = ko.observable("Word");


        self.getIncomeStatement = function () {
            self.isLoading(self.isLoading() + 1);
            //Code by Maruf
            var formData = new FormData();

            $.each(self.CompanyProfileIds(),
                   function (index, value) {
                       formData.append('CompanyProfileIds', value);
                   });
            //

            $.ajax({
                type: "POST",
                url: "/Accounts/ReportAccount/GetIncomeStatement?fromDate=" + moment(self.FromDate()).format('DD/MM/YYYY') + "&toDate=" + moment(self.ToDate()).format('DD/MM/YYYY'),
                //contentType: "application/json; charset=utf-8", //Commented by Maruf
                //dataType: "json", //Commented by Maruf
                //Code by Maruf
                data: formData, 
                contentType: false,
                processData: false,
                cache: false,
                //
                success: function (data) {

                    self.IncomeStatementNotesData(data); //Put the response in ObservableArray

                    //console.log("raw data - " + ko.toJSON(data));
                    //console.log("using group by" + ko.toJSON(_groupBy(data,)));
                    self.isLoading(self.isLoading() - 1);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                    self.isLoading(self.isLoading() - 1);
                }
            });
        }


        self.setUrl = ko.computed(function () {
            self.Link1("/Accounts/ReportAccount/GetIncomeStatementReport?reportTypeId=PDF&fromDate=" + moment(self.FromDate()).format('DD/MM/YYYY') + "&toDate=" + moment(self.ToDate()).format('DD/MM/YYYY'));
            self.Link2("/Accounts/ReportAccount/GetIncomeStatementReport?reportTypeId=Excel&fromDate=" + moment(self.FromDate()).format('DD/MM/YYYY') + "&toDate=" + moment(self.ToDate()).format('DD/MM/YYYY'));
            self.Link3("/Accounts/ReportAccount/GetIncomeStatementReport?reportTypeId=Word&fromDate=" + moment(self.FromDate()).format('DD/MM/YYYY') + "&toDate=" + moment(self.ToDate()).format('DD/MM/YYYY'));
            $.each(self.CompanyProfileIds(), function(index, value) {
                self.Link1(self.Link1() + "&CompanyProfileIds=" + value);
                self.Link2(self.Link2() + "&CompanyProfileIds=" + value);
                self.Link3(self.Link3() + "&CompanyProfileIds=" + value);
            });
        });


        self.loadInitialData = function () {
            //self.getIncomeStatement();
            self.setUrl();

        }
    }


    // ReSharper disable once InconsistentNaming
    var vm = new reportIncomeStatementVM();
    vm.loadInitialData();
    ko.applyBindings(vm, $('#rptIncomeStatementNotesDiv')[0]);
});