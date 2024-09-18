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

    $('.newwdv').focusout(function () {
        var newwdv = Number($('#txtNewWDV').val());
        var oldwdv = Number($('#txtCWDV').val());
        if (newwdv > 0 && oldwdv > 0) {
            var surplus = Number(newwdv - oldwdv);
            $("#txtsurplus").val(surplus);
            $("#btnSave").focusin();
        }
        else {
            $("#txtNewWDV").focusin();
        }
    });
    

    function DepreciationLogVm() {

        var self = this;
        var currentDate = (new Date()).toISOString().split('T')[0];

        self.Id = ko.observable();
        self.AssetName = ko.observable('');
        self.AssetID = ko.observable();
        self.BaseValue = ko.observable(0.00);
        self.OpeningValue = ko.observable(0.00);
        self.DepreciatedAmount = ko.observable(0.00);
        self.DepriciationModel = ko.observable();
        self.DepreciationModelName = ko.observable('');
        self.PointOfDepreciation = ko.observable();
        self.CauseOfDepreciation = ko.observable();
        self.WrittenDownValue = ko.observable();
        self.YearRemaining = ko.observable();
        self.RevaluationSurplus = ko.observable();
        self.CalculatedDate = ko.observable(moment());//.extend({ required: true, date: true });
        self.Pass = ko.observable(false);
        self.CalculatedDateString = ko.observable();
        self.AdjustedDepreciation = ko.observable();

        self.ResidualValue = ko.observable();
        self.FromDate = ko.observable(currentDate);
        self.EndDate = ko.observable(currentDate)
        self.AssetCode = ko.observable('');
        self.FromDateText = ko.observable();
        self.EndDateText = ko.observable();
        self.IsValid = ko.observable(true);
        self.Level = ko.observable(1);
        
        
       
            
        self.Assets_Logs = ko.observableArray([]);
        self.Logs = ko.observableArray([]);
        self.Categories = ko.observableArray([]);
        self.Levels = ko.observableArray([]);

        self.Level.subscribe(function () {
            self.getAllCategories();
        });

        self.Reset = function () {
            self.Id('');
            self.AssetName('');
            self.AssetID();
            self.DepreciatedAmount(0.00);
            self.BaseValue(0.00);
            Self.OpeningValue(0.00);
            self.EmployeeID('');
            self.DepriciationModel();
            self.DepreciationModelName('');
            self.PointOfDepreciation();
            self.CauseOfDepreciation('');
            self.WrittenDownValue(0.00);
            self.CalculatedDate(moment());
            self.CalculatedDateString();
            self.YearRemaining();
            self.RevaluationSurplus();
            self.AdjustedDepreciation(0.00);
            self.Pass(false);
           
            
        };

        
        self.SaveRevaluation = function (data) {
            if ($("#txtNewWDV").val() > 0) {
                self.CalculatedDateString(moment(self.CalculatedDate()).format('DD/MM/YYYY'));
                $.ajax({
                    type: "POST",
                    url: '/Revaluation/SaveRevaluation?assetid=' + self.AssetID() + '&surplus=' + $("#txtsurplus").val(),
                    data: ko.toJSON(this),
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
                $('#successModalText').text('Please Set a New Written Down Value.');
            }

        };

        self.SearchAsset = function (data) {
            self.FromDateText(moment(self.FromDate()).format('DD/MM/YYYY'));
            self.EndDateText(moment(self.EndDate()).format('DD/MM/YYYY'));
            if (self.Level() > 0) {
                return $.ajax({
                    type: "POST",
                    url: '/Revaluation/getFilturedAssets?level=' + self.Level() + '&catid=' + self.Id() + '&resval=' + self.ResidualValue() + '&from=' + self.FromDateText() + '&end=' + self.EndDateText() + '&code=' + self.AssetCode(),
                    data: ko.toJSON(this),
                    contentType: "application/json",
                    success: function (data) {

                        self.Assets_Logs(data);
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
        //self.getAllLogs = function () {
        //    return $.ajax({
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

        //self.getAssetsbyCatId = function () {
        //    if (self.Id() > 0) {
        //        return $.ajax({
        //            type: "GET",
        //            url: '/Revaluation/GetAssetsLogByCategory?catid=' + self.Id(),
        //            contentType: "application/json; charset=utf-8",
        //            dataType: "json",
        //            success: function (data) {
        //                self.Assets_Logs(data);
        //            },
        //            error: function (error) {
        //                alert(error.status + "<--and--> " + error.statusText);
        //            }
        //        });
        //    }
        //    else
        //    {
        //        self.getAllAssetsLogs();
        //    }
        //}
        self.getAllAssetsLogs = function () {
              return $.ajax({
                    type: "GET",
                    url: '/Revaluation/getFilturedAssets?catid=' + self.Id() + '&resval=' + self.ResidualValue() + '&from=' + self.FromDateText() + '&end=' + self.EndDateText() + '&code=' + self.AssetCode(),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        self.Assets_Logs(data);
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
                url: '/Category/getCategoryLevels',
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
                url: '/Depreciation/GetAllCategoriesByLevel?level=' + self.Level(),
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

        self.getEditUrl = function (data) {
            return '/Revaluation/Edit?id=' + data.Id;
        };

        self.editAssets = function (data) {
            self.Id(data.Id);
            self.AssetName(data.AssetName);
            self.AssetID(data.AssetID);
            self.DepreciatedAmount(data.DepreciatedAmount);
            self.BaseValue(data.BaseValue);
            self.OpeningValue(data.OpeningValue);
            self.DepriciationModel(data.DepriciationModel);
            self.DepreciationModelName(data.DepreciationModelName);
            self.PointOfDepreciation(data.PointOfDepreciation);
            self.CauseOfDepreciation(data.CauseOfDepreciation);
            self.WrittenDownValue(data.WrittenDownValue);
            self.CalculatedDate(moment());
            self.CalculatedDateString();
            self.YearRemaining(data.YearRemaining);
            self.AdjustedDepreciation(data.AdjustedDepreciation);
            self.RevaluationSurplus(data.RevaluationSurplus);
            $('#txtNewWDV').val(0);
            $('#txtsurplus').val(0);

        };

        self.InitialValueLoad = function () {
            self.getLevels();
            self.getAllAssetsLogs();
            //self.getAllLogs();
            
        };

        self.errors = ko.validation.group(self);
        self.IsValid = ko.computed(function () {
            var err = self.errors().length;
            if (err == 0)
                return true;
            return false;
        });
    }

    var vm = new DepreciationLogVm();
    vm.InitialValueLoad();


    ko.applyBindings(vm, $('#DepreciationDiv')[0]);
});