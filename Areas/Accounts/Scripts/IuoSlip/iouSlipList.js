$(document).ready(function () {
    function IUOSlipVM() {
        var self = this;

        self.PageData = ko.observableArray(pageData);
        self.PrintIuoSlip = function (data) {
            debugger;
            console.log(ko.toJSON(data.Id));
            console.log(data.Id);
            if (data.Id > 0) {
                window.open('/Accounts/IuoSlip/GetIuoSlipReportById?reportTypeId=PDF&id=' + data.Id, '_blank');
            }
        }
        self.Adjust = function (data) {
            var parameters = [{
                Name: 'IuoId',
                Value: data.Id
            }];
            var menuInfo = {
                Id: 93,
                Menu: 'IUO Slip Adjustment',
                Url: '/Accounts/IuoSlip/IuoSlipAdjustment',
                Parameters: parameters
            }
            window.parent.AddTabFromExternal(menuInfo);
        }
    }
    var pavm = new IUOSlipVM();
    ko.applyBindings(pavm, document.getElementById("IUOSlipList"));
});