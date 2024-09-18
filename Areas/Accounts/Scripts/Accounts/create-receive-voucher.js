/// <reference path="../knockout-3.4.0.debug.js" />
/// <reference path="../jquery-2.1.4.js" />

$(document).ready(function () {

    function getPaytypes() {
        return ['cash', 'cheque', 'other'];
    }

    function voucherDetail(data) {
        var self = this;

        self.entryType = ko.observable(data.entryType);
        self.TransactionNo = ko.observable(data.TransactionNo);
        self.paytype = ko.observable(data.paytype);
        self.VoucherNo = ko.observable(data.VoucherNo);
        self.VoucherDate = ko.observable(data.VoucherDate);

        self.accountHeadName = ko.observable(data.accountHeadName);
        self.AccountHeadCode = ko.observable(data.AccountHeadCode);

        self.Description = ko.observable(data.Description);
        self.Amount = ko.observable(data.Amount);
        self.Debit = ko.observable(0.00);
        self.Credit = ko.observable(0.00);

        self.IsCheque = ko.observable(false);
        self.BankName = ko.observable(data.BankName);
        self.ChequeNo = ko.observable(data.ChequeNo);
        self.ChequeDate = ko.observable(data.ChequeDate);
        self.isEntryTypeDr = ko.computed(function () {
            if (self.entryType() === 'dr') {
                self.Debit(self.Amount());
                return true;
            }
            return false;
        });
        self.isEntryTypeCr = ko.computed(function () {
            if (self.entryType() === 'cr') {
                self.Credit(self.Amount());
                return true;
            }
            return false;
        });


        self.PaymentType = ko.computed(function () {

            if (self.paytype() === 'cash') {
                self.BankName('');
                self.ChequeNo('');
                self.ChequeDate('');
                self.IsCheque(false);
                return 1;
            } else if (self.paytype() === 'cheque') {
                self.IsCheque(true);
                return 2;
            } else {
                self.BankName('');
                self.ChequeNo('');
                self.ChequeDate('');
                self.IsCheque(false);
                return 3;
            }

        });
        self.AccTranType = ko.computed(function () {

            if (self.paytype() === 'other') {
                return 3;
            }
            return 1;
        });

        return self;
    }

    function receiveVoucherVM() {
        var self = this;
        self.VoucherType = ko.observable('rv');
        var currentDate = (new Date()).toISOString().split('T')[0];
        //
        self.paytypes = ko.observableArray(getPaytypes());
        self.selectedPaytype = ko.observable(self.paytypes()[0]);
        self.accountHeads = ko.observableArray([]);
        self.selectedAccountHeadCode = ko.observable(0.00); //self.accountHeads()[2].AccountHeadCode

        //voucher info
        self.VoucherNo = ko.observable('');
        self.VoucherDate = ko.observable(currentDate);
        self.Description = ko.observable('');
        self.Amount = ko.observable(0.00);
        self.IsCash = ko.computed(
            function () {
                if (self.selectedPaytype() === 'cheque' || self.selectedPaytype() === 'cash')
                    return true; //cheque
                return false; //cash
            });
        self.VoucherDetails = ko.observableArray([]);

        // for cheque type
        self.BankAccHeads = ko.observableArray([]);
        self.selectedBankAccHeadCode = ko.observable(0.00);

        self.BankName = ko.observable('');
        self.ChequeNo = ko.observable('');
        self.ChequeDate = ko.observable(currentDate);
        self.IsCheque = ko.computed(
            function () {
                if (self.selectedPaytype() === 'cheque' || self.selectedPaytype() === 'other') {
                    //alert(true);
                    return true; //cheque
                }
                return false;
            });

        self.nextTN = function () {
            var arr = self.VoucherDetails();
            var max = 0;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].TransactionNo() >= max)
                    max = arr[i].TransactionNo();
            }
            return max + 1;
        };

        

        self.getAccountHeadName = function (code) {
            
            if (self.selectedPaytype() == 'cash') {
                for (var i = 0, len = self.accountHeads().length; i < len; i++) {
                    if (self.accountHeads()[i].AccountHeadCode === code)

                        return self.accountHeads()[i].name;
                }

                return 'Cash';
            }
            else {
                for (var i = 0, len = self.BankAccHeads().length; i < len; i++) {
                    if (self.BankAccHeads()[i].AccountHeadCode === code)
                        var name = self.BankAccHeads()[i].name;
                    if (name != null)
                        return name;
                }
                for (var i = 0, len = self.accountHeads().length; i < len; i++) {
                    if (self.accountHeads()[i].AccountHeadCode === code)

                        var name = self.accountHeads()[i].name;
                    if (name != null)
                        return name;
                }

                return 'Bank-Account';
            }
        };

        self.addReceiveVaoucsers = function () {
            var tn = self.nextTN();

            var arr = self.VoucherDetails();

            if (self.selectedPaytype() == 'other') {
                var voucher_crSide = new voucherDetail(
                {
                    TransactionNo: tn,
                    entryType: 'cr',
                    paytype: self.selectedPaytype(),
                    Description: self.Description(),
                    AccountHeadCode: self.selectedBankAccHeadCode(),
                    accountHeadName: self.getAccountHeadName(self.selectedBankAccHeadCode()),
                    VoucherNo: self.VoucherNo(),
                    VoucherDate: self.VoucherDate(),
                    Amount: self.Amount(),
                    BankName: self.BankName(),
                    ChequeNo: self.ChequeNo(),
                    ChequeDate: self.ChequeDate()
                });
                arr.push(voucher_crSide);
            } else {
                var voucher_crSide = new voucherDetail(
                {
                    TransactionNo: tn,
                    entryType: 'cr',
                    paytype: self.selectedPaytype(),
                    Description: self.Description(),
                    AccountHeadCode: self.selectedAccountHeadCode(),
                    accountHeadName: self.getAccountHeadName(self.selectedAccountHeadCode()),
                    VoucherNo: self.VoucherNo(),
                    VoucherDate: self.VoucherDate(),
                    Amount: self.Amount(),
                    BankName: self.BankName(),
                    ChequeNo: self.ChequeNo(),
                    ChequeDate: self.ChequeDate()
                });
                arr.push(voucher_crSide);
            }

            if (self.selectedPaytype() == 'cash' || self.selectedPaytype() == 'other') {
                var voucher_drSide = new voucherDetail(
                            {
                                TransactionNo: tn,
                                entryType: 'dr',
                                paytype: self.selectedPaytype(),
                                Description: self.Description(),
                                AccountHeadCode: '1020101128', /*dr should be cash-in hand*/
                                accountHeadName: 'Cash', /*dr should be cash-in hand*/
                                VoucherNo: self.VoucherNo(),
                                VoucherDate: self.VoucherDate(),
                                Amount: self.Amount(),
                                BankName: self.BankName(),
                                ChequeNo: self.ChequeNo(),
                                ChequeDate: self.ChequeDate()
                            });
                arr.push(voucher_drSide);
            }
            else {
                var voucher_drSideBank = new voucherDetail(
                            {
                                TransactionNo: tn,
                                entryType: 'dr',
                                paytype: self.selectedPaytype(),
                                Description: self.Description(),
                                AccountHeadCode: self.selectedBankAccHeadCode(),
                                accountHeadName: self.getAccountHeadName(self.selectedBankAccHeadCode()),
                                VoucherNo: self.VoucherNo(),
                                VoucherDate: self.VoucherDate(),
                                Amount: self.Amount(),
                                BankName: self.BankName(),
                                ChequeNo: self.ChequeNo(),
                                ChequeDate: self.ChequeDate()
                            });
                arr.push(voucher_drSideBank);
            }

            self.VoucherDetails(arr);

            self.clearAddedControls();
        };

        self.removeReceiveVaoucsers = function (voucherDetail) {
            var tn = voucherDetail.TransactionNo();
            var arr = self.VoucherDetails();
            var newArr = arr.filter(function (obj) {
                return obj.TransactionNo() !== tn;
            });
            self.VoucherDetails(newArr);
        };

        self.saveVoucher = function () {

            $.ajax({
                type: "POST",
                url: '/Accounts/SaveVoucher',
                data: ko.toJSON(this),
                contentType: "application/json",
                success: function (data) {
                    alert(data.Message);
                    self.clearSavedControls();
                },
                error: function () {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });

            //Ends Here
        };

        self.getAccHeads = function () {
            $.ajax({
                type: "GET",
                url: '/Accounts/GetAccountHeadsByAccountGroupCode?accountGroupCode=4',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    //return data;
                    self.accountHeads(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
        self.getAccBankHeads = function () {
            $.ajax({
                type: "GET",
                url: '/Accounts/GetAccountHeadsByAccountGroupCode?accountGroupCode=10202',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data1) {
                    //return data;
                    self.BankAccHeads(data1);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }

        self.getCompanyProfile = function () {
            $.ajax({
                type: "GET",
                url: '/CompanyProfile/GetCompanyProfile',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.VoucherDate(data.SystemDate);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }

        self.clearSavedControls = function () {
            self.VoucherDetails([]);
            self.VoucherNo('');
            self.VoucherDate(currentDate);
            self.AccountHeadCode('');
            self.BankName('');
            self.ChequeNo('');
            self.ChequeDate(currentDate);
            self.Description('');
            self.Amount(0);
        }
        self.clearAddedControls = function () {
            self.selectedAccountHeadCode('');
            self.selectedBankAccHeadCode('');
            self.BankName('');
            self.ChequeNo('');
            self.ChequeDate(currentDate);
            self.Description('');
            self.Amount(0);
        }

    }

    var vm = new receiveVoucherVM();

    vm.getAccHeads();
    vm.getAccBankHeads();
    //vm.getCompanyProfile();
    ko.applyBindings(vm, $('#accountDiv')[0]);


});

