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

   

    function AssetVm() {

        var self = this;
        var currentDate = (new Date()).toISOString().split('T')[0];

        self.Id = ko.observable();
        self.AssetName = ko.observable('').extend({ required: { message: 'Only alphanumeric value required.' }, params: '^[a-zA-Z]', minLength: 3 });
        self.AssetCategoryID = ko.observable().extend({ required: true });
        self.CategoryName = ko.observable('');
        self.SupplierID = ko.observable();
        self.EmployeeID = ko.observable();
        self.DepriciationModel = ko.observable().extend({ required: true });
        self.DepriciationRate = ko.observable();
        self.UsefulLife = ko.observable();
        self.VoucherCode = ko.observable('').extend({ required: true, minLength: 5, maxLength: 7 });
        self.OpeningDepreciation = ko.observable(0.00);
        self.BaseValue = ko.observable(0.00).extend({ required: true });
        self.Tax = ko.observable(0.00);
        self.VAT = ko.observable(0.00);
        self.TotalValue = ko.observable(0.00);
        self.Location = ko.observable('');
        self.PurchaseDate = ko.observable(currentDate);//.extend({ required: true, date: true });
        self.PurchaseDateText = ko.observable();
        self.ServiceTypes = ko.observable();
        self.ServicePeriod = ko.observable();
        self.Description = ko.observable('');
        self.FromDate = ko.observable(currentDate);
        self.ToDate = ko.observable(currentDate);
        self.FromDateText = ko.observable();
        self.ToDateText = ko.observable();
        self.reportgroupby = ko.observable('');
        self.Level = ko.observable(1);

        //self.DepriciationModel = ko.observable().extend({ readonly: true });
        //self.UsefulLife = ko.observable().extend({ readonly: true });

        self.Link1 = ko.observable();
        self.Link2 = ko.observable();
        self.Link3 = ko.observable();

        self.Title1 = ko.observable('PDF');
        self.Title2 = ko.observable('Excel');
        self.Title3 = ko.observable('Word');
              
        self.Assets = ko.observableArray([]);
        self.Categories = ko.observableArray([]);
        self.Suppliers = ko.observableArray([]);
        self.Employees = ko.observableArray([]);
        self.ReportGroupBy = ko.observable([]);
        self.Levels = ko.observableArray([]);
              
        self.Level.subscribe(function () {
            self.getAllCategories();
        });

        self.getAllAssets = function () {
            self.FromDateText(moment(self.FromDate()).format('DD/MM/YYYY'));
            self.ToDateText(moment(self.ToDate()).format('DD/MM/YYYY'));
           return $.ajax({
                type: "GET",
                url: '/FAMS/AssetReport/GetAssetsByCategory?level=' + self.Level() + '&catid=' + self.Id() + '&fromDate=' + self.FromDateText() + '&toDate=' + self.ToDateText(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.Assets(data);
                    self.setUrl();
                },
                error: function (error) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(error.statusText);
                }
            });
        };

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

        self.getDepreciationModels = function () {

            return $.ajax({
                type: "GET",
                url: '/FAMS/Assets/GetDepreciationModels',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.DepriciationModels(data);

                },
                error: function (error) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(error.statusText);
                }
            });
        }

        self.getSuppliers = function () {

            return $.ajax({
                type: "GET",
                url: '/FAMS/Assets/GetSupplierList',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.Suppliers(data);

                },
                error: function (error) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(error.statusText);
                }
            });
        }

        self.getEmployees = function () {

            return $.ajax({
                type: "GET",
                url: '/FAMS/Assets/GetEmployeeList',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.Employees(data);

                },
                error: function (error) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(error.statusText);
                }
            });
        }

        self.getServiceTypes = function () {

            return $.ajax({
                type: "GET",
                url: '/FAMS/Assets/GetServiceTypes',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.ServiceTypeList(data);

                },
                error: function (error) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(error.statusText);
                }
            });
        }

        self.getReportGroupBy = function () {

            return $.ajax({
                type: "GET",
                url: '/FAMS/AssetReport/getReportGroupby',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.ReportGroupBy(data);

                },
                error: function (error) {
                $('#successModal').modal('show');
                $('#successModalText').text(error.statusText);
                }
            });
        }

        self.getAssetsbyCatId = function () {
            if (self.Id() > 0) {
                return $.ajax({
                    type: "GET",
                    url: '/FAMS/Assets/GetAssetsByCategory?catid=' + self.Id(),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        self.Assets(data);
                        self.setUrl();
                    },
                    error: function (error) {
                        $('#successModal').modal('show');
                        $('#successModalText').text(error.statusText);
                    }
                });
            }
            else {
                self.getAllAssets();
            }
        }

        self.setUrl = ko.computed(function () {
            if (self.reportgroupby() === undefined) {
               
                self.reportgroupby('');
            }
            self.FromDateText(moment(self.FromDate()).format('DD/MM/YYYY'));
            self.ToDateText(moment(self.ToDate()).format('DD/MM/YYYY'));

            self.Link1('/FAMS/AssetReport/getReport?level=' + self.Level() + '&reportTypeId=PDF&catid=' + self.Id() + '&groupby=' + self.reportgroupby() + '&fromDate=' + self.FromDateText() + '&toDate=' + self.ToDateText());
            self.Link2('/FAMS/AssetReport/getReport?level=' + self.Level() + '&reportTypeId=Excel&catid=' + self.Id() + '&groupby=' + self.reportgroupby() + '&fromDate=' + self.FromDateText() + '&toDate=' + self.ToDateText());
            self.Link3('/FAMS/AssetReport/getReport?level=' + self.Level() + '&reportTypeId=Word&catid=' + self.Id() + '&groupby=' + self.reportgroupby() + '&fromDate=' + self.FromDateText() + '&toDate=' + self.ToDateText());
        });
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
        self.InitialValueLoad = function () {
            
            self.getLevels();
            // self.getDepreciationModels();
            self.getReportGroupBy();
            self.getSuppliers();
            self.getEmployees();
            self.getAllAssets();
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

    var vm = new AssetVm();
    vm.InitialValueLoad();


    ko.applyBindings(vm, $('#AssetsDiv')[0]);
});