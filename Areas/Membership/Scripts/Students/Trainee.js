/// <reference path="../knockout-3.4.0.debug.js" />
/// <reference path="../jquery-2.1.4.js" />
/// <reference path="../finix.util.js" />
/// <reference path="~/Scripts/knockout.validation.min.js" />

$(document).ready(function () {

    ko.validation.init({
        errorElementClass: 'has-error',
        errorMessageClass: 'help-block',
        decorateInputElement: true
    });

    function Address() {
        var self = this;
        self.Id = ko.observable();
        self.CountryId = ko.observable(1);
        self.CountryName = ko.observable();
        self.DivisionId = ko.observable('');
        self.DivisionNameEng = ko.observable('');
        self.DistrictId = ko.observable();
        self.DistrictNameEng = ko.observable('');
        self.ThanaId = ko.observable();
        self.ThanaNameEng = ko.observable('');
        self.PhoneNo = ko.observable().extend({ required: false, pattern: { message: 'Valid Phone Number required.', params: '^(?:\\+88|01)?(?:\\d{11}|\\d{13})$' } });
        self.CellPhoneNo = ko.observable().extend({ required: false, pattern: { message: 'Valid Phone Number required.', params: '^(?:\\+88|01)?(?:\\d{11}|\\d{13})$' } });
        self.Email = ko.observable().extend({ required: true, pattern: { message: 'Valid Email address required.', params: '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$', maxLength: 25 } });
        self.AddressLine1 = ko.observable('');
        self.AddressLine2 = ko.observable('');
        self.PostalCode = ko.observable().extend({ pattern: { message: 'Valid Postal Code required.', params: '^[0-9]*$' }, maxLength: 4});
                                          

        self.DivisionList = ko.observableArray([]);
        self.DistrictList = ko.observableArray([]);
        self.ThanaList = ko.observableArray([]);
        self.LoadDivisionList = function () {
          return  $.ajax({
                type: "GET",
                url: '/Membership/Settings/GetDivisionList?countryId=' + 1,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.DivisionList(data); //Put the response in ObservableArray
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }

        self.LoadDistrictList = function () {
            if (self.DivisionId() > 0) {
                return $.ajax({
                    type: "GET",
                    url: '/Membership/Settings/GetDistrictList?divisionId=' + self.DivisionId(),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        self.DistrictList(data); //Put the response in ObservableArray
                    },
                    error: function (error) {
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            }
            //else {
            //    $('#successModal').modal('show');
            //    $('#successModalText').text('Please select a Division First!');
            //}
        };
          

        self.LoadThanaList = function () {
            
            if (self.DistrictId() > 0) {
                return $.ajax({
                    type: "GET",
                    url: '/Membership/Settings/GetThanaList?districtId=' + self.DistrictId(),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        self.ThanaList(data); //Put the response in ObservableArray
                    },
                    error: function (error) {
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            }
            //else {
            //    $('#successModal').modal('show');
            //    $('#successModalText').text('Please select a District First!');
            //}
        }

        self.DivisionId.subscribe(function () {
            if (self.DivisionId() > 0) {
                self.LoadDistrictList();
            }
        });
        self.DistrictId.subscribe(function () {
            if (self.DistrictId() > 0) {
                self.LoadThanaList();
            }
        });

        self.LoadAddress = function (data) {
            //console.log("Data: " + ko.toJSON(data));
            self.Id(data.Id);
            self.CountryId(data.CountryId);
            self.DivisionId(data.DivisionId);
            self.DistrictId(data.DistrictId);
            self.ThanaId(data.ThanaId);
            self.PhoneNo(data.PhoneNo);
            self.CellPhoneNo(data.CellPhoneNo);
            self.Email(data.Email);
            self.AddressLine1(data.AddressLine1);
            self.AddressLine2(data.AddressLine2);
            self.PostalCode(data.PostalCode);
            
        };
       
    }
    function TrainingCourses() {
        var self = this;
        self.Id = ko.observable();
        self.TraineeId = ko.observable();
        self.Course = ko.observable('').extend({ required: true });      // by RANA
        //self.Course = ko.observable('');                                    // by RANA          
        self.CourseFee = ko.observable(0.00).extend({ pattern: { message: 'Numaric value is required.', params: '^[0-9]*$', maxLength: "10" } });
        self.CollectedAmount = ko.observable(0.00).extend({ pattern: { message: 'Numaric value is required.', params: '^[0-9]*$', maxLength: "10" } });
        self.MRNo = ko.observable();
        
        self.LoadCourseDetail = function (data) {
            //console.log("Data: " + ko.toJSON(data));
            self.Id(data.Id);
            self.TraineeId(data.TraineeId);
            self.Course(data.Course);
            self.CourseFee(data.CourseFee);
            self.CollectedAmount(data.BrandName);
            self.MRNo(data.BrandId);
        };
    }

    function TraineeVm() {

        var self = this;
        

        self.Id = ko.observable();
        self.Name = ko.observable('');
        self.TraineeNo = ko.observable('');
        self.AreaId = ko.observable('');
        self.FathersName = ko.observable('');
        self.MothersName = ko.observable('');
        
        self.Gender = ko.observable();
        self.Religion = ko.observable();
        self.LastAcademicQualification = ko.observable('');
        self.Occupation = ko.observable();
        self.FromYear = ko.observable('').extend({ required: true });
        self.Years = ko.observableArray([]);
        
        self.SourceOfInformation = ko.observable();
        self.OtherSourceOfInformation = ko.observable('');
        self.AccountsOfficer = ko.observable('');
        self.AdmissionOfficer = ko.observable('');
        self.UrlOfPhoto = ko.observable();
        self.UrlOfSignature = ko.observable();
        self.VirtualUrlOfPhoto = ko.observable();
        self.VirtualUrlOfSignature = ko.observable();
        self.TotalFeeAmount = ko.observable(0.00);
        self.TotalCollectedAmount = ko.observable(0.00);
        self.DiscountAmount = ko.observable(0.00);
        self.MRNo = ko.observable('');
        self.Batch = ko.observable();
        self.Bank = ko.observable('');
        self.DateOfBirth = ko.observable(moment());
        self.DateOfBirthText = ko.observable();
        self.DateOfAdmission = ko.observable(moment());
        self.DateOfAdmissionText = ko.observable();
        self.Status = ko.observable();
        self.IsActive = ko.observable(false);
        //self.IsActive = ko.observable(true);   //by RANA

        self.AddressId = ko.observable();
        self.Address = new Address();
        //self.Courses = ko.observableArray([new TrainingCourses])
        ////self.addCourse = function () {
        ////    self.Courses.push(new TrainingCourses());
        ////};
        ////self.removeCourse = function (trcourse) {
        ////    self.Courses.remove(trcourse);
        ////};
        //self.addCourse = function () {
        //    self.Courses.push(new TrainingCourses());
        //}
        self.Courses = ko.observableArray([]);
        self.Students = ko.observableArray([]);

        self.addCourse = function () {
            var Course = new TrainingCourses();
            Course.TraineeId(self.Id());
            self.Courses.push(Course);

        }

        self.removedCourse = ko.observableArray([]);
        self.removeCourse = function (line) {
            if (line.Id() > 0)
                self.removedCourse.push(line.Id());
            self.Courses.remove(line);
        }


        self.Link1 = ko.observable();
        self.Link2 = ko.observable();
        self.Link3 = ko.observable();

        self.Title1 = ko.observable('PDF');
        self.Title2 = ko.observable('Excel');
        self.Title3 = ko.observable('Word');

        self.Genders = ko.observableArray([]);
        self.Religions = ko.observableArray([]);
        self.SOI = ko.observableArray([]);
        self.Trainees = ko.observableArray([]);
        
        self.CourseList = ko.observableArray([]);
        self.LoadCourses = function () {
            return $.ajax({
                type: "GET",
                url: '/Membership/Students/GetAllCourses',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    //console.log("Courses :" + ko.toJSON(data));
                    self.CourseList(data);
                },
                error: function (error) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(error.statusText);
                }
            });
        }

        self.GetStudentList = function (searchTerm, callback) {
            var submitData = {
                prefix: searchTerm,
                exclusionList: self.Students()
            };
            $.ajax({
                type: "POST",
                url: '/Membership/Students/GeStudentListForAutoFill',
                data: ko.toJSON(submitData),
                contentType: "application/json",
                success: function (data) {
                    self.Students(data);
                },
                error: function () {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            }).done(callback);
        };

        self.GetYears = function () {
            return $.ajax({
                type: "GET",
                url: '/Membership/FeeCollection/GetYearList',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.Years(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }

        self.LoadGender = function () {
            
            return $.ajax({

                type: "GET",
                url: '/Membership/Students/GetAllGender',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.Genders(data);
                },
                error: function (error) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(error.statusText);
                }
            });
        };

        self.LoadReligions = function () {

            return $.ajax({
                type: "GET",
                url: '/Membership/Students/GetAllReligions',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.Religions(data);

                },
                error: function (error) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(error.statusText);
                }
            });
        };

        self.LoadSourceOfInformation = function () {
            return $.ajax({
                type: "GET",
                url: '/Membership/Students/GetAllSourceOfInformation',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.SOI(data);

                },
                error: function (error) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(error.statusText);
                }
            });
        };

        self.saveTrainee = function () {
            self.DateOfBirthText(moment(self.DateOfBirth()).format('DD/MM/YYYY'));
            self.DateOfAdmissionText(moment(self.DateOfAdmission()).format('DD/MM/YYYY'));
    
            $.ajax({
                type: "POST",
                url: '/Membership/Students/SaveTrainee',
                data: ko.toJSON(this),
                contentType: "application/json",
                success: function (data) {
                    
                    console.log(data.Id);
                    self.Id(data.Id);
                    $('#successModal').modal('show');
                    $('#successModalText').text(data.Message);

                    self.GetAllDiv();
                    // self.CodeVisible(true);
                },
                error: function () {
                    $('#successModal').modal('show');
                    $('#successModalText').text(error.statusText);

                }
            });

        };
        
        self.getToData = function () {
            
            url = '/Auth/CompanyProfile/DateToday';
            url += '?CompanyProfileId=1';
            return $.ajax({
                type: "GET",
                url: url,
                contentType: "application/json",
                success: function (data) {
                    
                    self.DateOfAdmission(moment(data));
                },
                error: function () {
                    
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        };

        self.saveAddress = function () {
            
            $.ajax({
                type: "POST",
                url: '/Membership/Students/SaveAddress',
                data: ko.toJSON(this),
                contentType: "application/json",
                success: function (data) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(data.Message);
                    self.saveAttachment();
                },
                error: function () {
                    $('#successModal').modal('show');
                    $('#successModalText').text(error.statusText);

                }
            });

        };

        //commented by RANA
        self.saveCourses = function () {
            //if (self.Courses().length > 0) {
                $.ajax({
                    type: "POST",
                    url: '/Membership/Students/SaveCourses',
                    data: ko.toJSON(this),
                    contentType: "application/json",
                    success: function (data) {

                        $('#successModal').modal('show');
                        $('#successModalText').text(data.Message);

                    },
                    error: function () {
                        $('#successModal').modal('show');
                        $('#successModalText').text(error.statusText);

                    }
                });
            //}
            //else {
            //    $('#successModal').modal('show');
            //    $('#successModalText').text('Please select a Course');
            //}

        };

        self.GetAllDiv = function () {
            if (self.Id() > 0) {
                $("#Contact :input").attr("disabled", false);
                $("#CourseSelection :input").attr("disabled", false);
                $("#Admission :input").attr("disabled", false);
            }
            else {
                $("#Contact :input").attr("disabled", true);
                $("#CourseSelection :input").attr("disabled", true);
                $("#Admission :input").attr("disabled", true);
            }

        };

        self.saveAttachment = function () {
            var photoFile = $('#PhotoFile').prop('files')[0];
            var signatureFile = $('#SignatureFile').prop('files')[0];
           
            var formData = new FormData();
            formData.append('PhotoPath', self.UrlOfPhoto());
            formData.append('PhotoPathName', photoFile);
            //formData.append('FilePath', attachment.PathName());
            formData.append('TraineeId', self.Id());
            formData.append('SignaurePath', self.UrlOfPhoto());
            formData.append('SignaurePathName', signatureFile);

            $.ajax({
                type: "POST",
                url: '/Membership/Students/SaveImages',
                data: formData,
                contentType: false,
                processData: false,
                cache: false,
                success: function (data) {
                    //$('#successModal').modal('show');
                    //$('#successModalText').text(data.Message);
                    //self.UrlOfPhoto();
                    //self.LoadDocumentList();
                    //self.Attachment.Refresh();
                   // self.saveCourses();
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });

        };

        self.TraineeAdmission = function () {
            self.DateOfAdmissionText(moment(self.DateOfAdmission()).format('DD/MM/YYYY'));
           var data = {
                MRNo: self.MRNo(),
                Batch: self.Batch(),
                DateOfAdmission: self.DateOfAdmission(),
                Id: self.Id()
            };
            $.ajax({
                url: '/Membership/Students/TraineeAdmission',
                type: 'POST',
                contentType: 'application/json',
                data: ko.toJSON(data),
                success: function (data) {
                    //if (data.Success == false) {
                        $('#successModal').modal('show');
                        $('#successModalText').text(data.Message);
                   
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        };
        
        self.LoadTrainee = function () {
            if (self.Id() > 0) {
                return $.ajax({
                    type: "GET",
                    url: '/Membership/Students/GetStudentInformation?id=' + self.Id(),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        //console.log("Data :" + ko.toJSON(data));
                        self.Id(data.Id);
                        self.Name(data.Name);
                        self.FathersName(data.FathersName);
                        self.MothersName(data.MothersName);
                        self.TraineeNo(data.TraineeNo);
                        $.when(self.LoadGender()).done(function () {
                            self.Gender(data.Gender);
                        });
                        $.when(self.LoadReligions()).done(function () {
                            self.Religion(data.Religion);
                        });
                        $.when(self.LoadSourceOfInformation()).done(function () {
                            self.SourceOfInformation(data.SourceOfInformation);
                        });
                        self.Occupation(data.Occupation);
                        self.LastAcademicQualification(data.LastAcademicQualification);
                        self.OtherSourceOfInformation(data.OtherSourceOfInformation);
                        self.DateOfBirth(moment(data.DateOfBirth));
                        self.DateOfAdmission(moment(data.DateOfAdmission));
                        $.when(self.GetYears()).done(function () {
                            self.FromYear(data.FromYear);
                        });
                        
                        self.AddressId(data.AddressId);
                        //var trAddress = new Address();
                        
                        //if (typeof (data.Address) != 'undefined') {
                        //    trAddress.LoadAddress(data.Address);
                            
                        //}

                        self.Address.Id(data.Address.Id);
                        self.Address.AddressLine1(data.Address.AddressLine1);
                        self.Address.AddressLine2(data.Address.AddressLine2);
                        self.Address.Email(data.Address.Email);
                        self.Address.CellPhoneNo(data.Address.CellPhoneNo);
                        self.Address.PhoneNo(data.Address.PhoneNo);
                        self.Address.PostalCode(data.Address.PostalCode);
                        self.Address.CountryId(1);
                        $.when(self.Address.LoadDivisionList()).done(function () {
                            self.Address.DivisionId(data.Address.DivisionId);
                            $.when(self.Address.LoadDistrictList()).done(function () {
                                self.Address.DistrictId(data.Address.DistrictId);
                                $.when(self.Address.LoadThanaList()).done(function () {
                                    self.Address.ThanaId(data.Address.ThanaId);
                                });
                            });
                        });

                        self.MRNo(data.MRNo);
                        self.Batch(data.Batch);
                        
                        //self.UrlOfPhoto(data.UrlOfPhoto);
                        //self.UrlOfSignature(data.UrlOfSignature);
                        if (typeof (data.VirtualUrlOfPhoto) != '')
                            self.VirtualUrlOfPhoto(data.VirtualUrlOfPhoto);
                        if (typeof (data.VirtualUrlOfSignature) != '')
                            self.VirtualUrlOfSignature(data.VirtualUrlOfSignature);
                        self.Status(data.Status);
                        if (data.Status == 1) {
                            $("#CourseSelection :input").attr("disabled", true);
                            self.IsActive(false);
                        }

                        else {
                            $("#CourseSelection :input").attr("disabled", false);
                            self.IsActive(true);
                        }


                            
                        if (data.Courses.length > 0) {
                            $.when(self.LoadCourses()).done(function () {
                                $.each(data.Courses, function (index, value) {
                                    var aDetail = new TrainingCourses();
                                    if (typeof (value) != 'undefined') {
                                        aDetail.LoadCourseDetail(value);
                                        self.Courses.push(aDetail);
                                    }
                                });
                            });
                        }
                    },
                    error: function (error) {
                        $('#successModal').modal('show');
                        $('#successModalText').text(error.statusText);
                    }
                });

            }
            


        };

        self.BrowseSignature = function () {
            window.open(self.VirtualUrlOfSignature(), '_blank');
        };

        

        self.InitialValueLoad = function () {
            self.LoadGender();
            self.LoadReligions();
            self.LoadSourceOfInformation();
            self.Address.LoadDivisionList();
            self.LoadCourses();
            self.GetYears();
            self.getToData();
           // self.GetAllDiv();
                       
        };

        self.queryString = function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        };

        self.errors = ko.validation.group(self);
        self.IsValid = ko.computed(function () {
            var err = self.errors().length;
            if (err == 0)
                return true;
            return false;
        });
    }

    var vm = new TraineeVm();
    vm.Id(vm.queryString("Id"));
    vm.InitialValueLoad();
    vm.LoadTrainee();
    ko.applyBindings(vm, $('#TraineeDiv')[0]);
});