$(document).ready(function () {
    
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
        self.FirstName = ko.observable().extend({ required: true, pattern: { message: 'Only alphanumeric value required.', params: "^[_A-Za-z ]{1,}$", maxLength: "100" } });
        self.LastName = ko.observable().extend({ required: true, pattern: { message: 'Only alphanumeric value required.', params: "^[_A-Za-z ]{1,}$", maxLength: "100" } });
        self.FatherFirstName = ko.observable().extend({ required: true, pattern: { message: 'Only alphanumeric value required.', params: "^[_A-Za-z ]{1,}$", maxLength: "100" } });
        self.FatherLastName = ko.observable().extend({ required: true, pattern: { message: 'Only alphanumeric value required.', params: "^[_A-Za-z ]{1,}$", maxLength: "100" } });
        self.MotherFirstName = ko.observable().extend({ required: true, pattern: { message: 'Only alphanumeric value required.', params: "^[_A-Za-z ]{1,}$", maxLength: "100" } });
        self.MotherLastName = ko.observable().extend({ required: true, pattern: { message: 'Only alphanumeric value required.', params: "^[_A-Za-z ]{1,}$", maxLength: "100" } });
        self.DateOfBirth = ko.observable();
        self.DateOfBirthTxt = ko.observable();
        self.DateOfBirth.subscribe(function () {
            self.DateOfBirthTxt(moment(self.DateOfBirth()).format('DD/MM/YYYY'));
        });
        self.GenderList = ko.observableArray([]);
        self.Gender = ko.observable().extend({ required: true });
        self.MaritalStatusList = ko.observableArray([]);
        self.MaritalStatus = ko.observable().extend({ required: true });
        //self.Countries = ko.observableArray(print_country("country"));
        self.ReligionList = ko.observableArray([]);
        self.Religion = ko.observable().extend({ required: true });
        self.BloodGroupList = ko.observableArray([]);
        self.BloodGroup = ko.observable().extend({ required: true });
        self.NationalityList = ko.observableArray([]);
        self.Nationality = ko.observable();
        self.NID = ko.observable().extend({ required: true, pattern: { message: 'Enter correct NID.', params: "^[0-9]{17}$", maxLength: "100" } });
        self.IMEINo = ko.observable();
        //self.Photo = ko.observable();
        self.Photo = ko.observable({
            file: ko.observable()
        });
        self.errors = ko.validation.group(self);
        self.IsValid = ko.computed(function () {
            if (self.errors().length == 0)
                return true;
            return false;
        });
        self.GetBasicInfoDetails = function () {
            return $.ajax({
                type: "GET",
                url: "/FAMS/Employee/GetBasicInfoById/?id=" + val,
                dataType: "json",
                success: function (data) {
                    //debugger;
                    self.FirstName(data.FirstName);
                    self.LastName(data.LastName);
                    self.FatherFirstName(data.FatherFirstName);
                    self.FatherLastName(data.FatherLastName);
                    self.MotherFirstName(data.MotherFirstName);
                    self.MotherLastName(data.MotherLastName);
                    self.Nationality(data.Nationality);
                    self.DateOfBirth(data.DateOfBirth ? moment(data.DateOfBirth) : '');
                    dobDate = data.DateOfBirth;
                    self.Gender(data.Gender);
                    self.NID(data.NID);
                    self.MaritalStatus(data.MaritalStatus);
                    self.IMEINo(data.IMEINo);
                    self.Religion(data.Religion);
                    self.BloodGroup(data.BloodGroup);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) { }
            });
        };

        self.GetInitialDropdown = function () {
            
            $.getJSON("/FAMS/Employee/GetGenderList", null, function (data) {
                BasicInfovm.GenderList(data);
            });
            $.getJSON("/FAMS/Employee/GetMaritalStatus", null, function (data) {
                BasicInfovm.MaritalStatusList(data);
            });
            $.getJSON("/FAMS/Employee/GetReligionList", null, function (data) {
                BasicInfovm.ReligionList(data);
            });

            $.getJSON("/FAMS/Employee/GetBloodGroup", null, function (data) {
                BasicInfovm.BloodGroupList(data);
            });
        };

        self.Submit = function () {
            // self.DateOfBirth(dobDate);
            if (self.IsValid()) {
                //self.EmployeeId = ko.observable(val);
                //initial EmployeeId of BasicInfoDto,can't be initialized outside submit function

                $.ajax({
                    type: "POST",
                    url: "/FAMS/Employee/SaveEmployee/" + val,

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

    }

    

    function ContactAddress() {
        var self = this;
        self.IsChanged = ko.observable(false);
        self.AddressLine1 = ko.observable().extend({ required: true });
        self.AddressLine2 = ko.observable().extend({ required: true });
        self.PostalCode = ko.observable().extend({ required: true });
        // self.Country = ko.observable().extend({ required: true });
        self.CountryId = ko.observable(1);
        self.DivisionId = ko.observable().extend({ required: true });
        self.DistrictId = ko.observable().extend({ required: true });
        self.ThanaId = ko.observable().extend({ required: true });
       // self.AreaId = ko.observable().extend({ required: true });
        self.DivisionList = ko.observableArray([]);
        self.DistrictList = ko.observableArray([]);
        self.ThanaList = ko.observableArray([]);
        //self.AreaList = ko.observableArray([]);

        //$.getJSON("/FAMS/Employee/GetDivisionList", null, function (data) {
        //   self.DivisionList(data);
        //});

        self.CountryId.subscribe(function () {
            self.IsChanged(true);
            //var officecountryId = self.CountryId();
            if (self.CountryId() > 0) {
                self.LoadDivisionByCountry();
            }

        });

        self.DivisionId.subscribe(function () {
            self.IsChanged(true);
            //var officecountryId = self.CountryId();
            if (self.DivisionId() > 0) {
                self.LoadDistrictByDivision();
            }

        });

        self.DistrictId.subscribe(function () {
            self.IsChanged(true);
            //var officecountryId = self.CountryId();
            if (self.DistrictId() > 0) {
                self.LoadThanaByDistrict();
            }
        });

        self.LoadDivisionByCountry = function () {
            if (self.CountryId() > 0) {
                return $.ajax({
                    type: "GET",
                    url: '/FAMS/Employee/GetDivisionList',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        self.DivisionList(data);
                    },
                    error: function (error) {
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            } else {
                return false;
            }
        }

        self.LoadDistrictByDivision = function () {
            if (self.DivisionId() > 0) {
                return $.ajax({
                    type: "GET",
                    url: '/FAMS/Employee/GetDistrictByDivisionId/?divid=' + self.DivisionId(),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        self.DistrictList(data);
                    },
                    error: function (error) {
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            } else {
                return false;
            }
        }

        self.LoadThanaByDistrict = function () {
            if (self.DistrictId() > 0) {
                return $.ajax({
                    type: "GET",
                    url: '/FAMS/Employee/GetThanaByDistrictId/?distid=' + self.DistrictId(),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        self.ThanaList(data);
                    },
                    error: function (error) {
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            } else {
                return false;
            }
        }

        //self.DivisionId.subscribe(function (newValue) {
        //    $.getJSON("/FAMS/Employee/GetDistrictByDivisionId/?divid=" + newValue, null, function (data) {
        //        if (data != null) {
        //            self.DistrictList(data);
        //        }
        //    });
        //});
        //self.DistrictId.subscribe(function (newValue) {
        //    $.getJSON("/FAMS/Employee/GetThanaByDistrictId/?distid=" + newValue, null, function (data) {
        //        if (data != null) {
        //            self.ThanaList(data);
        //        }
        //    });
        //});
        self.GetInitialAddressDropdown = function () {
            //self.DivisionId.subscribe(function () { //DesignationList is populated with change of selectedGradeId 
            //    $.getJSON("/Location/GetLocationHierarchy/?parentid=" + self.DivisionId(), null, function (data) {
            //        self.DistrictList(data);
            //    });
            //});
            //self.DistrictId.subscribe(function () { //DesignationList is populated with change of selectedGradeId 
            //    $.getJSON("/Location/GetLocationHierarchy/?parentid=" + self.DistrictId(), null, function (data) {
            //        self.ThanaList(data);
            //    });
            //});
            //self.ThanaId.subscribe(function () { //DesignationList is populated with change of selectedGradeId 
            //    $.getJSON("/Location/GetLocationHierarchy/?parentid=" + self.ThanaId(), null, function (data) {
            //        self.AreaList(data);
            //    });
            //});
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
        //self.CountryList = ko.observableArray([]);

        self.PhoneNo = ko.observable().extend({ required: true, digit: true });
        self.Email = ko.observable().extend({ required: true, email: true });
        self.EmergencyContactPerson = ko.observable();
        self.EmergencyContactPhone = ko.observable().extend({ required: true, digit: true });
        self.EmergencyContactRelation = ko.observable().extend({ required: true, pattern: { message: 'Only alpha value required.', params: "^[_A-Za-z ]{1,}$", maxLength: "100" } });
        self.errors = ko.validation.group(self);
        self.IsValid = ko.computed(function () {
            if (self.errors().length == 0)
                return true;
            return false;
        });
        self.GetContactInfoDetails = function () {
            return $.ajax({
                type: "GET",
                url: "/FAMS/Employee/GetContactInfoByEmpId/?EmpId=" + val,
                dataType: "json",
                success: function (data) {
                    self.PresentAddress.AddressLine1(data.PresentAddress !=null ? (data.PresentAddress.AddressLine1 != null ? data.PresentAddress.AddressLine1 : "") : "");
                    self.PresentAddress.AddressLine2(data.PresentAddress !=null ? (data.PresentAddress.AddressLine2 != null ? data.PresentAddress.AddressLine2 : "") : "");
                    self.PresentAddress.PostalCode(data.PresentAddress != null ? (data.PresentAddress.PostalCode != null ? data.PresentAddress.PostalCode : "") : "");
                    self.PresentAddress.DivisionId(data.PresentAddress != null ? (data.PresentAddress.DivisionId != null ? data.PresentAddress.DivisionId : "") : "");

                    self.PresentAddress.DistrictId(data.PresentAddress != null ? (data.PresentAddress.DistrictId != null ? data.PresentAddress.DistrictId : "") : "");
                    self.PresentAddress.ThanaId(data.PresentAddress != null ? (data.PresentAddress.ThanaId != null ? data.PresentAddress.ThanaId : "") : "");
                    
                    $.when(self.PresentAddress.LoadDivisionByCountry()).done(function () {
                        self.PresentAddress.DivisionId(data.PresentAddress.DivisionId);
                        self.PresentAddress.IsChanged(false);
                        $.when(self.PresentAddress.LoadDistrictByDivision()).done(function () {
                            self.PresentAddress.DistrictId(data.PresentAddress.DistrictId);
                            self.PresentAddress.IsChanged(false);
                            $.when(self.PresentAddress.LoadThanaByDistrict()).done(function () {
                                self.PresentAddress.ThanaId(data.PresentAddress.ThanaId);
                                self.PresentAddress.IsChanged(false);
                            });
                        });
                    });

                    self.ParmanentAddress.AddressLine1(data.ParmanentAddress != null ? (data.ParmanentAddress.AddressLine1 != null ? data.ParmanentAddress.AddressLine1 : "") : "");
                    self.ParmanentAddress.AddressLine2(data.ParmanentAddress != null ? (data.ParmanentAddress.AddressLine2 != null ? data.ParmanentAddress.AddressLine2 : "") : "");
                    self.ParmanentAddress.PostalCode(data.ParmanentAddress != null ? (data.ParmanentAddress.PostalCode != null ? data.ParmanentAddress.PostalCode : "") : "");
                    
                    $.when(self.ParmanentAddress.LoadDivisionByCountry()).done(function () {
                        self.ParmanentAddress.DivisionId(data.ParmanentAddress.DivisionId);
                        self.ParmanentAddress.IsChanged(false);
                        $.when(self.ParmanentAddress.LoadDistrictByDivision()).done(function () {
                            self.ParmanentAddress.DistrictId(data.ParmanentAddress.DistrictId);
                            self.ParmanentAddress.IsChanged(false);
                            $.when(self.ParmanentAddress.LoadThanaByDistrict()).done(function () {
                                self.ParmanentAddress.ThanaId(data.ParmanentAddress.ThanaId);
                                self.ParmanentAddress.IsChanged(false);
                            });
                        });
                    });
                    

                    

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
                $.ajax({
                    type: "POST",
                    url: "/FAMS/Employee/SaveContactInfo/?empid=" + val,
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

        self.GetInitialDropdown = function () {
            
            //$.getJSON("/Location/GetLocationHierarchy/", null, function (data) {
            //    ContactInfovm.PresentAddress.DivisionList(data);
            //});
            //$.getJSON("/Location/GetLocationHierarchy/", null, function (data) {
            //    ContactInfovm.ParmanentAddress.DivisionList(data);
            //});
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

        this.SaveTraining = function () {//This wil return employeeDegrees which is nothing but a list of EducationDto of an employee
            
            if (self.IsValid()) {
                $.ajax({
                    type: "POST",
                    url: "/FAMS/Employee/SaveTrainingInfo/" + val,
                    data: ko.toJSON(self.employeeTrainings),  //for passing array to controller,in ko.toJson() parameter should be passed
                    contentType: 'application/json',
                    success: function (data) {
                        toastr.success(data);

                        TrainingInfovm.employeeTrainings('');

                        window.location.href = "/FAMS/Employee/Index";
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) { }
                });
                //alert("Form Submitted");
            }
            else {
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
            if (self.IsValid()) {
                $.ajax({
                    type: "POST",
                    url: "/FAMS/Employee/SaveEducationInfo/" + val,
                    data: ko.toJSON(self.employeeDegrees), //for passing array to controller,in ko.toJson() parameter should be passed
                    contentType: 'application/json',
                    success: function (data) {
                        toastr.success(data);

                        EducationInfovm.employeeDegrees('');

                        window.location.href = "/FAMS/Employee/Index"
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) { }
                });
                //alert("Form Submitted");
            } else {
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
            return this.errors() && this.errors().length === 0;
        }
    };

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

        //self.Id = ko.observable();
       // self.JoiningDate = ko.observable().extend({ required: true, date: true });

        self.GradeStepId = ko.observable({ required: true });
        self.CompanyProfileId = ko.observable({ required: true });
        self.OfficeId = ko.observable({ required: true });
        self.OfficeUnitId = ko.observable({ required: true });
        self.DesignationId = ko.observable({ required: true });
        self.GradeId = ko.observable({ required: true });
        
        //self.WorkShift = ko.observable({ required: true });
        //self.WorkShiftList = ko.observableArray([]);
        self.EmployeeType = ko.observable({ required: true });
        self.OfficeList = ko.observableArray([]);
        self.EmployeeTypeList = ko.observableArray([]);
        //self.OfficeUnitList = ko.observableArray([]);
        //self.GradeStepList = ko.observableArray([]);
        //self.GradeList = ko.observableArray([]);

        self.DesignationList = ko.observableArray([]);


        //self.CompanyProfileList = ko.observableArray([]);
        self.errors = ko.validation.group(self);

        self.IsValid = ko.computed(function () {

            if (self.errors().length == 0)
                return true;
            return false;
        });

        self.GetJoiningInfoDetail = function () {
            // var Id = getUrlParameter('Id');
            $.ajax({
                type: "GET",
                url: "/FAMS/Employee/GetJoiningInfoById/?id=" + val,
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
            //self.JoiningDate(newJoiningDate);    //initializing JoiningDate again due to send in dateTime format
            if (self.errors().length == 0) {
                self.EmployeeId = ko.observable(val);


                $.ajax({
                    type: "POST",
                    url: "/FAMS/Employee/SaveJoiningInfo/",
                    data: ko.toJSON(self),                                      //data contains all properties contained in self,which are validated properly
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

        self.GetInitialDropdown = function () {
            return $.getJSON("/FAMS/Employee/GetCompanyProfiles/", null, function (data) {
                JoiningInfovm.CompanyProfileList(data);
            }).then(function () {
                return $.getJSON("/FAMS/Office/GetOffice/", null, function (data) {
                    JoiningInfovm.OfficeList(data);
                }).then(function () {
                    return $.getJSON("/FAMS/OfficeUnit/GetOfficeUnits/", null, function (data) {
                        JoiningInfovm.OfficeUnitList(data);
                    }).then(function () {
                        return $.getJSON("/FAMS/Employee/GetEmployeeType/", null, function (data) {
                            JoiningInfovm.EmployeeTypeList(data);
                        }).then(function () {
                            return $.getJSON("/FAMS/Employee/GetWorkShift/", null, function (data) {
                                JoiningInfovm.WorkShiftList(data);
                            }).then(function () {
                                return $.getJSON("/FAMS/Grade/GetGradeSteps/", null, function (data) {
                                    JoiningInfovm.GradeStepList(data);
                                }).then(function () {
                                    return $.getJSON("/FAMS/Employee/GetGrades/", null, function (data) {
                                        JoiningInfovm.GradeList(data);
                                    });
                                });
                            });
                        });
                    });
                })


            });
        }
        

    }

    function UserInfo() {
        var self = this;
        //self.Id = ko.observable();
        self.Username = ko.observable().extend({ required: true }); // pattern: { message: 'Only alpha value required.', params: "^[_A-Za-z ]{1,}$", maxLength: "100" }
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
                    url: "/Auth/User/UserRegistration/" + val,
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
                url: "/FAMS/Employee/GetUserInfoByEmpId/?empId=" + val,
                dataType: "json",
                success: function (data) {
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
    //ContactInfovm.PresentAddress.GetInitialAddressDropdown();
    //ContactInfovm.ParmanentAddress.GetInitialAddressDropdown();

    ko.applyBindings(ContactInfovm, document.getElementById('address'));
    $('#myModal').on('shown.bs.modal', function () {
        BasicInfovm.GetBasicInfoDetails();
        ContactInfovm.GetContactInfoDetails();
        UserInfovm.GetUserInfoDetails();
        //$.when(JoiningInfovm.GetInitialDropdown()).done(function () {
        //    JoiningInfovm.GetJoiningInfoDetail();
        //});
        //
        $("#jqGridEducation").jqGrid({
            
            url: "/FAMS/Employee/GetEducationInfo/?id=" + val,
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'EmployeeId', 'InstituteId', 'Institute Name', 'DegreeId', 'Degree Name', 'Passing Year', 'Result', 'Summary'],
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
                url: '/FAMS/Employee/SaveEducationInfo/',
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
                url: '/FAMS/Employee/SaveEducationInfo/',
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
                url: '/FAMS/Employee/DeleteEducationInfo',
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
            url: "/FAMS/Employee/GetTrainingInfo/?empid=" + val,
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'TrainingVendorId', 'Training Vendor Name', 'TrainingId', 'Training Name', 'Start Date', 'End Date', 'Training Hours', 'EmployeeId'],
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                { key: false, hidden: true, name: 'TrainingVendorId', index: 'TrainingVendorId', editable: true, edittype: "select", editrules: {edithidden: true, required: true}, formoptions: { label: "Training Vendor: " } },

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
            url: '/FAMS/Employee/SaveTrainingInfo/',
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
            url: '/FAMS/Employee/SaveTrainingInfo/?empid=' + val,
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
            url: '/FAMS/Employee/DeleteTrainingInfo',
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

    });
    //BasicInfovm.GetBasicInfoDetails();
    // var TrainingInfovm = new TrainingInfo();
    // ko.applyBindings(TrainingInfovm, document.getElementById('training'));
    // var EducationInfovm = new EducationInfo();
    // ko.applyBindings(EducationInfovm, document.getElementById('education'));
    //var JoiningInfovm = new JoiningInfo();
    //ko.applyBindings(JoiningInfovm, document.getElementById('joining'));
    
    var UserInfovm = new UserInfo();
    ko.applyBindings(UserInfovm, document.getElementById('userinfo'));

});
