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
  

    function DepreciationLogVm() {

        

        var self = this;
        var currentDate = (new Date()).toISOString().split('T')[0];

        self.Id = ko.observable();
        self.AssetName = ko.observable('');
        self.AssetID = ko.observable().extend({ required: true });
        self.BaseValue = ko.observable(0.00);
        self.OpeningValue = ko.observable(0.00);
        self.DepreciatedAmount = ko.observable(0.00);
        self.DepriciationModel = ko.observable();
        self.DepreciationModelName = ko.observable('');
        self.PointOfDepreciation = ko.observable();
        self.CauseOfDepreciation = ko.observable();
        self.WrittenDownValue = ko.observable();
        self.PurchaseDate = ko.observable();
        self.RevaluationSurplus = ko.observable();
        self.YearRemaining = ko.observable();
        self.CalculatedDate = ko.observable(currentDate);//.extend({ required: true, date: true });
        self.Pass = ko.observable(false);
        self.CalculatedDateString = ko.observable();
        self.ResidualValue = ko.observable();
        self.FromDate = ko.observable(currentDate);
        self.EndDate = ko.observable(currentDate)
        self.AssetCode = ko.observable('');
        self.FromDateText = ko.observable();
        self.EndDateText = ko.observable();
        self.IsValid = ko.observable(true);
        self.Level = ko.observable(1);
        //self.CalculatedDateString(moment(self.CalculatedDate()).format('DD/MM/YYYY'));

              
        self.Assets = ko.observableArray([]);
        // self.Logs = ko.observableArray([]);
        self.Levels = ko.observableArray([]);
        self.DepriciationModels = ko.observableArray([]);
        self.Categories = ko.observableArray([]);
        
        self.Level.subscribe(function () {
            self.getAllCategories();
        });

        self.Reset = function () {
            self.Id('');
            self.AssetName('');
            self.AssetID('');
            self.DepreciatedAmount(0.00);
            self.BaseValue(0.00);
            Self.OpeningValue(0.00);
            self.EmployeeID('');
            self.DepriciationModel();
            self.DepreciationModelName('');
            self.PointOfDepreciation();
            self.CauseOfDepreciation('');
            self.WrittenDownValue(0.00);
            self.RevaluationSurplus(0);
            self.CalculatedDate(currentDate);
            self.CalculatedDateString();
            self.YearRemaining();
            self.Pass(false);
           
            
        };

        

        self.SaveDepreciation = function (data) {
            
           // if (self.WrittenDownValue() > 0) {
                self.CalculatedDateString(moment(self.CalculatedDate()).format('DD/MM/YYYY'));
                $.ajax({
                    type: "POST",
                    url: '/FAMS/Depreciation/SaveDepreciation?assetid=' + data.Id,
                    data: ko.toJSON(this),
                    contentType: "application/json",
                    success: function (data) {
                        $('#successModal').modal('show');
                        $('#successModalText').text(data.Message);

                        //self.getAllLogs(); 
                    },
                    error: function () {
                        $('#successModal').modal('show');
                        $('#successModalText').text(error.status + "<--save and--> " + error.statusText);
                       
                    }
                });
            //}
            //else {
            //    $('#successModal').modal('show');
            //    $('#successModalText').text('There is no Possible value to be depreciated.');
            //}

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
                    
                    self.Assets(data);
                },
                error: function () {
                    $('#successModal').modal('show');
                    $('#successModalText').text(error.status + "<--save and--> " + error.statusText);
                }
            });
            }
        else {
                $('#successModal').modal('show');
                $('#successModalText').text('Please Select Category Level');
        }
        };

        self.SaveSelectedAssets = function () {
            var saveData = ko.observableArray([]);
            $.each(self.Assets(), function (index, value) {
                 if (value.Pass == true) {
                     saveData.push(value.AssetID);
                }
            });
            if (saveData().length > 0) {
                $.ajax({
                    type: "POST",
                    url: '/FAMS/Depreciation/SaveSelectedDepreciation',
                    data: ko.toJSON(saveData),
                    contentType: "application/json",
                    success: function (data) {
                        $('#successModal').modal('show');
                        $('#successModalText').text(data.Message);

                        self.getAllLogs();
                    },
                    error: function () {
                        $('#successModal').modal('show');
                        $('#successModalText').text(error.status + "<--save and--> " + error.statusText);
                        
                    }
                });
            }
            else {
                $('#successModal').modal('show');
                $('#successModalText').text('Please Select Assets!');
            }

        };

        self.getAllAssets = function () {
          return  $.ajax({
                type: "GET",
                url: '/FAMS/Assets/GetAssets',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.Assets(data);
                },
                error: function (error) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(error.status + "<--save and--> " + error.statusText);
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
        //self.getAllLogs = function () {
        //    $.ajax({
        //        type: "GET",
        //        url: '/Depreciation/GetDepreciationLogs',
        //        contentType: "application/json; charset=utf-8",
        //        dataType: "json",
        //        success: function (data) {
        //            self.Logs(data);
        //        },
        //        error: function (error) {
        //            alert(error.status + "<--and--> " + error.statusText);
        //        }
        //    });
        //};

        self.getAssetsbyCatId = function () {
            if (self.Id() > 0) {
                return $.ajax({
                    type: "GET",
                    url: '/FAMS/Assets/GetAssetsByCategory?catid=' + self.Id(),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        self.Assets(data);
                    },
                    error: function (error) {
                        $('#successModal').modal('show');
                        $('#successModalText').text(error.status + "<--save and--> " + error.statusText);
                    }
                });
            }
            else
            {
                self.getAllAssets();
            }
        }

        //self.getDepreciationModels = function () {

        //    return $.ajax({
        //        type: "GET",
        //        url: '/Assets/GetDepreciationModels',
        //        contentType: "application/json; charset=utf-8",
        //        dataType: "json",
        //        success: function (data) {
        //            self.DepriciationModels(data);

        //        },
        //        error: function (error) {

        //            alert(error.status + "<--and--> " + error.statusText);
        //        }
        //    });
        //}

       
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
                    $('#successModalText').text(error.status + "<--save and--> " + error.statusText);
                }
            });
        }

        

        self.InitialValueLoad = function () {
            // self.getDepreciationModels();
            self.getLevels();
            //self.getAllCategories();
           // self.getAllAssets();
            //self.getAllLogs();
            
        };

        //self.errors = ko.validation.group(self);
        //self.IsValid = ko.computed(function () {
        //    var err = self.errors().length;
        //    if (err == 0)
        //        return true;
        //    return false;
        //});


    }

    var vm = new DepreciationLogVm();
    vm.InitialValueLoad();


    ko.applyBindings(vm, $('#DepreciationDiv')[0]);
});