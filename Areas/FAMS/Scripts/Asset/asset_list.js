$(document).ready(function () {
    function ActiveTraineeVM() {
        var self = this;

        self.PageData = ko.observableArray(pageData);
        self.FromDate = ko.observable(fromDate ? moment(fromDate,"DD/MM/YYYY") : moment());
        self.ToDate = ko.observable(toDate ? moment(toDate, "DD/MM/YYYY") : moment());
        self.Categories = ko.observableArray(categories);
        self.Category = ko.observable(category);
        
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
                Id: '133_'+ data.Id,
                Menu: 'Asset Information',
                Url: '/FAMS/Assets/Index',
                Parameters: parameters
            }
            window.parent.AddTabFromExternal(menuInfo);
        }
        
        
    }

    var pavm = new ActiveTraineeVM();
    ko.applyBindings(pavm, document.getElementById("activeList"));
});