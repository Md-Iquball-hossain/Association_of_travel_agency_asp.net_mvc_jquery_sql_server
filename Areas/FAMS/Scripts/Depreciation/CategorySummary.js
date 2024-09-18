/// <reference path="../knockout-3.4.0.debug.js" />
/// <reference path="../jquery-2.1.4.js" />
/// <reference path="../finix.util.js" />
/// <reference path="~/Scripts/knockout.validation.min.js" />

$(document).ready(function () {

    ko.validation.init({
        errorElementClass: 'has-error',
        errorMessageClass: 'help-block',
        decorateInputElement: true
    });

    ko.bindingHandlers.numericText = {
        update: function (element, valueAccessor, allBindingsAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor()),
                precision = ko.utils.unwrapObservable(allBindingsAccessor().precision) || ko.bindingHandlers.numericText.defaultPrecision,
                formattedValue = value.toFixed(precision);

            ko.bindingHandlers.text.update(element, function () { return formattedValue; });
        }, defaultPrecision: 1
    };

    function DepreciationSummaryVm() {

        var self = this;
        //var currentDate = (new Date()).toISOString().split('T')[0];
        self.Id = ko.observable();  //to category event
        self.CategoryID = ko.observable();
        self.AssetCategoryID = ko.observable();
        self.AssetCode = ko.observable();
        self.AssetName = ko.observable()
        self.AssetID = ko.observable();
        self.DepreciatedAmount = ko.observable();
        self.CategoryName = ko.observable('');
        self.OpeningValue = ko.observable(0.00);
        self.DepriciationRate = ko.observable();
        self.AdditionalValue = ko.observable(0.00);
        self.ClosingValue = ko.observable(0.00);
        self.Rate = ko.observable(0.00);
        self.OpeningDepreciation = ko.observable(0.00);
        self.AdjustedDepreciation = ko.observable(0.00);
        self.ClosingDepreciation = ko.observable(0.00);
        self.RevaluationSurplus = ko.observable();
        self.DisposedValue = ko.observable();
        self.WrittenDownValue = ko.observable();
        self.FromDate = ko.observable(moment());
        self.EndDate =  ko.observable(moment());
        self.FromDateText= ko.observable();
        self.EndDateText = ko.observable();
        self.Level = ko.observable();
       
        self.Levels = ko.observableArray([]);
        self.Summary = ko.observableArray([]);
        self.InsideSummary = ko.observableArray([]);
        self.SummaryStock = ko.observableArray([]);
        self.Link1 = ko.observable();
        self.Link2 = ko.observable();
        self.Link3 = ko.observable();

        self.Link4 = ko.observable();
        self.Link5 = ko.observable();
        self.Link6 = ko.observable();

        self.Link7 = ko.observable();
        self.Link8 = ko.observable();
        self.Link9 = ko.observable();

        
        self.getSummary = function () {

            self.FromDateText(moment(self.FromDate()).format('DD/MM/YYYY'));
            self.EndDateText(moment(self.EndDate()).format('DD/MM/YYYY'));
            
         return   $.ajax({
                type: "GET",
                url: '/FAMS/CategorySummary/getGroupSummary?level=' + self.Level() + '&catid=' + self.Id() + '&from=' + self.FromDateText() + '&to=' + self.EndDateText(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.Summary(data);
                    
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        };

        self.getInsidesSummary = function () {

            self.FromDateText(moment(self.FromDate()).format('DD/MM/YYYY'));
            self.EndDateText(moment(self.EndDate()).format('DD/MM/YYYY'));

           return $.ajax({
                type: "GET",
                url: '/FAMS/CategorySummary/getDetailsGroupSummary?from=' + self.FromDateText() + '&to=' + self.EndDateText(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.InsideSummary(data);

                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        };

        self.getCategoryStock = function () {
            
            self.FromDateText(moment(self.FromDate()).format('DD/MM/YYYY'));
            self.EndDateText(moment(self.EndDate()).format('DD/MM/YYYY'));
           return $.ajax({
                type: "GET",
                url: '/FAMS/CategorySummary/getGroupStock?level=' + self.Level() + '&catid=' + self.Id() + '&from=' + self.FromDateText() + '&to=' + self.EndDateText(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.SummaryStock(data);
                    
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        };
        self.getLevels = function () {
            return $.ajax({
                type: "GET",
                url: '/FAMS/Category/getCategoryLevels',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.Levels(data);
                },
                error: function (error) {

                    $('#successModal').modal('show');
                    $('#successModalText').text(error.status + "<--save and--> " + error.statusText);
                }
            });
        }
        self.setUrl = ko.computed(function () {
           
            self.Link1('/FAMS/CategorySummary/getReport?reportTypeId=PDF&level=' + self.Level() + '&from=' + self.FromDateText() + '&to=' + self.EndDateText());
            self.Link2('/FAMS/CategorySummary/getReport?reportTypeId=Excel&level=' + self.Level() + '&from=' + self.FromDateText() + '&to=' + self.EndDateText());
            self.Link3('/FAMS/CategorySummary/getReport?reportTypeId=Word&level=' + self.Level() + '&from=' + self.FromDateText() + '&to=' + self.EndDateText());

            self.Link4('/FAMS/CategorySummary/getAssetStockReport?level=' + self.Level() + '&reportTypeId=PDF&from=' + self.FromDateText() + '&to=' + self.EndDateText());
            self.Link5('/FAMS/CategorySummary/getAssetStockReport?level=' + self.Level() + '&reportTypeId=Excel&from=' + self.FromDateText() + '&to=' + self.EndDateText());
            self.Link6('/FAMS/CategorySummary/getAssetStockReport?level=' + self.Level() + '&reportTypeId=Word&from=' + self.FromDateText() + '&to=' + self.EndDateText());

            self.Link7('/FAMS/CategorySummary/getDetailedReport?reportTypeId=PDF&from=' + self.FromDateText() + '&to=' + self.EndDateText());
            self.Link8('/FAMS/CategorySummary/getDetailedReport?reportTypeId=Excel&from=' + self.FromDateText() + '&to=' + self.EndDateText());
            self.Link9('/FAMS/CategorySummary/getDetailedReport?reportTypeId=Word&from=' + self.FromDateText() + '&to=' + self.EndDateText());
        });

        self.InitialValueLoad = function () {
            self.getLevels();
            self.setUrl();
        };

        self.errors = ko.validation.group(self);
        self.IsValid = ko.computed(function () {
            var err = self.errors().length;
            if (err == 0)
                return true;
            return false;
        });

       
    }

    var vm = new DepreciationSummaryVm();
    vm.InitialValueLoad();


    ko.applyBindings(vm, $('#DepreciationDiv')[0]);
    ko.applyBindings(vm, $('#DepreciationDivs')[0]);
});