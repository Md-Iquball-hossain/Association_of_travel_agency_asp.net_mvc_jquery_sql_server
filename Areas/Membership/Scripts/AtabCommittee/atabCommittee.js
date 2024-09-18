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
    ko.validation.registerExtenders();
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#cifPhoto').attr('src', e.target.result);
                $('#cifPhoto').show();
                $('#cifPhotoOld').hide();
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    function tenure() {
        var self = this;
        self.Id = ko.observable();
        self.MemberCommitteId = ko.observable();
        //self.ATABCommittee = ko.observable();
        self.CommitteeType = ko.observable();
        self.Zone = ko.observable();
        self.Post = ko.observable();
        self.JoiningDate = ko.observable();
        self.EndOfTenure = ko.observable();


        self.LoadData = function (data) {
            //console.log(moment(data.EndOfTenure).format('DD/MM/YYYY'));
            self.Id(data ? data.Id : '');
            self.MemberCommitteId(data ? data.MemberCommitteId : '');
            //self.ATABCommittee(data ? data.Id : '');
            self.CommitteeType(data ? data.CommitteeType : '');
            self.Zone(data ? data.Zone : '');
            self.Post(data ? data.Post : '');
            self.JoiningDate(data ? moment(data.JoiningDate) : '');
            self.EndOfTenure(data ? moment(data.EndOfTenure) : '');
        }
    }

    function DepreciationLogVm() {

        var self = this;
        var currentDate = (new Date()).toISOString().split('T')[0];

        self.Id = ko.observable();
        self.Photo = ko.observable();
        self.MemberId = ko.observable();
        self.FirstName = ko.observable();
        self.LastName = ko.observable();
        //self.Address = ko.observable();
        self.AddressId = ko.observable();
        self.PermanentAddress = new address();
        self.PhotoFile = ko.observable();
        self.Remarks = ko.observable();
        self.CommitteeId = ko.observable();
        self.PhotoName = ko.observable('');
        self.NameOfOrganization = ko.observable();
        self.ExistingCifIds = ko.observableArray([]);
        self.Member = ko.observable('');
        self.Member.subscribe(function () {
            if(self.Member())
            {
                self.MemberId(self.Member().key);
                self.NameOfOrganization(self.Member().value);
                self.AddressId(self.Member().address);
                if (self.MemberId() > 0 && self.AddressId() > 0) {
                    self.GetAddressMemberWise(self.AddressId());
                }
            }
        });
        self.GetAddressMemberWise = function (data) {
            return $.ajax({
                type: "GET",
                url: '/Membership/AtabCommittee/GetAddressById?addressId=' + data,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    //self.CountryList(data); //Put the response in ObservableArray
                    self.PermanentAddress.LoadAddress(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
        self.ZoneList = ko.observableArray([]);
        self.PostList = ko.observableArray([]);
        self.CommitteeTypes = ko.observableArray([]);
        self.TenureHistoryDetails = ko.observableArray([]);
        self.CountryList = ko.observableArray([]);
        self.DivisionList = ko.observableArray([]);
        self.DistrictList = ko.observableArray([]);
        self.ThanaList = ko.observableArray([]);
        //self.Assets_Logs = ko.observableArray([]);
        //self.Logs = ko.observableArray([]);
        //self.Categories = ko.observableArray([]);
        //self.Levels = ko.observableArray([]);

        //self.Level.subscribe(function () {
        //    self.getAllCategories();
        //});
        self.addTenures = function () {
            var aDetail = new tenure();
            self.TenureHistoryDetails.push(aDetail);
        }
        self.RemovedTenures = ko.observableArray([]);
        self.removeTenures = function (line) {
            if (line.Id() > 0)
                self.RemovedTenures.push(line.Id());
            self.TenureHistoryDetails.remove(line);
        };

        self.GetMemberAutoFill = function (searchTerm, callback) {
            var submitData = {
                prefix: searchTerm,
                exclusionList: self.ExistingCifIds()
            };
            $.ajax({
                type: "POST",
                url: '/Membership/AtabCommittee/GetMemberAutoFill',
                data: ko.toJSON(submitData),
                contentType: "application/json",
                success: function () {
                },
                error: function () {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            }).done(callback);
        };

        self.Reset = function () {
            //self.Id('');
            //self.AssetName('');
            //self.AssetID();
            //self.DepreciatedAmount(0.00);
            //self.BaseValue(0.00);
            //Self.OpeningValue(0.00);
            //self.EmployeeID('');
            //self.DepriciationModel();
            //self.DepreciationModelName('');
            //self.PointOfDepreciation();
            //self.CauseOfDepreciation('');
            //self.WrittenDownValue(0.00);
            //self.CalculatedDate(moment());
            //self.CalculatedDateString();
            //self.YearRemaining();
            //self.RevaluationSurplus();
            //self.AdjustedDepreciation(0.00);
            //self.Pass(false);
        };
        $('#imgInp').inputFileText({
            text: 'Upload Profile Picture'
        });

        $("#imgInp").change(function () {
            readURL(this);
        });

        self.Upload = function () {
            if (self.CommitteeId() > 0) {
                var file_data = $('#imgInp').prop('files')[0];
                //var file_data = $("#" + self.PhotoFile()).prop('files')[0];
                var formData = new FormData();
                formData.append('Id', self.CommitteeId());
                formData.append('PhotoFile', file_data);
                $.ajax({
                    type: "POST",
                    url: '/Membership/AtabCommittee/UploadPicture',
                    data: formData,
                    contentType: false,
                    processData: false,
                    cache: false,
                    success: function (data) {
                        $('#SuccessModal').modal('show');
                        $('#SuccessModalText').text(data.Message);
                    },
                    error: function () {
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            }

        }
        self.LoadApplicationData = function () {
            //;
            if (self.Id() > 0) {
                $.getJSON("/Membership/AtabCommittee/LoadAtabCommittee/?id=" + self.Id(),
                    null,
                    function (data) {
                        self.Id(data.Id);
                        self.Member(data.LoadMemberautofilLoad);

                        self.FirstName(data.FirstName);
                        self.LastName(data.LastName);
                        self.Remarks(data.Remarks);

                        self.PhotoName(data.PhotoName);
                        if (data.Address != null && typeof (data.Address) != 'undefined') {
                            self.PermanentAddress.LoadAddress(data.Address);
                        }
                        $.when(self.GetCommitteeTypes()).done(function () {
                            $.when(self.GetPosts()).done(function () {
                                $.when(self.GetZones()).done(function () {
                                    $.each(data.TenureHistoryDetails, function (index, value) {
                                        var aDetail = new tenure();
                                        if (typeof (value) != 'undefined') {
                                            aDetail.LoadData(value);
                                            self.TenureHistoryDetails.push(aDetail);
                                        }
                                    });
                                });
                            });
                        });

                    });

            }
        }
        self.Save = function () {
            var details = ko.observableArray([]);
            $.each(self.TenureHistoryDetails(),
                function (index, value) {
                    details.push({
                        Id: value.Id(),
                        MemberCommitteId: value.MemberCommitteId(),
                        Zone: value.Zone(),
                        Post: value.Post(),
                        CommitteeType: value.CommitteeType(),
                        JoiningDate: value.JoiningDate(),
                        JoiningDateTxt: moment(value.JoiningDate()).format("DD/MM/YYYY"),
                        EndOfTenure: value.EndOfTenure(),
                        EndOfTenureTxt: moment(value.EndOfTenure()).format("DD/MM/YYYY")
                    });
                });
            var submitData = {
                Id: self.Id(),
                FirstName: self.FirstName(),
                LastName: self.LastName(),
                Remarks: self.Remarks(),
                TenureHistoryDetails: details,
                RemovedTenures: self.RemovedTenures(),
                Address: self.PermanentAddress,
                AddressId: self.AddressId,
                MemberId: self.MemberId()
            };
            $.ajax({
                url: '/Membership/AtabCommittee/SaveAtabCommittee',
                type: 'POST',
                contentType: 'application/json',
                data: ko.toJSON(submitData),
                success: function (data) {
                    if (data.Id > 0) {
                        self.CommitteeId(data.Id);
                        self.Upload();
                    }
                    $('#successModal').modal('show');
                    $('#successModalText').text(data.Message);

                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        };

        self.GetCountry = function () {
            return $.ajax({
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

        self.GetPosts = function () {
            return $.ajax({
                type: "GET",
                url: '/Membership/Settings/GetPosts',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.PostList(data);
                },
                error: function (error) {

                    $('#successModal').modal('show');
                    $('#successModalText').text(error.status + "<--save and--> " + error.statusText);
                }
            });
        }
        self.GetCommitteeTypes = function () {
            return $.ajax({
                type: "GET",
                url: '/Membership/Settings/GetCommitteeTypes',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.CommitteeTypes(data);
                },
                error: function (error) {

                    $('#successModal').modal('show');
                    $('#successModalText').text(error.status + "<--save and--> " + error.statusText);
                }
            });
        }
        self.GetZones = function () {
            return $.ajax({
                type: "GET",
                url: '/Membership/Settings/GetZoneList',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.ZoneList(data);
                },
                error: function (error) {

                    $('#successModal').modal('show');
                    $('#successModalText').text(error.status + "<--save and--> " + error.statusText);
                }
            });
        }
        self.InitialValueLoad = function () {
            self.GetPosts();
            self.GetZones();
            self.GetCountry();
            self.GetCommitteeTypes();
            if (self.Id() > 0) {
                self.LoadApplicationData();
            }
        };

        self.errors = ko.validation.group(self);
        self.IsValid = ko.computed(function () {
            var err = self.errors().length;
            if (err == 0)
                return true;
            return false;
        });
        self.queryString = function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));

        }
    }

    var vm = new DepreciationLogVm();
    var qValue = vm.queryString('Id');
    vm.Id(qValue);
    vm.InitialValueLoad();
    ko.applyBindings(vm, $('#DepreciationDiv')[0]);
});