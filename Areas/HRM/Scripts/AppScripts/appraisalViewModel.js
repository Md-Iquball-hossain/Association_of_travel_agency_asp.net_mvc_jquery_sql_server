$(document).ready(function () {
    ko.validation.init({
        errorElementClass: 'has-error',
        errorMessageClass: 'help-block',
        decorateInputElement: true,
        grouping: { deep: true, observable: true }
    });
    function AppraisalPerformance(){
        var self = this;
        self.AppraisalId = ko.observable();
        self.EmployeeId = ko.observable();
        self.EmployeeName = ko.observable();
        self.FiscalYear = ko.observable();
        self.OfficeUnitName = ko.observable();
        self.OfficeName = ko.observable();
        self.PeriodFrom = ko.observable();
        self.PeriodTo = ko.observable();
        self.KPIGroupList = ko.observableArray([]);
        self.errors = ko.validation.group(self);
        self.IsValid = ko.computed(function () {
            if (self.errors().length == 0)
                return true;
            return false;
        });
        self.GetAppraisalInterface = function (){
            return $.ajax({
                type: "GET",
                url: "/HRM/Appraisal/GetAppraisalPerformance/?empid=" + 1 + "&appraisalid=" + 3,
                dataType: "json",
                success: function (data) {
                    console.log("successfull " + data.EmployeeName);
                    //self.EmployeeId(data.EmployeeId);
                    self.EmployeeName(data.EmployeeName);
                    //console.log(self.EmployeeName());
                    self.FiscalYear(data.FiscalYear);
                    self.OfficeUnitName(data.OfficeUnitName);
                    self.OfficeName(data.OfficeName);
                    self.PeriodFrom(data.PeriodFrom);
                    self.PeriodTo(data.PeriodTo);
                    self.KPIGroupList(data.KPIGroupList);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) { }
            });
        };
        //self.disableevaluator1 = ko.computed(function (data, event, target) {
        //    console.log(" target" + target);
        //    return (document.getelementbyid(target).value.length == 0);
        //});
        
    }

    var AppraisalPerformancevm = new AppraisalPerformance();
    AppraisalPerformancevm.GetAppraisalInterface();
    ko.applyBindings(AppraisalPerformancevm);

});