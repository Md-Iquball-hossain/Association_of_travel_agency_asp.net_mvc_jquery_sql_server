var bloodTypes = [{ 'Id': 1, 'Name': 'O_Positive' },
                { 'Id': 2, 'Name': 'O_Negative' },
                { 'Id': 3, 'Name': 'A_Positive' },
                { 'Id': 4, 'Name': 'A_Negative' },
                { 'Id': 5, 'Name': 'AB_Positive' },
                { 'Id': 6, 'Name': 'AB_Negetivee' },
                { 'Id': 7, 'Name': 'B_Positive' },
                { 'Id': 8, 'Name': 'B_Negative' }

];
$(document).ready(function () {
    function historyVM() {
        var self = this;

        self.FromDate = ko.observable();
        self.ToDate = ko.observable();

        self.trainingId = ko.observable();
        self.TrainingList = ko.observableArray([]);

        self.educationId = ko.observable();
        self.OfficeId = ko.observable();
        self.OfficeList = ko.observableArray([]);
        self.EducationList = ko.observableArray([]);

        self.BloodId = ko.observable();
        self.BloodList = ko.observableArray(bloodTypes);
        //self.ToAmount = ko.observable(); FromDate
        self.Employees = ko.observableArray([]);
        self.Link1 = ko.observable();
        self.Link2 = ko.observable();
        self.Link3 = ko.observable();

        self.Title1 = ko.observable('PDF');
        self.Title2 = ko.observable('Excel');
        self.Title3 = ko.observable('Word');

        self.pageReload = function () {
            window.location.href = "/HRM/Employee/EmployeeJobHistoryOfficeWise";
        };
        self.getAllTrainings = function () {
          return  $.ajax({
                type: "GET",
                url: '/HRM/Employee/GetAllTrainings',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.TrainingList(data);
                    console.log(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
            //Ends Here
        };

        self.getAllEducations = function () {
           return $.ajax({
                type: "GET",
                url: '/HRM/Employee/GetAllEducations',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.EducationList(data);
                    console.log(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
            //Ends Here
        };
        self.getAllChildOffices = function () {
          return  $.ajax({
                type: "GET",
                url: '/HRM/Employee/GetEmployeeChildOffices',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.OfficeList(data);
                    //console.log(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
            //Ends Here
        };
        self.Search = function () {
          return  $.ajax({
                type: "GET",
                url: '/HRM/Employee/GetBasicWiseEmployee?trainId=' + self.trainingId() + '&educationId=' + self.educationId() + '&bloodId=' + self.BloodId() + '&fromDate=' + self.FromDate() + '&toDate=' + self.ToDate(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    self.Employees(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }

        //self.getAllEmployees = function () {
        //    $.ajax({
        //        type: "GET",
        //        url: '/Employee/GetAllActiveEmployees',
        //        contentType: "application/json; charset=utf-8",
        //        dataType: "json",
        //        success: function (data) {
        //            self.EmployeeList(data);
        //            console.log(data);
        //        },
        //        error: function (error) {
        //            alert(error.status + "<--and--> " + error.statusText);
        //        }
        //    });
        //    //Ends Here
        //};

        self.LoadInitial = function () {
            self.getAllTrainings();
            self.getAllEducations();
            self.getAllChildOffices();
        };

        self.Reset = function () {
            self.DateDetails('');

        };
        self.IsSave = function () {
            return true;
        };
        self.setUrl = ko.computed(function () {
            self.Link1('/HRM/Employee/GetBasicInfoWiseEmp?reportTypeId=PDF&trainId=' + self.trainingId() + '&educationId=' + self.educationId() + '&bloodId=' + self.BloodId() + '&fromDate=' + self.FromDate() + '&toDate=' + self.ToDate());
            self.Link2('/HRM/Employee/GetBasicInfoWiseEmp?reportTypeId=Excel&trainId=' + self.trainingId() + '&educationId=' + self.educationId() + '&bloodId=' + self.BloodId() + '&fromDate=' + self.FromDate() + '&toDate=' + self.ToDate());
            self.Link3('/HRM/Employee/GetBasicInfoWiseEmp?reportTypeId=Word&trainId=' + self.trainingId() + '&educationId=' + self.educationId() + '&bloodId=' + self.BloodId() + '&fromDate=' + self.FromDate() + '&toDate=' + self.ToDate());
        });
    };


    var vm = new historyVM();
    vm.LoadInitial();
    ko.applyBindings(vm, $("#historyDiv")[0]);
});