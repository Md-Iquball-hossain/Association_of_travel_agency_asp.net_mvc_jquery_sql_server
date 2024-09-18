/// <reference path="../knockout-3.4.0.debug.js" />
/// <reference path="../jquery-2.1.4.js" />
/// <reference path="../finix.util.js" />

$(document).ready(function () {
    ko.validation.init({
        errorElementClass: 'has-error',
        errorMessageClass: 'help-block',
        decorateInputElement: true
    });
    function supplierVm(data) {

        var self = this;
        
        self.Id = ko.observable();
        self.Name = ko.observable().extend({ required: true, pattern: { message: 'Only alphabetical values required.', params: "^[\\w ]+$", maxLength: "100" } });
        self.Address = ko.observable().extend({ pattern: { message: 'Only alphabetical values required.', params: "^[\\w ]+$", maxLength: "250" } });
        self.Phone = ko.observable().extend({ required: false, pattern: { message: 'Valid Phone Number required.', params: '^(?:\\+88|01)?(?:\\d{11}|\\d{13})$' } });
        self.Fax = ko.observable().extend({ required: false, pattern: { message: 'Valid Fax Number required.', params: '^(?:\\+88|01)?(?:\\d{11}|\\d{13})$' } });
        self.Email = ko.observable().extend({ required: true, pattern: { message: 'Valid Email address required.', params: '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$', maxLength: "25" } });
        self.ContactPerson = ko.observable();
        self.BankAccountNo = ko.observable().extend({ pattern: { message: 'Valid Bank Account required.', params: '^[0-9]*$', maxLength: "17" } });
        self.PayTerms = ko.observable();
        self.CountryId = ko.observable();
        self.CountryName = ko.observable();

        self.CountryList = ko.observableArray([]);

        self.urlEdit = ko.observable();
        self.titleEdit = ko.observable('Edit');

        self.queryStringValue = ko.observable();
        self.queryStringParam = ko.observable();
        self.IsValid = ko.observable(false);

        self.suppliers = ko.observableArray([]);

        self.Reset = function ()
        {
            self.Id();
            self.Name('');
            self.Address('');
            self.Phone('');
            self.Fax('');
            self.Email('');
            self.ContactPerson('');
            self.BankAccountNo('');
            self.PayTerms('');
            self.CountryId('');
            self.CountryName('');
        }

        self.saveSupplier = function () {
                if (self.IsValid())
                {
                    $.ajax({
                        type: "POST",
                        url: '/FAMS/Supplier/SaveSupplier',
                        data: ko.toJSON(self),
                        contentType: "application/json",
                        success: function (data) {
                            $('#successModal').modal('show');
                            $('#successModalText').text(data.Message);
                            //if (data.Message().contain("Saved"))
                            //    self.Reset();

                            //self.getsuppliers();
                        },
                        error: function () {
                            $('#successModal').modal('show');
                            $('#successModalText').text(error.status + "<--and--> " + error.statusText);
                            
                        }
                    });
                }
      
            else {
                
                $('#successModal').modal('show');
                $('#successModalText').text(error.status + "<--and--> " + error.statusText);
            }
        };
        self.getsuppliers = function () {
          return  $.ajax({
                type: "GET",
                url: '/FAMS/Supplier/SuppliersList',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.suppliers(data);
                    
                },
                error: function (error) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(error.status + "<--and--> " + error.statusText);
                }
            });
            //Ends Here
        }

        self.LoadCountrylist = function () {
          return  $.ajax({
                type: "GET",
                url: '/FAMS/Employee/CountryList',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.CountryList(data); //Put the response in ObservableArray
                },
                error: function (error) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(error.status + "<--and--> " + error.statusText);
                }
            });
        }

        self.LoadSupplier = function () {
            if (self.Id() > 0)
            {
                return $.ajax({
                    type: "GET",
                    url: '/FAMS/Supplier/GetSupplierById?id=' + self.Id(),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        //console.log("data=" + ko.toJSON(data));
                        self.suppliers(data); //Put the response in ObservableArray

                        self.Id(data.Id ? data.Id : 0);
                        self.Name(data.Name ? data.Name : '');
                        self.Address(data.Address ? data.Address : '');
                        self.Phone(data.Phone ? data.Phone : '');
                        self.Fax(data.Fax ? data.Fax : '');
                        self.Email(data.Email ? data.Email : '');
                        self.ContactPerson(data.ContactPerson ? data.ContactPerson : '');
                        self.BankAccountNo(data.BankAccountNo ? data.BankAccountNo : '');
                        self.PayTerms(data.PayTerms ? data.PayTerms : '');
                        $.when(self.LoadCountrylist()).done(function () {
                            self.CountryId(data.CountryId ? data.CountryId : '');
                            self.CountryName(data.CountryName ? data.CountryName : '');
                        });
                    },
                    error: function (error) {
                        $('#successModal').modal('show');
                        $('#successModalText').text(error.status + "<--and--> " + error.statusText);
                    }
                });
            }
        }
       
        self.InitialValueLoad = function () {
            self.getsuppliers();
            self.LoadCountrylist();
        }

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

    var vm = new supplierVm();
    vm.InitialValueLoad();
    vm.Id(vm.queryString("Id"))
    vm.LoadSupplier();
    ko.applyBindings(vm, $('#supplierDiv')[0]);
});