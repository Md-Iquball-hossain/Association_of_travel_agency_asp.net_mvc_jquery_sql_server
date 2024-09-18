var unitType = [{ 'Id': 1, 'Name': 'Wing' },
                { 'Id': 2, 'Name': 'Dept' },
                { 'Id': 3, 'Name': 'Section' }];
var genders = [
    { 'Id': 1, 'Name': 'Male' },
    { 'Id': 2, 'Name': 'Female' }
];
$(document).ready(function () {
    //function receiveDetail(data) {
    //    var self = this;
    //    self.EmployeeName = ko.observable(data.EmployeeName ? data.EmployeeName : '');
    //    self.OfficeUnitName = ko.observable(data.OfficeUnitName ? data.OfficeUnitName : '');
    //    self.DesignationName = ko.observable(data.DesignationName ? data.DesignationName : '');
    //    self.OfficeName = ko.observable(data.OfficeName ? data.OfficeName : '');
    //    self.GradeName = ko.observable(data.GradeName ? data.GradeName : '');
    //    self.unitTypeId = ko.observable(data.UnitType ? data.UnitType : '');
    //    self.officeUnitId = ko.observable(data.OfficeUnitId ? data.OfficeUnitId : '');
    //    self.officeLayerId = ko.observable(data.OfficeLayerId ? data.OfficeLayerId : '');
    //    self.officeId = ko.observable(data.OfficeId ? data.OfficeId : '');
    //    self.gradeId = ko.observable(data.GradeId ? data.GradeId : '');
    //    self.designationId = ko.observable(data.DesignationId ? data.DesignationId : '');
    //    self.genderId = ko.observable(data.GenderId ? data.GenderId : '');
    //    self.Pick = ko.observable(data.Pick ? data.Pick : '');
    //}
    function receiveVM(secondaryDataVm) {
        var self = this;
        self.secondaryVm = ko.observable(secondaryDataVm)
        self.UnitTypes = ko.observableArray(unitType);
        self.OfficeUnits = ko.observableArray([]);
        self.OfficeLayers = ko.observableArray([]);
        self.offices = ko.observableArray([]);
        self.Grades = ko.observableArray([]);
        self.Designations = ko.observableArray([]);
        self.Genders = ko.observableArray(genders);
        

        self.unitTypeId = ko.observable('');
        self.officeUnitId = ko.observable('');
        self.officeLayerId = ko.observable('');
        self.officeId = ko.observable('');
        self.gradeId = ko.observable('');
        self.designationId = ko.observable('');
        self.genderId = ko.observable('');
        // self.Pick = ko.observable(false);


        self.LoadInitial = function () {
            console.log("dot dot");
            self.getAllOfficeLayers();
            self.getAllGrades();
           // self.LoadEmp();
        };



        self.LoadEmp = function () {
            //self.EmployeeDetails([]);
                return $.ajax({
                type: "GET",
                url: '/HRM/Employee/GetSelectedEmployees?unitId=' + self.unitTypeId() + '&officeUnitId=' + self.officeUnitId() + '&officeLayerId=' + self.officeLayerId() + '&officeId=' + self.officeId() + '&gradeId=' + self.gradeId() + '&designationId=' + self.designationId() + '&genderId=' + self.genderId(),
                contentType: "application/json",
                dataType: "json",
                success: function (data) {
                    console.log("entered...");
                    self.secondaryVm().EmployeeList(data);

                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                },
                complete: function () {
                    console.log("finished");
                }
            });

        }



        self.getAllGrades = function () {
            $.ajax({
                type: "GET",
                url: '/HRM/Grade/GetGrades',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.Grades(data); //Put the response in ObservableArray
                    //console.log(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });

        }

        self.getAllDesignation = function () {
            var grade = self.gradeId() ? self.gradeId() : 0;

            $.ajax({
                type: "GET",
                url: '/HRM/Grade/GetCorrespondingDesignation?id=' + grade,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    //console.log(data);
                    self.Designations(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }

        self.getAllOfficeLayers = function () {
            $.ajax({
                type: "GET",
                url: '/HRM/OfficeLayer/GetAllOfficeLayersJsonResult',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.OfficeLayers(data); //Put the response in ObservableArray
                    //console.log(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });

        }

        self.getAllOffices = function () {
            var officeId = self.officeLayerId() ? self.officeLayerId() : 0;

            $.ajax({
                type: "GET",
                url: '/HRM/Office/GetAllOffices?officeLayerId=' + officeId,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    //console.log(data);
                    self.offices(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }

        self.getOfficeUnit = function () {
            var unitId = self.unitTypeId() ? self.unitTypeId() : 0;

            $.ajax({
                type: "GET",
                url: '/HRM/OfficeUnit/GetOfficeUnitsByUnitType?unittype=' + unitId,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {

                    self.OfficeUnits(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }



        
    }

    function Transfervm() {
        var self = this;
       
        self.EmployeeList = ko.observableArray([]);
        self.EmployeeId = ko.observable().extend({ required: true });
        self.OfficeLayers = ko.observableArray([]);
        self.offices = ko.observableArray([]);
        self.UnitTypes = ko.observableArray(unitType);
        self.OfficeUnits = ko.observableArray([]);
        self.officeLayerId = ko.observable().extend({ required: true });
        self.OfficeId = ko.observable().extend({ required: true});
        self.UnitType = ko.observable().extend({ required: true});
        self.OfficeUnitId = ko.observable().extend({ required: true});
        self.EmployeeId.subscribe(function () {                    //DesignationList is populated with change of selectedGradeId 
            //console.log("id is: " + self.selectedGradeId());
            return $.getJSON('/HRM/EmployeeHistory/GetRespectiveOfficeInfo?empid=' + self.EmployeeId(), null, function (data) {
                console.log(data);
                self.officeLayerId(data.OfficeLayerId);
                //self.OfficeId(data.OfficeId);
                self.UnitType(data.OfficeUnitType);
                //self.OfficeUnitId(data.OfficeUnitId);

            }).then(function () {
                $.getJSON("/HRM/Office/GetAllOffices?officeLayerId=" + self.officeLayerId(), null, function (data) {
                    self.offices(data);

                }).then(function () {
                    $.getJSON('/HRM/EmployeeHistory/GetRespectiveOfficeInfo?empid=' + self.EmployeeId(), null, function (data) {
                        self.OfficeId(data.OfficeId);
                    }).then(function () {
                        $.getJSON("/HRM/OfficeUnit/GetOfficeUnitsByUnitType?unittype=" + self.UnitType(), null, function (data) {
                            self.OfficeUnits(data);
                        }).then(function () {
                            $.getJSON('/HRM/EmployeeHistory/GetRespectiveOfficeInfo?empid=' + self.EmployeeId(), null, function (data) {
                                self.OfficeUnitId(data.OfficeUnitId);
                            });
                        });
                    });
                });
            });
        }, this);

        self.Remarks = ko.observable().extend({ required: true });
        self.errors = ko.validation.group(self);
        self.Submit = function () {
            if (self.errors().length == 0) {
                console.log("submitted..");
                //initial EmployeeId of BasicInfoDto,can't be initialized outside submit function

                $.ajax({
                    type: "POST",
                    url: "/HRM/EmployeeHistory/SaveTransferHistory/",

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

        self.getAllOfficeLayers = function () {
            $.ajax({
                type: "GET",
                url: '/HRM/OfficeLayer/GetAllOfficeLayersJsonResult',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.OfficeLayers(data); //Put the response in ObservableArray
                    //console.log(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });

        };

        self.getAllOffices = function () {
            var officeId = self.officeLayerId() ? self.officeLayerId() : 0;

            $.ajax({
                type: "GET",
                url: '/HRM/Office/GetAllOffices?officeLayerId=' + officeId,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    //console.log(data);
                    self.offices(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        };

        self.getOfficeUnit = function () {
            var unitId = self.UnitType() ? self.UnitType() : 0;

            $.ajax({
                type: "GET",
                url: '/HRM/OfficeUnit/GetOfficeUnitsByUnitType?unittype=' + unitId,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {

                    self.OfficeUnits(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        };

        self.GetRespectiveOfficeInfo = function () {
            $.ajax({
                type: "GET",
                url: '/HRM/EmployeeHistory/GetRespectiveOfficeInfo?empid=' + self.EmployeeId(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    
                    self.officeLayerId(data.officeLayerId);
                    self.OfficeId(data.officeId);
                    self.UnitType(data.unitType);
                    self.OfficeUnitId(data.officeUnitId);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }

        self.LoadInitial = function () {
            console.log("tran");
            self.getAllOfficeLayers();
            
            // self.LoadEmp();
        };


    };

    
    var tvm = new Transfervm();
    
    var vm = new receiveVM(tvm);
    vm.LoadInitial();
    tvm.LoadInitial();
    ko.applyBindings(vm, document.getElementById("receiveDiv"));
    ko.applyBindings(tvm, document.getElementById("transferinfo"));

   
});