$(document).ready(function () {
    function ActiveTraineeVM() {
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
                Menu: 'Trainee Information',
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
                Id: '154_' + data.Id,
                Menu: 'Trainee Fee Collection',
                Url: '/Membership/CourseFeeCollection/CourseFeeCollection',
                Parameters: parameters
            }
            window.parent.AddTabFromExternal(menuInfo);
        }

        self.PaymentHistory = function (data) {
            var parameters = [{
                Name: 'TraineeId',
                Value: data.Id
            }];
            var menuInfo = {
                Id: '155_' + data.Id,
                Menu: 'Payment History',
                Url: '/Membership/CourseFeeCollection/PaymentHistory',
                Parameters: parameters
            }
            window.parent.AddTabFromExternal(menuInfo);
        }
        self.MoneyReceipt = function (data) {
            var parameters = [{
                Name: 'TraineeId',
                Value: data.Id
            }];
            var menuInfo = {
                Id: '156_' + data.Id,
                Menu: 'Payment History',
                Url: '/Membership/CourseFeeCollection/MoneyReceipt',
                Parameters: parameters
            }
            window.parent.AddTabFromExternal(menuInfo);
        }

        self.PrintCertificate = function (data) {
            var parameters = [{
                Name: 'TraineeId',
                Value: data.Id
            }];
            var menuInfo = {
                Id: '157_' + data.Id,
                Menu: 'Print Certificate',
                Url: '/Membership/Students/CertificatePrint',
                Parameters: parameters
            }
            window.parent.AddTabFromExternal(menuInfo);
        }
    }

    var pavm = new ActiveTraineeVM();
    ko.applyBindings(pavm, document.getElementById("activeList"));
});