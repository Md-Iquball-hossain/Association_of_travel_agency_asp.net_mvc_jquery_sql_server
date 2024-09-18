$(document).ready(function () {
    function MoneyReceiptVM() {
        var self = this;
      //  self.MemberId = ko.observable(memberId);
        self.PageData = ko.observableArray(pageData);
        self.FromDate = ko.observable(fromDate ? moment(fromDate, "DD/MM/YYYY") : moment());
        self.ToDate = ko.observable(toDate ? moment(toDate, "DD/MM/YYYY") : moment());
        //self.SearchString = ko.observable(searchString);
  
        self.FromDate.subscribe(function () {
            $('#fromDate').val(moment(self.FromDate()).format("DD/MM/YYYY"));
        });
        self.ToDate.subscribe(function () {
            $('#toDate').val(moment(self.ToDate()).format("DD/MM/YYYY"));
        });

        self.PrintMoneyReceipt = function (data) {
            console.log('Data:' + ko.toJSON(data));
            if (data.Id > 0) {
                window.open('/Membership/FeeCollection/GetMoneyReceiptById?reportTypeId=PDF&receiptId=' + data.Id + '&mtype=' + (data.MRType=='Member'?2:1), '_blank'); //Commented by Maruf
                //window.open('/Membership/FeeCollection/GetMoneyReceiptById?reportTypeId=PDF&receiptId=' + data.Id + '&mtype=1', '_blank'); //Code by Maruf
            }
        }
        self.PrintVoucher = function (data) {

            if (data.Id > 0) {
                window.open('/Accounts/Accounts/GetVoucherPrintByVoucherNo?reportTypeId=PDF&voucherNo=' + data.VoucherNo + '&companyProfileId=1');
               // window.open('/Membership/FeeCollection/GetMoneyReceiptById?reportTypeId=PDF&receiptId=' + data.Id, '_blank');
            }
        }
    }

    var pavm = new MoneyReceiptVM();
    //pavm.TraineeID(pavm.queryString("TraineeId"));
    ko.applyBindings(pavm, document.getElementById("moneyReceipts"));
});




