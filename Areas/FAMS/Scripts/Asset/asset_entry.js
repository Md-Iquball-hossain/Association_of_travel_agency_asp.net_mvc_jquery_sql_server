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

    $(".model").change(function () {
        var end = this.value;
        if (end == "2") {
           // $("#txtOpenDepre").show();
            $("#txtRate").show();
           // $("#txtUsefulLife").hide();
        }
        else if (end == "1") {
           // $("#txtOpenDepre").show();
            $("#txtRate").show();
          //  $("#txtUsefulLife").hide();
        }
        else if (end == "3") {
           // $("#txtOpenDepre").hide();
            $("#txtRate").hide();
          //  $("#txtUsefulLife").show();
        }
    });

    $('.taxrate').focusout(function () {
        var basic = Number($('#txtBase').val());
        if (basic>0) {
            var tax = Number($('#txtTaxRate').val()) / 100;
            var taxtotal = Number(basic * tax);
            $("#txtTax").val(taxtotal);
            $("#txtVATRate").focusin();
        }
        else
        {
            $("#txtBase").focusin();
        }
    });

    $(".vatrate").focusout(function () {
       
            var basic = Number($('#txtBase').val());
            var tax = Number($('#txtTaxRate').val()) / 100;
            var vat = Number($('#txtVATRate').val()) / 100;
            var taxtotal = Number(basic * tax);
            var vattotal = Number(basic * vat);

            var total = (basic) + (taxtotal) + (vattotal);
           
            $("#txtTax").val(taxtotal);
            $("#txtVAT").val(vattotal);
            
            $("#txtTotal").val(total);
            
            $("#txtTotal").focusin();
     

    });

    function AssetVm() {

        var self = this;
        var currentDate = (new Date()).toISOString().split('T')[0];

        self.Id = ko.observable();
        self.AssetName = ko.observable().extend({ required: true, pattern: { message: 'Only alphabetical values required.', params: '[^\p{L}\d\s_]', maxLength: 100 } });
        self.AssetCategoryID = ko.observable().extend({ required: true });
        self.CategoryName = ko.observable('');
        self.AssetCode = ko.observable();
        self.SupplierID = ko.observable();
        self.DepriciationModel = ko.observable().extend({ required: true });
        self.DepriciationRate = ko.observable().extend({ pattern: { message: 'Numaric value is required.', params: '^[0-9]*$' }, maxLength: 2 });
        self.UsefulLife = ko.observable();
            //.extend({ pattern: { message: 'Numaric value is required.', params: '^[0-9]*$', maxLength: "3" } });
        self.VoucherCode = ko.observable('');
            //.extend({ required: true, minLength: 5, maxLength: 7 });
        self.OpeningDepreciation = ko.observable(0.00);
        self.BaseValue = ko.observable(0.00).extend({ required: true, pattern: { message: 'Numaric value is required.', params: '^[0-9]*$', maxLength: 10 } });
        self.Tax = ko.observable(0.00).extend({ pattern: { message: 'Numaric value is required.', params: '^[0-9]*$', maxLength: "15" } });
        self.VAT = ko.observable(0.00).extend({ pattern: { message: 'Numaric value is required.', params: '^[0-9]*$', maxLength: "15" } });
        self.TotalValue = ko.observable(0.00);
        self.Location = ko.observable('');
        self.PurchaseDate = ko.observable(currentDate);//.extend({ required: true, date: true });
        self.PurchaseDateText = ko.observable();
        self.ServiceTypes = ko.observable();
        self.ServicePeriod = ko.observable().extend({ pattern: { message: 'Numaric value is required.', params: '^[0-9]*$', maxLength: 3} });
        self.Description = ko.observable().extend({ pattern: { message: 'Only alphabetical values required.', params: "^[A-Za-z0-9- ]+$", maxLength: 250 } });
        self.IsValid = ko.observable(false);
        self.CodeVisible = ko.observable(false);

        //self.DepriciationModel = ko.observable().extend({ readonly: true });
        //self.UsefulLife = ko.observable().extend({ readonly: true });

              
        self.Assets = ko.observableArray([]);
        self.Categories = ko.observableArray([]);
        self.Suppliers = ko.observableArray([]);
        self.ServiceTypeList = ko.observableArray([]);
        self.DepriciationModels = ko.observableArray([]);

        self.Reset = function () {
            self.Id('');
            self.AssetName('');
            self.AssetCategoryID('');
            self.SupplierID('');
            self.DepriciationModel('');
            self.VoucherCode('');
            self.OpeningDepreciation(0.00);
            self.BaseValue(0.00);
            self.Tax(0.00);
            self.VAT(0.00);
            self.TotalValue(0.00);
            self.Location('');
            self.PurchaseDate(currentDate);
            self.PurchaseDateText();
            self.ServiceTypes('');
            self.ServicePeriod('');
            self.Description = ko.observable('');
            self.DepriciationRate = ko.observable('');
            
        };

        self.SaveAsset = function () {
            if (self.IsValid()) {
                self.PurchaseDateText(moment(self.PurchaseDate()).format('DD/MM/YYYY'));
                $.ajax({
                    type: "POST",
                    url: '/FAMS/Assets/SaveAsset',
                    data: ko.toJSON(this),
                    contentType: "application/json",
                    success: function (data) {
                        $('#successModal').modal('show');
                        $('#successModalText').text(data.Message);
                        //self.getAllAssets(); 
                        self.Reset();
                       // self.CodeVisible(true);
                    },
                    error: function () {
                        $('#successModal').modal('show');
                        $('#successModalText').text(error.statusText);
                        
                    }
                });
            }
            else {
                $('#successModal').modal('show');
                $('#successModalText').text(error.status + "<--save and--> " + error.statusText);
            }
            

        };

        //self.getAllAssets = function () {
        //   return $.ajax({
        //        type: "GET",
        //        url: '/Assets/GetAssets?catid=' + self.AssetCategoryID(),
        //        contentType: "application/json; charset=utf-8",
        //        dataType: "json",
        //        success: function (data) {
        //            self.Assets(data);
        //        },
        //        error: function (error) {
        //            $('#successModal').modal('show');
        //            $('#successModalText').text(error.status + "<--save and--> " + error.statusText);
        //        }
        //    });
        //};

        self.getAllCategories = function () {

            return $.ajax({
                type: "GET",
                url: '/FAMS/Assets/GetAllCategories',
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
                    $('#successModalText').text(error.status + "<--save and--> " + error.statusText);
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
                    $('#successModalText').text(error.status + "<--save and--> " + error.statusText);
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
                    $('#successModalText').text(error.status + "<--save and--> " + error.statusText);
                }
            });
        }

        self.InitialValueLoad = function () {
            self.getAllCategories();
            self.getDepreciationModels();
            self.getSuppliers();
            self.getServiceTypes();
            //self.getAllAssets();
        };

        self.getEditUrl = function (data) {
            return '/FAMS/Assets/Edit?id=' + data.Id;
        };

        self.getOptionsSelected = function (data) {
            return $.ajax({
                type: "GET",
                url: '/FAMS/Category/getParent?Id=' + data,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.Mappings(data);  //Put the response in ObservableArray

                    self.Id(data.Id);
                    self.CategoryID(data.CategoryID);
                    self.CategoryName(data.CategoryName);
                    self.DepricationType(data.DepricationType);
                    self.AccountHeadCode(data.AccountHeadCode);

                },
                error: function (error) {

                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        };

        //self.editAssets = function (data) {
           
        //    self.Id(data.Id);
        //    self.AssetName(data.AssetName);
        //    self.AssetCode(data.AssetCode);
        //    self.AssetCategoryID(data.AssetCategoryID);
        //    self.SupplierID(data.SupplierID);
        //    self.DepriciationModel(data.DepriciationModel);
        //    self.VoucherCode(data.VoucherCode);
        //    self.BaseValue(data.BaseValue);
        //    self.Tax(data.Tax);
        //    self.VAT(data.VAT);
        //    self.TotalValue(data.TotalValue);
        //    self.OpeningDepreciation(data.OpeningDepreciation);
        //    self.PurchaseDate(moment(data.PurchaseDate));
        //    self.ServiceTypes(data.ServiceTypes);
        //    self.ServicePeriod(data.ServicePeriod);
        //    self.Description(data.Description);
        //    self.DepriciationRate(data.DepriciationRate);
        //    self.UsefulLife(data.UsefulLife);
        //    self.Location(data.Location);
        //    self.CodeVisible(true);

        //    $('#txtBase').attr('readonly', true);
        //    $('#txtTax').attr('readonly', true);
        //    $('#txtVAT').attr('readonly', true);
        //    $('#txtTotal').attr('readonly', true);
        //   // $('#txtOpenDepre').attr('readonly', true);
        //    $('#ddlDepreModel').attr('disabled', true);
        //    $('#txtRate').attr('readonly', true);
        //    $('.vatrate').attr('readonly', true);
        //    $('.taxrate').attr('readonly', true);
        //    $('#PurchaseDate').attr('readonly', true);
        //   // $('#txtUsefulLife').attr('readonly', true);
            
           
        //};

        self.LoadAsset = function () {
            if (self.Id() > 0) {
                return $.ajax({
                    type: "GET",
                    url: '/FAMS/Assets/GetAssetInformation?id=' + self.Id(),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        //console.log("Data :" + ko.toJSON(data));
                        self.Id(data.Id);
                        self.AssetName(data.AssetName);
                        self.AssetCode(data.AssetCode);
                        $.when(self.getAllCategories()).done(function () {
                            self.AssetCategoryID(data.AssetCategoryID);
                        });
                        $.when(self.getSuppliers()).done(function () {
                            self.SupplierID(data.SupplierID);
                        });
                        $.when(self.getDepreciationModels()).done(function () {
                            self.DepriciationModel(data.DepriciationModel);
                        });
                        self.VoucherCode(data.VoucherCode);
                        self.BaseValue(data.BaseValue);
                        self.Tax(data.Tax);
                        self.VAT(data.VAT);
                        self.TotalValue(data.TotalValue);
                        self.OpeningDepreciation(data.OpeningDepreciation);
                        self.PurchaseDate(moment(data.PurchaseDate));
                        $.when(self.getServiceTypes()).done(function () {
                            self.ServiceTypes(data.ServiceTypes);
                        });
                        self.ServicePeriod(data.ServicePeriod);
                        self.Description(data.Description);
                        self.DepriciationRate(data.DepriciationRate);
                        self.UsefulLife(data.UsefulLife);
                        self.Location(data.Location);
                        self.CodeVisible(true);

                        $('#txtBase').attr('readonly', true);
                        $('#txtTax').attr('readonly', true);
                        $('#txtVAT').attr('readonly', true);
                        $('#txtTotal').attr('readonly', true);
                        // $('#txtOpenDepre').attr('readonly', true);
                        $('#ddlDepreModel').attr('disabled', true);
                        $('#txtRate').attr('readonly', true);
                        $('.vatrate').attr('readonly', true);
                        $('.taxrate').attr('readonly', true);
                        $('#PurchaseDate').attr('readonly', true);
                        // $('#txtUsefulLife').attr('readonly', true);
                    },
                    error: function (error) {
                        $('#successModal').modal('show');
                        $('#successModalText').text(error.statusText);
                    }
                });

            }



        };

        self.errors = ko.validation.group(self);
        self.IsValid = ko.computed(function () {
            var err = self.errors().length;
            if (err == 0)
                return true;
            return false;
        });

        self.queryString = function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        };

    }

    var vm = new AssetVm();
    vm.Id(vm.queryString("Id"));
    vm.InitialValueLoad();
    vm.LoadAsset();
    ko.applyBindings(vm, $('#AssetsDiv')[0]);
});