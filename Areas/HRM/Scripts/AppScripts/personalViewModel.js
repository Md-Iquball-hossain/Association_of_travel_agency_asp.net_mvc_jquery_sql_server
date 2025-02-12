﻿$(document).ready(function () {
    function populateVendors(isEdit) {
        var trainingVendorCombo = $("#tr_TrainingVendorId select");
        var trainingCombo = $("#tr_TrainingId select");
        $(trainingVendorCombo).attr("id", "TrainingVendorId").attr("name", "TrainingVendorId");
        $(trainingCombo).attr("id", "TrainingId").attr("name", "TrainingId");

        var selectedTrainingVendorId = $("#jqGridTraining").jqGrid('getRowData', $("#jqGridTraining")[0].p.selrow).TrainingVendorId | 0;
        $(trainingVendorCombo)
                     .html("<option value=''>Loading vendors...</option>")
                     .attr("disabled", "disabled");
        $.ajax({
            url: '/HRM/Training/GetCorrespondingVendors',
            type: "GET",
            success: function (vendorHtml) {
                $(trainingVendorCombo).removeAttr("disabled").html(vendorHtml);

                if (isEdit) {
                    $(trainingVendorCombo).val(selectedTrainingVendorId);
                } else {
                    $(trainingVendorCombo).selectedIndex = 0;
                }
                updateTrainingCallBack(isEdit, $(trainingVendorCombo).val(), trainingCombo);
            }
        });
        $(trainingVendorCombo).bind("change", function (e) {
            updateTrainingCallBack(false, $(trainingVendorCombo).val(), trainingCombo);
        });
    }

    function updateTrainingCallBack(isEdit, selectedTrainingVendorId, trainingCombo) {
        var url = '/HRM/Training/GetTrainingByVendors/?vendorid=' + selectedTrainingVendorId;
        $(trainingCombo)
             .html("<option value=''>Loading trainings...</option>")
             .attr("disabled", "disabled");
        $.ajax({
            url: url,
            type: "GET",
            success: function (trainingJson) {
                var trainings = eval(trainingJson);
                var trainingHtml = "";
                $(trainings).each(function (i, option) {
                    trainingHtml += '<option value="' + option.Id + '">' + option.TrainingName + '</option>';
                });
                $(trainingCombo).removeAttr("disabled").html(trainingHtml);
                if (isEdit) {
                    var selectedTrainingId = $("#jqGridTraining").jqGrid('getRowData', $("#jqGridTraining")[0].p.selrow).TrainingId | 0;
                    $(trainingCombo).val(selectedTrainingId);
                } else {
                    $(trainingCombo).selectedIndex = 0;
                }
                $(trainingCombo).focus();
            }
        });
    }
    function populateInstitute(isEdit) {
        var instituteCombo = $("#tr_InstituteId select");
        var degreeCombo = $("#tr_DegreeId select");
        $(instituteCombo).attr("id", "InstituteId").attr("name", "InstituteId");
        $(degreeCombo).attr("id", "DegreeId").attr("name", "DegreeId");


        var selectedInstituteId = $("#jqGridEducation").jqGrid('getRowData', $("#jqGridEducation")[0].p.selrow).InstituteId | 0;
        $(instituteCombo)
                     .html("<option value=''>Loading institutes...</option>")
                     .attr("disabled", "disabled");
        $.ajax({
            url: '/HRM/Degree/GetInstitutes',
            type: "GET",
            success: function (instituteHtml) {
                $(instituteCombo).removeAttr("disabled").html(instituteHtml);

                if (isEdit) {
                    $(instituteCombo).val(selectedInstituteId);
                } else {
                    $(instituteCombo).selectedIndex = 0;
                }
                updateDegreeCallBack(isEdit, $(instituteCombo).val(), degreeCombo);
            }
        });
        $(instituteCombo).bind("change", function (e) {
            updateDegreeCallBack(false, $(instituteCombo).val(), degreeCombo);
        });
    }
    function updateDegreeCallBack(isEdit, selectedInstituteId, degreeCombo) {
        var url = '/HRM/Degree/GetDegreeByInstitute?instituteid=' + selectedInstituteId;
        $(degreeCombo)
             .html("<option value=''>Loading degrees...</option>")
             .attr("disabled", "disabled");
        $.ajax({
            url: url,
            type: "GET",
            success: function (degreejson) {
                var degrees = eval(degreejson);
                var degreeHtml = "";
                $(degrees).each(function (i, option) {
                    degreeHtml += '<option value="' + option.Id + '">' + option.Name + '</option>';
                });
                $(degreeCombo).removeAttr("disabled").html(degreeHtml);
                if (isEdit) {
                    var selectedDegreeId = $("#jqGridEducation").jqGrid('getRowData', $("#jqGridEducation")[0].p.selrow).DegreeId | 0;
                    $(degreeCombo).val(selectedDegreeId);
                } else {
                    $(degreeCombo).selectedIndex = 0;
                }
                $(degreeCombo).focus();
            }
        });
    }
    ko.validation.init({
        errorElementClass: 'has-error',
        errorMessageClass: 'help-block',
        decorateInputElement: true,
        grouping: { deep: true, observable: true }
    });
    // change a default option
    var dobDate;
    //view model for BasicInfo
    function BasicInfo() {
        var self = this;
        //self.Id = ko.observable();
        self.FirstName = ko.observable().extend({ pattern: { message: 'Only alphanumeric value required.', params: "^[_A-Za-z ]{1,}$", maxLength: "100" } });
        self.LastName = ko.observable().extend({ pattern: { message: 'Only alphanumeric value required.', params: "^[_A-Za-z ]{1,}$", maxLength: "100" } });
        self.FatherFirstName = ko.observable();//.extend({ required: true }); //, pattern: { message: 'Only alphanumeric value required.', params: "^[_A-Za-z ]{1,}$", maxLength: "100" }
        self.FatherLastName = ko.observable().extend({ pattern: { message: 'Only alphanumeric value required.', params: "^[_A-Za-z ]{1,}$", maxLength: "100" } });
        self.MotherFirstName = ko.observable().extend({ pattern: { message: 'Only alphanumeric value required.', params: "^[_A-Za-z ]{1,}$", maxLength: "100" } });
        self.MotherLastName = ko.observable().extend({ pattern: { message: 'Only alphanumeric value required.', params: "^[_A-Za-z ]{1,}$", maxLength: "100" } });
        self.DateOfBirth = ko.observable();//.extend({ required: true });
        self.GenderList = ko.observableArray([]);
        self.Gender = ko.observable();
        self.MaritalStatusList = ko.observableArray([]);
        self.MaritalStatus = ko.observable();
        self.ReligionList = ko.observableArray([]);
        self.Religion = ko.observable();
        self.BloodGroupList = ko.observableArray([]);
        self.BloodGroup = ko.observable();
        self.NationalityList = ko.observableArray([]);
        self.CountryId = ko.observable();
        self.OfficeId = ko.observable();
        self.NID = ko.observable().extend({ pattern: { message: 'Enter correct NID.', params: "^[0-9]{17}$", maxLength: "100" } });
        //self.Photo = ko.observable();
        self.EmpCode = ko.observable();
        self.Photo = ko.observable({
            file: ko.observable()
        });
        self.errors = ko.validation.group(self);
        //console.log("Error Contact:" + self.errors());
        //console.log("Error Number:" + self.errors().length);
        self.IsValid = ko.computed(function () {
            if (self.errors().length == 0)
                return true;
            return false;
        });
        self.GetBasicInfoDetails = function () {
            return $.ajax({
                type: "GET",
                url: "/HRM/Employee/GetBasicInfoById?id=" + val,
                dataType: "json",
                success: function (data) {
                    //console.log("successfull"+data.DateOfBirth);
                    self.FirstName(data.FirstName);
                    self.LastName(data.LastName);
                    self.FatherFirstName(data.FatherFirstName);
                    self.FatherLastName(data.FatherLastName);
                    self.MotherFirstName(data.MotherFirstName);
                    self.MotherLastName(data.MotherLastName);
                    self.DateOfBirth(data.DateOfBirth);
                    dobDate = data.DateOfBirth;
                    self.Gender(data.Gender);
                    self.NID(data.NID);
                    self.CountryId(data.CountryId);
                    self.OfficeId(data.OfficeId);
                    self.MaritalStatus(data.MaritalStatus);
                    self.Religion(data.Religion);
                    self.BloodGroup(data.BloodGroup);
                    self.EmpCode(data.EmpCode);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) { }
            });
        };

        self.GetInitialDropdown = function () {
            $.getJSON("/HRM/Employee/GetCountries/", null, function (data) {
                BasicInfovm.NationalityList(data);
            });
            $.getJSON("/HRM/Employee/GetGender/", null, function (data) {
                BasicInfovm.GenderList(data);
            });
            $.getJSON("/HRM/Employee/GetMaritalStatus/", null, function (data) {
                BasicInfovm.MaritalStatusList(data);
            });
            $.getJSON("/HRM/Employee/GetReligionList/", null, function (data) {
                BasicInfovm.ReligionList(data);
            });

            $.getJSON("/HRM/Employee/GetBloodGroup/", null, function (data) {
                BasicInfovm.BloodGroupList(data);
            });

        };

        self.Submit = function () {
            if (self.errors().length == 0) {
                $.ajax({
                    type: "POST",
                    url: "/HRM/Employee/SaveEmployee/" + val,

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
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) { }
                });
            } else {
                self.errors.showAllMessages();
            }
        };

    }
    function ContactAddress() {
        var self = this;
        self.AddressLine1 = ko.observable();
        self.AddressLine2 = ko.observable();
        self.PostalCode = ko.observable();
        // self.Country = ko.observable();
        self.DivisionId = ko.observable();
        self.DistrictId = ko.observable();
        self.ThanaId = ko.observable();
        self.AreaId = ko.observable();
        self.DivisionList = ko.observableArray([]);
        self.DistrictList = ko.observableArray([]);
        self.ThanaList = ko.observableArray([]);
        self.AreaList = ko.observableArray([]);
        self.PostalCode.subscribe(function (newValue) {
            if (newValue > 0) {
                $.getJSON("/HRM/Employee/GetPostOfficeByPostalCode?postalcode=" + newValue, null, function (data) {
                    if (data == null) {
                        self.GetInitialAddressDropdown();
                    } else {
                        return $.getJSON("/HRM/Location/GetParentLocations?loclevel=" + 5, null, function (data) {
                            self.AreaList(data);

                        }).then(function () {
                            return $.getJSON("/HRM/Employee/GetAreaId?locid=" + data.LocationId, null, function (data) {
                                // console.log(data.LocationId);
                                self.AreaId(data);

                            }).then(function () {
                                return $.getJSON("/HRM/Location/GetParentLocations?loclevel=" + 4, null, function (data) {
                                    self.ThanaList(data);

                                }).then(function () {
                                    $.getJSON("/HRM/Employee/GetParentId?locid=" + self.AreaId(), null, function (data) {
                                        // console.log(data.LocationId);
                                        self.ThanaId(data);

                                    }).then(function () {
                                        return $.getJSON("/HRM/Location/GetParentLocations?loclevel=" + 3, null, function (data) {
                                            self.DistrictList(data);

                                        }).then(function () {
                                            $.getJSON("/HRM/Employee/GetParentId?locid=" + self.ThanaId(), null, function (data) {
                                                // console.log(data.LocationId);
                                                self.DistrictId(data);

                                            }).then(function () {
                                                return $.getJSON("/HRM/Location/GetParentLocations?loclevel=" + 2, null, function (data) {
                                                    self.DivisionList(data);

                                                }).then(function () {
                                                    $.getJSON("/HRM/Employee/GetParentId?locid=" + self.DistrictId(), null, function (data) {
                                                        // console.log(data.LocationId);
                                                        self.DivisionId(data);

                                                    });

                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    }

                });
            }
        });
        self.GetInitialAddressDropdown = function () {
            self.DivisionId.subscribe(function () { //DesignationList is populated with change of selectedGradeId 
                //console.log("id is: " + self.selectedGradeId());
                $.getJSON("/HRM/Location/GetLocationHierarchy?parentid=" + self.DivisionId(), null, function (data) {
                    self.DistrictList(data);

                });
            });
            self.DistrictId.subscribe(function () { //DesignationList is populated with change of selectedGradeId 
                //console.log("id is: " + self.selectedGradeId());
                $.getJSON("/HRM/Location/GetLocationHierarchy?parentid=" + self.DistrictId(), null, function (data) {
                    self.ThanaList(data);

                });
            });

            self.ThanaId.subscribe(function () { //DesignationList is populated with change of selectedGradeId 
                //console.log("id is: " + self.selectedGradeId());
                $.getJSON("/HRM/Location/GetLocationHierarchy?parentid=" + self.ThanaId(), null, function (data) {
                    self.AreaList(data);

                });
            });
        };


    }

    //view model for ContactInfo
    function ContactInfo() {
        var self = this;
        //self.Id = ko.observable();
        self.PresentAddress = new ContactAddress();
        self.ParmanentAddress = new ContactAddress();
        self.myValue = ko.observable(false);
        self.myValue.subscribe(function (newValue) {
            console.log("val: " + newValue);
            if (newValue == true) {
                self.ParmanentAddress.AddressLine1(self.PresentAddress.AddressLine1());
                self.ParmanentAddress.AddressLine2(self.PresentAddress.AddressLine2());
                self.ParmanentAddress.PostalCode(self.PresentAddress.PostalCode());
            } else {
                self.ParmanentAddress.AddressLine1('');
                self.ParmanentAddress.AddressLine2('');
                self.ParmanentAddress.PostalCode('');
                self.ParmanentAddress.DivisionId('');
                self.ParmanentAddress.DistrictId('');
                self.ParmanentAddress.ThanaId('');
                self.ParmanentAddress.AreaId('');
            }
        });
        self.CountryList = ko.observableArray([]);

        self.PhoneNo = ko.observable().extend({ digit: true });
        self.Email = ko.observable().extend({ email: true });
        self.EmergencyContactPerson = ko.observable();
        self.EmergencyContactPhone = ko.observable().extend({ digit: true });
        self.EmergencyContactRelation = ko.observable().extend({ pattern: { message: 'Only alpha value required.', params: "^[_A-Za-z ]{1,}$", maxLength: "100" } });
        self.errors = ko.validation.group(self);
        self.IsValid = ko.computed(function () {
            if (self.errors().length == 0)
                return true;
            return false;
        });
        self.GetContactInfoDetails = function () {
            return $.ajax({
                type: "GET",
                url: "/HRM/Employee/GetContactInfoById?id=" + val,
                dataType: "json",
                success: function (data) {
                    //console.log("successfull"+data.DateOfBirth);
                    console.log("successfull" + ko.toJSON(data));
                    self.PresentAddress.AddressLine1(data.PresentAddress != null ? data.PresentAddress.AddressLine1 : "");
                    self.PresentAddress.AddressLine2(data.PresentAddress != null ? data.PresentAddress.AddressLine2 : "");
                    self.PresentAddress.PostalCode(data.PresentAddress != null ? data.PresentAddress.PostalCode : "");
                    self.ParmanentAddress.AddressLine1(data.ParmanentAddress != null ? data.ParmanentAddress.AddressLine1 : "");
                    self.ParmanentAddress.AddressLine2(data.ParmanentAddress != null ? data.ParmanentAddress.AddressLine2 : "");
                    self.ParmanentAddress.PostalCode(data.ParmanentAddress != null ? data.ParmanentAddress.PostalCode : "");
                    self.PhoneNo(data.PhoneNo);
                    self.Email(data.Email);
                    self.EmergencyContactPerson(data.EmergencyContactPerson);
                    self.EmergencyContactPhone(data.EmergencyContactPhone);
                    self.EmergencyContactRelation(data.EmergencyContactRelation);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) { }
            });
        };
        self.Submit = function () {

            if (self.errors().length == 0) {
                self.EmployeeId = ko.observable(val);
                console.log("no error");
                $.ajax({
                    type: "POST",
                    url: "/HRM/Employee/SaveContactInfo?empid=" + val,
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
                console.log("error:" + self.errors());
                self.errors.showAllMessages();
            }
        };

        self.GetInitialDropdown = function () {

            $.getJSON("/HRM/Location/GetLocationHierarchy/", null, function (data) {
                ContactInfovm.PresentAddress.DivisionList(data);
            });
            $.getJSON("/HRM/Location/GetLocationHierarchy/", null, function (data) {
                ContactInfovm.ParmanentAddress.DivisionList(data);
            });
        };

    }

    function Training(TrainingInfo) {
        var self = this;
        self.EmployeeId = ko.observable(val);

        self.TrainingName = ko.observable().extend({ required: true, pattern: { message: 'Only alpha value required.', params: "^[_A-Za-z0-9_ ]{1,}$", maxLength: "100" } });

        self.TrainingType = ko.observable().extend({ required: true, pattern: { message: 'Only alpha value required.', params: "^[_A-Za-z ]{1,}$", maxLength: "100" } });
        self.TrainingInstitute = ko.observable().extend({ required: true, pattern: { message: 'Only alpha value required.', params: "^[_A-Za-z ]{1,}$", maxLength: "100" } });
        self.StartDate = ko.observable().extend({ required: true, date: true });
        self.EndDate = ko.observable().extend({ required: true, date: true });
        self.Hours = ko.observable().extend({ required: true, number: true });

        self.remove = function () {
            TrainingInfo.employeeTrainings.destroy(self);
        };
    }

    function TrainingInfo() {
        var self = this;
        //self.Id = ko.observable();
        self.errors = ko.observable();

        self.employeeTrainings = ko.observableArray([]);
        self.employeeTrainings.subscribe(this.onAdded, this);
        self.employeeTrainings.push(new Training(self));

        this.SaveTraining = function () {                                   //This wil return employeeDegrees which is nothing but a list of EducationDto of an employee
            //console.log("degrees " + self.employeeDegrees().length);
            if (self.IsValid()) {
                $.ajax({
                    type: "POST",
                    url: "/HRM/Employee/SaveTrainingInfo/" + val,
                    data: ko.toJSON(self.employeeTrainings),  //for passing array to controller,in ko.toJson() parameter should be passed
                    contentType: 'application/json',
                    success: function (data) {
                        toastr.success(data);

                        TrainingInfovm.employeeTrainings('');

                        window.location.href = "/HRM/Employee/Index";
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) { }
                });
                //alert("Form Submitted");
            }
            else {
                //console.log("edu errors: " + self.errors().length); 
                self.errors.showAllMessages();

            }
        };

    }

    TrainingInfo.prototype = {
        onAdded: function () {
            this.errors = ko.validation.group(this);
        },
        addNewRow: function () {
            this.employeeTrainings.push(new Training(this));
        },
        getCanSave: function () {
            return this.errors() && this.errors()().length === 0;
        },
        IsValid: function () {
            //console.log("edu errors: " + this.errors());
            return this.errors() && this.errors().length === 0;
        }
    };

    function Education(EducationInfo) {
        var self = this;
        self.EmployeeId = ko.observable(val);
        self.degrees = ko.observableArray([
                { Value: 'SSC/Vocational', Text: 'SSC/Vocational' },
                { Value: 'SSC/Dakhil', Text: 'SSC/Dakhil' },
        		{ Value: 'HSC/Vocational', Text: 'HSC/Vocational' },
                { Value: 'HSC/Alim', Text: 'HSC/Alim' },
                { Value: 'Diploma in Commerse', Text: 'Diploma in Commerse' },
        		{ Value: 'Diploma in Business', Text: 'Diploma in Business' },
                { Value: 'Graduation', Text: 'Graduation' },
        		{ Value: 'Post Graduation', Text: 'Post Graduation' }
        ]);
        self.DegreeName = ko.observable().extend({ required: true });

        self.Subject = ko.observable().extend({ required: true, pattern: { message: 'Only alpha value required.', params: "^[_A-Za-z ]{1,}$", maxLength: "100" } });
        self.passingYears = ko.observableArray([
                { Value: '2000', Text: '2000' },
                { Value: '2001', Text: '2001' },
                { Value: '2002', Text: '2002' },
                { Value: '2003', Text: '2003' },
                { Value: '2004', Text: '2004' },
                { Value: '2005', Text: '2005' },
                { Value: '2006', Text: '2006' },
                { Value: '2007', Text: '2007' },
                { Value: '2008', Text: '2008' },
                { Value: '2009', Text: '2009' },
                { Value: '2010', Text: '2010' },
                { Value: '2011', Text: '2011' },
        		{ Value: '2012', Text: '2012' }
        ]);
        self.PassingYear = ko.observable().extend({ required: true });

        self.boardUniversities = ko.observableArray([
                { Value: 'Board Dhaka', Text: 'Board Dhaka' },
                { Value: 'Board Chittagong', Text: 'Board Chittagong' },
                { Value: 'Board Barishal', Text: 'Board Barishal' },
                { Value: 'Board Comilla', Text: 'Board Comilla' },
                { Value: 'Board Dinajpur', Text: 'Board Dinajpur' },
                { Value: 'Board Jessore', Text: 'Board Jessore' },
                { Value: 'Board Rajshahi', Text: 'Board Rajshahi' },
                { Value: 'Board Sylhet', Text: 'Board Sylhet' },
                { Value: 'Board Madrasa', Text: 'Board Madrasa' },
                { Value: 'Technical', Text: 'Technical' },
                { Value: 'DIBS', Text: 'DIBS' },
                { Value: 'University', Text: 'University' }
        ]);
        self.boardUniversity = ko.observable().extend({ required: true });


        self.Institute = ko.observable().extend({ required: true, pattern: { message: 'Only alpha value required.', params: "^[_A-Za-z ]{1,}$", maxLength: "100" } });
        self.Result = ko.observable().extend({ required: true, number: true });

        self.remove = function () {
            EducationInfo.employeeDegrees.destroy(self);
        };
    }

    EducationInfo = function () {
        var self = this;
        self.errors = ko.observable();

        self.employeeDegrees = ko.observableArray([]);
        self.employeeDegrees.subscribe(this.onAdded, this);
        self.employeeDegrees.push(new Education(self));

        //self.canSave = ko.computed(self.getCanSave, self);
        this.SaveEducation = function () { //This wil return employeeDegrees which is nothing but a list of EducationDto of an employee
            console.log("degrees " + self.employeeDegrees().length);
            if (self.IsValid()) {
                $.ajax({
                    type: "POST",
                    url: "/HRM/Employee/SaveEducationInfo/" + val,
                    data: ko.toJSON(self.employeeDegrees), //for passing array to controller,in ko.toJson() parameter should be passed
                    contentType: 'application/json',
                    success: function (data) {
                        toastr.success(data);

                        EducationInfovm.employeeDegrees('');

                        window.location.href = "/HRM/Employee/Index"
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) { }
                });
                //alert("Form Submitted");
            } else {
                //console.log("edu errors: " + self.errors().length); 
                self.errors.showAllMessages();

            }
        };


    };

    EducationInfo.prototype = {
        onAdded: function () {
            this.errors = ko.validation.group(this);
        },
        addNewRow: function () {
            this.employeeDegrees.push(new Education(this));
        },
        getCanSave: function () {
            return this.errors() && this.errors()().length === 0;
        },
        IsValid: function () {
            //console.log("edu errors: " + this.errors());
            return this.errors() && this.errors().length === 0;
        }
    };

    // Employment History
    function EmpPrevHistory(EmploymentHistory) {
        var self = this;
        self.EmployeeId = ko.observable(val);
        self.CompanyName = ko.observable().extend({ required: true, pattern: { message: 'Only alpha value required.', params: "^[_A-Za-z0-9_ ]{1,}$", maxLength: "100" } });
        self.CompanyBusiness = ko.observable().extend({ required: true, pattern: { message: 'Only alpha value required.', params: "^[_A-Za-z ]{1,}$", maxLength: "100" } });
        self.Designation = ko.observable().extend({ required: true, pattern: { message: 'Only alpha value required.', params: "^[_A-Za-z ]{1,}$", maxLength: "100" } });
        self.Department = ko.observable().extend({ required: true, pattern: { message: 'Only alpha value required.', params: "^[_A-Za-z ]{1,}$", maxLength: "100" } });
        self.AreaofExperiences = ko.observable().extend({ required: true, pattern: { message: 'Only alpha value required.', params: "^[_A-Za-z ]{1,}$", maxLength: "100" } });
        self.Responsibilities = ko.observable().extend({ required: true, pattern: { message: 'Only alpha value required.', params: "^[_A-Za-z ]{1,}$", maxLength: "100" } });
        self.CompanyAddress = ko.observable().extend({ required: true, pattern: { message: 'Only alpha value required.', params: "^[_A-Za-z ]{1,}$", maxLength: "100" } });
        self.StartDate = ko.observable().extend({ required: true, date: true });
        self.EndDate = ko.observable().extend({ required: true, date: true });
        self.remove = function () {
            EmploymentHistory.employeeTrainings.destroy(self);
        };
    }

    function EmploymentHistory() {
        var self = this;
        //self.Id = ko.observable();
        self.errors = ko.observable();

        self.employmentHistory = ko.observableArray([]);
        self.employmentHistory.subscribe(this.onAdded, this);
        self.employmentHistory.push(new EmpPrevHistory(self));

        this.SaveEmploymentHistory = function () {                                   //This wil return employeeDegrees which is nothing but a list of EducationDto of an employee
            //console.log("degrees " + self.employeeDegrees().length);
            if (self.IsValid()) {
                $.ajax({
                    type: "POST",
                    url: "/HRM/Employee/SaveEmploymentHistory/" + val,
                    data: ko.toJSON(self.employmentHistory),  //for passing array to controller,in ko.toJson() parameter should be passed
                    contentType: 'application/json',
                    success: function (data) {
                        toastr.success(data);

                        EmploymentHistoryvm.employmentHistory('');

                        window.location.href = "/HRM/Employee/Index";
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) { }
                });
                //alert("Form Submitted");
            }
            else {
                //console.log("edu errors: " + self.errors().length); 
                self.errors.showAllMessages();

            }
        };

    }

    EmploymentHistory.prototype = {
        onAdded: function () {
            this.errors = ko.validation.group(this);
        },
        addNewRow: function () {
            this.employmentHistory.push(new EmpPrevHistory(this));
        },
        getCanSave: function () {
            return this.errors() && this.errors()().length === 0;
        },
        IsValid: function () {
            //console.log("edu errors: " + this.errors());
            return this.errors() && this.errors().length === 0;
        }
    };
    ////////////////

    //function EducationInfo() {
    //    var self = this;
    //    //self.Id = ko.observable();
    //    self.DegreeName = ko.observable().extend({ required: true});
    //    self.Subject = ko.observable().extend({ required: true, pattern: { message:'Only alpha value required.', params: "^[_A-Za-z ]{1,}$", maxLength: "100" } });
    //    self.PassingYear = ko.observable().extend({ required: true});   //params: "^(19|20)\d{2}$"
    //    self.University = ko.observable().extend({ required: true, pattern: { message: 'Only alpha value required.', params: "^[_A-Za-z ]{1,}$", maxLength: "100" } });
    //    self.Result = ko.observable().extend({ required: true, number:true});

    //    self.errors = ko.validation.group(self);
    //    self.IsValid = ko.computed(function () {
    //        if (self.errors().length == 0)
    //            return true;
    //        return false;
    //    });
    //    self.Submit = function () {

    //        if (self.errors().length == 0) {
    //            self.EmployeeId = ko.observable(val);
    //            $.ajax({
    //                type: "POST",
    //                url: "/Employee/SaveEducationInfo/" + val,
    //                data: ko.toJSON(self),
    //                contentType: 'application/json',
    //                success: function (data) {
    //                    alert(data);

    //                    EducationInfovm.DegreeName('');
    //                    EducationInfovm.Subject('');
    //                    EducationInfovm.PassingYear('');
    //                    EducationInfovm.Result('');
    //                    EducationInfovm.University('');
    //                    self.IsValid = ko.computed(function () {
    //                        if (self.errors().length == 0)
    //                            return true;
    //                        return false;
    //                    });
    //                    window.location.href = "/Employee/Index"
    //                },
    //                error: function (XMLHttpRequest, textStatus, errorThrown) { }
    //            });
    //        } else {
    //            self.errors.showAllMessages();
    //        }
    //    }
    //}



    function parseJsonDate(jsonDateString) {                                        //this function parses jsonDate to DateTime format and returns 
        return new Date(parseInt(jsonDateString.replace('/Date(', '')));            //Date value
    }
    var newJoiningDate;

    function JoiningInfo() {
        var self = this;

        self.GradeStepId = ko.observable({ required: true });
        self.CompanyProfileId = ko.observable({ required: true });
        self.OfficeId = ko.observable({ required: true });
        self.OfficeUnitId = ko.observable({ required: true });
        self.DesignationId = ko.observable({ required: true });
        self.GradeId = ko.observable({ required: true });

        self.WorkShift = ko.observable({ required: true });
        self.WorkShiftList = ko.observableArray([]);
        self.EmployeeType = ko.observable({ required: true });
        self.OfficeList = ko.observableArray([]);
        self.EmployeeTypeList = ko.observableArray([]);
        self.OfficeUnitList = ko.observableArray([]);
        self.GradeStepList = ko.observableArray([]);
        self.GradeList = ko.observableArray([]);

        self.DesignationList = ko.observableArray([]);

        self.GradeId.subscribe(function () {
            if (self.GradeId() > 0) {
                return $.getJSON("/HRM/Employee/GetCorrespondingDesignations?gradeid=" + self.GradeId(), null, function (data) {
                    JoiningInfovm.DesignationList(data);
                }).then(function () {
                    $.getJSON("/HRM/Employee/GetJoiningInfoById?id=" + val, null, function (data) {
                        self.DesignationId(data.DesignationId);
                        self.GetGradeSteps();
                    });
                });
            }
        },
        this);

        self.GetGradeSteps = function () {
            $.ajax({
                type: "GET",
                url: "/HRM/Employee/GetGradeStepsByGradeId?id=" + self.GradeId(),
                dataType: "json",
                success: function (data) {

                    self.GradeStepList(data);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) { }
            });
        }


        self.CompanyProfileList = ko.observableArray([]);
        self.errors = ko.validation.group(self);

        self.IsValid = ko.computed(function () {

            if (self.errors().length == 0)
                return true;
            return false;
        });

        self.GetJoiningInfoDetail = function () {
            $.ajax({
                type: "GET",
                url: "/HRM/Employee/GetJoiningInfoById?id=" + val,
                dataType: "json",

                success: function (data) {
                    self.CompanyProfileId(data.CompanyProfileId);
                    self.GradeId(data.GradeId);
                    self.GradeStepId(data.GradeStepId);
                    self.EmployeeType(data.EmployeeType);
                    self.OfficeId(data.OfficeId);
                    self.OfficeUnitId(data.OfficeUnitId);
                    self.WorkShift(data.WorkShift);

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) { }
            });
        }
        self.Submit = function () {
            console.log("errorlist: " + self.errors());
            if (self.errors().length == 0) {
                self.EmployeeId = ko.observable(val);
                $.ajax({
                    type: "POST",
                    url: "/HRM/Employee/SaveJoiningInfo/",
                    data: ko.toJSON(self),
                    contentType: 'application/json',
                    success: function (data) {
                        toastr.success(data);
                        self.IsValid = ko.computed(function () {
                            if (self.errors().length == 0)
                                return true;
                            return false;
                        });
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) { }
                });
            } else {
                self.errors.showAllMessages();
            }
        }

        self.GetInitialDropdown = function () {
            return $.getJSON("/HRM/Employee/GetCompanyProfiles/", null, function (data) {
                JoiningInfovm.CompanyProfileList(data);
            }).then(function () {
                return $.getJSON("/HRM/Office/GetOffice/", null, function (data) {
                    JoiningInfovm.OfficeList(data);
                }).then(function () {
                    return $.getJSON("/HRM/OfficeUnit/GetOfficeUnits/", null, function (data) {
                        JoiningInfovm.OfficeUnitList(data);
                    }).then(function () {
                        return $.getJSON("/HRM/Employee/GetEmployeeType/", null, function (data) {
                            JoiningInfovm.EmployeeTypeList(data);
                        }).then(function () {
                            return $.getJSON("/HRM/Employee/GetWorkShift/", null, function (data) {
                                JoiningInfovm.WorkShiftList(data);
                            }).then(function () {
                                return $.getJSON("/HRM/Grade/GetGradeSteps/", null, function (data) {
                                    JoiningInfovm.GradeStepList(data);
                                }).then(function () {
                                    return $.getJSON("/HRM/Employee/GetGrades/", null, function (data) {
                                        JoiningInfovm.GradeList(data);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }
        //self.GetInitialProfileDropdown= function () {

        //    //$.getJSON("/Employee/GetCompanyProfiles/" , null, function (data) {
        //    //    JoiningInfovm.CompanyProfileList(data);
        //    //});
        //    return $.ajax({
        //        type: "GET",
        //        url: '/Employee/GetCompanyProfiles/',
        //        contentType: "application/json; charset=utf-8",
        //        dataType: "json",
        //        success:function (data) {
        //            //return data;
        //            self.CompanyProfileList(data);
        //        },
        //        error: function (error) {
        //            alert(error.status + "<--and--> " + error.statusText);
        //        }
        //    });
        //}

        //self.GetInitialDepartmentDropdown = function () {
        //    return $.ajax({
        //        type: "GET",
        //        url: '/Employee/GetDepartments/',
        //        contentType: "application/json; charset=utf-8",
        //        dataType: "json",
        //        success: function (data) {
        //            //return data;
        //            self.DepartMentList(data);
        //        },
        //        error: function (error) {
        //            alert(error.status + "<--and--> " + error.statusText);
        //        }
        //    });
        //}

        //self.GetInitialGradeDropdown = function () {

        //   //return $.getJSON("/Employee/GetGrades/", null, function (data) {
        //   //     JoiningInfovm.GradeList(data);
        //   // });
        //    return $.ajax({
        //        type: "GET",
        //        url: '/Employee/GetGrades/',
        //        contentType: "application/json; charset=utf-8",
        //        dataType: "json",
        //        success: function (data) {
        //            //return data;
        //            self.GradeList(data);
        //        },
        //        error: function (error) {
        //            alert(error.status + "<--and--> " + error.statusText);
        //        }
        //    });
        //}

    }

    function UserInfo() {
        var self = this;
        self.UserId = ko.observable();
        self.Username = ko.observable().extend({ required: true, pattern: { message: 'Only alpha value required.', params: "^[_A-Za-z ]{1,}$", maxLength: "100" } });
        self.Password = ko.observable().extend({ required: true, pattern: { message: 'valid password required.', params: "^[_A-Za-z0-9_*]{6,12}$", maxLength: "100" } });
        self.ConfirmPassword = ko.observable().extend({ required: true, areSame: self.Password });
        self.errors = ko.validation.group(self);
        self.IsValid = ko.computed(function () {
            if (self.errors().length == 0)
                return true;
            return false;
        });
        self.Submit = function () {

            if (self.errors().length == 0) {
                self.EmployeeId = ko.observable(val);
                $.ajax({
                    type: "POST",
                    url: "/Auth/User/UserRegistration",
                    data: ko.toJSON(self),
                    contentType: 'application/json',
                    success: function (data) {
                        toastr.success(data);
                        self.IsValid = ko.computed(function () {
                            if (self.errors().length == 0)
                                return true;
                            return false;
                        });
                        //window.location.href = "/Employee/Index"
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) { }
                });
            } else {
                self.errors.showAllMessages();
            }
        }

        self.GetUserInfoDetails = function () {
            return $.ajax({
                type: "GET",
                url: "/HRM/Employee/GetUserInfoById?id=" + val,
                dataType: "json",
                success: function (data) {
                    //debugger;
                    //console.log(data);
                    //console.log("successfull"+data.DateOfBirth);
                    self.UserId(data.UserId);
                    self.Username(data.Username);
                    self.Password(data.Password);
                    self.ConfirmPassword(data.Password);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) { }
            });
        }

    }

    ko.validation.rules['areSame'] = {
        getValue: function (o) {
            return (typeof o === 'function' ? o() : o);
        },
        validator: function (val, otherField) {
            return val === this.getValue(otherField);
        },
        message: 'The Password and Confirm Password must have the same value'
    };
    ko.validation.registerExtenders();

    var BasicInfovm = new BasicInfo();
    ko.applyBindings(BasicInfovm, document.getElementById('personal'));
    BasicInfovm.GetInitialDropdown();
    var ContactInfovm = new ContactInfo();
    ContactInfovm.GetInitialDropdown();
    ContactInfovm.PresentAddress.GetInitialAddressDropdown();
    ContactInfovm.ParmanentAddress.GetInitialAddressDropdown();

    ko.applyBindings(ContactInfovm, document.getElementById('address'));
    $('#myModal').on('shown.bs.modal', function () {
        BasicInfovm.GetBasicInfoDetails();
        ContactInfovm.GetContactInfoDetails();
        UserInfovm.GetUserInfoDetails();
        $.when(JoiningInfovm.GetInitialDropdown()).done(function () {
            JoiningInfovm.GetJoiningInfoDetail();
        });
        //debugger;
        $("#jqGridEducation").jqGrid({

            url: "/HRM/Employee/GetEducationInfo?id=" + val,
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'EmployeeId', 'InstituteId', 'InstituteName', 'DegreeId', 'DegreeName', 'PassingYear', 'Result', 'Summary'],
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                {
                    key: false, hidden: true, name: 'EmployeeId', index: 'EmployeeId', editable: false

                },
                { key: false, hidden: true, name: 'InstituteId', index: 'InstituteId', width: 140, editable: true, editrules: { required: true, edithidden: true }, edittype: "select", formoptions: { label: "Institute " }, classes: "grid-col" },
                { key: false, name: 'InstituteName', label: 'InstituteName', index: 'InstituteName', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, hidden: true, name: 'DegreeId', index: 'DegreeId', width: 140, editable: true, editrules: { required: true, edithidden: true }, edittype: "select", formoptions: { label: "Degree " }, classes: "grid-col" },
                { key: false, name: 'DegreeName', label: 'Degree Name', index: 'DegreeName', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'PassingYear', index: 'PassingYear', width: 140, editable: true, editrules: { custom_func: validateYear, custom: true, required: true }, label: "PassingYear", formoptions: { label: "Passing Year" }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'Result', index: 'Result', label: "Result", width: 140, editable: true, editrules: { custom_func: validateFloat, custom: true, required: true }, formoptions: { label: "Result" }, align: 'right', searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'Summary', index: 'Summary', editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" }
                //{ key: false, name: 'Gender', index: 'Gender', editable: true, edittype: 'select', editoptions: { value: { 'M': 'Male', 'F': 'Female', 'N': 'None' } } },
                //{ key: false, name: 'ClassName', index: 'ClassName', editable: true, edittype: 'select', editoptions: { value: { '1': '1st Class', '2': '2nd Class', '3': '3rd Class', '4': '4th Class', '5': '5th Class' } } },

            ],
            ondblClickRow: function (rowid) {
                jQuery("#jqGrid").jqGrid('editGridRow', rowid);
            },
            pager: jQuery('#jqControlsEducation'),
            rowNum: 10,
            rowList: [10, 20, 30, 40, 50],
            hoverrows: true,
            sortable: true,
            //width: '70%',
            viewrecords: true,
            caption: 'Education Info Records',
            emptyrecords: 'No Education Info Records are Available to Display',
            jsonReader: {
                root: "rows",
                page: "page",
                total: "total",
                records: "records",
                repeatitems: false,
                Id: "0"
            },
            autowidth: true,

            height: 'auto',//set auto height
            multiselect: false
        }).navGrid('#jqControlsEducation',
            { edit: true, add: true, del: true, search: true, refresh: true },
            {

                zIndex: 10000,
                url: '/HRM/Employee/SaveEducationInfo/',
                closeOnEscape: true,
                width: 'auto',
                height: 'auto',
                closeAfterEdit: true,
                recreateForm: true,
                onInitializeForm: function (formId) { populateInstitute(true); },
                onclickSubmit: function (params, postdata) {
                    postdata = $.extend({}, postdata, { EmployeeId: val });
                    return postdata;
                },
                afterComplete: function (response) {
                    Messager.ShowMessage(response.responseText);
                }
            },
            {
                zIndex: 10000,
                url: '/HRM/Employee/SaveEducationInfo/',
                closeOnEscape: true,
                width: 'auto',
                height: 'auto',
                closeAfterAdd: true,
                onInitializeForm: function (formId) { populateInstitute(false); },
                onclickSubmit: function (params, postdata) {
                    postdata = $.extend({}, postdata, { EmployeeId: val });
                    return postdata;
                },
                afterComplete: function (response) {
                    Messager.ShowMessage(response.responseText);
                }
            },
            {
                zIndex: 10000,
                url: '/HRM/Employee/DeleteEducationInfo',
                closeOnEscape: true,
                closeAfterDelete: true,
                recreateForm: true,
                msg: "Are you sure to delete this EducationInfo? ",
                afterComplete: function (response) {
                    Messager.ShowMessage(response.responseText);
                }
            },
            {
                closeOnEscape: true, multipleSearch: true,
                closeAfterSearch: true
            }
            );

        $("#jqGridTraining").jqGrid({
            url: "/HRM/Employee/GetTrainingInfo/?empid=" + val,
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'TrainingVendorId', 'TrainingVendorName', 'TrainingId', 'TrainingName', 'StartDate', 'EndDate', 'TrainingHours', 'EmployeeId'],
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                { key: false, hidden: true, name: 'TrainingVendorId', index: 'TrainingVendorId', editable: true, edittype: "select", editrules: { edithidden: true, required: true }, formoptions: { label: "Training Vendor: " } },

                { key: false, name: 'TrainingVendorName', index: 'TrainingVendorName', editable: false, label: "TrainingVendorName", searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },

                { key: false, hidden: true, name: 'TrainingId', index: 'TrainingId', editable: true, edittype: "select", editrules: { edithidden: true, required: true }, formoptions: { label: "Training: " } },
                { key: false, name: 'TrainingName', index: 'TrainingName', editable: false, label: "TrainingName", searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },

                 {
                     name: "StartDate", index: 'StartDate', label: "StartDate", formatter: "date", editable: true, edittype: "text",
                     editoptions: {
                         dataInit: function (element) {
                             $(element).datepicker({
                                 id: 'StartDate_datePicker',
                                 dateFormat: 'M/d/yy',
                                 //minDate:0,
                                 maxDate: new Date(),
                                 dateFormat: 'dd-M-yy',
                                 changeYear: true,
                                 showOn: 'focus',
                                 onClose: function (selectedDate) {
                                     // Set the minDate of 'EndDate' as the selectedDate of 'StartDate'
                                     var dt2 = $('#EndDate').datepicker('getDate');
                                     if (dt2 <= selectedDate && dt2 != null) {
                                         //var minDate = $('#EndDate').datepicker('option', 'minDate');
                                         $('#EndDate').datepicker('setDate', selectedDate);
                                     }
                                     $("#EndDate").datepicker("option", "minDate", selectedDate);
                                 }
                             });
                         }, editrules: { required: true }, formoptions: { label: "Start Date: " }
                     }
                 },
                  {
                      name: "EndDate", index: 'EndDate', label: "EndDate", formatter: "date", editable: true, edittype: "text",
                      editoptions: {
                          dataInit: function (element) {
                              $(element).datepicker({
                                  id: 'EndDate_datePicker',
                                  dateFormat: 'M/d/yy',
                                  //minDate: new Date(2010, 0, 1),
                                  maxDate: new Date(),
                                  dateFormat: 'dd-M-yy',
                                  changeYear: true,
                                  showOn: 'focus'
                              });
                          }, editrules: { required: true }, formoptions: { label: "End Date: " }
                      }
                  },
                { key: false, name: 'TrainingHours', index: 'TrainingHours', width: 140, editable: true, label: "TrainingHours", editrules: { custom_func: validatePositive, custom: true, required: true }, align: 'right', searchoptions: { sopt: ['eq', 'ne'] }, classes: "grid-col" },
                { key: false, hidden: true, name: 'EmployeeId', index: 'EmployeeId', editable: true }

            ],
            ondblClickRow: function (rowid) {
                jQuery("#jqGrid").jqGrid('editGridRow', rowid);
            },
            pager: jQuery('#jqControlsTraining'),
            rowNum: 10,
            rowList: [10, 20, 30, 40, 50],
            hoverrows: true,
            sortable: true,
            //width: '70%',
            viewrecords: true,
            caption: 'Training Info Records',
            emptyrecords: 'No Training Info Records are Available to Display',
            jsonReader: {
                root: "rows",
                page: "page",
                total: "total",
                records: "records",
                repeatitems: false,
                Id: "0"
            },
            autowidth: true,

            height: 'auto',//set auto height
            multiselect: false
        }).navGrid('#jqControlsTraining',
        { edit: true, add: true, del: true, search: true, refresh: true },
        {
            zIndex: 20000,
            url: '/HRM/Employee/SaveTrainingInfo/',
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterEdit: true,
            recreateForm: true,
            onInitializeForm: function (formId) { populateVendors(true); },
            onclickSubmit: function (params, postdata) {
                postdata = $.extend({}, postdata, { EmployeeId: val });
                return postdata;
            },
            afterComplete: function (response) {
                Messager.ShowMessage(response.responseText);
            }
        },
        {
            zIndex: 20000,
            url: '/HRM/Employee/SaveTrainingInfo/?empid=' + val,
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterAdd: true,
            onInitializeForm: function (formId) { populateVendors(false); },
            onclickSubmit: function (params, postdata) {
                postdata = $.extend({}, postdata, { EmployeeId: val });
                return postdata;
            },
            afterComplete: function (response) {
                Messager.ShowMessage(response.responseText);
            }
        },
        {
            zIndex: 20000,
            url: '/HRM/Employee/DeleteTrainingInfo',
            closeOnEscape: true,
            closeAfterDelete: true,
            recreateForm: true,
            msg: "Are you sure to delete this TrainingInfo? ",
            afterComplete: function (response) {
                Messager.ShowMessage(response.responseText);
            }
        },
        {
            closeOnEscape: true, multipleSearch: true,
            closeAfterSearch: true
        }
        );

        // EmpHistory section

        $("#jqGridEmpHistory").jqGrid({
            url: "/HRM/Employee/GetEmploymentHistory/?empid=" + val,
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'CompanyName', 'CompanyBusiness', 'Designation', 'Department', 'AreaofExperiences', 'Responsibilities', 'CompanyAddress', 'StartDate', 'EndDate', 'EmployeeId'],
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                { key: false, name: 'CompanyName', index: 'CompanyName', editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'CompanyBusiness', index: 'CompanyBusiness', editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'Designation', index: 'Designation', editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'Department', index: 'Department', editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'AreaofExperiences', index: 'AreaofExperiences', editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'Responsibilities', index: 'Responsibilities', editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'CompanyAddress', index: 'CompanyAddress', editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                {
                    name: "StartDate", index: 'StartDate', label: "StartDate", formatter: "date", editable: true, edittype: "text",
                    editoptions: {
                        dataInit: function (element) {
                            $(element).datepicker({
                                id: 'StartDate_datePicker',
                                dateFormat: 'M/d/yy',
                                //minDate:0,
                                maxDate: new Date(),
                                dateFormat: 'dd-M-yy',
                                changeYear: true,
                                showOn: 'focus',
                                onClose: function (selectedDate) {
                                    // Set the minDate of 'EndDate' as the selectedDate of 'StartDate'
                                    var dt2 = $('#EndDate').datepicker('getDate');
                                    if (dt2 <= selectedDate && dt2 != null) {
                                        //var minDate = $('#EndDate').datepicker('option', 'minDate');
                                        $('#EndDate').datepicker('setDate', selectedDate);
                                    }
                                    $("#EndDate").datepicker("option", "minDate", selectedDate);
                                }
                            });
                        }, editrules: { required: true }, formoptions: { label: "Start Date: " }
                    }
                },
                {
                    name: "EndDate", index: 'EndDate', label: "EndDate", formatter: "date", editable: true, edittype: "text",
                    editoptions: {
                        dataInit: function (element) {
                            $(element).datepicker({
                                id: 'EndDate_datePicker',
                                dateFormat: 'M/d/yy',
                                //minDate: new Date(2010, 0, 1),
                                maxDate: new Date(),
                                dateFormat: 'dd-M-yy',
                                changeYear: true,
                                showOn: 'focus'
                            });
                        }, editrules: { required: true }, formoptions: { label: "End Date: " }
                    }
                },
                { key: false, hidden: true, name: 'EmployeeId', index: 'EmployeeId', editable: true }

            ],
            ondblClickRow: function (rowid) {
                jQuery("#jqGrid").jqGrid('editGridRow', rowid);
            },
            pager: jQuery('#jqControlsEmpHistory'),
            rowNum: 10,
            rowList: [10, 20, 30, 40, 50],
            hoverrows: true,
            sortable: true,
            //width: '70%',
            viewrecords: true,
            caption: 'Training Info Records',
            emptyrecords: 'No Training Info Records are Available to Display',
            jsonReader: {
                root: "rows",
                page: "page",
                total: "total",
                records: "records",
                repeatitems: false,
                Id: "0"
            },
            autowidth: true,

            height: 'auto',//set auto height
            multiselect: false
        }).navGrid('#jqControlsEmpHistory',
        { edit: true, add: true, del: true, search: true, refresh: true },
        {
            zIndex: 20000,
            url: '/HRM/Employee/SaveEmploymentHistory/',
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterEdit: true,
            recreateForm: true,
            onInitializeForm: function (formId) { populateVendors(true); },
            onclickSubmit: function (params, postdata) {
                postdata = $.extend({}, postdata, { EmployeeId: val });
                return postdata;
            },
            afterComplete: function (response) {
                Messager.ShowMessage(response.responseText);
            }
        },
        {
            zIndex: 20000,
            url: '/HRM/Employee/SaveEmploymentHistory/?empid=' + val,
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterAdd: true,
            onInitializeForm: function (formId) { populateVendors(false); },
            onclickSubmit: function (params, postdata) {
                postdata = $.extend({}, postdata, { EmployeeId: val });
                return postdata;
            },
            afterComplete: function (response) {
                Messager.ShowMessage(response.responseText);
            }
        },
        {
            zIndex: 20000,
            url: '/HRM/Employee/DeleteEmploymentHistory',
            closeOnEscape: true,
            closeAfterDelete: true,
            recreateForm: true,
            msg: "Are you sure to delete this TrainingInfo? ",
            afterComplete: function (response) {
                Messager.ShowMessage(response.responseText);
            }
        },
        {
            closeOnEscape: true, multipleSearch: true,
            closeAfterSearch: true
        }
        );

        //

    });
    //BasicInfovm.GetBasicInfoDetails();

    //var EmploymentHistoryVm = new EmploymentHistory();
    //ko.applyBindings(EmploymentHistoryVm, document.getElementById('employmentHistory'));
    var JoiningInfovm = new JoiningInfo();
    ko.applyBindings(JoiningInfovm, document.getElementById('joining'));
    var UserInfovm = new UserInfo();
    ko.applyBindings(UserInfovm, document.getElementById('userinfo'));

});
