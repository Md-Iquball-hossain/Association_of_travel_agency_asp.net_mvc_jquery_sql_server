var unitType = [{ 'Id': 1, 'Name': 'Wing' },
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
        self.UnitType = ko.observable(data.UnitType ? data.UnitType : '');
        self.OfficeUnitId = ko.observable(data.OfficeUnitId ? data.OfficeUnitId : '');
        self.OfficeLayerId = ko.observable(data.OfficeLayerId ? data.OfficeLayerId : '');
        self.OfficeId = ko.observable(data.OfficeId ? data.OfficeId : '');
        //self.gradeId = ko.observable(data.GradeId ? data.GradeId : '');
        self.DesignationId = ko.observable(data.DesignationId ? data.DesignationId : '');
        //self.genderId = ko.observable(data.GenderId ? data.GenderId : '');
        //self.Pick = ko.observable(data.Pick ? data.Pick : '');
    }
    function receiveVM() {
        var self = this;
        self.UnitTypes = ko.observableArray(unitType);
        self.OfficeUnits = ko.observableArray([]);
        self.OfficeLayers = ko.observableArray([]);
        self.offices = ko.observableArray([]);
        //self.Grades = ko.observableArray([]);
        self.Designations = ko.observableArray([]);
        self.Positions = ko.observableArray([]);
        self.Parents = ko.observableArray([]);
        self.Employees = ko.observableArray([]);
        //self.Genders = ko.observableArray(genders);
        self.EmployeeDetails = ko.observableArray([]);

        //self.unitTypeId = ko.observable('');
        //self.officeUnitId = ko.observable('');
        //self.officeLayerId = ko.observable('');
        //self.officeId = ko.observable('');
        self.gradeId = ko.observable('');
        //self.designationId = ko.observable('');
        self.genderId = ko.observable('');
        //self.Pick = ko.observable(false);


        self.Id = ko.observable('');
        self.Name = ko.observable('');
        self.EmployeeId = ko.observable('');
        self.EmployeeName = ko.observable('');
        self.DesignationId = ko.observable('');
        self.DesignationName = ko.observable('');
        self.OfficeLayerId = ko.observable('');
        self.OfficeLayerId.subscribe(function () {
            if (self.OfficeLayerId() > 0) {
                self.Load();
            }
        });
        self.DesignationId.subscribe(function () {
            if (self.DesignationId() > 0) {
                self.Load();
            }
        });


        self.EmployeeId = ko.observable('');
        self.EmployeeId.subscribe(function () {
            if (self.EmployeeId() > 0) {
                self.Load();
            }
        });
        self.OfficeId = ko.observable('');
        self.OfficeId.subscribe(function () {
            if (self.OfficeLayerId() > 0 && self.OfficeId() > 0) {
                self.Load();
            }
        });
        self.OfficeName = ko.observable('');
        self.UnitType = ko.observable('');
        //self.UnitType.subscribe(function () {
        //    if (self.OfficeLayerId() > 0 && self.OfficeId() > 0 && self.UnitType()>0) {
        //        self.Load();
        //    }
        //});
        self.OfficeUnitId = ko.observable('');
        self.OfficeUnitId.subscribe(function () {
            if (self.OfficeLayerId() > 0 && self.OfficeId() > 0 && self.UnitType() > 0 && self.OfficeUnitId() > 0) {
                self.Load();
            }
        });
        self.OfficeUnitName = ko.observable('');

        self.PositionId = ko.observable('');
        self.PositionId.subscribe(function () {
            if (self.OfficeLayerId() > 0 && self.OfficeId() > 0 && self.UnitType() > 0 && self.OfficeUnitId() > 0 && self.PositionId() > 0) {
                self.Load();
            }
        });
        self.PositionName = ko.observable('');
        self.ParentId = ko.observable('');
        self.ParentId.subscribe(function () {
            if (self.OfficeLayerId() > 0 && self.OfficeId() > 0 && self.UnitType() > 0 && self.OfficeUnitId() > 0 && self.PositionId() > 0 && self.ParentId() >= 0) {
                self.Load();
            }
        });
        self.ParentName = ko.observable('');


        self.LoadInitial = function () {
            self.getAllOfficeLayers();
            self.getAllOfficePositions();
            self.getAllDesignation();
            //self.getAllGrades();
            //self.getEmployeeByParentId();
        };



        self.Load = function () {
            self.EmployeeDetails([]);
            return $.ajax({
                type: "GET",
                url: '/HRM/Employee/GetSelectedEmployeesForOrganogram?unitId=' + self.UnitType() + '&officeUnitId=' + self.OfficeUnitId() + '&officeLayerId=' + self.OfficeLayerId() + '&officeId=' + self.OfficeId() + '&parentId=' + self.ParentId() + '&designationId=' + self.DesignationId() + '&empId=' + self.EmployeeId() + '&positionId=' + self.PositionId(),
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

        self.getAllOfficePositions = function () {
            $.ajax({
                type: "GET",
                //url: '/HRM/OfficePosition/GetOfficePosition',long? officeLayerId, long? officeId, long? designationId
                url: '/HRM/OfficePosition/GetOfficePositionByOfficeSettings?officeLayerId=' + self.OfficeLayerId() + '&officeId=' + self.OfficeId() + '&designationId=' + self.DesignationId(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.Positions(data); //Put the response in ObservableArray
                    //console.log(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });

        }

        //self.getAllGrades = function () {
        //    $.ajax({
        //        type: "GET",
        //        url: '/Grade/GetGrades',
        //        contentType: "application/json; charset=utf-8",
        //        dataType: "json",
        //        success: function (data) {
        //            self.Grades(data); //Put the response in ObservableArray
        //            //console.log(data);
        //        },
        //        error: function (error) {
        //            alert(error.status + "<--and--> " + error.statusText);
        //        }
        //    });

        //}

        self.getAllDesignation = function () {
            $.ajax({
                type: "GET",
                url: '/HRM/Designation/GetDesign',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
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
            var officeId = self.OfficeLayerId() ? self.OfficeLayerId() : 0;

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


        self.getOfficePositionParentWise = function () {
            var officeId = self.OfficeId() ? self.OfficeId() : 0;
            var positionId = self.PositionId() ? self.PositionId() : 0;
            //var url = '/Organogram/GetParentOrganogramsByPosition/?positionid=' + selectedOfficePositionId + "&officeid=" + $("#OfficeId").val();
            $.ajax({
                type: "GET",
                url: '/HRM/Organogram/GetParentOrganogramsByPosition?positionid=' + positionId + '&officeid=' + officeId,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    //console.log(data);
                    self.Parents(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }

        self.getEmployeeByParentId = function () {
            //var parentId = self.ParentId() ? self.ParentId() : 0;
            var officeId = self.OfficeId() ? self.OfficeId() : 0;
            //var url = '/Organogram/GetParentOrganogramsByPosition/?positionid=' + selectedOfficePositionId + "&officeid=" + $("#OfficeId").val();
            if (officeId > 0) {
                $.ajax({
                    type: "GET",
                    //url: '/HRM/Organogram/GetOrganogramByParentId?parentId=' + parentId,
                    url: '/HRM/Organogram/GetEmployeesByOffice?officeid=' + officeId + '&officeLayerId=' + self.OfficeLayerId()  + '&designationId=' + self.DesignationId(),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        self.Employees(data);
                    },
                    error: function (error) {
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            }

        }

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
        }



        self.removeDetail = function (receiveDetail) {
            self.ReceiveDetails.remove(receiveDetail);
        };

        self.Reset = function () {
            self.EmployeeDetails('');
            self.UnitType('');
            self.OfficeUnitId('');
            self.OfficeLayerId('');
            self.OfficeId('');
            //self.gradeId('');
            self.DesignationId('');
            //self.genderId('');
            //self.Pick(false);
        };
        self.SubmitOrganogram = function () {

            var submitOrganogramData = {
                EmployeeId: self.EmployeeId(),
                DesignationId: self.DesignationId(),
                UnitType: self.UnitType(),
                OfficeUnitId: self.OfficeUnitId(),
                OfficeLayerId: self.OfficeLayerId(),
                OfficeId: self.OfficeId(),
                //GradeId: self.GradeId(),
                PositionId: self.PositionId(),
                ParentId: self.ParentId(),

            };
            $.ajax({
                type: "POST",
                url: '/HRM/Organogram/SaveOrganogram',
                data: ko.toJSON(submitOrganogramData),
                contentType: "application/json",
                success: function (data) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(data.Message);
                    //self.IsSaved(true);

                },
                error: function () {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });

        };
        self.Submit = function () {
            var empDetails = ko.observableArray([]);
            $.each(self.EmployeeDetails(), function (index, value) {

                empDetails.push({
                    EmployeeId: value.EmployeeId,
                    EmployeeName: value.EmployeeName,
                    DesignationId: value.DesignationId,
                    DesignationName: value.DesignationName,
                    GradeName: value.GradeName,
                    UnitType: value.UnitType,
                    OfficeUnitId: value.OfficeUnitId,
                    OfficeUnitName: value.OfficeUnitName,
                    OfficeLayerId: value.OfficeLayerId,
                    OfficeId: value.OfficeId,
                    GradeId: value.gradeId,
                    OfficeName: value.OfficeName,
                    GenderId: value.genderId,
                    //Pick: value.Pick
                });
            });
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