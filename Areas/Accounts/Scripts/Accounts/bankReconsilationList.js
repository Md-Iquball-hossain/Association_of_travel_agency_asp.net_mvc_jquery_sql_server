$(document).ready(function () {
    function BankReconsilationVM() {
        var self = this;

        self.PageData = ko.observableArray(pageData);
        self.PrintBankReconsilation = function (data) {
            
            console.log(ko.toJSON(data.Id));
            console.log(data.Id);
            if (data.Id > 0) {
                window.open('/Accounts/Accounts/GetBankReconsilationReportById?reportTypeId=PDF&id=' + data.Id, '_blank');
            }
        }

    }

    var pavm = new BankReconsilationVM();
    ko.applyBindings(pavm, document.getElementById("BankReconsilationDiv"));
});