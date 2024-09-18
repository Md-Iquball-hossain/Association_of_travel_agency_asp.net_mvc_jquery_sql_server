$(document).ready(function () {
    ko.validation.init({
        errorElementClass: 'has-error',
        errorMessageClass: 'help-block',
        decorateInputElement: true,
        grouping: { deep: true, observable: true }
    });
    function EvaluationWeightSetup() {
        var self = this;
        self.errors = ko.validation.group(self);
        self.SelfWeight = ko.observable(0).extend({ required: true, min: 0, max: 100 });
        self.Supervisor1Weight = ko.observable(0).extend({ required: true, min: 0, max: 100 });
        self.Supervisor2Weight = ko.observable(0).extend({ required: true, min: 0, max: 100 });
        self.GetEvaluationWeightSetup = function () {
            $.getJSON("/HRM/Appraisal/GetEvaluationWeightSetup/", null, function (data) {
                console.log(data);
                self.SelfWeight(data.SelfWeight ? data.SelfWeight : 0);
                self.Supervisor1Weight(data.Supervisor1Weight ? data.Supervisor1Weight : 0);
                self.Supervisor2Weight(data.Supervisor2Weight ? data.Supervisor2Weight : 0);
            });
        };
        
        self.TotalWeight = ko.pureComputed(function () {
            var total = 0;
            console.log("SelfWeight " + self.SelfWeight());
            console.log("Supervisor1Weight " + self.Supervisor1Weight());
            console.log("Supervisor2Weight " + self.Supervisor2Weight());

            total +=parseInt(self.SelfWeight())+parseInt(self.Supervisor1Weight())+parseInt(self.Supervisor2Weight());
            console.log("total " + total);
            return total;
        });
        ko.validation.rules['mustEqual'] = {
            getValue: function (o) {
                return (typeof o === 'function' ? o() : o);
            },
            validator: function (val, otherVal) {
                return val == this.getValue(otherVal);
                //console.log("val " + val + "Otherval " + otherVal);
            },
            message: 'The total value must equal 100'
        };
        ko.validation.registerExtenders();
        self.TotalWeight.extend({ mustEqual: 100 });

        self.Submit = function () {
            if (self.errors().length == 0) {

                $.ajax({
                    type: "POST",
                    url: "/HRM/Appraisal/SaveEvaluationWeightSetup/",

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
    }

    var vm = new EvaluationWeightSetup();
    vm.GetEvaluationWeightSetup();
    ko.applyBindings(vm, document.getElementById("evaluationWeight"));
});