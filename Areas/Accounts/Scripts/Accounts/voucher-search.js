$(document).ready(function () {
    ko.validation.init({
        errorElementClass: 'has-error',
        errorMessageClass: 'help-block',
        decorateInputElement: true
    });
    function getVouchertypes() {
        return ['pmnt', 'rcv', 'jrnl', 'contr'];
    }
    function getPaytypes() {
        return ['cash', 'bank'];
    }
    function getTrantypes() {
        return ['dr', 'cr'];
    }
    function Voucher(data) {
        var self = this;
        self.Id = ko.observable(data.Id);
        self.VoucherNo = ko.observable(data.VoucherNo);
        self.AccountHeadCodeName = ko.observable(data.AccountHeadCodeName);
        self.Description = ko.observable(data.Description);
        self.VoucherDate = ko.observable(moment(data.VoucherDate).format('DD/MMM/YYYY'));
        self.Debit = ko.observable(data.Debit);
        self.Credit = ko.observable(data.Credit);

    }
    function receiveVoucherVM() {
        var self = this;
        var currentDate = (new Date()).toISOString().split('T')[0];

        self.CompanyProfileId = ko.observable();

        if (userCompanyId != null && userCompanyId > 0) {
            self.CompanyProfileId(userCompanyId);
        }

        self.vouchertypes = ko.observableArray(getVouchertypes());
        self.selectedVouchertype = ko.observable();
        self.VoucherType = ko.computed(function () {
            if (self.selectedVouchertype() == 'pmnt')
                return 2;
            else if (self.selectedVouchertype() == 'rcv')
                return 1;
            else if (self.selectedVouchertype() == 'contr')
                return 4;
            else
                return 3;
        });

        //ko.observable();

        self.paytypes = ko.observableArray(getPaytypes());
        self.selectedPaytype = ko.observable();

        self.trantypes = ko.observableArray(getTrantypes());
        self.selectedTrantype = ko.observable();

        self.vouNo = ko.observable('');
        self.VoucherDateFrom = ko.observable(currentDate);
        self.VoucherDateTo = ko.observable(currentDate);

        self.selectedAccountHeadCode = ko.observable(0.00).extend({ required: true }); //self.accountHeads()[2].AccountHeadCode
        self.selectedBankAccountHeadCode = ko.observable('');

        //voucher info
        self.Description = ko.observable('');
        self.Amount = ko.observable(0.00).extend({ required: true });
        self.TotalDr = ko.observable(0.00);
        self.TotalCr = ko.observable(0.00);

        self.CompanyList = ko.observableArray(Companies);
        self.CompanyProfileId = ko.observable(userCompanyId);

        self.IsCash = ko.computed(
            function () {
                if (self.selectedPaytype() === 'cash')
                    return true; //cheque
                return false; //cash
            });
        self.Vouchers = ko.observableArray([]);

        self.EditableVoucher = ko.observable();

        // for cheque type
        self.BankId = ko.observable();
        self.Banks = ko.observableArray([]);
        self.BankName = ko.observable('');
        self.BranchName = ko.observable('');
        self.ChequeNo = ko.observable('');
        self.Branch = ko.observable('');
        self.ChequeDate = ko.observable(currentDate);

        self.getVoucherDetails = function (item, event) {
            var vId = $(event.target).prev().val();
            window.location.href = "/Accounts/Accounts/VoucherEdit?vId=" + vId;
        }

        self.IsBank = ko.computed(
            function () {
                if (self.selectedPaytype() === 'bank') {
                    return true;
                }
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
            $.ajax({
                type: "GET",
                url: '/Accounts/Accounts/GetBankAccHeads?companyProfileId=' + self.CompanyProfileId(),
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

        self.AddVouchers = function (data) {

            console.log(data);
            //console.log(ko.tojson(data));
            $.each(data, function (index, value) {
                var arr = self.Vouchers();
                var newVoucher = Voucher(value);
                arr.push(newVoucher);
                self.Vouchers(arr);
            })
            console.log(self.Vouchers().length);
        }

        self.searchVoucher = function () {
            $.ajax({
                type: "GET",
                url: '/Accounts/Accounts/SearchVoucher?accTranType=' + self.selectedVouchertype() + '&payType=' + self.selectedPaytype()
                    + '&bankAccHeadCode=' + self.selectedBankAccountHeadCode() + '&dateFrom=' + self.VoucherDateFrom()
                    + '&dateTo=' + self.VoucherDateTo() + '&tranType=' + self.selectedTrantype() + '&voucherNo=' + self.VoucherNo()
                    + '&officeId=' + self.CompanyProfileId(),
                //data: ko.toJSON(this),
                contentType: "application/json",
                success: function (data) {
                    self.Vouchers([]);
                    //console.log(data);
                    self.AddVouchers(data);
                },
                error: function () {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });

            //Ends Here
        };
        self.getDetails = function (item, event) {
            var voucherNo = $(event.target).prev().val();
            window.open('/Accounts/Accounts/GetVoucherPrintByVoucherNo?reportTypeId=PDF&voucherNo=' + voucherNo + '&companyProfileId=' + self.CompanyProfileId());
        }

        self.PrintResult = function (item, event) {
            window.open('/Accounts/Accounts/GetVoucherList?reportTypeId=PDF&accTranType=' + self.selectedVouchertype() + '&payType=' + self.selectedPaytype()
                    + '&bankAccHeadCode=' + self.selectedBankAccountHeadCode() + '&dateFrom=' + self.VoucherDateFrom()
                    + '&dateTo=' + self.VoucherDateTo() + '&tranType=' + self.selectedTrantype() + '&voucherNo=' + self.VoucherNo()
                    + '&officeId=' + self.CompanyProfileId());
        }
        self.errors = ko.validation.group(self);
        self.IsValid = ko.computed(function () {
            var err = self.errors().length;
            //console.log(err);
            if (err == 0)//&& self.VoucherNo().length > 0
                return true;
            return false;
        });

        self.editLink = ko.observable();
        self.editTitle = ko.observable('Edit');

        self.setUrl = ko.computed(function () {
            var vn = self.VoucherNo() ? self.VoucherNo() : '';
        });


    }

    var voucherSearchVm = new receiveVoucherVM();

    voucherSearchVm.setUrl();
    voucherSearchVm.getBanks();
    ko.applyBindings(voucherSearchVm, $('#voucherSearch')[0]);


});

