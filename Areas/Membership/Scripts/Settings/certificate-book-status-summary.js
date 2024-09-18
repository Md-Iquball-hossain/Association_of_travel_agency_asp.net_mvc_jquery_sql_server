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

    function CertificatebookSummaryStatusVm() {

        var self = this;

        self.Id = ko.observable();
        self.CompanyList = ko.observableArray([]);
        self.CompanyProfileId = ko.observable();
        //self.CertificateStatus = ko.observable();
        self.CertificateType = ko.observable();
        self.Prefix = ko.observable('');
        self.StartingNumber = ko.observable('');
        self.TotalPages = ko.observable(0);
        self.UnUsedCount = ko.observable(0);
        self.IssuedCount = ko.observable(0);
        self.VoidCount = ko.observable(0);
        self.RuinedCount = ko.observable(0);


        self.CertificateBooks = ko.observableArray([]);
        self.CTypes = ko.observableArray([]);

        //self.bankChanged = function (data) {
        //    if (self.SelectedBank() != null && self.SelectedBank() != undefined) {
        //        self.BranchName(self.SelectedBank().BranchName);
        //        self.BankId(self.SelectedBank().Id);
        //    }
        //}


        self.getCertificateBookStatusSummary = function () {
            
            self.CertificateBooks([]);
            var currentCompany = self.CompanyProfileId() > 0 ? self.CompanyProfileId() : null;
            var certype = self.CertificateType();
            
            return $.ajax({
                type: "GET",
                url: '/Membership/Settings/GetCertificateRegisterStatusSummary?CompanyProfileId=' + currentCompany + '&certype=' + certype,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {

                    self.CertificateBooks(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        };

        self.loadTypes = function () {
            self.CTypes([]);
            var currentCompany = self.CompanyProfileId() > 0 ? self.CompanyProfileId() : null;
            return $.ajax({
                type: "GET",
                url: '/Membership/Settings/GetCertificateTypes?companyid=' + currentCompany,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.CTypes(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        };

        self.getAllCompanies = function () {
            if (userCompanyId != null && userCompanyId > 0) {
                self.CompanyProfileId(userCompanyId);
            } else {
                self.CompanyList([]);
                return $.ajax({
                    type: "GET",
                    url: '/Auth/CompanyProfile/GetAllCompanyList',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        self.CompanyList(data);
                    },
                    error: function (error) {
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            }
        }

        self.InitialValueLoad = function () {
            self.getAllCompanies();
            self.loadTypes();
            
        };

        self.errors = ko.validation.group(self);
        self.IsValid = ko.computed(function () {
            var err = self.errors().length;
            if (err == 0)
                return true;
            return false;
        });

      
    }

    var vm = new CertificatebookSummaryStatusVm();
    vm.InitialValueLoad();
    
    ko.applyBindings(vm, $('#CertificatebookSummaryStatusDiv')[0]);
});