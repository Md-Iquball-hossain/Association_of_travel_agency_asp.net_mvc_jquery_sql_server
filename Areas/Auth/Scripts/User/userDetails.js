
$(document).ready(function () {
    $(document).on('click', '.panel-heading.address', function (e) {
        if ($(this).data('toggle') == 'collapse') {
            $(this).next().toggle();
        }
        e.preventDefault();
    });

    ko.validation.init({
        errorElementClass: 'has-error',
        errorMessageClass: 'help-block',
        decorateInputElement: true,
        grouping: { deep: true, observable: true }
    });

    function userCompanyApp() {
        var self = this;
        self.Id = ko.observable();
        self.UserId = ko.observable();
        self.UserName = ko.observable();
        self.OfficeId = ko.observable();
        self.OfficeName = ko.observable();
        self.ApplicationId = ko.observable();
        self.ApplicationName = ko.observable();
        self.LoadData = function (data) {
            console.log(ko.toJSON(data));
            self.Id(data.Id);
            self.UserId(data.UserId);
            self.UserName(data.UserName);
            self.OfficeId(data.OfficeId);
            self.OfficeName(data.OfficeName);
            self.ApplicationId(data.ApplicationId);
            self.ApplicationName(data.ApplicationName);
        }
    }
    function amendmentVM() {
        var self = this;
        //var currentDate = (new Date()).toISOString().split('T')[0];
        self.Id = ko.observable();
        self.UserId = ko.observable();
        self.UserName = ko.observable();
        self.Password = ko.observable();
        self.ConfirmPassword = ko.observable();
        self.OldPassword = ko.observable();
        self.EmployeeId = ko.observable();
        self.IsActive = ko.observable();
        self.IsActive.subscribe(function () {
            if (self.Id() > 0) {
                self.ChangeUserStatus();
            }
        });
        self.RoleId = ko.observable();
        self.CompanyProfileId = ko.observable();
        self.IMEI = ko.observable();
        self.OfficeList = ko.observableArray([]);
        self.ApplicationList = ko.observableArray([]);
        self.UserCompanyApplications = ko.observableArray([]);

        self.AddUserCompanyApplication = function () {
            var dtl = new userCompanyApp();
            dtl.UserId(self.Id());
            self.UserCompanyApplications.push(dtl);
        }
        self.RemovedUserCompanyApplications = ko.observableArray([]);
        self.RemoveUserCompanyApplication = function (line) {
            if (line.Id() > 0)
                self.RemovedUserCompanyApplications.push(line.Id());
            self.UserCompanyApplications.remove(line);
        }

        self.errors = ko.validation.group(self);
        self.IsValid = ko.computed(function () {
            var err = self.errors().length;
            if (err === 0)
                return true;
            return false;
        });
        //self.Print = function () {
        //    if (self.Id() > 0) {
        //        var url = "";
        //        url = "/IPDC/CRM/LoadAmendmentOfferLetterReport?reportTypeId=PDF&id=" + self.Id();
        //        window.open(url, '_blank');
        //    } else {
        //        $('#lonSuccessModal').modal('show');
        //        $('#lonSuccessModalText').text("Enable to find amendment");
        //    }
        //};
        self.ChangeUserStatus = function () {
            if (self.Id() > 0) {
                $.getJSON("/Auth/User/ChangeUserStatus/?id=" + self.Id() + '&status=' + self.IsActive(),
                    null,
                    function (data) {
                        if (data.Id > 0) {
                            $('#lonSuccessModal').modal('show');
                            $('#lonSuccessModalText').text(data.Message);
                        }
                    });
            };

        };
        self.LoadUserById = function () {
            if (self.Id() > 0) {
                $.getJSON("/Auth/User/LoadUserById/?id=" + self.Id(),
                    null,
                    function (data) {
                        self.Id(data.Id);
                        self.UserId(data.UserId);
                        self.UserName(data.UserName);
                        //self.OldPassword(data.Password);
                        //self.ConfirmPassword(data.ConfirmPassword);
                        self.EmployeeId(data.EmployeeId);
                        self.IsActive(data.IsActive);
                        $.when(self.GetOfficeList()).done(function () {
                            $.when(self.GetApplicationList()).done(function () {
                                $.each(data.UserCompanyApplications,
                                  function (index, value) {
                                      var aDetail = new userCompanyApp();
                                      if (typeof (value) != 'undefined') {
                                          aDetail.LoadData(value);
                                          self.UserCompanyApplications.push(aDetail);
                                      }
                                  });
                            });
                        });
                        //public  List<OfferLetterAmendmentTextsDto> Conditions (data.);
                    });
            };

        };
        self.GetOfficeList = function () {
            return $.ajax({
                type: "GET",
                url: '/Auth/CompanyProfile/GetAllCompanyList',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.OfficeList(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
        self.GetApplicationList = function () {
            return $.ajax({
                type: "GET",
                url: '/Auth/User/GetAllApplications',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.ApplicationList(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
        //self.LoadProposaLData = function () {
        //    if (self.ApplicationId() > 0 && self.ProposalId() > 0 && self.OfferLetterId() > 0) {
        //        $.getJSON("/IPDC/CRM/LoadProposalForAmendment/?AppId=" + self.ApplicationId() + '&Id=' + self.ProposalId() + '&offerLetterId=' + self.OfferLetterId(),
        //            null,
        //            function (data) {
        //                //console.log(data);
        //                self.ProposalId(data.Id);
        //                self.ApplicationId(data.ApplicationId);
        //                self.ApplicationNo(data.ApplicationNo);
        //                self.CRMReceiveDate(moment(data.CRMReceiveDate));
        //                self.CRMReceiveDateText(data.CRMReceiveDateText);
        //                self.ProposalDate(moment(data.ProposalDate));
        //                self.ProposalDateText(data.ProposalDateText);
        //                self.AppliedLoanAmount(data.AppliedLoanAmount);
        //                self.CreditMemoNo(data.CreditMemoNo);
        //                var amt = data.ChangedLoanAmount + data.AppliedLoanAmount;
        //                self.LoanAmount(amt);
        //                self.AccountTitle(data.AccountTitle);
        //                self.OfferLetterId(data.OfferLetterId);
        //                if (data.OLAId) {
        //                    self.Id(data.OLAId);
        //                    self.LoadOfferLetterAmendmentData();
        //                }
        //                self.flag(1);
        //            });
        //    };

        //};
        self.IsSave = ko.pureComputed(function () {
            if (self.Password().length > 5 && self.Password() === self.ConfirmPassword())
                return true;
            else
                return false;
        });
        self.SaveUserPassword = function () {
            var submitData = {
                //Id :self.Id(),
                UserId: self.Id(),
                UserName: self.UserName(),
                OldPassword: self.OldPassword(),
                Password: self.Password(),
                ConfirmPassword: self.ConfirmPassword(),
                EmployeeId: self.EmployeeId(),
                IsActive: self.IsActive()
                //UserCompanyApplications: self.UserCompanyApplications()
            }
            if (self.IsSave()) {
                $.ajax({
                    type: "POST",
                    url: '/Auth/Login/ChangePasswordByUserId',
                    data: ko.toJSON(submitData),
                    contentType: "application/json",
                    success: function (data) {
                        $('#lonSuccessModal').modal('show');
                        $('#lonSuccessModalText').text(data.Message);
                    },
                    error: function () {
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            }
        }
        self.SaveUserDetails = function () {
            var con = ko.observableArray([]);
            $.each(self.UserCompanyApplications(),
                function (index, value) {
                    con.push({
                        Id: value.Id(),
                        UserId: self.Id(),
                        UserName: value.UserName(),
                        OfficeId: value.OfficeId(),
                        OfficeName: value.OfficeName(),
                        ApplicationId: value.ApplicationId(),
                        ApplicationName: value.ApplicationName()
                    });
                });
            console.log(ko.toJSON(self.UserCompanyApplications()));
            var submitData = {
                //Id :self.Id(),
                //UserId: self.UserId(),
                //UserName :self.UserName(),
                //Password:self.Password(),
                //ConfirmPassword:self.ConfirmPassword(),
                //EmployeeId:self.EmployeeId(),
                //IsActive:self.IsActive(),
                UserCompanyApplications: self.UserCompanyApplications(),
                RemovedUserCompanyApplications: self.RemovedUserCompanyApplications()
            }
            $.ajax({
                type: "POST",
                url: '/Auth/User/SaveUserDetails',
                data: ko.toJSON(submitData),
                contentType: "application/json",
                success: function (data) {
                    $('#lonSuccessModal').modal('show');
                    $('#lonSuccessModalText').text(data.Message);
                },
                error: function () {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }

        self.queryString = function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));

        }
        self.Initialize = function () {
            if (self.Id() > 0) {
                self.LoadUserById();
            }
            self.GetOfficeList();
            self.GetApplicationList();
        }
    }

    var user = new amendmentVM();

    var qValue = user.queryString('Id');
    user.Id(qValue);
    user.Initialize();
    ko.applyBindings(user, $('#amendmentVW')[0]);

});