$(document).ready(function () {
    ko.validation.init({
        errorElementClass: 'has-error',
        errorMessageClass: 'help-block',
        decorateInputElement: true
    });
    function address() {
        var self = this;

        self.Id = ko.observable();
        self.CountryId = ko.observable();
        self.CountryName = ko.observable('');
        self.DivisionId = ko.observable();
        self.DivisionNameEng = ko.observable('');
        self.DistrictId = ko.observable('');
        self.DistrictNameEng = ko.observable('');
        self.ThanaId = ko.observable('');
        self.ThanaNameEng = ko.observable('');
        self.AreaId = ko.observable('');
        self.AreaName = ko.observable('');
        self.PhoneNo = ko.observable().extend({ required: false, pattern: { message: 'Valid Phone Number required.', params: '^(?:\\+88|01)?(?:\\d{11}|\\d{13})$' } });
        self.CellPhoneNo = ko.observable().extend({ required: false, pattern: { message: 'Valid Phone Number required.', params: '^(?:\\+88|01)?(?:\\d{11}|\\d{13})$' } });
        self.Email = ko.observable().extend({ required: true, pattern: { message: 'Valid Email address required.', params: '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$', maxLength: "25" } });
        self.AddressLine1 = ko.observable('');
        self.AddressLine2 = ko.observable('');
        self.PostalCode = ko.observable().extend({ pattern: { message: 'Valid Postal Code required.', params: '^[0-9]*$' }, maxLength: 4 });
        self.Website = ko.observable('');
        self.Fax = ko.observable().extend({ pattern: { message: 'Valid Postal Code required.', params: '^[0-9]*$' }, maxLength: 13 });
        self.DivisionList = ko.observableArray([]);
        self.DistrictList = ko.observableArray([]);
        self.ThanaList = ko.observableArray([]);
        self.AreaList = ko.observableArray([]);

        self.LoadDivisionList = function () {
            //debugger;
            return $.ajax({
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
        }

        self.LoadThanaList = function () {
            //console.log("self.DistrictId() : " + self.DistrictId());
            if (self.DistrictId() > 0) {
                //debugger;
                return $.ajax({
                    type: "GET",
                    url: '/Membership/Settings/GetThanaList?districtId=' + self.DistrictId(),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        //console.log("data : " + data);
                        self.ThanaList(data); //Put the response in ObservableArray
                    },
                    error: function (error) {
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            }
        }

        self.LoadAreaList = function () {
            if (self.ThanaId() > 0) {
                return $.ajax({
                    type: "GET",
                    url: '/Membership/Settings/GetAreaList?thanaId=' + self.ThanaId(),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        self.AreaList(data); //Put the response in ObservableArray
                    },
                    error: function (error) {
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            }
        }
    }

    function Owner() {
        var self = this;

        self.Id = ko.observable();
        self.Name = ko.observable('');
        self.Designation = ko.observable('');
        self.MemberId = ko.observable();
        self.NID = ko.observable().extend({ pattern: { message: 'Valid NID required.', params: '^[0-9]*$' }, maxLength: 17 });
        self.Phone = ko.observable().extend({ required: false, pattern: { message: 'Valid Phone Number required.', params: '^(?:\\+88|01)?(?:\\d{11}|\\d{13})$' } });
        self.Email = ko.observable().extend({ required: false, pattern: { message: 'Valid Email address required.', params: '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$', maxLength: "25" } });
        self.MobileNo = ko.observable().extend({ required: false, pattern: { message: 'Valid Mobile Number required.', params: '^(?:\\+88|01)?(?:\\d{11}|\\d{13})$' } });
        self.Res = ko.observable('');
        self.PresentAddress = ko.observable('');
        self.PhotoPath = ko.observable('');
        self.PhotoTest = ko.observable('');
        self.PermanentAddress = ko.observable('');
        self.IsContactPerson = ko.observable();
        self.AddressCheck = ko.observable(false);
        self.Photo = ko.observable();
        self.IsRemovable = ko.observable(true);

        self.getEditUrlPhoto = function (data) {
            return '/Membership/Membership/Download?imageName=' + self.PhotoPath();
        }
        self.Refresh = function () {
            self.Id('');
            self.Name('');
            self.Designation('');
            self.NID('');
            self.Phone('');
            self.Email('');
            self.MobileNo('');
            self.Res('');
            self.PresentAddress('');
            self.PhotoPath('');
            self.PhotoTest('');
            self.PermanentAddress('');
            self.AddressCheck(false);
            self.Photo('');
        }
        self.Load = function (data) {
            console.log("Data : " + ko.toJSON(data));
            self.Id(data.Id);
            self.Name(data.Name);
            self.Designation(data.Designation);
            self.MemberId(data.MemberId);
            self.NID(data.NID);
            self.Phone(data.Phone);
            self.Email(data.Email);
            self.MobileNo(data.MobileNo);
            self.Res(data.Res);
            self.PresentAddress(data.PresentAddress);
            self.PhotoPath(data.PhotoPath);
            self.PhotoTest(data.PhotoTest);
            self.PermanentAddress(data.PermanentAddress);
            self.IsContactPerson(data.IsContactPerson);
            self.AddressCheck(data.AddressCheck);
            //self.Photo(data.Photo);
            self.IsRemovable(data.IsRemovable);
        }

    }
    function Attachment() {
        var self = this;

        self.Id = ko.observable();
        self.MemberId = ko.observable();
        self.DocumentTypeId = ko.observable();
        self.Path = ko.observable('');
        self.PathTest = ko.observable('');
        self.PathName = ko.observable();
        self.FilePath = ko.observable('');

        self.getEditUrlPath = function (data) {
            //console.log("self.FilePath : " + self.FilePath());
            //console.log("self.PathTest : " + self.PathTest());
            return '/Membership/Membership/Download?imageName=' + data;
        }
        self.Refresh = function () {
            self.Id('');
            self.MemberId('');
            self.DocumentTypeId('');
            self.Path('');
            self.PathTest('');
            self.PathName('');
            self.FilePath('');
        }

    }



    function MembershipVM() {
        var self = this;
        self.Owner = new Owner();
        self.Attachment = new Attachment();
        self.ContactPerson = new Owner();
        self.MemberPresentAddress = ko.observable(new address());
        self.MemberParmanentAddress = ko.observable(new address());
        self.SameAddressCheck = ko.observable();
        self.ContactAddressCheck = ko.observable();
        self.Id = ko.observable();
        self.MemberNo = ko.observable();
        self.NameOfOrganization = ko.observable();
        self.Phone = ko.observable().extend({ required: false, pattern: { message: 'Valid Phone Number required.', params: '^(?:\\+88|01)?(?:\\d{11}|\\d{13})$' } });
        self.Fax = ko.observable().extend({ required: false, pattern: { message: 'Valid Fax required.', params: '^[0-9]*$', maxLength: "13" } });
        self.Email = ko.observable().extend({ required: true, pattern: { message: 'Valid Email address required.', params: '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$', maxLength: "25" } });
        self.Website = ko.observable();
        self.RenewalNo = ko.observable();
        self.FromYear = ko.observable('').extend({ required: true });
        self.AddressCheck = ko.observable(false);
        self.TradeLicenseNo = ko.observable();
        self.RepresentativeName = ko.observable();
        self.RepresentativeNID = ko.observable().extend({ pattern: { message: 'Valid Postal Code required.', params: '^[0-9]*$' }, maxLength: 17 });
        self.AddressCheck.subscribe(function () {
            if (self.AddressCheck() == true) {
                self.Owner.PermanentAddress(self.Owner.PresentAddress());
            }
            else {
                self.Owner.PermanentAddress('');
            }

        });
        self.ContactAddressCheck.subscribe(function () {
            if (self.ContactAddressCheck() == true) {
                self.ContactPerson.PermanentAddress(self.ContactPerson.PresentAddress());
            }
            else {
                self.ContactPerson.PermanentAddress('');
            }

        });
        self.Blacklisted = ko.observable('false');

        self.MRNo = ko.observable();
        self.PONo = ko.observable();
        self.Bank = ko.observable();
        self.Branch = ko.observable();
        self.SameAddressCheck.subscribe(function () {

            self.MemberParmanentAddress().PostalCode(self.MemberPresentAddress().PostalCode());
            self.MemberParmanentAddress().AddressLine1(self.MemberPresentAddress().AddressLine1());
            self.MemberParmanentAddress().AddressLine2(self.MemberPresentAddress().AddressLine2());
            self.MemberParmanentAddress().DivisionList(self.MemberPresentAddress().DivisionList());
            self.MemberParmanentAddress().DivisionId(self.MemberPresentAddress().DivisionId());
            self.MemberParmanentAddress().DistrictList(self.MemberPresentAddress().DistrictList());
            self.MemberParmanentAddress().DistrictId(self.MemberPresentAddress().DistrictId());
            self.MemberParmanentAddress().ThanaList(self.MemberPresentAddress().ThanaList());
            self.MemberParmanentAddress().ThanaId(self.MemberPresentAddress().ThanaId());
            self.MemberParmanentAddress().AreaList(self.MemberPresentAddress().AreaList());
            self.MemberParmanentAddress().AreaId(self.MemberPresentAddress().AreaId());
            self.MemberParmanentAddress().Email(self.MemberPresentAddress().Email());
            self.MemberParmanentAddress().PhoneNo(self.MemberPresentAddress().PhoneNo());
            self.MemberParmanentAddress().CellPhoneNo(self.MemberPresentAddress().CellPhoneNo());

        });
        self.TradeLicenseFile = ko.observable();
        self.RenewalFile = ko.observable();
        self.IncorporationFile = ko.observable();
        self.RepresentativePhotoFile = ko.observable();

        self.TradeLicenseFileTest = ko.observable('');
        self.RenewalFileTest = ko.observable('')
        self.IncorporationFileTest = ko.observable('');
        self.RepresentativePhotoFileTest = ko.observable('');
        self.ImagePath = ko.observable('');

        self.TradeLicenseFilePath = ko.observable('');
        self.RenewalFilePath = ko.observable('');
        self.IncorporationFilePath = ko.observable('');
        self.RepresentativePhotoFilePath = ko.observable('');

        self.EstablishmentDate = ko.observable(moment());
        self.EstablishmentDateText = ko.observable();

        self.IncorporationDate = ko.observable(moment());
        self.IncorporationDateText = ko.observable();

        self.LicenseDate = ko.observable(moment());
        self.LicenseDateText = ko.observable();

        self.RenewalIssueDate = ko.observable(moment());
        self.RenewalIssueDateText = ko.observable();

        self.RenewalDate = ko.observable(moment());
        self.RenewalDateText = ko.observable();
        self.MembershipStatus = ko.observable();
        self.IsDisable = ko.observable(true);
        self.IssueDate = ko.observable(moment());

        self.FromYear.subscribe(function () {
            if (self.FromYear()) {
                var d = new Date(self.FromYear(), 0, 1);
                self.IssueDate(moment(d));

            }
        });


        self.IssueDateText = ko.observable();
        self.Years = ko.observableArray([]);

        self.DateOfReceived = ko.observable(moment());
        self.DateOfReceivedText = ko.observable();

        self.OwnershipStatus = ko.observable();
        self.OwnershipStatusList = ko.observableArray([]);
        self.OwnershipStatus.subscribe(function () {
            self.GetIncorporation();
        });
        self.GetIncorporation = function () {
            if (self.OwnershipStatus() == 0) {
                $("#incorporation").show();
            }
            else {
                $("#incorporation").hide();
            }
        };
        //self.BusinessCategoryList = ko.observableArray([]);
        //self.BusinessCategories = ko.observableArray([]);

        //Code by Maruf
        self.PriorityType = ko.observable();
        self.Subject = ko.observable();
        self.NotificationMessage = ko.observable();
        self.RecipientsList = ko.observableArray([]);
        self.Recipients = ko.observableArray([]);
        self.PriorityTypeList = ko.observableArray([]);
        //
        //self.BusinessCategories.subscribe(function () {
        //    console.log(ko.toJSON(self.BusinessCategories()));
        //})

        self.ChamberList = ko.observableArray([]);
        self.Chambers = ko.observableArray([]);

        self.DocumentTypeList = ko.observableArray([]);
        self.DocumentList = ko.observableArray([]);

        self.AssociationList = ko.observableArray([]);
        self.Associations = ko.observableArray([]);

        self.Zone = ko.observable();
        self.ZoneName = ko.observable();
        self.ZoneList = ko.observableArray([]);

        self.CountryList = ko.observableArray([]);
        self.CountryId = ko.observable().extend();
        self.CountryName = ko.observable();

        self.DivisionList = ko.observableArray([]);
        self.DivisionId = ko.observable().extend();
        self.DivisionName = ko.observable();

        self.DistrictList = ko.observableArray([]);
        self.DistrictId = ko.observable();
        self.DistrictName = ko.observable();

        self.ThanaId = ko.observable();
        self.ThanaName = ko.observable('');
        self.ThanaList = ko.observableArray([]);

        self.AreaList = ko.observableArray([]);
        self.AreaId = ko.observable();
        self.AreaName = ko.observable();

        self.errors = ko.validation.group(self);
        self.IsSaved = ko.observable(false);

        self.OwnerList = ko.observableArray([]);
        self.FeeTypeList = ko.observableArray([]);
        self.Members = ko.observableArray([]);

        self.GetMemberList = function (searchTerm, callback) {
            var submitData = {
                prefix: searchTerm,
                exclusionList: self.Members()
            };
            $.ajax({
                type: "POST",
                url: '/Membership/Membership/GeMemberListForAutoFill',
                data: ko.toJSON(submitData),
                contentType: "application/json",
                success: function (data) {
                    self.Members(data);
                },
                error: function () {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            }).done(callback);
        };

        self.RunPatch = function () {

            return $.ajax({
                type: "POST",
                url: '/Membership/FeeCollection/RectifyFeeCollectionTran',
                data: ko.toJSON(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    $('#successModal').modal('show');
                    $('#successModalText').text("Done!");
                },
                error: function (error) {

                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }

        self.LoadCountryList = function () {
            $.ajax({
                type: "GET",
                url: '/Membership/Settings/GetCountryList',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.CountryList(data); //Put the response in ObservableArray
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
        self.LoadZoneList = function () {
            return $.ajax({
                type: "GET",
                url: '/Membership/Settings/GetZoneList',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.ZoneList(data); //Put the response in ObservableArray
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
        self.LoadOwnerShipStatusList = function () {
            return $.ajax({
                type: "GET",
                url: '/Membership/Settings/GetOwnershipStatusList',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.OwnershipStatusList(data); //Put the response in ObservableArray
                    //$("#Owner :button").attr("disabled", false);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
        //self.LoadBusinessCategoryList = function () {
        //    return $.ajax({
        //        type: "GET",
        //        url: '/Membership/Settings/GetBusinessCategoryList',
        //        contentType: "application/json; charset=utf-8",
        //        dataType: "json",
        //        success: function (data) {
        //            self.BusinessCategoryList(data);
        //            //self.BusinessCategories(data);
        //        },
        //        error: function (error) {
        //            alert(error.status + "<--and--> " + error.statusText);
        //        }
        //    });
        //}
        //Code by Maruf
        self.LoadRecipientsList = function () {
            return $.ajax({
                type: "GET",
                url: '/Membership/Notification/GetRecipientsList',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    debugger
                    console.log(ko.toJSON(data));
                    self.RecipientsList(data);                    
                    //self.BusinessCategories(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
        self.LoadPriorityTypeList = function () {
            return $.ajax({
                type: "GET",
                url: '/Membership/Notification/GetPriorityTypeList',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.PriorityTypeList(data); //Put the response in ObservableArray
                    //$("#Owner :button").attr("disabled", false);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
        //
        self.LoadDocumentTypeList = function () {
            return $.ajax({
                type: "GET",
                url: '/Membership/Settings/GetDocumentTypes',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.DocumentTypeList(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
        self.LoadAssociationList = function () {
            return $.ajax({
                type: "GET",
                url: '/Membership/Settings/GetAssociationList',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.AssociationList(data);
                    //self.Associations(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
        self.LoadChamberList = function () {
            return $.ajax({
                type: "GET",
                url: '/Membership/Settings/GetChamberList',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.ChamberList(data);
                    //self.Chambers(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
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
        self.LoadOwnerList = function () {
            if (self.Id() > 0) {
                return $.ajax({
                    type: "GET",
                    url: '/Membership/Membership/GetOwnerList?memberId=' + self.Id(),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        console.log("OwnerList : " + ko.toJSON(data));
                        self.OwnerList(data); //Put the response in ObservableArray
                    },
                    error: function (error) {
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            }

        }
        self.LoadFeeTypeList = function () {
            return $.ajax({
                type: "GET",
                url: '/Membership/Membership/GetFeeTypeList?memid=' + self.Id(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.FeeTypeList(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
        self.LoadDocumentList = function () {
            if (self.Id() > 0) {
                return $.ajax({
                    type: "GET",
                    url: '/Membership/Membership/GetDocumentList?memberId=' + self.Id(),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        self.DocumentList(data); //Put the response in ObservableArray
                    },
                    error: function (error) {
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            }

        }
        self.saveMembership = function () {
            self.EstablishmentDateText(moment(self.EstablishmentDate()).format('DD/MM/YYYY'));
            self.IncorporationDateText(moment(self.IncorporationDate()).format('DD/MM/YYYY'));
            self.RenewalDateText(moment(self.RenewalDate()).format('DD/MM/YYYY'));
            self.LicenseDateText(moment(self.LicenseDate()).format('DD/MM/YYYY'));
            self.RenewalIssueDateText(moment(self.RenewalIssueDate()).format('DD/MM/YYYY'));

            var tradeLicenseFile = $('#TradeLicenseFile').prop('files')[0];
            var renewalFile = $('#RenewalFile').prop('files')[0];
            var incorporationFile = $('#IncorporationFile').prop('files')[0];
            var representativePhotoFile = $('#RepresentativePhotoFile').prop('files')[0];

            self.TradeLicenseFilePath(self.TradeLicenseFile());
            self.RenewalFilePath(self.RenewalFile());
            self.IncorporationFilePath(self.IncorporationFile());
            self.RepresentativePhotoFilePath(self.RepresentativePhotoFile());

            var formData = new FormData();

            $.each(self.Chambers(),
                   function (index, value) {
                       formData.append('ChamberIds', value);
                   });
            $.each(self.BusinessCategories(),
                    function (index, value) {
                        formData.append('BusinessCategoryIds', value);
                    });
            $.each(self.Associations(),
                    function (index, value) {
                        formData.append('AssociationIds', value);
                    });
            formData.append('Id', self.Id());
            formData.append('TradeLicenseFilePath', self.TradeLicenseFilePath());
            formData.append('RenewalFilePath', self.RenewalFilePath());
            formData.append('IncorporationFilePath', self.IncorporationFilePath());
            formData.append('RepresentativePhotoFilePath', self.RepresentativePhotoFilePath());

            formData.append('TradeLicenseFile', tradeLicenseFile);
            formData.append('RenewalFile', renewalFile);
            formData.append('IncorporationFile', incorporationFile);
            formData.append('RepresentativePhotoFile', representativePhotoFile);

            formData.append('NameOfOrganization', self.NameOfOrganization());
            formData.append('TradeLicenseNo', self.TradeLicenseNo());
            formData.append('LicenseDate', self.LicenseDate());
            formData.append('LicenseDateText', self.LicenseDateText());

            formData.append('RenewalNo', self.RenewalNo());
            formData.append('RenewalDate', self.RenewalDate());
            formData.append('RenewalDateText', self.RenewalDateText());
            formData.append('IncorporationDate', self.IncorporationDate());
            formData.append('IncorporationDateText', self.IncorporationDateText());
            formData.append('RenewalIssueDate', self.RenewalIssueDate());
            formData.append('RenewalIssueDateText', self.RenewalIssueDateText());

            formData.append('OwnershipStatus', self.OwnershipStatus());
            formData.append('RepresentativeName', self.RepresentativeName());
            formData.append('RepresentativeNID', self.RepresentativeNID());
            formData.append('Zone', self.Zone());
            formData.append('MembershipStatus', self.MembershipStatus());
            formData.append('MemberNo', self.MemberNo());
            formData.append('FromYear', self.FromYear());
            if (self.FromYear() > 0) {
                $.ajax({
                    type: "POST",
                    url: '/Membership/Membership/SaveMembership',
                    data: formData,
                    contentType: false,
                    processData: false,
                    cache: false,
                    success: function (data) {
                        self.Id(data);
                        $('#successModal').modal('show');
                        $('#successModalText').text("Member basic information saved successfully");


                        self.GetAllDiv();
                        //Need to set Issue Date to 
                    },
                    error: function (error) {
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            }
            else {
                $('#successModal').modal('show');
                $('#successModalText').text("Select the Membership Since Year");
            }
        };
        self.saveContactPerson = function () {
            var owner = self.ContactPerson;

            owner.MemberId(self.Id());
            owner.IsContactPerson(true);
            //var photoFile = $('#Photo').prop('files')[0];
            //owner.PhotoPath(owner.Photo());
            //AddressCheck


            var formData = new FormData();
            //formData.append('PhotoPath', owner.PhotoPath());
            formData.append('Id', owner.Id());
            formData.append('Name', owner.Name());
            formData.append('Designation', owner.Designation());
            formData.append('NID', owner.NID());
            formData.append('Phone', owner.Phone());
            formData.append('MobileNo', owner.MobileNo());
            formData.append('Email', owner.Email());
            formData.append('PresentAddress', owner.PresentAddress());
            formData.append('PermanentAddress', owner.PermanentAddress());
            //formData.append('PhotoPath', owner.Photo());
            formData.append('MemberId', owner.MemberId());
            formData.append('IsContactPerson', owner.IsContactPerson());
            $.ajax({
                type: "POST",
                url: '/Membership/Membership/SaveOwner',
                data: formData,
                contentType: false,
                processData: false,
                cache: false,
                success: function (data) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(data.Message);
                    //self.LoadOwnerList();
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });

        };
        self.removeAttachment = function (data) {
            //console.log("Attachment Id : " + data.Id);

            //var Id = self.Owner.Id();
            $.ajax({
                //type: "POST",
                url: '/Membership/Membership/RemoveAttachment?Id=' + data.Id,
                type: 'GET',
                contentType: 'application/json',
                data: ko.toJSON(address),

                success: function (data) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(data.Message);
                    self.LoadDocumentList();
                    self.Attachment.Refresh();
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });

        };
        self.removeOwner = function (data) {
            //console.log("Owner Id : " + data.Id);

            //var Id = self.Owner.Id();
            $.ajax({
                //type: "POST",
                url: '/Membership/Membership/RemoveOwner?Id=' + data.Id,
                type: 'GET',
                contentType: 'application/json',
                data: ko.toJSON(address),

                success: function (data) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(data.Message);
                    self.LoadOwnerList();
                    self.Owner.Refresh();
                    self.AddressCheck(false);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });

        };
        self.saveOwner = function () {
            var owner = self.Owner;

            owner.IsContactPerson(false);
            owner.MemberId(self.Id());

            var photoFile = $('#Photo').prop('files')[0];
            owner.PhotoPath(owner.Photo());
            //AddressCheck

            var formData = new FormData();
            formData.append('Id', owner.Id());
            formData.append('PhotoPath', owner.PhotoPath());
            formData.append('Photo', photoFile);
            formData.append('Name', owner.Name());
            formData.append('Designation', owner.Designation());
            formData.append('NID', owner.NID());
            formData.append('Phone', owner.Phone());
            formData.append('MobileNo', owner.MobileNo());
            formData.append('Email', owner.Email());
            formData.append('PresentAddress', owner.PresentAddress());
            formData.append('PermanentAddress', owner.PermanentAddress());
            formData.append('PhotoPath', owner.Photo());
            formData.append('MemberId', owner.MemberId());
            formData.append('IsContactPerson', owner.IsContactPerson());
            $.ajax({
                type: "POST",
                url: '/Membership/Membership/SaveOwner',
                data: formData,
                contentType: false,
                processData: false,
                cache: false,
                success: function (data) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(data.Message);
                    self.LoadOwnerList();
                    self.Owner.Refresh();
                    self.AddressCheck(false);
                    $('#removeOwnerButton').button('enable');
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });

        };
        self.EditOwner = function (line) {
            //debugger;
            //console.log(ko.toJSON(line))
            self.Owner.Load(line);
        }
        self.saveAttachment = function () {
            //debugger;
            var attachment = self.Attachment;
            //attachment.MemberId(self.Id());
            attachment.MemberId(self.Id());
            var photoFile = $('#Path').prop('files')[0];
            attachment.FilePath(attachment.PathName());
            //AddressCheck

            var formData = new FormData();
            formData.append('FilePath', attachment.FilePath());
            formData.append('PathName', photoFile);
            formData.append('FilePath', attachment.PathName());

            formData.append('DocumentTypeId', attachment.DocumentTypeId());
            formData.append('MemberId', attachment.MemberId());

            $.ajax({
                type: "POST",
                url: '/Membership/Membership/SaveAttachment',
                data: formData,
                contentType: false,
                processData: false,
                cache: false,
                success: function (data) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(data.Message);
                    self.LoadDocumentList();
                    self.Attachment.Refresh();
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });

        };
        self.saveAddress = function () {
            var presentAddress = self.MemberPresentAddress;
            var parmanentAddress = self.MemberParmanentAddress;
            var memberId = self.Id();

            var address = {
                PresentAddress: presentAddress,
                ParmanentAddress: parmanentAddress,
                Id: memberId
                //,
                //MemberId: memberId,
                //CountryId: 1
            };

            //var formData = new FormData();
            //formData.append('AddressLine1', presentAddress.AddressLine1);
            ////formData.append('AddressLine1', parmanentAddress.AddressLine1);


            $.ajax({
                //type: "POST",
                url: '/Membership/Membership/SaveAddress',
                type: 'POST',
                contentType: 'application/json',
                data: ko.toJSON(address),
                //data: formData,
                //contentType: false,
                //processData: false,
                //cache: false,
                success: function (data) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(data.Message);
                    //self.LoadOwnerList();
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });

        };
        self.getEditUrlTradeLicenseFile = function (data) {
            //console.log("TradeLicenseFilePath : " + data);
            return '/Membership/Membership/Download?imageName=' + self.TradeLicenseFilePath();
        }
        self.getEditUrlRenewalFile = function (data) {
            return '/Membership/Membership/Download?imageName=' + self.RenewalFilePath();
        }
        self.getEditUrlIncorporationFile = function (data) {
            return '/Membership/Membership/Download?imageName=' + self.IncorporationFilePath();
        }
        self.getEditUrlRepresentativePhotoFile = function (data) {
            return '/Membership/Membership/Download?imageName=' + self.RepresentativePhotoFilePath();
        }
        self.getEditUrlPathName = function (data) {
            return '/Membership/Membership/Download?imageName=' + data;
        }
        self.getEditUrlPhotoName = function (data) {
            return '/Membership/Membership/Download?imageName=' + data;
        }
        self.GetAllDiv = function () {
            if (self.Id() > 0) {
                $("#Owner :input").attr("disabled", false);
                $("#Contact :input").attr("disabled", false);
                $("#ContactPerson :input").attr("disabled", false);
                $("#attachment :input").attr("disabled", false);
                $("#ATABOffice :input").attr("disabled", false);

            }
            else {
                $("#Owner :input").attr("disabled", true);
                $("#Contact :input").attr("disabled", true);
                $("#ContactPerson :input").attr("disabled", true);
                $("#attachment :input").attr("disabled", true);
                $("#ATABOffice :input").attr("disabled", true);

            }


        }
        self.loadApplicationDetail = function () {

            if (self.Id() > 0) {
                return $.ajax({
                    type: "GET",
                    url: "/Membership/Membership/GetMemberApplication?memberId=" + self.Id(),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {

                        //console.log("Data : " + ko.toJSON(data));
                        self.Id(data.Id);
                        self.MemberNo(data.MemberNo);
                        self.NameOfOrganization(data.NameOfOrganization);
                        self.TradeLicenseNo(data.TradeLicenseNo);
                        self.RenewalNo(data.RenewalNo);
                        self.RepresentativeName(data.RepresentativeName);
                        self.RepresentativeNID(data.RepresentativeNID);
                        self.LicenseDate(moment(data.LicenseDate));
                        self.RenewalDate(moment(data.RenewalDate));
                        self.RenewalIssueDate(moment(data.RenewalIssueDate));
                        self.IncorporationDate(moment(data.IncorporationDate));
                        self.MembershipStatus(data.MembershipStatus);
                        self.MRNo(data.MRNo);
                        self.PONo(data.PONo);
                        self.Bank(data.Bank);
                        self.Branch(data.Branch);
                        self.DateOfReceived
                        self.IsDisable(data.IsDisable);
                        self.Blacklisted(data.Blacklisted);

                        self.DateOfReceived(data.DateOfReceived ? moment(data.DateOfReceived) : moment());
                        self.EstablishmentDate(data.EstablishmentDate ? moment(data.EstablishmentDate) : moment(data.DateOfReceived));
                        self.IssueDate(data.IssueDate ? moment(data.IssueDate) : moment());
                        self.FromYear(data.FromYear);
                        //$.when(self.LoadBusinessCategoryList()).done(function () {
                        //    $.each(data.BusinessCategories, function (index, value) {

                        //        self.BusinessCategories.push(value.BusinessCategoryId);
                        //    });
                        //});
                        //Code by Maruf
                        $.when(self.LoadRecipientsList()).done(function () {
                            $.each(data.Recipients, function (index, value) {

                                self.Recipients.push(value.Id);
                            });
                        });
                        $.when(self.LoadPriorityTypeList()).done(function () {
                            self.PriorityType(data.PriorityType);
                        });
                        //
                        $.when(self.LoadChamberList()).done(function () {
                            $.each(data.Chambers, function (index, value) {
                                self.Chambers.push(value.ChamberId);
                            });
                        });
                        $.when(self.LoadAssociationList()).done(function () {
                            $.each(data.Associations, function (index, value) {
                                self.Associations.push(value.AssociationId);
                            });
                        });
                        $.when(self.LoadZoneList()).done(function () {
                            self.Zone(data.Zone);
                        });
                        $.when(self.LoadOwnerShipStatusList()).done(function () {
                            self.OwnershipStatus(data.OwnershipStatus);
                        });
                        self.TradeLicenseFileTest(data.TradeLicenseFileTest);
                        self.TradeLicenseFilePath(data.TradeLicenseFilePath);
                        self.RenewalFileTest(data.RenewalFileTest);
                        self.RenewalFilePath(data.RenewalFilePath);

                        self.IncorporationFileTest(data.IncorporationFileTest);
                        self.IncorporationFilePath(data.IncorporationFilePath);

                        self.RepresentativePhotoFileTest(data.RepresentativePhotoFileTest);
                        self.RepresentativePhotoFilePath(data.RepresentativePhotoFilePath);
                        self.ImagePath(data.ImagePath);
                        self.OwnerList(data.OwnerList);

                        self.MemberPresentAddress().AddressLine1(data.PreAddressLine1);
                        self.MemberPresentAddress().AddressLine2(data.PreAddressLine2);
                        self.MemberPresentAddress().PostalCode(data.PrePostalCode);
                        self.MemberPresentAddress().CellPhoneNo(data.PreCellPhoneNo);
                        self.MemberPresentAddress().PhoneNo(data.PrePhoneNo);
                        self.MemberPresentAddress().Email(data.PreEmail);
                        self.MemberPresentAddress().Website(data.Website);
                        self.MemberPresentAddress().Fax(data.Fax);

                        $.when(self.MemberPresentAddress().LoadDivisionList()).done(function () {
                            self.MemberPresentAddress().DivisionId(data.PreDivisionId);
                            $.when(self.MemberPresentAddress().LoadDistrictList()).done(function () {
                                self.MemberPresentAddress().DistrictId(data.PreDistrictId);
                                $.when(self.MemberPresentAddress().LoadThanaList()).done(function () {
                                    //console.log("Thana Id : " + data.PreThanaId);
                                    self.MemberPresentAddress().ThanaId(data.PreThanaId);
                                    $.when(self.MemberPresentAddress().LoadAreaList()).done(function () {
                                        self.MemberPresentAddress().AreaId(data.PreAreaId);

                                    })
                                })
                            })
                        });

                        self.MemberParmanentAddress().AddressLine1(data.ParAddressLine1);
                        self.MemberParmanentAddress().AddressLine2(data.ParAddressLine2);
                        self.MemberParmanentAddress().PostalCode(data.ParPostalCode);
                        self.MemberParmanentAddress().CellPhoneNo(data.ParCellPhoneNo);
                        self.MemberParmanentAddress().PhoneNo(data.ParPhoneNo);
                        self.MemberParmanentAddress().Email(data.ParEmail);


                        $.when(self.MemberParmanentAddress().LoadDivisionList()).done(function () {
                            self.MemberParmanentAddress().DivisionId(data.ParDivisionId);
                            $.when(self.MemberParmanentAddress().LoadDistrictList()).done(function () {
                                self.MemberParmanentAddress().DistrictId(data.ParDistrictId);
                                $.when(self.MemberParmanentAddress().LoadThanaList()).done(function () {
                                    self.MemberParmanentAddress().ThanaId(data.ParThanaId);
                                    $.when(self.MemberParmanentAddress().LoadAreaList()).done(function () {
                                        self.MemberParmanentAddress().AreaId(data.ParAreaId);

                                    })
                                })
                            })
                        });
                        //debugger;

                        if (data.ContactPerson != null) {
                            self.ContactPerson.Id(data.ContactPerson.Id);
                            self.ContactPerson.Name(data.ContactPerson.Name);
                            self.ContactPerson.Designation(data.ContactPerson.Designation);
                            self.ContactPerson.NID(data.ContactPerson.NID);
                            self.ContactPerson.MobileNo(data.ContactPerson.MobileNo);
                            self.ContactPerson.Email(data.ContactPerson.Email);
                            self.ContactPerson.Phone(data.ContactPerson.Phone);
                            self.ContactPerson.PresentAddress(data.ContactPerson.PresentAddress);
                            self.ContactPerson.PermanentAddress(data.ContactPerson.PermanentAddress);
                        }

                    },
                    error: function (error) {
                        alert(error.status + "<--and--> " + error.statusText);
                        //self.isLoading(self.isLoading() - 1);
                    }
                });
            }

        }
        self.loadInitialData = function () {
            self.MemberPresentAddress().LoadDivisionList();
            self.MemberParmanentAddress().LoadDivisionList();
            self.LoadOwnerShipStatusList();
            //self.LoadBusinessCategoryList();
            self.LoadZoneList();
            self.LoadChamberList();
            self.LoadAssociationList();
            self.LoadDocumentTypeList();
            self.LoadDocumentList();
            self.GetAllDiv();
            self.GetIncorporation();
            self.LoadFeeTypeList();
            self.GetYears();
            self.LoadRecipientsList();//Code by Maruf
            self.LoadPriorityTypeList();//Code by Maruf
            //$('input[type="button"]').removeAttr('disabled');

        }
        self.queryString = function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        };
        self.SetAppId = function (data) {
            self.Owner.Id(data.Id);
        }
        self.setFees = function () {
            var feeTypeList = self.FeeTypeList();

            var feeType = {
                FeeTypeList: feeTypeList,
                MemberId: self.Id()
            };
            if (self.Id() > 0) {
                $.ajax({
                    url: '/Membership/Membership/SetFees',
                    type: 'POST',
                    contentType: 'application/json',
                    data: ko.toJSON(feeType),

                    success: function (data) {
                        $('#successModal').modal('show');
                        $('#successModalText').text(data.Message);
                    },
                    error: function (error) {
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            }
            else {
                $('#successModal').modal('show');
                $('#successModalText').text("Member is Empty");
            }

        };
        self.memberApprove = function () {
            self.IssueDateText(moment(self.IssueDate()).format('DD/MM/YYYY'));
            self.DateOfReceivedText(moment(self.DateOfReceived()).format('DD/MM/YYYY'));

            var data = {
                MRNo: self.MRNo(),
                PONo: self.PONo(),
                Bank: self.Bank(),
                Branch: self.Branch(),
                IssueDate: self.IssueDate(),
                DateOfReceived: self.DateOfReceived(),
                Id: self.Id()
            };

            $.ajax({
                url: '/Membership/Membership/MemberApprove',
                type: 'POST',
                contentType: 'application/json',
                data: ko.toJSON(data),

                success: function (data) {

                    $('#successModal').modal('show');
                    $('#successModalText').text(data.Message);


                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });

        };
        self.setApprove = function () {
            self.IssueDateText(moment(self.IssueDate()).format('DD/MM/YYYY'));
            self.DateOfReceivedText(moment(self.DateOfReceived()).format('DD/MM/YYYY'));

            var data = {
                MRNo: self.MRNo(),
                PONo: self.PONo(),
                Bank: self.Bank(),
                Branch: self.Branch(),
                IssueDate: self.IssueDate(),
                DateOfReceived: self.DateOfReceived(),
                Id: self.Id()
            };

            $.ajax({
                url: '/Membership/Membership/SetApprove',
                type: 'POST',
                contentType: 'application/json',
                data: ko.toJSON(data),

                success: function (data) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(data.Message);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });

        };
        //Code by Maruf
        self.saveNotification = function () {

            //var Subject = self.Subject;
            //var NotificationMessage = self.NotificationMessage;
            //var memberId = self.Id();

            var formData = new FormData();

            $.each(self.Recipients(),
                   function (index, value) {
                       formData.append('MemberIds', value);
                   });

            //formData.append('NotificationId', self.Id());
            formData.append('Id', self.Id());
            formData.append('PriorityType', self.PriorityType());
            formData.append('Subject', self.Subject());
            formData.append('Message', self.NotificationMessage());


            $.ajax({
                type: "POST",
                url: '/Membership/Notification/SaveNotification',
                data: formData,
                //data: ko.toJSON(formData),
                contentType: false,
                processData: false,
                cache: false,
                success: function (data) {
                    self.Id(data);
                    $('#successModal').modal('show');
                    $('#successModalText').text("Notification saved successfully");


                    //self.GetAllDiv();
                    //Need to set Issue Date to 
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
            //if (self.Id() > 0) {
            //    $.ajax({
            //        type: "POST",
            //        url: '/Membership/Notification/SaveNotification',
            //        data: formData,
            //        contentType: false,
            //        processData: false,
            //        cache: false,
            //        success: function (data) {
            //            self.Id(data);
            //            $('#successModal').modal('show');
            //            $('#successModalText').text("Notification saved successfully");


            //            //self.GetAllDiv();
            //            //Need to set Issue Date to 
            //        },
            //        error: function (error) {
            //            alert(error.status + "<--and--> " + error.statusText);
            //        }
            //    });
            //}
            //else {
            //    $('#successModal').modal('show');
            //    $('#successModalText').text("You are not authorized!");
            //}
        };
    }

    var vm = new MembershipVM();
    vm.Id(vm.queryString("Id"));
    vm.loadInitialData();
    vm.loadApplicationDetail();
    ko.applyBindings(vm, $('#membershipId')[0]);
});