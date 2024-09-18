
$(document).ready(function () {
    ko.validation.init({
        errorElementClass: 'has-error',
        errorMessageClass: 'help-block',
        decorateInputElement: true,
        grouping: { deep: true, observable: true }
    });
    function Component(data) {
        var self = this;

        self.Checked = ko.observable(data.Checked);
        self.DisplayText = ko.observable(data.DisplayText);
        self.IsBasicComponent = ko.observable(data.IsBasicComponent);
        self.StatusText = ko.observable(data.StatusText);
        self.StatusVal = ko.observable(data.StatusVal);
        
    };
    function PopulateSalaryProcessComponent()
    {
        var components = [
        { Checked: false, DisplayText: 'Basic', StatusText: 'Pending', Key: 1, StatusVal: 1 },
        { Checked: false, DisplayText: 'Bonus', StatusText: 'Pending', Key: 2, StatusVal: 1 },
        { Checked: false, DisplayText: 'Incentive', StatusText: 'Pending', Key: 3, StatusVal: 1 },
        { Checked: false, DisplayText: 'Overtime', StatusText: 'Pending', Key: 4, StatusVal: 1 }];
        var list = [];
        for (var k = 0; k < components.length; k++)
        {
            list.push(new Component(components[k]));
        }
        return list;

    }
    function SalaryProcessInterface() {
        var self = this;
        self.OfficeList = ko.observableArray([]);
        self.OfficeId = ko.observable().extend({ required: true });
        self.OfficeUnitList = ko.observableArray([]);
        self.OfficeUnitId = ko.observable().extend({ required: true });
        self.MonthYearList = ko.observableArray([]);
        self.MonthYearId = ko.observable().extend({ required: true });
        self.ComponentList = ko.observableArray(PopulateSalaryProcessComponent());
        self.errors = ko.validation.group(self);
        self.LoadInitial = function () {
            $.getJSON("/HRM/Office/GetOffice/", null, function (data) {
                self.OfficeList(data);
            });
            
            $.getJSON("/HRM/SalaryProcess/GetYearMonthCombo/", null, function (data) {
                self.MonthYearList(data);
            });
            //$.getJSON("/SalaryProcess/GetSalaryComponents/", null, function (data) {
            //    $.each(data, function (index, value) {
            //        self.ComponentList.push(new Component(value));
            //    })
            //});
        };
        self.OfficeId.subscribe(function () { //DesignationList is populated with change of selectedGradeId 
            //console.log("id is: " + self.selectedGradeId());
            $.getJSON("/HRM/OfficeUnit/GetOfficeUnitByOffice/?officeid=" + self.OfficeId(), null, function (data) {
                self.OfficeUnitList(data);
            });
        });
        self.Doprocess = function () {
            var complist = self.ComponentList();            
             
            for (var e in complist) {
                if (self.ComponentList()[e].StatusVal() == 1 && self.ComponentList()[e].Checked() == true) {
                    complist[e].StatusVal(3);
                    complist[e].StatusText('In-Progress');

                }
            }
            self.ComponentList(complist);
            console.log("after => " + ko.toJSON(self.ComponentList()));

        };
        self.Doprocess_old = function () {
             var complist = self.ComponentList();
            //console.log("entered  " + complist);
            console.log("before => " + ko.toJSON(self.ComponentList()));
            for (var element in self.ComponentList()) {
                console.log(complist[element]);
                if (self.ComponentList()[element].StatusVal == 1 && self.ComponentList()[element].Checked == true) {
                    
                    self.ComponentList()[element].StatusVal(2);
                    self.ComponentList()[element].StatusText("On Process");
                    
                }
                self.ComponentList(self.ComponentList());
            }
            
            console.log("after => " + ko.toJSON(self.ComponentList()));
           
        };
        self.Submit = function () {
            if (self.errors().length == 0) {
                console.log("entered");
                $.ajax({
                    type: "POST",
                    url: "/HRM/SalaryProcess/DoSalaryProcess/",
                    data: ko.toJSON(self.ComponentList),
                    contentType: 'application/json',
                    success: function (data) {
                        console.log("json " + data);
                        self.ComponentList(data);
                        self.IsValid = ko.computed(function () {
                            if (self.errors().length == 0)
                                return true;
                            return false;
                        });
                        //window.location.href = "/Employee/Index"
                    },
                    async: false,
                    error: function (XMLHttpRequest, textStatus, errorThrown) { }
                });
            } else {
                self.errors.showAllMessages();
            }
        };
    };

    var vm = new SalaryProcessInterface();
    vm.LoadInitial();
    ko.applyBindings(vm, document.getElementById('salaryprocess'));
});