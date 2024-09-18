var Months = [{ 'Id': 1, 'Name': 'January' },
                    { 'Id': 2, 'Name': 'February' },
                    { 'Id': 3, 'Name': 'March' },
                    { 'Id': 4, 'Name': 'April' },
                    { 'Id': 5, 'Name': 'May' },
                    { 'Id': 6, 'Name': 'June' },
                    { 'Id': 7, 'Name': 'July' },
                    { 'Id': 8, 'Name': 'August' },
                    { 'Id': 9, 'Name': 'September' },
                    { 'Id': 10, 'Name': 'October' },
                    { 'Id': 11, 'Name': 'November' },
                    { 'Id': 12, 'Name': 'December' }];

$(document).ready(function () {
    function MemberSearch() {
        var self = this;
        self.errors = ko.validation.group(self);
        self.memberInfo = ko.observable();
        self.Year = ko.observable();
        self.MemberId = ko.observable().extend({ required: true });
        self.memberList = ko.observableArray([]);
        self.MemberSummary = ko.observableArray([]);
        self.Name = ko.observable();
        self.shouldShowDetail = ko.observable(false);
        self.MonthList = ko.observableArray(Months);
        self.FromMonth = ko.observable();
        self.ToMonth = ko.observable();


        self.Link1 = ko.observable();
        self.Link2 = ko.observable();
        self.Link3 = ko.observable();
        self.Title1 = ko.observable('PDF');
        self.Title2 = ko.observable('Excel');
        self.Title3 = ko.observable('Word');

        //self.Search = function () {
        //    $.getJSON("/Member/GetMemberById/?memberInfo=" + self.memberInfo(), null, function (data) {
        //        console.log(data);
        //        self.shouldShowDetail(true);
        //        self.memberList(data);

        //    });
        //};
        //self.memberDetails = function (details) {
        //    console.log("det " + details.Name);
        //    window.location.href = "/Somity/Member/MemberSavings?memberId=" + details.MemberIdNo + "&memberName=" + details.Name;
        //};

        //self.ViewSavingDetails = function (details) {
        //    console.log("det " + details.Name);
        //    window.location.href = "/Somity/Member/SavingDetails?memberId=" + details.MemberIdNo + "&memberName=" + details.Name;
        //};
        var i = 0;
        for (i = new Date().getFullYear() ; i > 1900; i--) {
            $('#yearpicker').append($('<option />').val(i).html(i));
        }
        self.Search = function () {

            $.ajax({
                type: "GET",
                url: '/Somity/Member/MemberSummaryReport?year=' + self.Year() + '&from=' + self.FromMonth() + '&to=' + self.ToMonth(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.MemberSummary(data); //Put the response in ObservableArray
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }

        self.setUrl = ko.computed(function () {
            //var hospitalId = self.billNo() ? self.billNo() : 0;
            self.Link1('/Somity/Member/GetAuditDetailReport?reportTypeId=PDF&year=' + self.Year() + '&from=' + self.FromMonth() + '&to=' + self.ToMonth());
            self.Link2('/Somity/Member/GetAuditDetailReport?reportTypeId=Excel&year=' + self.Year() + '&from=' + self.FromMonth() + '&to=' + self.ToMonth());
            self.Link3('/Somity/Member/GetAuditDetailReport?reportTypeId=Word&year=' + self.Year() + '&from=' + self.FromMonth() + '&to=' + self.ToMonth());
        });
    }

    var vm = new MemberSearch();
    ko.applyBindings(vm, document.getElementById("memberSearch"));
});