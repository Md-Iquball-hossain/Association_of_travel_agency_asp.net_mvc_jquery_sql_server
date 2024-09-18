$(document).ready(function () {
    function ApprovedMemberListVM() {
        var self = this;

        self.PageData = ko.observableArray(pageData);
        self.FromDate = ko.observable(fromDate ? moment(fromDate, "DD/MM/YYYY") : moment());
        self.ToDate = ko.observable(toDate ? moment(toDate, "DD/MM/YYYY") : moment());
        self.FromDate.subscribe(function () {
            $('#fromDate').val(moment(self.FromDate()).format("DD/MM/YYYY"));
        });
        self.ToDate.subscribe(function () {
            $('#toDate').val(moment(self.ToDate()).format("DD/MM/YYYY"));
        });

        self.Details = function (data) {
            var parameters = [{
                Name: 'Id',
                Value: data.Id
            }];
            var menuInfo = {
                Id: '136_' + data.Id,
                Menu: 'Budget Create',
                Url: '/Accounts/Budget/BudgetCreate',
                Parameters: parameters
            }
            window.parent.AddTabFromExternal(menuInfo);
        }
        self.Print = function (data) {
            window.open("/Accounts/Budget/BudgetReport?Id=" + data.Id + "&reportTypeId=PDF", "_blank");
        }

    }

    var pavm = new ApprovedMemberListVM();
    ko.applyBindings(pavm, document.getElementById("ApprovedMemberList"));
});