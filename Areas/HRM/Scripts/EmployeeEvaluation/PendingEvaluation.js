$(document).ready(function () {

    function pendingEvaluation() {
        var self = this;
        self.EmployeeId = ko.observable();
        self.EmployeeName = ko.observable();
        self.DesignationName = ko.observable();
        self.EvaluationYear = ko.observable();
        self.EvaluationStatus = ko.observable();
        self.EvaluationStatusName = ko.observable();
        self.LastEvaluatedBy = ko.observable();
        self.Remarks = ko.observable();
        self.Recommendation = ko.observable();
        self.PendingList = ko.observableArray([]);
        self.getPendingDetails = function (details){
            console.log(details);
            if (details.EvaluationStatusName == 'Submitted') {
                window.location.href = "/HRM/Appraisal/SuperVisor1Evaluation?employeeId=" + details.EmployeeId + "&evaluationYear=" + details.EvaluationYear;
            } else {
                window.location.href = "/HRM/Appraisal/SuperVisor2Evaluation?employeeId=" + details.EmployeeId + "&evaluationYear=" + details.EvaluationYear;
            }
            
        };
        self.GetList = function () {
            $.getJSON("/HRM/Appraisal/GetPendingEvaluationList/", null, function (data) {
                self.PendingList(data);
            });
        };
    };

    var vm = new pendingEvaluation();
    vm.GetList();
    ko.applyBindings(vm, document.getElementById("pendingEvaluation"));
});