$(document).ready(function () {

    function SubscriptionMembersVM() {
        var self = this;
        self.Id = ko.observable();

        self.Zones = ko.observableArray([]);
        self.ZoneId = ko.observable();
        self.ZoneName = ko.observable();

        self.FromDate = ko.observable(moment().format("YYYY"));
        self.Year = ko.observable(moment().format("YYYY"));
        self.AnnualYear = ko.computed(function () {
            return moment(self.Year()).format("YYYY");
        });
        self.MiddleDate = ko.computed(function () {
            return moment(self.FromDate()).add(1, 'y').format("YYYY");
        });
        self.ToDate = ko.computed(function () {
            return moment(self.FromDate()).add(2, 'y').format("YYYY");
        });
        self.FromDateTxt = ko.computed(function () {
            return moment(self.FromDate()).format("YYYY");
        });
        self.MiddleDateTxt = ko.computed(function () {
            return moment(self.MiddleDate()).format("YYYY");
        });
        self.ToDateTxt = ko.computed(function () {
            return moment(self.ToDate()).format("YYYY");
        });
        self.SubscriptionYear = ko.computed(function () {
            return self.FromDateTxt() + '-' + self.MiddleDateTxt() + '-' + self.ToDateTxt();
        });

        self.getZones = function () {
             $.ajax({
                type: "GET",
                url: '/Membership/Settings/GetZoneList',
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.Zones(data)
                },
                error: function () {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }

        self.ShowSubscriptionReport = function () {
            window.open('/Membership/MembershipReport/GetMembershipSubscriptionReport?reportTypeId=PDF&SubscriptionYear=' + self.SubscriptionYear(), '_blank');
        }

        self.ShowAnnualSubscriptionReport = function () {
            window.open('/Membership/MembershipReport/GetMembershipAnnualSubscriptionReport?reportTypeId=PDF&SubscriptionYear=' + self.AnnualYear() + '&zone=' + self.ZoneId(), '_blank');
        }
        self.InitialValueLoad = function () {
            self.getZones();
        };

    }
    var vm = new SubscriptionMembersVM();
    vm.InitialValueLoad();
    ko.applyBindings(vm, $('#rptSubscription')[0]);
});