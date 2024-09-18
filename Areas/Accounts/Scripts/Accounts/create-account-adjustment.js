/// <reference path="../knockout-3.4.0.debug.js" />
/// <reference path="../jquery-2.1.4.js" />

$(document).ready(function () {

    function getVouchertypes() {
        return ['rcv', 'pmnt'];
    }

    function voucherDetail(data) {
        var self = this;

        self.entryType = ko.observable(data.entryType);
        self.TransactionNo = ko.observable(data.TransactionNo);
        self.vouchertype = ko.observable(data.vouchertype);
        self.VoucherDate = ko.observable(data.VoucherDate);

        self.accountHeadName = ko.observable(data.accountHeadName);
        self.AccountHeadCode = ko.observable(data.AccountHeadCode);

        self.Description = ko.observable(data.Description);
        self.Amount = ko.observable(data.Amount);
        self.Debit = ko.observable(0.00);
        self.Credit = ko.observable(0.00);

        self.isEntryTypeDr = ko.computed(function () {
            if (self.entryType() === 'dr') {
                self.Credit(self.Amount());
                return true;
            }
            return false;
        });
        self.isEntryTypeCr = ko.computed(function () {
            if (self.entryType() === 'cr') {
                self.Debit(self.Amount());
                return true;
            }
            return false;
        });


        self.PaymentType = ko.observable(1);
        self.AccTranType = ko.computed(function () {

            if (self.vouchertype() === 'rcv') {
                return 1;
            }
            return 2;
        });

        return self;
    }

    function receiveVoucherVM() {
        var self = this;
        self.VoucherType = ko.observable('rv');
        var currentDate = (new Date()).toISOString().split('T')[0];
        //
        self.vouchertypes = ko.observableArray(getVouchertypes());
        self.selectedvouchertype = ko.observable(self.vouchertypes()[0]);
        self.accountHeads = ko.observableArray([]);
        self.selectedAccountHeadCode = ko.observable(0.00); //self.accountHeads()[2].AccountHeadCode

        //voucher info
        self.VoucherNo = ko.observable('');
        self.VoucherDate = ko.observable(currentDate);
        self.Description = ko.observable('');
        self.Amount = ko.observable(0.00);

        self.VoucherDetails = ko.observableArray([]);


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

            for (var i = 0, len = self.accountHeads().length; i < len; i++) {
                if (self.accountHeads()[i].AccountHeadCode === code)

                    return self.accountHeads()[i].name;
            }
            return 'Cash';

        };

        self.addReceiveVaoucsers = function () {
            var tn = self.nextTN();

            var arr = self.VoucherDetails();
            if (self.selectedvouchertype() === 'rcv') {
                var voucher_drSide = new voucherDetail(
                {
                    TransactionNo: tn,
                    entryType: 'dr',
                    vouchertype: self.selectedvouchertype(),
                    Description: self.Description(),
                    AccountHeadCode: self.selectedAccountHeadCode(),
                    accountHeadName: self.getAccountHeadName(self.selectedAccountHeadCode()),
                    VoucherNo: self.VoucherNo(),
                    VoucherDate: self.VoucherDate(),
                    Amount: self.Amount()

                });
                arr.push(voucher_drSide);

                var voucher_crSide = new voucherDetail(
                {
                    TransactionNo: tn,
                    entryType: 'cr',
                    vouchertype: self.selectedvouchertype(),
                    Description: self.Description(),
                    AccountHeadCode: '1020101128', /*dr should be cash-in hand*/
                    accountHeadName: 'Cash', /*dr should be cash-in hand*/
                    VoucherNo: self.VoucherNo(),
                    VoucherDate: self.VoucherDate(),
                    Amount: self.Amount()

                });
                arr.push(voucher_crSide);
            } else {
                var voucher_drSide = new voucherDetail(
                {
                    TransactionNo: tn,
                    entryType: 'cr',
                    vouchertype: self.selectedvouchertype(),
                    Description: self.Description(),
                    AccountHeadCode: self.selectedAccountHeadCode(),
                    accountHeadName: self.getAccountHeadName(self.selectedAccountHeadCode()),
                    VoucherNo: self.VoucherNo(),
                    VoucherDate: self.VoucherDate(),
                    Amount: self.Amount()

                });
                arr.push(voucher_drSide);

                var voucher_crSide = new voucherDetail(
                {
                    TransactionNo: tn,
                    entryType: 'dr',
                    vouchertype: self.selectedvouchertype(),
                    Description: self.Description(),
                    AccountHeadCode: '1020101128', /*dr should be cash-in hand*/
                    accountHeadName: 'Cash', /*dr should be cash-in hand*/
                    VoucherNo: self.VoucherNo(),
                    VoucherDate: self.VoucherDate(),
                    Amount: self.Amount()

                });
                arr.push(voucher_crSide);
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

        self.getAccHeads = function getAccHeads(code) {
            $.ajax({
                type: "GET",
                url: '/Accounts/GetAccountHeadsByAccountGroupCode?accountGroupCode=' + code,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    //return data;
                    self.accountHeads(data);
                    if (code === 4) {
                        self.selectedvouchertype('rcv');
                    } else {
                        self.selectedvouchertype('pmnt');
                    }
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
        self.getAccHeadsForAssetExpenditure = function () {
            $.ajax({
                type: "GET",
                url: '/Accounts/GetAccHeadsForAssetExpenditure',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    //return data;
                    self.accountHeads(data);
                    self.selectedvouchertype('pmnt');
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }

        self.getCompanyProfile =
            function () {
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

            self.Description('');
            self.Amount(0);
        }
        self.clearAddedControls = function () {
            self.selectedAccountHeadCode('');
            self.Description('');
            self.Amount(0);
        }

    }

    var vm = new receiveVoucherVM();

    //vm.getAccHeads();
    //vm.getCompanyProfile();
    ko.applyBindings(vm, $('#accountDiv')[0]);


});

