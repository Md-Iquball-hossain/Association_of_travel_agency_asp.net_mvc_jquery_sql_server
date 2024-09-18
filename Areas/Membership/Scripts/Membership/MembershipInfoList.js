$(document).ready(function () {


    function MembershipInfoListVM() {
        var self = this;

        self.PageData = ko.observableArray(pageData);
        self.FromDate = ko.observable(fromDate ? moment(fromDate, "DD/MM/YYYY") : moment());
        self.ToDate = ko.observable(toDate ? moment(toDate, "DD/MM/YYYY") : moment());
        self.SubscriptionYear = ko.observable('');
        self.Zones = ko.observableArray(zones);
        self.Zone = ko.observable(zone);

        //self.Id = ko.observable(); 
        //self.MemberNo = ko.observable(); 
        //self.NameOfOrganization = ko.observable() 

        self.SearchString = ko.observable(searchString); 

        self.Link1 = ko.observable();
        self.Link2 = ko.observable();
        self.Link3 = ko.observable();
        self.Title1 = ko.observable("PDF");
        self.Title2 = ko.observable("Excel");
        self.Title3 = ko.observable("Word");

        self.FromDate.subscribe(function () {
            $('#fromDate').val(moment(self.FromDate()).format("DD/MM/YYYY"));
        });
        self.ToDate.subscribe(function () {
            $('#toDate').val(moment(self.ToDate()).format("DD/MM/YYYY"));
        });
        self.SubscriptionYear.subscribe(function () {
            $('#subscriptionYear').val(moment(self.SubscriptionYear()).format("YYYY"));
        });

        self.GetMemberListWithPhotoReport = function () {
            if (typeof searchString === 'undefined') {
                searchString = "";
            }
            if (typeof zone === 'undefined') {
                zone = "";
            }
            window.open('/Membership/MembershipReport/GetMemberListWithPhoto?reportTypeId=PDF&fromDate=' + moment(self.FromDate()).format('DD/MM/YYYY') + '&toDate=' + moment(self.ToDate()).format('DD/MM/YYYY') + '&subscriptionYear=' + moment(self.SubscriptionYear()).format('YYYY') + '&searchString=' + self.SearchString() + '&zone=' + self.Zone(), '_blank');

        }

        self.setUrl = ko.computed(function () {
            self.Link1('/Membership/MembershipReport/GetMemberListWithPhoto?reportTypeId=PDF&fromDate=' + moment(self.FromDate()).format('DD/MM/YYYY') + '&toDate=' + moment(self.ToDate()).format('DD/MM/YYYY') + '&subscriptionYear=' + moment(self.SubscriptionYear()).format('YYYY') + '&searchString=' + self.SearchString() + '&zone=' + self.Zone(), '_blank');
            self.Link2('/Membership/MembershipReport/GetMemberListWithPhoto?reportTypeId=Excel&fromDate=' + moment(self.FromDate()).format('DD/MM/YYYY') + '&toDate=' + moment(self.ToDate()).format('DD/MM/YYYY') + '&subscriptionYear=' + moment(self.SubscriptionYear()).format('YYYY') + '&searchString=' + self.SearchString() + '&zone=' + self.Zone(), '_blank');
            self.Link3('/Membership/MembershipReport/GetMemberListWithPhoto?reportTypeId=Word&fromDate=' + moment(self.FromDate()).format('DD/MM/YYYY') + '&toDate=' + moment(self.ToDate()).format('DD/MM/YYYY') + '&subscriptionYear=' + moment(self.SubscriptionYear()).format('YYYY') + '&searchString=' + self.SearchString() + '&zone=' + self.Zone(), '_blank');
        });

        self.loadInitialData = function () {
            self.setUrl();
        }

        self.Reload = function () {
            //location.reload(true);
        }
    }
    var pavm = new MembershipInfoListVM();
    pavm.loadInitialData();
    ko.applyBindings(pavm, document.getElementById("MembershipInfoList"));
});