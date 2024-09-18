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
    ChequeStatuses = [  { Id: 1, Name: "UnUsed" },
                        { Id: 1, Name: "Issued" },
                        { Id: 1, Name: "Bounced" },
                        { Id: 1, Name: "Ruined" }
                     ]
    function ChequebookSummaryStatusVm() {

        var self = this;

        self.Id = ko.observable();
        self.CompanyList = ko.observableArray([]);
        self.CompanyProfileId = ko.observable();
        
        self.ChequeStatuses = ko.observableArray(ChequeStatuses);
        self.ChequeStatus = ko.observable();
        self.Details = ko.observableArray([]);
        //self.ChequePrefix = ko.observable('');
        //self.StartingNumber = ko.observable('');
        //self.TotalCheques = ko.observable(0);

        self.ChequeBooks = ko.observableArray([]);
        self.SelectedBank = ko.observable();
        self.Banks = ko.observableArray([]);
        self.BankId = ko.observable();
        self.BranchName = ko.observable();

        self.bankChanged = function (data) {
            if (self.SelectedBank() != null && self.SelectedBank() != undefined) {
                self.BranchName(self.SelectedBank().BranchName);
                self.BankId(self.SelectedBank().Id);
            }
        }


        self.getChequeBookStatusSummary = function () {
            
            self.ChequeBooks([]);
            var currentCompany = self.CompanyProfileId() > 0 ? self.CompanyProfileId() : null;
            var bankId = self.BankId();
            var chequeStatus = self.ChequeStatus();
            return $.ajax({
                type: "GET",
                url: '/Accounts/Bank/GetChequeBookStatusSummary?CompanyProfileId=' + currentCompany + '&BankId=' + bankId + '&ChequeStatus=' + chequeStatus,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {

                    self.ChequeBooks(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        };

        self.loadBanks = function () {
            self.Banks([]);
            var currentCompany = self.CompanyProfileId() > 0 ? self.CompanyProfileId() : null;
            return $.ajax({
                type: "GET",
                url: '/Accounts/Bank/GetBankList?CompanyProfileId=' + currentCompany,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {

                    self.Banks(data);
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
            self.loadBanks();
            //    self.loadAccTypes();
        };

        self.errors = ko.validation.group(self);
        self.IsValid = ko.computed(function () {
            var err = self.errors().length;
            if (err == 0)
                return true;
            return false;
        });

        self.getEditUrl = function (data) {
            return '/Accounts/Bank/Edit?id=' + data.Id;
        };
    }

    var vm = new ChequebookSummaryStatusVm();
    vm.InitialValueLoad();
    //ko.applyBindings(vm);

    ko.applyBindings(vm, $('#ChequebookSummaryStatusDiv')[0]);
});