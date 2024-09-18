/// <reference path="../knockout-3.4.0.debug.js" />
/// <reference path="../jquery-2.1.4.js" />
/// <reference path="../finix.util.js" />
$(document).ready(function () {
    ko.validation.init({
        errorElementClass: 'has-error',
        errorMessageClass: 'help-block',
        decorateInputElement: true
    });

    function supplierEditVm() {
        var self = this;
        self.Id = ko.observable();
        self.Name = ko.observable().extend({ required: true });
        self.Address = ko.observable().extend({ required: true });
        self.Phone = ko.observable();
        self.Fax = ko.observable();
        self.Email = ko.observable();
        self.ContactPerson = ko.observable();
        self.BankAccountNo = ko.observable();
        self.PayTerms = ko.observable();
        self.CountryId = ko.observable();
        self.CountryName = ko.observable();

        self.CountryList = ko.observableArray([]);

        self.queryStringValue = ko.observable();
        self.queryStringParam = ko.observable();

        self.suppliers = ko.observableArray([]);
        
        self.saveSupplier = function () {
            if (self.errors().length === 0) {
                $.ajax({
                    type: "POST",
                    url: '/FillingStation/Supplier/SaveSupplier',
                    data: ko.toJSON(self),
                    contentType: "application/json",
                    success: function (data) {
                        alert("Record Added Successfully");
                        self.Name('');
                        self.Address('');
                        self.Phone('');
                        self.Fax('');
                        self.Email('');
                        self.ContactPerson('');
                        self.BankAccountNo('');
                        self.PayTerms('');
                        self.CountryId('');
                        self.CountryName();
                    },
                    error: function () {
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });

                //Ends Here
            } else {
                self.errors.showAllMessages();
            }
        };
        self.LoadCountrylist = function () {
            $.ajax({
                type: "GET",
                url: '/FillingStation/Country/GetCountries',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.CountryList(data); //Put the response in ObservableArray
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
        //debugger;
        self.getSupplierById = function (data) {
            $.ajax({
                type: "GET",
                url: '/FillingStation/Supplier/GetSupplierById?id=' + data,
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
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }


        self.queryString = function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));

        }

        self.errors = ko.validation.group(self);
        self.IsValid = ko.computed(function () {
            if (self.errors().length === 0)
                return true;
            return false;
        });
    }

    var vm = new supplierEditVm();
    var qValue = vm.queryString('id');

    //vm.LoadCountrylist();

    vm.queryStringValue(qValue);
    vm.getSupplierById(qValue);

    ko.applyBindings(vm, $('#editsupplierDiv')[0]);

});
