$(document).ready(function () {
   
    function OverTimeRule(data) {
        var self = this;
        self.DesignationId = ko.observable(data.DesignationId ? data.DesignationId : '');
        self.DesignationName = ko.observable(data.DesignationName ? data.DesignationName : '');
        self.IsIllegibleForOT = ko.observable(data.IsIllegibleForOT ? data.IsIllegibleForOT : false);
        self.RatePerHour = ko.observable(data.RatePerHour ? data.RatePerHour : '');
        self.IsLateAttendanceMonitored = ko.observable(data.IsLateAttendanceMonitored ? data.IsLateAttendanceMonitored : false);
        self.DayForLateAttendance = ko.observable(data.DayForLateAttendance ? data.DayForLateAttendance : '');
        self.IsLeaveEncashed = ko.observable(data.IsLeaveEncashed ? data.IsLeaveEncashed : false);
    };

    function SalaryConfiguarion() {
        var self = this;
        self.BasicConfig = ko.observableArray([]);
        self.SalaryConfigurationList = ko.observableArray([]);
        self.errors = ko.validation.group(self);
        self.LoadInitial = function () {
            //console.log("hello");
            $.getJSON("/HRM/OfficeOutTime/GetOverTimeRules/", null, function (data) {
                //self.SalaryConfigurationList(data);
                $.each(data, function (index, value) {
                    //console.log(value);
                    self.SalaryConfigurationList.push(new OverTimeRule(value));
                });
                
            });

        };

        self.getBasicConfiguration = function () {
            $.ajax({
                type: "GET",
                url: '/HRM/OfficeOutTime/GetBasicConfiguration',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.BasicConfig(data);
                    console.log(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
            //Ends Here
        };

        self.Submit = function () {
            if (self.errors().length == 0) {
                console.log(self.SalaryConfigurationList());
                //initial EmployeeId of BasicInfoDto,can't be initialized outside submit function

                $.ajax({
                    type: "POST",
                    url: "/HRM/OfficeOutTime/SaveOverTimeRule/",
                    data: ko.toJSON(self.SalaryConfigurationList()),
                    contentType: 'application/json',
                    success: function (data) {
                        toastr.success(data);
                        self.errors = ko.validation.group(self);
                        self.IsValid = ko.computed(function () {
                            if (self.errors().length == 0)
                                return true;
                            return false;
                        });
                       // window.location.href = "/Grade/GradeStepSalarySetup"
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) { }
                });
            } else {
                self.errors.showAllMessages();
            }
        };
    };

    var vm = new SalaryConfiguarion();
    vm.LoadInitial();
    vm.getBasicConfiguration();
    ko.applyBindings(vm, document.getElementById("salaryConfiguration"));
});