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
    function ChequeRegisterDetail() {
        var self = this;

        self.ChequeNo = ko.observable();
        self.ChequeRegisterId = ko.observable();
        self.IssueDate = ko.observable();
        self.IssuedBy = ko.observable();
        self.PaidTo = ko.observable();
        self.PaidFor = ko.observable();
        self.Amount = ko.observable();
        self.VoucherNo = ko.observable();
        self.AccHeadCode = ko.observable();
    }

    function ChequeRegisterVm() {

        var self = this;

        self.Id = ko.observable();
        self.CompanyList = ko.observableArray([]);
        self.CompanyProfileId = ko.observable();
        self.AccountName = ko.observable('').extend({ required: true });//.extend({ required: { message: 'Only alphanumeric valu required.' }, params: '^[a-zA-Z]', minLength: 3 });
        
        self.BookIssueDate = ko.observable('');
        self.AccountNumber = ko.observable('').extend({ required: true });
        self.Details = ko.observableArray([]);
        self.ChequePrefix = ko.observable('');
        self.StartingNumber = ko.observable('');
        self.TotalCheques = ko.observable(0);

        self.Banks = ko.observableArray([]);
        self.SelectedBank = ko.observable();
        self.BankId = ko.observable();
        self.BranchName = ko.observable();

        self.bankChanged = function (data) {
            if (self.SelectedBank() != null && self.SelectedBank() != undefined) {
                self.BranchName(self.SelectedBank().BranchName);
                self.BankId(self.SelectedBank().Id);
            }
            console.log(self.BankId());
            console.log(self.BranchName());
        }

        self.Reset = function () {
            self.Id('');
            self.CompanyList([]);
            //self.CompanyProfileId('');
            self.AccountName('');
            self.BookIssueDate('');
            self.AccountNumber('');
            self.Details([]);
            self.ChequePrefix('');
            self.StartingNumber(0);
            self.Banks = ko.observableArray([]);
            self.BankId('');
        };

        self.saveChequeBook = function () {
            //console.log("inside saveing function");
            //if (self.errors().length === 0) {
            //self.CompanyList([]);
            //self.Banks([]);
            var saveData = {
                Id: self.Id() ? self.Id() : 0,
                CompanyProfileId: self.CompanyProfileId(),
                AccountName: self.AccountName(),
                BookIssueDate: self.BookIssueDate(),
                AccountNumber: self.AccountNumber(),
                Details: self.Details(),
                ChequePrefix: self.ChequePrefix(),
                TotalCheques: self.TotalCheques(),
                BookIssueDate: self.BookIssueDate(),
                StartingNumber: self.StartingNumber(),
                BankId: self.BankId()
            };
            console.log(saveData);
            $.ajax({
                type: "POST",
                url: '/Accounts/Bank/SaveChequeRegister',
                data: ko.toJSON(saveData),//ko.toJSON(self),
                contentType: "application/json",
                success: function (data) {
                    self.Id('');
                    //self.CompanyProfileId('');
                    self.AccountName();
                    self.BookIssueDate();
                    self.AccountNumber();
                    self.Details();
                    self.ChequePrefix();
                    self.TotalCheques();
                    self.BookIssueDate();
                    self.StartingNumber();
                    self.BankId();
                    alert("Record Added Successfully");
                    //self.loadBanks();
                    //self.Reset();
                    //window.location.href = "/Bank/Create";
                },
                error: function () {
                    alert(error.status + "<--save and--> " + error.statusText);
                }
            });

            //Ends Here
            // } 
            //else {
            //            self.errors.showAllMessages();
            //        }
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

        self.editBank = function (data) {
            self.Id(data.Id);
            self.Name(data.Name);
            self.Address(data.Address);
            //self.BranchName(data.BranchName);
            self.PhoneNo(data.PhoneNo);
            self.Email(data.Email);
            self.Fax(data.Fax);
            self.Phone(data.Phone);
            self.AccountNo(data.AccountNo);
            //self.AccountType(data.AccountType);
            //self.Signatories(data.Signatories);
        };


    }

    var vm = new ChequeRegisterVm();
    vm.InitialValueLoad();

    ko.applyBindings(vm, $('#ChequeRegisterDiv')[0]);
});