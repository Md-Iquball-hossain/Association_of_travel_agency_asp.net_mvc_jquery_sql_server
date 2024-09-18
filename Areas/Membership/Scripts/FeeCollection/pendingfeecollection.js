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



    function AssetVm() {

        var self = this;

        self.getSystemDate = function () {

            return $.ajax({
                type: "GET",
                url: '/Membership/FeeCollection/GetSystemDate',
                //data: ko.toJSON(this),
                contentType: "application/json;charset=utf-8",
                success: function (data) {
                    self.FromDate(fromDate ? moment(fromDate, "DD/MM/YYYY") : moment(data));
                    //return data;
                },
                error: function () {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        };


        self.Visibility = ko.observable(false);
        self.PageData = ko.observableArray(pageData);
        self.FromDate = ko.observable();
        self.ToDate = ko.observable(toDate ? moment(toDate, "DD/MM/YYYY") : moment());
        self.Zones = ko.observableArray(zones);
        self.Zone = ko.observable(zone);
        self.BTypes = ko.observableArray(btypes);
        self.BType = ko.observable(btype);
        self.MemberPaymentStatusList = ko.observableArray(memberPaymentStatusList); //Code by Maruf
        self.MemberPaymentStatus = ko.observable(memberPaymentStatus); //Code by Maruf
        //self.SearchString = ko.observable(searchString); //Code by Maruf


        self.FromDate.subscribe(function () {
            $('#fromDate').val(moment(self.FromDate()).format("DD/MM/YYYY"));
        });
        self.ToDate.subscribe(function () {
            $('#toDate').val(moment(self.ToDate()).format("DD/MM/YYYY"));
        });



        self.DataForFeeCollection = function (data) {
            var parameters = [
               {
                   Name: 'Id',
                   Value: data.Id,
               }
            ];
            var menuInfo = {
                Id: '165_' + data.Id,
                Menu: 'Member Pending Fee Collection',
                Url: '/Membership/FeeCollection/ExistingMemberFeeCollection',
                Parameters: parameters
            }
            window.parent.AddTabFromExternal(menuInfo);
            console.log(parameters);
        }


        self.getBlackListedMember = function () {
            var parameters = [
               {
                   Name: 'Id',
                   Value: data.Id
               }

            ];
            return $.ajax({
                type: "GET",
                url: '/Membership/FeeCollection/GetMemberFeeCollection?' + data.Id,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.DataForFeeCollection(data);
                    console.log('ddddd', data);
                },
                error: function (error) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(error.statusText);
                }
            });
        }


        //self.GetMembersOfPendingFees = function () {
        //    return $.ajax({
        //        type: "GET",
        //        url: '/Membership/FeeCollection/GetMembersOfPendingFees?memberName=' + self.MemberName() + '&memberNo=' + self.MemberNo() + '&catId=' + self.BusinessCategoryId() + '&areaId=' + self.AreaId() + '&fromDate=' + moment(self.FromDate()).format("DD/MM/YYYY") + '&toDate=' + moment(self.ToDate()).format("DD/MM/YYYY"),
        //        contentType: "application/json; charset=utf-8",
        //        dataType: "json",
        //        success: function (data) {
        //            self.Members(data);

        //        },
        //        error: function (error) {
        //            $('#successModal').modal('show');
        //            $('#successModalText').text(error.statusText);
        //        }
        //    });
        //}

        //Code by Maruf
        console.log(searchString);
        self.GetMemberListWithPaymentStatusReport = function () {
            if (typeof searchString === 'undefined')
            {
                searchString = "";
            }
            if (typeof memberPaymentStatus === 'undefined') {
                memberPaymentStatus = "";
            }
            if (typeof zone === 'undefined') {
                zone = "";
            }
            if (typeof btype === 'undefined') {
                btype = "";
            }
            //typeof myVar !== 'undefined'
            window.open('/Membership/MembershipReport/GetMemberListWithPaymentStatusReport?reportTypeId=PDF&searchString=' + searchString + '&btype=' + btype + '&memberPayStatus=' + memberPaymentStatus + '&zone=' + zone + '', '_blank');
        }

        self.InitialValueLoad = function () {
            self.getSystemDate();
            //self.getAllAreas();
            //self.getAllCategories();
            //self.GetMembersOfPendingFees();
        };

        self.errors = ko.validation.group(self);
        self.IsValid = ko.computed(function () {
            var err = self.errors().length;
            if (err == 0)
                return true;
            return false;
        });
    }

    var vm = new AssetVm();
    vm.InitialValueLoad();
    ko.applyBindings(vm, $('#AssetsDiv')[0]);
});