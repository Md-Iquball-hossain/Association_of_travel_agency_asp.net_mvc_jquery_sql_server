$(document).ready(function () {
    //console.log("js loaded");
    function GradeSalary(data) {
        var self = this;
        self.Id = ko.observable(data.Id?data.Id:0);
        self.SalaryItemId = ko.observable(data.SalaryItemId?data.SalaryItemId:0);
        self.SalaryItemName = ko.observable(data.SalaryItemName?data.SalaryItemName:'');
        self.IsParcentOfBasic = ko.observable(data.IsParcentOfBasic);
        self.SalaryItemUnit = ko.observable(data.SalaryItemUnit?data.SalaryItemUnit:'');
        self.Amount = ko.observable(data.Amount?data.Amount:'');
        self.SalaryItemUnit.subscribe(function (newValue) {
            console.log("Hello "+newValue);
            if (self.IsParcentOfBasic()==true) {
                //self.Amount(newValue);
                var basic;
                console.log(vm.GradeStepSalaryList());
                for (var i in vm.GradeStepSalaryList()) {
                    if (vm.GradeStepSalaryList()[i].SalaryItemName() === "Basic") {
                        basic = vm.GradeStepSalaryList()[i].SalaryItemUnit();
                        break;
                    }
                }
                self.Amount(basic * (self.SalaryItemUnit() / 100));
            }else {
                self.Amount(newValue);
            }
        });
    };
    function GradeStepSalary() {
        var self = this;
        self.GradeId = ko.observable().extend({ required: true });
        self.GradeList = ko.observableArray([]);
        self.GradeStepId = ko.observable().extend({ required: true });
        self.GradeStepList = ko.observableArray([]);
        self.GradeStepSalaryList = ko.observableArray([]);
        self.errors = ko.validation.group(self);
        self.LoadInitial = function () {
            //console.log("hello");
            $.getJSON("/HRM/Grade/GetGrades/", null, function (data) {
                self.GradeList(data);
            });

        };
        self.GradeId.subscribe(function () {
            $.getJSON("/HRM/Grade/GetGradeStepByGrade/?gradeid="+self.GradeId(), null, function (data) {
                self.GradeStepList(data);
            });
        });
        self.GradeStepId.subscribe(function () { //DesignationList is populated with change of selectedGradeId    
            self.GradeStepSalaryList.removeAll();
            $.getJSON("/HRM/Grade/GetGradeStepSalaryDto/?gradeid=" + self.GradeId() + "&gradestepid=" + self.GradeStepId(), null, function (data) {
                $.each(data, function (index, value) { 
                    self.GradeStepSalaryList.push(new GradeSalary(value));
                });
            });
        });

        self.total =ko.pureComputed(function () {
            var total = 0;
            for (var p = 0; p < self.GradeStepSalaryList().length; ++p) {
                total += parseFloat(self.GradeStepSalaryList()[p].Amount());
                //console.log(total);
            }
            //console.log(total);
            return total;
        });
        self.Submit = function () {
            if (self.errors().length == 0) {
                //console.log(self.GradeStepSalaryList());
                //initial EmployeeId of BasicInfoDto,can't be initialized outside submit function

                $.ajax({
                    type: "POST",
                    url: "/HRM/Grade/SaveGradeStepSalarySetUp/?gradeid=" + self.GradeId() + "&gradestepid=" + self.GradeStepId(),

                    data: ko.toJSON(self.GradeStepSalaryList()),
                    contentType: 'application/json',
                    success: function (data) {
                        toastr.success(data);
                        self.errors = ko.validation.group(self);
                        self.IsValid = ko.computed(function () {
                            if (self.errors().length == 0)
                                return true;
                            return false;
                        });
                        window.location.href = "/HRM/Grade/GradeStepSalarySetup";
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) { }
                });
            } else {
                self.errors.showAllMessages();
            }
        };

        
    };

   
    var vm = new GradeStepSalary();
    vm.LoadInitial();
    ko.applyBindings(vm, document.getElementById("gradeStepSalary"));
});