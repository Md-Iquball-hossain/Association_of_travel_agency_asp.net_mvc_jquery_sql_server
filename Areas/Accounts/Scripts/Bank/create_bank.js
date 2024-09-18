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

    function BankVm() {

        var self = this;

        self.Id = ko.observable();
        self.CompanyList = ko.observableArray([]);
        self.CompanyProfileId = ko.observable();
        //self.Code = ko.observable('');//.extend({ required: true, minLength: 3, maxLength: 10 });
        self.Name = ko.observable('').extend({ required: true });//.extend({ required: { message: 'Only alphanumeric valu required.' }, params: '^[a-zA-Z]', minLength: 3 });
        self.Address = ko.observable('').extend({ required: true });
        self.BranchName = ko.observable('');//.extend({ required: true });
        self.PhoneNo = ko.observable('');//.extend({ required: true, digit: true });
        self.Email = ko.observable('');//.extend({ required: true, email: true });
        self.Fax = ko.observable('');
        self.Phone = ko.observable('');//.extend({ required: true, digit: true });
        self.AccountNo = ko.observable('');//.extend({ required: true });
        self.AccountTypes = ko.observableArray([]);
        self.AccountType = ko.observable('');
        self.Signatories = ko.observable('');


        self.Banks = ko.observableArray([]);

        self.SendEmail = ko.observable(); // Email by Maruf

        self.Reset = function () {
            self.Id('');
            self.Name('');
            self.Address('');
            self.BranchName('');
            self.PhoneNo('');
            self.Email('');
            self.Fax('');
            self.Phone('');
            self.AccountNo('');
            self.AccountTypes = ko.observableArray([]);
            self.AccountType('');
            self.Signatories('');
            self.loadBanks();
        };

        self.saveBank = function () {
            //if (self.errors().length === 0) {
            $.ajax({
                type: "POST",
                url: '/Accounts/Bank/SaveBank',
                data: ko.toJSON(this),
                contentType: "application/json",
                success: function (data) {

                    alert("Record Added Successfully");
                    self.loadBanks();
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
            $.ajax({
                type: "GET",
                url: '/Accounts/Bank/GetBankList?CompanyProfileId=' + self.CompanyProfileId(),
                //url: '/Accounts/Bank/GetBankList',
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

        self.loadAccTypes = function () {
            $.ajax({
                type: "GET",
                url: '/Accounts/Bank/GetBankAccountTypes',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {

                    self.AccountTypes(data);
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
            self.loadAccTypes();
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
            self.BranchName(data.BranchName);
            self.PhoneNo(data.PhoneNo);
            self.Email(data.Email);
            self.Fax(data.Fax);
            self.Phone(data.Phone);
            self.AccountNo(data.AccountNo);
            self.AccountType(data.AccountType);
            self.Signatories(data.Signatories);
        };

        //self.editBank = function (data) {
        //    $.ajax({
        //        type: "GET",
        //        url: '/Bank/Edit?id=' + data.Id,
        //        contentType: "application/json; charset=utf-8",
        //        dataType: "json",
        //        success: function (data) {
        //                self.Id(data.Id);
        //                self.Name(data.Name);
        //                self.Address(data.Address);
        //                self.BranchName(data.BranchName);
        //                self.PhoneNo(data.PhoneNo);
        //                self.Email(data.Email);
        //                self.Fax(data.Fax);
        //                self.Phone(data.Phone);
        //                self.AccountNo(data.AccountNo);
        //                self.AccountType(data.AccountType);
        //                self.Signatories(data.Signatories);
        //        },
        //        error: function (error) {
        //            alert(error.status + "<--and--> " + error.statusText);
        //        }
        //    });

        //}

        //Code by Maruf
        //self.SendEmail = function () {
        //    $.ajax({
        //        type: "POST",
        //        url: '/Accounts/Bank/SendEmailToUser',
        //        contentType: "application/json; charset=utf-8",
        //        dataType: "json",
        //        success: function (data) {
        //            alert("success");
        //        },
        //        error: function () {
        //            alert(error.status + "<--and--> " + error.statusText);
        //        }
        //    });
        //}
    }

    var vm = new BankVm();
    vm.InitialValueLoad();
    //ko.applyBindings(vm);

    ko.applyBindings(vm, $('#BankDiv')[0]);
});