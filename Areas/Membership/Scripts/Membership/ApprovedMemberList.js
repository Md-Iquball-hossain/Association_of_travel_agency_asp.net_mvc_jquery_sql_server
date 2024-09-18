$(document).ready(function () {


    function ApprovedMemberListVM() {
        var self = this;

        self.PageData = ko.observableArray(pageData);
        self.FromDate = ko.observable(fromDate ? moment(fromDate,"DD/MM/YYYY") : moment());
        self.ToDate = ko.observable(toDate ? moment(toDate,"DD/MM/YYYY") : moment());
        self.Zones = ko.observableArray(zones);
        self.Zone = ko.observable(zone);
        self.BusinessTypes = ko.observableArray(bcs);
        self.BusinessType = ko.observable(businessType);

        self.BlacklistReason = ko.observable(''); //Code by Maruf
        //self.Blacklisted = ko.observable(); //Code by Maruf
        //self.Id = ko.observable(); //Code by Maruf
        //self.MemberNo = ko.observable(); //Code by Maruf
        //self.NameOfOrganization = ko.observable() //Code by Maruf

        //Code by Maruf
        self.CountryId = ko.observable();
        //self.CountryName = ko.observable('');
        self.DivisionId = ko.observable(DivisionId);
        //self.DivisionNameEng = ko.observable('');
        self.DistrictId = ko.observable(DistrictId);
        //self.DistrictNameEng = ko.observable('');
        self.ThanaId = ko.observable(ThanaId);
        //self.ThanaNameEng = ko.observable('');
        self.AreaId = ko.observable(AreaId);
        //self.AreaName = ko.observable('');
        self.SearchString = ko.observable(searchString); //Code by Maruf
        self.DivisionList = ko.observableArray(Divisions);
        self.DistrictList = ko.observableArray(Districts);
        self.ThanaList = ko.observableArray(Thanas);
        self.AreaList = ko.observableArray(Areas);
        //
        self.Link1 = ko.observable();
        self.Link2 = ko.observable();
        self.Link3 = ko.observable();
        self.Title1 = ko.observable("PDF");
        self.Title2 = ko.observable("Excel");
        self.Title3 = ko.observable("Word");


        console.log("VoucherType: " + self.BusinessType(businessType));

        self.FromDate.subscribe(function () {
            $('#fromDate').val(moment(self.FromDate()).format("DD/MM/YYYY"));
        });
        self.ToDate.subscribe(function () {
            $('#toDate').val(moment(self.ToDate()).format("DD/MM/YYYY"));
        });

        self.Details = function (data) {
            var parameters = [{
                Name: 'Id',
                Value: data.Id
            }];
            var menuInfo = {
                Id: '136_' + data.Id,
                Menu: 'Membership Application',
                Url: '/Membership/Membership/MembershipApplication',
                Parameters: parameters
            }
            window.parent.AddTabFromExternal(menuInfo);
        }
        self.PaymentDetails = function (data) {
            var parameters = [{
                Name: 'Id',
                Value: data.Id
            }];
            var menuInfo = {
                Id: '139_' + data.Id,
                Menu: 'Member Payment History',
                Url: '/Membership/Membership/PaymentHistory',
                Parameters: parameters
            }
            window.parent.AddTabFromExternal(menuInfo);
        }
        self.MoneyReceipt = function (data) {
            var parameters = [{
                Name: 'MemberId',
                Value: data.Id
            }];
            var menuInfo = {
                Id: '140_' + data.Id,
                Menu: 'Money Receipts',
                Url: '/Membership/FeeCollection/MoneyReceiptList',
                Parameters: parameters
            }
            window.parent.AddTabFromExternal(menuInfo);
        }

        self.PrintCertificate = function (data) {
            var parameters = [{
                Name: 'MemberId',
                Value: data.Id
            }];
            var menuInfo = {
                Id: '141_' + data.Id,
                Menu: 'Print Certificate',
                Url: '/Membership/Membership/CertificatePrint',
                Parameters: parameters
            }
            window.parent.AddTabFromExternal(menuInfo);
        }
        //Commented by Maruf
        //self.ToggleBlacklisted = function () {
        //    var memberDetail = self.LoadMemberDetail();

        //    var member = {
        //        LoadMemberDetail: memberDetail,
        //        MemberId: self.Id()
        //    };

        //    $.ajax({
        //        type: 'POST',
        //        //url: '/Membership/Membership/ToggleBlacklisted?Id=' + data.Id + '&Blacklisted=' + !data.Blacklisted, //Commented by Maruf
        //        //url: '/Membership/Membership/ToggleBlacklisted?Id=' + data.Id + '&Blacklisted=' + !data.Blacklisted + '&BlacklistReason=' + data.BlacklistReason, //Code by Maruf
        //        url: '/Membership/Membership/ToggleBlacklisted', //Code by Maruf
        //        contentType: 'application/json',
        //        data: ko.toJSON(member),

        //        success: function (data) {
        //            $('#successModal').modal('show');
        //            $('#successModalText').text(data.Message);

        //        },
        //        error: function (error) {
        //            alert(error.status + "<--and--> " + error.statusText);
        //        }
        //    });
        //}

        //Code by Maruf
        self.ToggleBlacklisted = function (data) {
            $.ajax({
                type: 'GET',
                url: '/Membership/Membership/ToggleBlacklisted?Id=' + data.Id + '&Blacklisted=' + !data.Blacklisted + '&BlacklistReason=' + data.BlacklistReason,
                success: function (data) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(data.Message);

                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
        //Commented by Maruf
        //self.ToggleBlacklisted = function (data) {
        //    $.ajax({
        //        type: 'GET',
        //        url: '/Membership/Membership/ToggleBlacklisted?Id=' + data.Id + '&Blacklisted=' + !data.Blacklisted, 
        //        success: function (data) {
        //            $('#successModal').modal('show');
        //            $('#successModalText').text(data.Message);

        //        },
        //        error: function (error) {
        //            alert(error.status + "<--and--> " + error.statusText);
        //        }
        //    });
        //}
        
        self.GetMemberListWithPhotoReport = function () {
            //window.open('/Membership/MembershipReport/GetMemberListWithPhotoReport?reportTypeId=PDF', '_blank');
            if (typeof searchString === 'undefined') {
                searchString = "";
            }
            if (typeof businessType === 'undefined') {
                businessType = "";
            }
            if (typeof zone === 'undefined') {
                zone = "";
            }
            if (typeof DivisionId === 'undefined') {
                DivisionId = "";
            }
            if (typeof DistrictId === 'undefined') {
                DistrictId = "";
            }
            if (typeof ThanaId === 'undefined') {
                ThanaId = "";
            }
            if (typeof AreaId === 'undefined') {
                AreaId = "";
            }
            window.open('/Membership/MembershipReport/GetMemberListWithPhotoReport?reportTypeId=PDF&fromDate=' + moment(self.FromDate()).format('DD/MM/YYYY') + '&toDate=' + moment(self.ToDate()).format('DD/MM/YYYY') + '&businessCategory=' + self.BusinessType() + '&searchString=' + self.SearchString() + '&zone=' + self.Zone() + '&blacklisted=false&DivisionId=' + self.DivisionId() + '&DistrictId=' + self.DistrictId() + '&ThanaId=' + self.ThanaId() + '&AreaId=' + self.AreaId(), '_blank');

        }
        //Code by Maruf
        self.setUrl = ko.computed(function () {
            self.Link1('/Membership/MembershipReport/GetMemberListWithPhotoReport?reportTypeId=PDF&fromDate=' + moment(self.FromDate()).format('DD/MM/YYYY') + '&toDate=' + moment(self.ToDate()).format('DD/MM/YYYY') + '&businessCategory=' + self.BusinessType() + '&searchString=' + self.SearchString() + '&zone=' + self.Zone() + '&blacklisted=false&DivisionId=' + self.DivisionId() + '&DistrictId=' + self.DistrictId() + '&ThanaId=' + self.ThanaId() + '&AreaId=' + self.AreaId(), '_blank');
            self.Link2('/Membership/MembershipReport/GetMemberListWithPhotoReport?reportTypeId=Excel&fromDate=' + moment(self.FromDate()).format('DD/MM/YYYY') + '&toDate=' + moment(self.ToDate()).format('DD/MM/YYYY') + '&businessCategory=' + self.BusinessType() + '&searchString=' + self.SearchString() + '&zone=' + self.Zone() + '&blacklisted=false&DivisionId=' + self.DivisionId() + '&DistrictId=' + self.DistrictId() + '&ThanaId=' + self.ThanaId() + '&AreaId=' + self.AreaId(), '_blank');
            self.Link3('/Membership/MembershipReport/GetMemberListWithPhotoReport?reportTypeId=Word&fromDate=' + moment(self.FromDate()).format('DD/MM/YYYY') + '&toDate=' + moment(self.ToDate()).format('DD/MM/YYYY') + '&businessCategory=' + self.BusinessType() + '&searchString=' + self.SearchString() + '&zone=' + self.Zone() + '&blacklisted=false&DivisionId=' + self.DivisionId() + '&DistrictId=' + self.DistrictId() + '&ThanaId=' + self.ThanaId() + '&AreaId=' + self.AreaId(), '_blank');
            //$.each(self.CompanyProfileIds(), function (index, value) {
            //    self.Link1(self.Link1() + "&CompanyProfileIds=" + value);
            //    self.Link2(self.Link2() + "&CompanyProfileIds=" + value);
            //    self.Link3(self.Link3() + "&CompanyProfileIds=" + value);
            //});
        });
        //Commented by Maruf
        //self.GetBlackListedMemberWithPhotoReport = function () {
        //    window.open('/Membership/MembershipReport/GetBlackListedMemberWithPhotoReport?reportTypeId=PDF', '_blank');

        //}

        //Code by Maruf
        self.GetBlackListedMemberWithPhotoReport = function () {
            window.open('/Membership/MembershipReport/GetBlackListedMemberWithPhotoReport?reportTypeId=PDF&fromDate=' + moment(self.FromDate()).format('DD/MM/YYYY') + '&toDate=' + moment(self.ToDate()).format('DD/MM/YYYY') + '&businessCategory=' + self.BusinessType() + '&searchString=' + self.SearchString() + '&zone=' + self.Zone(), '_blank');

        }

        ////Code by Maruf
        //self.LoadMemberDetail = function (data) {

        //    if (data.Id > 0) {
        //        return $.ajax({
        //            type: "GET",
        //            url: "/Membership/Membership/GetMemberApplication?memberId=" + data.Id,
        //            contentType: "application/json; charset=utf-8",
        //            dataType: "json",
        //            success: function (data) {                       
        //                //console.log("Data : " + ko.toJSON(data));
        //                self.Id(data.Id);
        //                self.NameOfOrganization(data.NameOfOrganization); 
        //                self.Blacklisted(data.Blacklisted);
        //                self.BlacklistReason(data.BlacklistReason); //Code by Maruf                                     
        //            },
        //            error: function (error) {
        //                alert(error.status + "<--and--> " + error.statusText);
        //                //self.isLoading(self.isLoading() - 1);
        //            }
        //        });
        //    }
        //}

        //Code by Maruf

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

        //Code by Maruf
        self.loadInitialData = function () {

            self.LoadDivisionList();
            self.setUrl(); //Code by Maruf
        }

        self.Reload = function () {
            location.reload(true);
        }
    }
    var pavm = new ApprovedMemberListVM();
    pavm.loadInitialData(); //Code by Maruf
    ko.applyBindings(pavm, document.getElementById("ApprovedMemberList"));
});