$(document).ready(function () {
    ko.validation.init({
        errorElementClass: 'has-error',
        errorMessageClass: 'help-block',
        decorateInputElement: true,
        grouping: { deep: true, observable: true }
    });
    
    function KPI(data) {
        var self = this;
        self.Id = ko.observable(data.Id?data.Id:0);
        self.Name = ko.observable(data.Name ? data.Name : '');
        self.IsKPISelected = ko.observable(data.IsKPISelected);
        self.KpiWeight = ko.observable(data.KpiWeight ? data.KpiWeight : 0).extend({ required: true, min: 0, max: 100 });;
    };

    function KPIGroup(data) {
        var self = this;
        self.Id = ko.observable(data.Id?data.Id:0);
        self.IsGroupSelected = ko.observable(data.IsGroupSelected);
        self.KPIGroupWeight = ko.observable(data.KPIGroupWeight ? data.KPIGroupWeight : 0).extend({ required: true, min: 0, max: 100 });;
        self.Name = ko.observable(data.Name ? data.Name : '');
        console.log("grp "+data.Name);
        self.KPIList = ko.observableArray([]);
        $.each(data.KPIList, function (index, value) {
            //console.log(value);
            self.KPIList.push(new KPI(value));
        });
        self.KPITotal = ko.computed(function () {
            var total = 0;
            for (var i = 0; i < self.KPIList().length; i++) {
                total += parseInt(self.KPIList()[i].KpiWeight());
            }
            console.log("kpi total "+total);
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
            message: 'The field must equal 100'
        };
        ko.validation.registerExtenders();
        self.KPITotal.extend({ mustEqual: 100 });
    };

    function parseJsonDate(jsonDateString) {                                        //this function parses jsonDate to DateTime format and returns 
        return new Date(parseInt(jsonDateString.replace('/Date(', '')));            //Date value
    }
    function PerformanceAppraisal() {
         var self = this;
        self.DesignationId = ko.observable();
        self.DesignationList = ko.observableArray([]);
        self.PeriodFrom = ko.observable();
        self.PeriodTo = ko.observable();
        self.KPIGroupList = ko.observableArray([]);
        self.errors = ko.validation.group(self);
        self.LoadInitial = function () {
            //console.log("hello");
            $.getJSON("/HRM/Designation/GetDesign/", null, function (data) {
                self.DesignationList(data);
            });

        };
        self.DesignationId.subscribe(function () {
            self.KPIGroupList.removeAll();
            $.getJSON("/HRM/Appraisal/GetAppraisals/?DesignationId=" + self.DesignationId(), null, function (data) {
                self.PeriodFrom(parseJsonDate(data.PeriodFrom));
                self.PeriodTo(parseJsonDate(data.PeriodTo));
                $.each(data.KPIGroupList, function (index, value) {
                    //console.log(value);
                    self.KPIGroupList.push(new KPIGroup(value));
                });
            });
        });
        self.GrpTotal = ko.computed(function () {
            var total = 0;
            for (var i = 0; i < self.KPIGroupList().length; i++) { 
                total += parseInt(self.KPIGroupList()[i].KPIGroupWeight());
            }
            console.log(total);
            return total;
        });

        ko.validation.rules['mustEqual'] = {
            getValue: function (o) {
                return (typeof o === 'function' ? o() : o);
            },
            validator: function (val, otherVal) {
                console.log('sdfsdf');
                return val == this.getValue(otherVal);
                //console.log("val " + val + "Otherval " + otherVal);
            },
            message:'The field must equal 100'
        };
        ko.validation.registerExtenders();
        self.GrpTotal.extend({ mustEqual: 100 });
        

        self.Submit = function () {
            if (self.errors().length == 0) {

                $.ajax({
                    type: "POST",
                    url: "/HRM/Appraisal/SavePerformanceAppraisals/",

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
                        // window.location.href = "/Employee/Index"
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) { }
                });
            } else {
                self.errors.showAllMessages();
            }
        };
    };

    var vm = new PerformanceAppraisal();
    vm.LoadInitial();
    ko.applyBindings(vm, document.getElementById("appraisalInterface"));
});