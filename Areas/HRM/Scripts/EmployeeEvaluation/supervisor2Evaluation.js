$(document).ready(function () {
    ko.validation.init({
        errorElementClass: 'has-error',
        errorMessageClass: 'help-block',
        decorateInputElement: true,
        grouping: { deep: true, observable: true }
    });
    function parseJsonDate(jsonDateString) {                                        //this function parses jsonDate to DateTime format and returns 
        return new Date(parseInt(jsonDateString.replace('/Date(', '')));            //Date value
    }
    function KPI(data) {
        var self = this;
        self.Id = ko.observable(data.Id ? data.Id : 0);
        self.Name = ko.observable(data.Name ? data.Name : '');
        self.PerformanceAppraisalId = ko.observable(data.PerformanceAppraisalId ? data.PerformanceAppraisalId : 0);
        self.KPIMarks = ko.observable(data.KPIMarks ? data.KPIMarks : 0);
        self.KPIMarksEvaluator1 = ko.observable(data.KPIMarksEvaluator1 ? data.KPIMarksEvaluator1 : 0);
        self.KPIMarksEvaluator2 = ko.observable(data.KPIMarksEvaluator2 ? data.KPIMarksEvaluator2 : 0).extend({ required: true, min: 0, max: 10 });
        self.errors = ko.validation.group(self);
    };
    function KPIGroup(data) {
        var self = this;
        self.Id = ko.observable(data.Id ? data.Id : 0);
        self.Name = ko.observable(data.Name ? data.Name : '');
        self.KPIList = ko.observableArray([]);
        $.each(data.KPIList, function (index, value) {
            //console.log(value);
            self.KPIList.push(new KPI(value));
        });

        
    };
    function superTwoEvaluation() {
        var self = this;
        self.errors = ko.validation.group(self);
        self.EmployeeId = ko.observable();
        self.EmployeeName = ko.observable();
        self.DesignationId = ko.observable();
        self.DesignationName = ko.observable();
        self.JoiningDate = ko.observable();
        self.PeriodFrom = ko.observable();
        self.PeriodTo = ko.observable();
        self.SeniorList = ko.observableArray([]);
        self.SeniorId = ko.observable();
        self.Remarks = ko.observable();
        self.Recommendation = ko.observable();
        self.Pick = ko.observable(false);
        self.KPIGroupList = ko.observableArray([]);
        self.LoadInitial = function () {
            $.getJSON("/HRM/Appraisal/GetSupervisor2Evaluation/?empid=" + empid + "&evaluationYear=" + evaluationyear, null, function (data) {
                console.log("emp " + empid + "evaluationyear " + evaluationyear);
                self.EmployeeId(data.EmployeeId);
                self.EmployeeName(data.EmployeeName);
                self.DesignationId(data.DesignationId);
                self.DesignationName(data.DesignationName);
                self.JoiningDate(parseJsonDate(data.JoiningDate));
                self.PeriodFrom(parseJsonDate(data.PeriodFrom));
                self.PeriodTo(parseJsonDate(data.PeriodTo));
                $.each(data.KPIGroupList, function (index, value) {
                    //console.log(value);
                    self.KPIGroupList.push(new KPIGroup(value));
                });
            });
            $.getJSON("/HRM/Appraisal/GetSeniorsList/", null, function (data) {
                self.SeniorList(data);
            });
        };
        self.getPendingList = function () {
            console.log("helloooo");
            window.location.href = "/HRM/Appraisal/PendingEvaluationList";
        };
        self.Submit = function () {
            if (self.errors().length == 0) {

                $.ajax({
                    type: "POST",
                    url: "/HRM/Appraisal/SubmitSupervisorTwoEvaluation/",

                    data: ko.toJSON(self),
                    contentType: 'application/json',
                    success: function (data) {
                        toastr.success(data);
                        self.errors = ko.validation.group(self);
                        self.IsValid = ko.computed(function () {
                            if (self.errors().length == 0)
                                return true;
                            return false;
                        });
                        //window.location.href = "/Grade/GradeStepSalarySetup";
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) { }
                });
            } else {
                self.errors.showAllMessages();
            }
        };
    };

    var vm = new superTwoEvaluation();
    vm.LoadInitial();
    ko.applyBindings(vm, document.getElementById("supervisorTwoEvaluation"));
});