/// <reference path="../knockout-3.4.0.debug.js" />
/// <reference path="../jquery-2.1.4.js" />
var activities = [{ 'Id': 1, 'Name': 'Cash Flow from Operating Activities' },
                    { 'Id': 2, 'Name': 'Cash Flow from Investing Activities' },
                    { 'Id': 3, 'Name': 'Cash Flow from Financing Activities' },
                    { 'Id': 4, 'Name': 'Cash & Cash Equivalents' }];


$(document).ready(function () {
    ko.validation.init({
        errorElementClass: 'has-error',
        errorMessageClass: 'help-block',
        decorateInputElement: true
    });
    function AccountGroupEntry() {
        var self = this;
        self.AccGroup = ko.observable('');
        self.Code = ko.observable('');
        self.Name = ko.observable('');
        self.AccGroupId = ko.observable('');
        self.AccSubGroupId = ko.observable('');
        self.CashFlowStatementActivity = ko.observable('');
        self.AccHeadGroupId = ko.observable('');

        self.AccGroupList = ko.observableArray([]);
        self.AccSubGroupList = ko.observableArray([]);
        self.AccHeadGroupList = ko.observableArray([]);
        self.CashFlowStatementActivityList = ko.observableArray(activities);
        
        //GetAllAccGroups
        self.GetAllAccGroup = function () {
            return $.ajax({
                type: "GET",
                url: '/Accounts/Accounts/GetAllAccGroups',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.AccGroupList(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
        //GetAllAccGroups
        self.GetAllAccSubGroup = function () {
            return $.ajax({
                type: "GET",
                url: '/Accounts/Accounts/GetAllAccSubGroup',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.AccSubGroupList(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
        self.GetAllAccHeadGroup = function () {
            return $.ajax({
                type: "GET",
                url: '/Accounts/Accounts/GetAllAccHeadGroup',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.AccHeadGroupList(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
        self.Initialize = function () {
            self.GetAllAccGroup();
            self.GetAllAccSubGroup();
            self.GetAllAccHeadGroup();
        }

        self.SaveAccountGroup = function () {
            
            $.ajax({
                type: "POST",
                url: '/Accounts/Accounts/SaveAccountGroup',
                data: ko.toJSON(self),
                contentType: "application/json",
                success: function (data) {
                    $('#SuccessModal').modal('show');
                    $('#SuccessModalText').text(data.Message);
                },
                error: function () {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });

            //Ends Here
        };

        self.assignment = function (data) {
           
        }

    }

    var vm = new AccountGroupEntry();
    vm.Initialize();
    ko.applyBindings(vm, $('#accountGroupEntryDiv')[0]);

});