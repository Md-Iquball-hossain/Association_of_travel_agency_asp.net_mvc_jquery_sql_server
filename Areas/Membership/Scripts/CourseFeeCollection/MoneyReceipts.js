$(document).ready(function () {
    function MoneyReceiptVM() {
        var self = this;
        self.TraineeID = ko.observable(traineeid);
        self.PageData = ko.observableArray(pageData);
        self.FromDate = ko.observable(fromDate ? moment(fromDate, "DD/MM/YYYY") : moment());
        self.ToDate = ko.observable(toDate ? moment(toDate, "DD/MM/YYYY") : moment());
  
        self.FromDate.subscribe(function () {
            $('#fromDate').val(moment(self.FromDate()).format("DD/MM/YYYY"));
        });
        self.ToDate.subscribe(function () {
            $('#toDate').val(moment(self.ToDate()).format("DD/MM/YYYY"));
        });

        self.PrintMoneyReceipt = function (data) {
            
            if (data.Id > 0) {
                window.open('/Membership/FeeCollection/GetMoneyReceiptById?mtype=1&reportTypeId=PDF&receiptId=' + data.Id, '_blank');
            }
        }
    }

    var pavm = new MoneyReceiptVM();
    //pavm.TraineeID(pavm.queryString("TraineeId"));
    ko.applyBindings(pavm, document.getElementById("moneyReceipts"));
});