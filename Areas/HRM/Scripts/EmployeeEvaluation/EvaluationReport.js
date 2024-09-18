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
    function Super(data) {
        var self = this;
        self.EvaluatorId = ko.observable(data.EvaluatorId?data.EvaluatorId:0);
        self.EvaluatorName = ko.observable(data.EvaluatorName?data.EvaluatorName:'');
        self.KPIMarks = ko.observable(data.KPIMarks?data.KPIMarks:0);

    };
   
    function EvaluationReport() {
        var self = this;
        self.EmpCode = ko.observable();
        self.EmployeeName = ko.observable();
        self.DesignationName = ko.observable();
        self.EvaluationYear = ko.observable();
        self.Evaluations = ko.observableArray([]);
        self.DesignationList = ko.observableArray([]);
        self.DesignationId = ko.observable();
        self.EmployeeList = ko.observableArray([]);
        self.EmployeeId = ko.observable();
        self.PeriodFrom = ko.observable();
        self.PeriodTo = ko.observable();
       
        self.GetDesignations = function () {
            $.getJSON("/HRM/Designation/GetDesign/", null, function (data) {
                self.DesignationList(data);
            });
        }
        self.DesignationId.subscribe(function () {
            $.getJSON("/HRM/Employee/GetBasicInfoByDesignation/?DesignationId=" + self.DesignationId(), null, function (data) {
                self.EmployeeList(data);
            });
        });

        self.PeriodTo.subscribe(function () {
            console.log("period from " + moment(self.PeriodFrom()).format('DD/MM/YYYY') + "\nperiod to " + self.PeriodTo() + "emp " + self.EmployeeId());
            $.getJSON("/HRM/Appraisal/GetEvaluationReport/?EmployeeId=" + self.EmployeeId() + "&PeriodFrom=" + moment(self.PeriodFrom()).format('DD/MM/YYYY') + "&PeriodTo=" + moment(self.PeriodTo()).format('DD/MM/YYYY'), null, function (data) {
                self.Evaluations.valueHasMutated();
                self.Evaluations([]);
                console.log("data " + data.EmpCode);
                if (data=== null) {
                    console.log("This employee evaluation is not completed");
                    toastr.success("This employee evaluation is not completed");
                }else {
                    console.log("This...");
                    self.Evaluations([]);
                    self.EmpCode(data.EmpCode);
                    self.EmployeeName(data.EmployeeName);
                    self.DesignationName(data.DesignationName);
                    self.EvaluationYear(data.EvaluationYear);
                    $.each(data.Evaluations, function (index, value) {
                        self.Evaluations.push(new Super(value));
                    });
                }
                
            });
        });
    };

    var vm = new EvaluationReport();
    vm.GetDesignations();
    ko.applyBindings(vm, document.getElementById("evaluationReport"));
});