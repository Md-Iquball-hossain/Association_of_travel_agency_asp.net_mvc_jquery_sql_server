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

    ko.bindingHandlers.option = {
        update: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            ko.selectExtensions.writeValue(element, value);
        }
    };

    function Group(label, children) {
        this.Name = ko.observable(label);
        this.children = ko.observableArray(children);
    }

    function Option(label, property) {
        this.AssetID = ko.observable(property);
        this.AssetCode = ko.observable(label);
    }

    function AssetLocationVm() {

        var self = this;
        var currentDate = (new Date()).toISOString().split('T')[0];

        self.Id = ko.observable();
        self.AssetID = ko.observable();
        self.AssetName = ko.observable('');
        self.AssetCode = ko.observable();
        self.CustodianID = ko.observable();
        self.EmployeeName = ko.observable('');
        self.LocationID = ko.observable();
        self.LocationName = ko.observable();
        self.SpecificLocation = ko.observable();
        self.Remark = ko.observable('');
        self.Pass = ko.observable(false);
        self.Level = ko.observable(1);

        self.CompanyID = ko.observable(1);
        self.OfficeID = ko.observable();
       
              
        self.Assets = ko.observableArray([]);
        self.UnAssignedAssets = ko.observableArray([]);
        self.DestinationAssets = ko.observableArray([]);
        self.Employees = ko.observableArray([]);
        self.Companies = ko.observableArray([]);
        self.Categories = ko.observableArray([]);
        self.Offices = ko.observableArray([]);
        self.Levels = ko.observableArray([]);
       
        self.Level.subscribe(function () {
            self.getAllCategories();
        });

        self.OfficeID.subscribe(function () {
            self.getEmployees();
        });

        self.Reset = function () {
            self.Id('');
            self.AssetID('');
            self.AssetName('');
            self.AssetCode('');
            self.CustodianID();
            self.EmployeeName('');
            self.LocationID('');
            self.LocationName('');
            self.Pass(false);
            
            
        };
        
        self.SaveAssetAcquisition = function () {
            
            if (self.CustodianID() > 0) {
                $.ajax({
                    type: "POST",
                    url: '/FAMS/Acquisition/SaveAssetAcquisition?empid=' + self.CustodianID(),
                    data: ko.toJSON(this),
                    contentType: "application/json",
                    success: function (data) {
                        $('#successModal').modal('show');
                        $('#successModalText').text(data.Message);
                        self.Reset();
                        //self.getAllAssets();
                    },
                    error: function () {
                        alert(error.status + "<--save and--> " + error.statusText);
                    }
                });
            }
            else
            {
                $('#successModal').modal('show');
                $('#successModalText').text('Please select Custodian');
            }
        };
        self.SaveSelcetedAssetAcquisition = function () {
            var saveData = ko.observableArray([]);
            $.each(self.UnAssignedAssets(), function (index, value) {
                if (value.Pass == true) {
                    saveData.push(value.AssetID);
                }
            });
            
            if (saveData().length>0)
            {
                if (self.CustodianID() > 0) {
                    $.ajax({
                        type: "POST",
                        url: '/FAMS/Acquisition/SaveSelectedAssetAcquisition?empid=' + self.CustodianID(),
                        data: ko.toJSON(saveData),
                        contentType: "application/json",
                        success: function (data) {
                            $('#successModal').modal('show');
                            $('#successModalText').text(data.Message);
                            self.Reset();
                           // self.getAllAssets();
                        },
                        error: function () {
                            alert(error.status + "<--save and--> " + error.statusText);
                        }
                    });
                }
                else {
                    $('#successModal').modal('show');
                    $('#successModalText').text('Please select Custodian');
                }
            }
            else {
                $('#successModal').modal('show');
                $('#successModalText').text('Please select Assets');
            }

            
        };

        //self.getAllAssets = function () {
        //   return $.ajax({
        //        type: "GET",
        //        url: '/Acquisition/GetAcquisitions',
        //        contentType: "application/json; charset=utf-8",
        //        dataType: "json",
        //        success: function (data) {
        //            self.Assets(data);
        //        },
        //        error: function (error) {
        //            alert(error.status + "<--and--> " + error.statusText);
        //        }
        //    });
        //};

        self.getOffices = function () {
            return $.ajax({
                type: "GET",
                url: '/FAMS/Acquisition/GetAllOffices?parentid=3',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.Offices(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        };
        self.getUnAssignedAssets = function () {
            return $.ajax({
                type: "GET",
                url: '/FAMS/Acquisition/GetUnAssignesAssets?parentid=' + self.OfficeID() + '&catid=' + self.Id(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.UnAssignedAssets(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        };
        self.getDestinationAssets = function () {
            return $.ajax({
                type: "GET",
                url: '/FAMS/Acquisition/GetAssignedAssets?empid=' + self.CustodianID(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.DestinationAssets(data);
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
        self.getEmployees = function () {

            return $.ajax({
                type: "GET",
                url: '/FAMS/Acquisition/GetEmployeeList?officeId=' + self.OfficeID(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.Employees(data);

                },
                error: function (error) {

                    alert(error.status + "<--and--> " + error.statusText);
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
                    //self.groups(data);
                    self.Categories(data);
                },
                error: function (error) {
                    $('#successModal').modal('show');
                    $('#successModalText').text( error.statusText);
                }
            });
        }

        self.InitialValueLoad = function () {
           // self.getAllAssets();
            self.getLevels();
            self.getEmployees();
            self.getOffices();

        };

        self.errors = ko.validation.group(self);
        self.IsValid = ko.computed(function () {
            var err = self.errors().length;
            if (err == 0)
                return true;
            return false;
        });



    }

    var vm = new AssetLocationVm();
    vm.InitialValueLoad();
    var group = new Group();

    ko.applyBindings(vm, $('#AssetsDiv')[0]);
});