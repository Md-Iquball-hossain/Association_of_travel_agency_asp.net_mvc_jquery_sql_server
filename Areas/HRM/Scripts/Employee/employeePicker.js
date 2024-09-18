﻿var unitType = [{ 'Id': 1, 'Name': 'Wing' },
                { 'Id': 2, 'Name': 'Dept' },
                { 'Id': 3, 'Name': 'Section' }];
var genders = [
    { 'Id': 1, 'Name': 'Male' },
    { 'Id': 2, 'Name': 'Female' }
];
$(document).ready(function () {
    function receiveDetail(data) {
        var self = this;
        self.EmployeeName = ko.observable(data.EmployeeName ? data.EmployeeName : '');
        self.OfficeUnitName = ko.observable(data.OfficeUnitName ? data.OfficeUnitName : '');
        self.DesignationName = ko.observable(data.DesignationName ? data.DesignationName : '');
        self.OfficeName = ko.observable(data.OfficeName ? data.OfficeName : '');
        self.GradeName = ko.observable(data.GradeName ? data.GradeName : '');
        self.unitTypeId = ko.observable(data.UnitType ? data.UnitType : '');
        self.officeUnitId = ko.observable(data.OfficeUnitId ? data.OfficeUnitId : '');
        self.officeLayerId = ko.observable(data.OfficeLayerId ? data.OfficeLayerId : '');
        self.officeId = ko.observable(data.OfficeId ? data.OfficeId : '');
        self.gradeId = ko.observable(data.GradeId ? data.GradeId : '');
        self.designationId = ko.observable(data.DesignationId ? data.DesignationId : '');
        self.genderId = ko.observable(data.GenderId ? data.GenderId : '');
        self.Pick = ko.observable(data.Pick ? data.Pick : '');
    }
    function receiveVM() {
        var self = this;
        self.UnitTypes = ko.observableArray(unitType);
        self.OfficeUnits = ko.observableArray([]);
        self.OfficeLayers = ko.observableArray([]);
        self.offices = ko.observableArray([]);
        self.Grades = ko.observableArray([]);
        self.Designations = ko.observableArray([]);
        self.Genders = ko.observableArray(genders);
        self.EmployeeDetails = ko.observableArray([]);

        self.unitTypeId = ko.observable('');
        self.officeUnitId = ko.observable('');
        self.officeLayerId = ko.observable('');
        self.officeId = ko.observable('');
        self.gradeId = ko.observable('');
        self.designationId = ko.observable('');
        self.genderId = ko.observable('');
        self.Pick = ko.observable(false);


        self.LoadInitial = function () {
            self.getAllOfficeLayers();
            self.getAllGrades();
        };

       

        self.Load = function () {
            self.EmployeeDetails([]);
            return $.ajax({
                type: "GET",
                url: '/HRM/Employee/GetSelectedEmployees?unitId=' + self.unitTypeId() + '&officeUnitId=' + self.officeUnitId() + '&officeLayerId=' + self.officeLayerId() + '&officeId=' + self.officeId() + '&gradeId=' + self.gradeId() + '&designationId=' + self.designationId() + '&genderId=' + self.genderId(),
                contentType: "application/json",

                success: function (data) {
                    
                    $.each(data, function (index, value) {
                        //console.log(value);
                        self.EmployeeDetails.push(new receiveDetail(value));
                    });
                   
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
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



        self.removeDetail = function (receiveDetail) {
            self.ReceiveDetails.remove(receiveDetail);
        };

        self.Reset = function () {
            self.EmployeeDetails('');
            self.unitTypeId('');
            self.officeUnitId('');
            self.officeLayerId('');
            self.officeId('');
            self.gradeId('');
            self.designationId('');
            self.genderId('');
            self.Pick(false);
        };

        self.Submit = function () {
            console.log(self.EmployeeDetails());
            var empDetails = ko.observableArray([]);
            $.each(self.EmployeeDetails(), function (index, value) {
                //if (value.Pick === true ) {
                console.log("value: " + value);
                empDetails.push({
                    EmployeeId: value.EmployeeId,
                    EmployeeName: value.EmployeeName,
                    DesignationId: value.designationId,
                    DesignationName: value.DesignationName,
                    GradeName: value.GradeName,
                    UnitType: value.unitTypeId,
                    OfficeUnitId: value.officeUnitId,
                    OfficeUnitName: value.OfficeUnitName,
                    OfficeLayerId: value.officeLayerId,
                    OfficeId: value.officeId,
                    GradeId: value.gradeId,
                    OfficeName: value.OfficeName,
                    GenderId: value.genderId,
                    Pick: value.Pick
                });
            });
            console.log(empDetails);
            $.ajax({
                type: "POST",
                url: '/HRM/Employee/GetPickedEmployees',
                data: ko.toJSON(empDetails),
                contentType: "application/json",
                success: function (data) {
                    //console.log(data);
                    //$('#successModal').modal('show');
                    //$('#successModalText').text(data);
                    //self.Reset();
                },
                error: function () {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        };

        self.IsSave = function () {
            return true;
        };

    }

    var vm = new receiveVM();
    vm.LoadInitial();
    ko.applyBindings(vm, $("#receiveDiv")[0]);
});