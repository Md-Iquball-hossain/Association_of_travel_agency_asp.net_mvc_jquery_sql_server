var leaveStatus = [{ 'Id': 0, 'Name': 'Draft' },
                    { 'Id': 1, 'Name': 'Applied' },
                    { 'Id': 2, 'Name': 'ApprovedByDept' },
                    { 'Id': 3, 'Name': 'ApprovedByHr' },
                    { 'Id': 4, 'Name': 'Halted' },
                    { 'Id': 5, 'Name': 'Rejected' },
                    { 'Id': 6, 'Name': 'Forward' }];
$(document).ready(function () {
    //function receiveDetail(data) {
    //    var self = this;
    //    //self.EmployeeName = ko.observable(data.EmployeeName ? data.EmployeeName : '');
    //    //self.OfficeUnitName = ko.observable(data.OfficeUnitName ? data.OfficeUnitName : '');
    //    //self.DesignationName = ko.observable(data.DesignationName ? data.DesignationName : '');
    //    //self.OfficeName = ko.observable(data.OfficeName ? data.OfficeName : '');
    //    //self.GradeName = ko.observable(data.GradeName ? data.GradeName : '');
    //    //self.unitTypeId = ko.observable(data.UnitType ? data.UnitType : '');
    //    //self.officeUnitId = ko.observable(data.OfficeUnitId ? data.OfficeUnitId : '');
    //    //self.officeLayerId = ko.observable(data.OfficeLayerId ? data.OfficeLayerId : '');
    //    //self.officeId = ko.observable(data.OfficeId ? data.OfficeId : '');
    //    //self.gradeId = ko.observable(data.GradeId ? data.GradeId : '');
    //    //self.designationId = ko.observable(data.DesignationId ? data.DesignationId : '');
    //    //self.genderId = ko.observable(data.GenderId ? data.GenderId : '');
    //   // self.Pick = ko.observable(false);
    //}
    function receiveVM() {
        var self = this;

        self.LeaveApplication = ko.observableArray([]);
        self.PickedLeaveApplication = ko.observableArray([]);
        self.LeaveTypes = ko.observableArray([]);
        self.SeniorList = ko.observableArray([]);
        self.LeaveStatus = ko.observableArray(leaveStatus);
        self.Id = ko.observable('');
        self.SeniorId = ko.observable('');
        self.EmployeeName = ko.observable('');
        self.From = ko.observable('');
        self.To = ko.observable('');
        self.TotalDays = ko.observable('');
        self.LeaveType = ko.observable('');
        self.Description = ko.observable('');
        self.CurrentLeaveStatus = ko.observable('');

        self.Substitutor = ko.observable('');
        self.Address = ko.observable('');
        self.Email = ko.observable('');
        self.Comments = ko.observable('');
        self.Pick = ko.observable(false);


        self.LoadInitial = function () {
            self.getAllLeaveApplication();
            self.getAllLeaveTypes();
            self.getSeniorList();
        };


        self.getAllLeaveApplication = function () {
            $.ajax({
                type: "GET",
                url: '/HRM/LeaveApplication/GetLeaveApplicationsForApproval?id=' + 1,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.LeaveApplication(data);
                    //console.log(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });

        }

        self.getAllLeaveTypes = function () {
            $.ajax({
                type: "GET",
                url: '/HRM/LeaveType/GetLeaveTypes',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.LeaveTypes(data);

                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });

        }
        self.getSeniorList = function () {
            $.ajax({
                type: "GET",
                url: '/HRM/LeaveApplication/GetSeniorsList',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    //console.log(data);
                    self.SeniorList(data);

                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });

        }

        self.dateDetails = ko.observableArray([]);

        self.leaveDetails = function (details) {
            self.dateDetails(details);
            //console.log(details);
            self.Id(details.Id);
            self.EmployeeName(details.EmployeeName);
            self.From(details.From);
            self.To(details.To);
            self.TotalDays(details.TotalDays);
            self.LeaveType(details.LeaveTypeId);
            self.Description(details.Description);
            self.CurrentLeaveStatus(details.CurrentLeaveStatus);
            self.SeniorId('');
            self.Substitutor(details.SubstitutorName);
            self.Address(details.Address);
            self.Email(details.Email);
            self.Comments(details.Comments);

        };

        self.Reset = function () {

            self.Pick(false);
        };

        self.Submit = function () {
            // console.log(" all "  + ko.toJSON(self.dateDetails())); Edit
            var postdata = {
                Id: self.Id(),
                SeniorId: self.SeniorId()
            };

            $.ajax({
                type: "POST",
                url: '/HRM/LeaveApplication/SaveLeaveSupervisor',
                data: ko.toJSON(postdata),
                contentType: "application/json",
                success: function (data) {
                    console.log(data);

                },
                error: function () {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        };

        self.Edit = function () {
            //console.log(self);
            //self.Id(details.Id);
            //self.EmployeeName(details.EmployeeName);
            //self.From(details.From);
            //self.To(details.To);
            //self.TotalDays(details.TotalDays);
            //self.LeaveType(details.LeaveTypeId);
            //self.Description(details.Description);
            //self.CurrentLeaveStatus(details.CurrentLeaveStatus);
            //self.SeniorId('');
            //self.Substitutor(details.SubstitutorName);
            //self.Address(details.Address);
            //self.Email(details.Email);
            //self.Comments(details.Comments);

            //self.Id = ko.observable('');
            //self.SeniorId = ko.observable('');
            //self.EmployeeName = ko.observable('');
            //self.From = ko.observable('');
            //self.To = ko.observable('');
            //self.TotalDays = ko.observable('');
            //self.LeaveType = ko.observable('');
            //self.Description = ko.observable('');
            //self.CurrentLeaveStatus = ko.observable('');

            //self.Substitutor = ko.observable('');
            //self.Address = ko.observable('');
            //self.Email = ko.observable('');
            //self.Comments = ko.observable('');
            var postdata = {
                Id: self.Id(),
                FromDate: self.From(),
                ToDate :self.To(),
                TotalDays:self.TotalDays(),      
                LeaveTypeId :self.LeaveType(),
                Description:self.Description(),
                SubstitutorId:self.Substitutor(),
                Address :self.Address(),
                Email :self.Email(),
                CurrentLeaveStatus: self.CurrentLeaveStatus(),
                Comments :self.Comments(),
                SeniorId: self.SeniorId()
            };
            console.log(postdata);
            $.ajax({
                type: "POST",
                url: '/HRM/LeaveApplication/SaveLeaveApplication',
                data: ko.toJSON(postdata),
                contentType: "application/json",
                success: function (data) {
                    console.log(data);

                },
                error: function () {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        };

        self.IsSave = function () {
            return true;
        };

    }

    var vm = new receiveVM();
    vm.LoadInitial();
    ko.applyBindings(vm, $("#receiveDiv")[0]);
});