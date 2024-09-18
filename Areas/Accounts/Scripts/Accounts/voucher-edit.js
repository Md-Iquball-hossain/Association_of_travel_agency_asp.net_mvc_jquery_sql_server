var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

$(document).ready(function () {
    ko.validation.init({
        errorElementClass: 'has-error',
        errorMessageClass: 'help-block',
        decorateInputElement: true
    });
    function getVouchertypes() {
        return ['pmnt', 'rcv', 'jrnl'];
    }
    function getPaytypes() {
        return ['cash', 'bank'];
    }
    function getTrantypes() {
        return ['dr', 'cr'];
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
        self.BankAccountHead = ko.observable(data.BankAccountHead);

        self.Description = ko.observable(data.Description);
        self.Amount = ko.observable(data.Amount);
        self.Debit = ko.observable(0.00);
        self.Credit = ko.observable(0.00);

        self.IsCheque = ko.observable(false);
        self.Banks = ko.observableArray([]);
        self.BankName = ko.observable(data.BankName);
        self.BranchName = ko.observable(data.BranchName);
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
                self.BranchName('');
                self.ChequeNo('');
                self.ChequeDate('');
                self.IsCheque(false);
                return 1;
            } else if (self.paytype() === 'bank') {
                if (self.ChequeNo().length > 0)
                    self.IsCheque(true);
                return 2;
            } else {
                self.BankName('');
                self.ChequeNo('');
                self.ChequeDate('');
                self.IsCheque(false);
                return 1;
            }

        });
        self.AccTranType = ko.observable(data.AccTranType);
        return self;
    }

    function receiveVoucherVM() {
        var self = this;
        var currentDate = (new Date()).toISOString().split('T')[0];

        self.Id = ko.observable();
        self.vouchertypes = ko.observableArray(getVouchertypes());
        self.selectedVouchertype = ko.observable(self.vouchertypes()[0]);
        self.VoucherType = ko.computed(function () {
            if (self.selectedVouchertype() == 'pmnt')
                return 2;
            else if (self.selectedVouchertype() == 'rcv')
                return 1;
            else
                return 3;
        });

        self.paytypes = ko.observableArray(getPaytypes());
        self.selectedPaytype = ko.observable(self.paytypes()[0]);

        self.trantypes = ko.observableArray(getTrantypes());
        self.selectedTrantype = ko.observable(self.trantypes()[0]);

        self.vouNo = ko.observable('');
        self.VoucherDate = ko.observable(currentDate);

        self.accountHeads = ko.observableArray([]);
        self.filteredAccHeads = ko.observableArray([]);
        self.selectedAccountHeadCode = ko.observable(0.00).extend({ required: true }); //self.accountHeads()[2].AccountHeadCode
        self.selectedBankAccountHeadCode = ko.observable(0).extend({ required: { onlyIf: function () { return (self.selectedPaytype() === "bank"); } } });

        //voucher info
        self.Description = ko.observable('');
        self.Amount = ko.observable(0.00).extend({ required: true });
        self.TotalDr = ko.observable(0.00);
        self.TotalCr = ko.observable(0.00);

        self.IsCash = ko.computed(
            function () {
                if (self.selectedPaytype() === 'cash')
                    return true; //cheque
                return false; //cash
            });

        // for cheque type
        self.BankId = ko.observable();
        self.Banks = ko.observableArray([]);
        self.BankName = ko.observable('');
        self.BranchName = ko.observable('');
        self.ChequeNo = ko.observable('');
        self.Branch = ko.observable('');
        self.ChequeDate = ko.observable(currentDate);
        self.IsBank = ko.computed(
            function () {
                if (self.selectedPaytype() === 'bank') {
                    return true;
                }
                return false;
            });
        self.IsNotJournal = ko.computed(function () {
            if (self.selectedVouchertype() === 'jrnl') {
                return false;
            }
            return true;
        });
        self.IsJournal = ko.computed(function () {
            if (self.selectedVouchertype() === 'jrnl') {
                self.selectedTrantype(self.trantypes()[0]);
                return true;
            }
            else if (self.selectedVouchertype() === 'pmnt')
                self.selectedTrantype(self.trantypes()[0]);
            else
                self.selectedTrantype(self.trantypes()[1]);
            return false;
        });
        self.getAccountHeadName = function (code) {
            for (var i = 0, len = self.accountHeads().length; i < len; i++) {
                if (self.accountHeads()[i].AccountHeadCode === code)
                    return self.accountHeads()[i].name;
            }
            return '';
        };

        self.VoucherNo = ko.observable('');
        
        self.getBanks = function () {
            return $.ajax({
                type: "GET",
                url: '/Accounts/Accounts/GetBankAccHeads',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.Banks(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }

        
        self.saveVoucher = function () {
            var debit = 0;
            var credit = 0;
            if (self.selectedTrantype() === 'dr') {
                debit = self.Amount();
            } else if (self.selectedTrantype() === 'cr') {
                credit = self.Amount();
            }
            console.log("modified date - " + self.selectedAccountHeadCode());
            var model = {
                Id: self.Id(),
                VoucherDate: self.VoucherDate(),
                SerialNo: 0,
                AccountHeadCode: self.selectedAccountHeadCode(),
                Description: self.Description(),
                Debit: debit,
                Credit: credit
            };
            $.ajax({
                type: "POST",
                url: '/Accounts/Accounts/SaveEditVoucher',
                data: ko.toJSON(model),
                contentType: "application/json",
                success: function (data) {
                    alert(data.Message);
                    window.location.href = "/Accounts/GenAccounts";
                },
                error: function () {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });

        };


        self.getAccHeads = function () {
            return $.ajax({
                type: "GET",
                url: '/Accounts/Accounts/GetConcatedAccHeads',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.accountHeads(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }

        self.getVoucherDetails = function () {
            var vId = getUrlParameter('vId');
            $.ajax({
                type: "GET",
                url: '/Accounts/Accounts/GetVoucherById?vId=' + vId,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.Id(data.Id);
                    self.VoucherNo(data.VoucherNo);
                    self.VoucherDate(data.VoucherDate);
                    self.Description(data.Description);
                    self.selectedAccountHeadCode(data.AccountHeadCode);
                    self.BankName(data.BankName);
                    self.ChequeNo(data.ChequeNo);
                    self.ChequeDate(data.ChequeDate);
                    if (data.Credit > 0) {
                        self.selectedTrantype('cr');
                        self.Amount(data.Credit);
                    } else if (data.Debit > 0) {
                        self.selectedTrantype('dr');
                        self.Amount(data.Debit);
                    }
                    if (data.AccTranType === 1) {
                        self.selectedVouchertype('rcv');
                    } else if (data.AccTranType === 2) {
                        self.selectedVouchertype('pmnt');
                    } else if (data.AccTranType === 3) {
                        self.selectedVouchertype('jrnl');
                    }
                    if (data.IsCheque) {
                        self.selectedPaytype('bank');
                        self.selectedBankAccountHeadCode(data.BankAccountHead);
                    }
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }

        self.errors = ko.validation.group(self);
        self.IsValid = ko.computed(function () {
            var err = self.errors().length;
            if (err == 0)
                return true;
            return false;
        });
        self.EnableHeader = ko.computed(function () {
            return true;
        });
        self.reset = function () {
            self.clearSavedControls();
            self.clearAddedControls();
        }
        self.clearSavedControls = function () {
            self.VoucherDetails([]);
            self.VoucherNo('');
            self.VoucherDate(currentDate);
            self.AccountHeadCode('');
            self.selectedAccountHeadCode(0);
            self.BankName('');
            self.ChequeNo('');
            self.ChequeDate(currentDate);
            self.Description('');
            self.Amount(0);
        }
        self.clearAddedControls = function () {
            self.selectedAccountHeadCode(0);
            self.BankName('');
            self.BranchName('');
            self.ChequeNo('');
            self.ChequeDate(currentDate);
            self.Description('');
            self.Amount(0);
        }
    }

    var vm = new receiveVoucherVM();

    $.when(vm.getAccHeads(), vm.getBanks()).done(function () {
        vm.getVoucherDetails();
    });
    ko.applyBindings(vm, $('#VoucherEdit')[0]);


});

