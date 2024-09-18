$(document).ready(function () {
    function PendingApplicationVM() {
        var self = this;
         self.Visibility = ko.observable(false);
        self.PageData = ko.observableArray(pageData);
        self.FromDate = ko.observable(fromDate ? moment(fromDate,"DD/MM/YYYY") : moment());
        self.ToDate = ko.observable(toDate ? moment(toDate, "DD/MM/YYYY") : moment());
        self.Courses = ko.observableArray(courses);
        self.Course = ko.observable(course);
        
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
                Id: '153_' + data.Id,
                Menu: 'Trainee Application',
                Url: '/Membership/Students/Entry',
                Parameters: parameters
            }
            window.parent.AddTabFromExternal(menuInfo);
        }

        self.FeeCollection = function (data) {
            var parameters = [{
                Name: 'Id',
                Value: data.Id
            }];
            var menuInfo = {
                Id: '254_' + data.Id,
                Menu: 'Trainee Fee Collection',
                Url: '/Membership/CourseFeeCollection/CourseFeeCollection',
                Parameters: parameters
            }
            window.parent.AddTabFromExternal(menuInfo);
        }

        self.getApplicationReport = function (data) {
            window.open('/Membership/Students/TraineeApplictionReport?traineeid='+ data.Id +'&reportTypeId=PDF', '_blank');

        }
        
    }

    var pavm = new PendingApplicationVM();
    ko.applyBindings(pavm, document.getElementById("pendingApplicationList"));
});