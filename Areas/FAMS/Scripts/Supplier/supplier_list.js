$(document).ready(function () {
    function SuppliersVM() {
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
                Id: '134_'+ data.Id,
                Menu: 'Asset Information',
                Url: '/FAMS/Supplier/Create',
                Parameters: parameters
            }
            window.parent.AddTabFromExternal(menuInfo);
        }


    }

    var pavm = new SuppliersVM();
    ko.applyBindings(pavm, document.getElementById("activeList"));
});