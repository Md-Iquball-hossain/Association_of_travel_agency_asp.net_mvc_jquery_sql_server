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

   
    function DisposalVm() {

        var self = this;
        var currentDate = (new Date()).toISOString().split('T')[0];

        self.Id = ko.observable();
        self.AssetName = ko.observable('');
        self.AssetID = ko.observable();
        self.AssetCode = ko.observable('');
        self.BaseValue = ko.observable(0.00);
        self.AccumulatedDepreciation = ko.observable(0.00);
        self.ResaleValue = ko.observable(0.00);
        self.ResaleTo = ko.observable('');
        self.DisposedValue = ko.observable(0.00);
        self.GainOfDisposal = ko.observable(0.00);
        self.LossOfDisposal = ko.observable(0.00);
        self.DisposalDate = ko.observable(currentDate);
        self.DisposalDateString = ko.observable();
        self.Pass = ko.observable(false);
        self.Level = ko.observable(1);

        self.FromDate = ko.observable(currentDate);
        self.EndDate = ko.observable(currentDate);
        self.FromDateText = ko.observable();
        self.EndDateText = ko.observable();

        self.ResidualValue = ko.observable();

        self.Link1 = ko.observable();
        self.Link2 = ko.observable();
        self.Link3 = ko.observable();
        
          
        self.Assets_Depreciation_Logs = ko.observableArray([]);
        self.DisposalLogs = ko.observableArray([]);
        self.Categories = ko.observableArray([]);
        self.Levels = ko.observableArray([]);
   
        self.Level.subscribe(function () {
            self.getAllCategories();
        });

        self.SaveDispose = function () {
            self.DisposalDateString(moment(self.DisposalDate()).format('DD/MM/YYYY'));
            $.ajax({
                type: "POST",
                url: '/FAMS/AssetDispose/SaveDispose',
                data: ko.toJSON(this),
                contentType: "application/json",
                success: function (data) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(data.Message);
                    self.getDisposeLogs();
                    self.getAllLogs();
                },
                error: function () {
                    $('#successModal').modal('show');
                    $('#successModalText').text(error.statusText);
                }
            });
        };

       
        self.PopUpModal = function (data) {
            self.DisposedValue(data.WrittenDownValue);
            self.AssetID(data.AssetID);
            
            $('#ResaleModal').modal('show');
         };

        self.SaveResale = function () {
            self.DisposalDateString(moment(self.DisposalDate()).format('DD/MM/YYYY'));
            $.ajax({
                type: "POST",
                url: '/FAMS/AssetDispose/SaveDispose',
                data: ko.toJSON(this),
                contentType: "application/json",
                success: function (data) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(data.Message);
                    self.getDisposeLogs();
                    self.getAllLogs();
                },
                error: function () {
                    $('#successModal').modal('show');
                    $('#successModalText').text(error.statusText);
                }
            });
        };
          
        self.SearchAsset = function (data) {
            self.FromDateText(moment(self.FromDate()).format('DD/MM/YYYY'));
            self.EndDateText(moment(self.EndDate()).format('DD/MM/YYYY'));
            if(self.Level()>0)
            {
            return $.ajax({
                type: "POST",
                url: '/FAMS/Depreciation/getFilturedAssets?level=' + self.Level() + '&catid=' + self.Id() + '&resval=' + self.ResidualValue() + '&from=' + self.FromDateText() + '&end=' + self.EndDateText() + '&code=' + self.AssetCode(),
                data: ko.toJSON(this),
                contentType: "application/json",
                success: function (data) {
                    
                    self.Assets_Depreciation_Logs(data);
                },
                error: function () {
                    $('#successModal').modal('show');
                    $('#successModalText').text(error.statusText);
                }
            });
            }
            else {
                $('#successModal').modal('show');
                $('#successModalText').text('Please Select Category Level');
            }
        };

        self.getDisposeLogs = function () {
            self.FromDateText(moment(self.FromDate()).format('DD/MM/YYYY'));
            self.EndDateText(moment(self.EndDate()).format('DD/MM/YYYY'));
            
                return $.ajax({
                    type: "GET",
                    url: '/FAMS/DisposeLog/GetDisposeLogs?level=' + self.Level() + '&catid=' + self.Id() + '&from=' + self.FromDateText() + '&end=' + self.EndDateText(),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        self.DisposalLogs(data);
                        self.setUrl();
                    },
                    error: function (error) {
                        $('#successModal').modal('show');
                        $('#successModalText').text(error.statusText);
                    }
                });
            
        }
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
        self.getAllCategories = function () {

            return $.ajax({
                type: "GET",
                url: '/FAMS/Depreciation/GetAllCategoriesByLevel?level=' + self.Level(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.Categories(data);

                },
                error: function (error) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(error.statusText);
                }
            });
        }

        self.DisposeSelectedAssets = function () {
            var saveData = ko.observableArray([]);
            $.each(self.Assets_Depreciation_Logs(), function (index, value) {
                if (value.Pass == true) {
                    saveData.push(value.AssetID);
                }
            });
            if (saveData().length > 0) {
                $.ajax({
                    type: "POST",
                    url: '/FAMS/AssetDispose/DisposeSelectedAssets',
                    data: ko.toJSON(saveData),
                    contentType: "application/json",
                    success: function (data) {
                        $('#successModal').modal('show');
                        $('#successModalText').text(data.Message);

                        self.getAllLogs();
                    },
                    error: function () {
                        $('#successModal').modal('show');
                        $('#successModalText').text(error.statusText);
                       
                    }
                });
            }
            else {
                $('#successModal').modal('show');
                $('#successModalText').text('Please Select Assets!');
            }
            

        };

        self.setUrl = ko.computed(function () {
            self.FromDateText(moment(self.FromDate()).format('DD/MM/YYYY'));
            self.EndDateText(moment(self.EndDate()).format('DD/MM/YYYY'));

            self.Link1('/FAMS/DisposeLog/getAssetDisposalReport?level=' + self.Level() + '&reportTypeId=PDF&catid=' + self.Id() + '&from=' + self.FromDateText() + '&to=' + self.EndDateText());
            self.Link2('/FAMS/DisposeLog/getAssetDisposalReport?level=' + self.Level() + '&reportTypeId=Excel&catid=' + self.Id() + '&from=' + self.FromDateText() + '&to=' + self.EndDateText());
            self.Link3('/FAMS/DisposeLog/getAssetDisposalReport?level=' + self.Level() + '&reportTypeId=Word&catid=' + self.Id() + '&from=' + self.FromDateText() + '&to=' + self.EndDateText());
          
        });

        self.InitialValueLoad = function () {
            
            self.getLevels();
            self.getDisposeLogs();
            
            
        };

        self.errors = ko.validation.group(self);
        self.IsValid = ko.computed(function () {
            var err = self.errors().length;
            if (err == 0)
                return true;
            return false;
        });
    }

    var vm = new DisposalVm();
    vm.InitialValueLoad();


    ko.applyBindings(vm, $('#DisposalDiv')[0]);
});