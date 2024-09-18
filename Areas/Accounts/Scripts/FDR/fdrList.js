$(document).ready(function () {
    function BankReconsilationVM() {
        var self = this;

        self.PageData = ko.observableArray(pageData);
        self.PrintBankReconsilation = function (data) {
            
            console.log(ko.toJSON(data.Id));
            console.log(data.Id);
            //if (data.Id > 0) {
            //    window.open('/Accounts/Accounts/GetBankReconsilationReportById?reportTypeId=PDF&id=' + data.Id, '_blank');
            //}
        }
        self.Details = function (data) {
            var parameters = [{
                Name: 'Id',
                Value: data.Id
            }];
            var menuInfo = {
                //Id: 133,
                Menu: 'FDR Schedule',
                Url: '/Accounts/FDR/Create',
                Parameters: parameters
            }
            window.parent.AddTabFromExternal(menuInfo);
        }
    }

    var pavm = new BankReconsilationVM();
    ko.applyBindings(pavm, document.getElementById("FDRListDiv"));
});