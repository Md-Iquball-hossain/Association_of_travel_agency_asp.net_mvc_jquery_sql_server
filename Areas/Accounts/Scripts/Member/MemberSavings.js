var month = [{ 'Id': 'January', 'Name': 'January' },
                    { 'Id': 'February', 'Name': 'February' },
                    { 'Id': 'March', 'Name': 'March' },
                    { 'Id': 'April', 'Name': 'April' },
                    { 'Id': 'May', 'Name': 'May' },
                    { 'Id': 'June', 'Name': 'June' },
                    { 'Id': 'July', 'Name': 'July' },
                    { 'Id': 'August', 'Name': 'August' },
                    { 'Id': 'September', 'Name': 'September' },
                    { 'Id': 'October', 'Name': 'October' },
                    { 'Id': 'November', 'Name': 'November' },
                    { 'Id': 'December', 'Name': 'December' }];
var trasactionType = [
    {'Id':1,'Name':'Deposit'},
    {'Id':2, 'Name':'Withdraw' }
];

$(document).ready(function () {
    ko.validation.init({
        errorElementClass: 'has-error',
        errorMessageClass: 'help-block',
        decorateInputElement: true,
        grouping: { deep: true, observable: true }
    });
    function memberSavingDetails() {
        var self = this;
        self.TransactionTypes = ko.observableArray(trasactionType);
        self.TransactionType = ko.observable('');
        self.errors = ko.validation.group(self);
        self.MemberIdNo = ko.observable(memberId);
        self.Name = ko.observable();
        self.Phone = ko.observable();
        self.TotalSavings = ko.observable().extend({ required: true });
        self.CurrentBalance = ko.observable();
        self.Due = ko.observable();
        self.CurrentFiscalYear = ko.observable().extend({ required: true });
        self.Months = ko.observableArray(month);
        self.Month = ko.observable().extend({ required: true });
        self.SavingsAmount = ko.observable();
        self.PaymentDate = ko.observable();
        var currentYr = new Date().getFullYear();
        self.LoadInitial = function(){
            $.getJSON("/Somity/Member/GetMemberDetails/?memberId=" + memberId, null, function (data) {
                console.log("member " + memberId);
                console.log("data " + ko.toJSON(data));
                self.CurrentFiscalYear(currentYr);
                self.Name(data.Name);
                self.Phone(data.Phone);
                self.TotalSavings(data.TotalSavings);
                self.CurrentBalance(data.CurrentBalance);
                //self.PaymentDate(data.PaymentDate);
                self.Due(data.Due);
                self.getBanks();
            });
        };

        /////////////////Newly Modified
        self.Banks = ko.observableArray([]);

        self.BankName = ko.observable();
        self.BranchName = ko.observable();
        self.ChequeNo = ko.observable();
        self.ChequeDate = ko.observable();
        self.AccountHeadCode = ko.observable();

        function getPaytypes() {
            return ['cash', 'bank'];
        }

        self.paytypes = ko.observableArray(getPaytypes());
        self.selectedPaytype = ko.observable(self.paytypes()[0]);
        self.selectedBankAccountHeadCode = ko.observable(0).extend({ required: { onlyIf: function () { return (self.selectedPaytype() === "bank"); } } });
     

        self.IsBank = ko.computed(
           function () {
               if (self.selectedPaytype() === 'bank') {
                   return true;
               }
               return false;
           });
        self.getBanks = function () {
            $.ajax({
                type: "GET",
                url: '/Accounts/Accounts/GetBankAccHeads',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    //return data;
                    self.Banks(data);
                    //console.log(ko.toJSON(data));
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
        /////////////////////////

        self.Submit = function () {
            if (self.errors().length == 0) {
               
                $.ajax({
                    type: "POST",
                    url: "/Somity/Member/SaveAccountSavings/",

                    data: ko.toJSON(self),
                    contentType: 'application/json',
                    success: function (data) {
                        toastr.success(data);
                        //document.getElementById("successModalText").innerHTML = data;
                        //$("#successModal").modal('show');
                        self.errors = ko.validation.group(self);
                        self.IsValid = ko.computed(function () {
                            if (self.errors().length == 0)
                                return true;
                            return false;
                        });
                        //window.location.href = "/Somity/Member/MemberSavings?memberId=" + self.MemberIdNo() + "&memberName="+self.Name();
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) { }
                });
            } else {
                self.errors.showAllMessages();
            }
        };

        self.Refresh = function () {
            window.location.href = "/Somity/Member/MemberSavings?memberId=" + self.MemberIdNo() + "&memberName=" + self.Name();
        };

        self.GoBack = function () {
            console.log("hitted ");
            window.location.href = "/Somity/Member/Index";
        };
    }

    var vm = new memberSavingDetails();
    vm.LoadInitial();
    ko.applyBindings(vm, document.getElementById("memberSavings"));
});