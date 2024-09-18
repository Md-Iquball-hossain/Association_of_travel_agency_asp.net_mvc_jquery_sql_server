$(document).ready(function () {
    
    function CurrentlyOnLeave() {
        var self = this;
        self.EmployeeList = ko.observableArray([]);
        self.getLeaveEmpList = function () {
            return $.ajax({
                type: "GET",
                url: "/HRM/Employee/GetEmployeesCurrentlyOnLeave",
                dataType: "json",
                success: function (data) {
                    self.EmployeeList(data);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) { }
            });
        }
    }

    function LateEmployees() {
        var self = this;
        self.EmployeeList = ko.observableArray([]);
        self.getLateEmpList = function () {
            return $.ajax({
                type: "GET",
                url:"/HRM/OfficeOutTime/GetTodaysAttendance",
                dataType: "json",
                success: function (data) {
                    self.EmployeeList(data);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) { }
            });
        }
    }
    var LeaveEmpvm = new CurrentlyOnLeave();
    LeaveEmpvm.getLeaveEmpList();
    ko.applyBindings(LeaveEmpvm, document.getElementById('collapse2'));
    var LateEmpvm = new LateEmployees();
    LateEmpvm.getLateEmpList();
    ko.applyBindings(LateEmpvm, document.getElementById('collapse1'));
});
