﻿$(document).ready(function () {
    function PendingApplicationVM() {
        var self = this;

        self.Visibility = ko.observable(false);
        self.PageData = ko.observableArray(pageData);
        self.FromDate = ko.observable(fromDate ? moment(fromDate,"DD/MM/YYYY") : moment());
        self.ToDate = ko.observable(toDate ? moment(toDate, "DD/MM/YYYY") : moment());
        self.Zones = ko.observableArray(zones);
        self.Zone = ko.observable(zone);
        self.BusinessTypes = ko.observableArray(bcs);
        self.BusinessType = ko.observable(businessType);
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
                Id: '135_' + data.Id,
                Menu: 'Membership Application',
                Url: '/Membership/Membership/MembershipApplication',
                Parameters: parameters
            }
            window.parent.AddTabFromExternal(menuInfo);
        }
        self.Print = function (data) {
            window.open('/Membership/MembershipReport/GetMembershipApplicationReport?reportTypeId=PDF&memid=' + data.Id, '_blank');

        }
    }

    var pavm = new PendingApplicationVM();
    ko.applyBindings(pavm, document.getElementById("pendingApplicationList"));
});