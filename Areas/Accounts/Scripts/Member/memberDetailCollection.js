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
                    { 'Id': 12, 'Name': 'December' }
];

$(document).ready(function () {
    function MemberSearch() {
        var self = this;
        self.errors = ko.validation.group(self);
        self.memberInfo = ko.observable();
        //self.Year = ko.observable();
        self.MemberId = ko.observable();
        self.MemberNo= ko.observable();
        self.memberList = ko.observableArray([]);
        self.MemberSummary = ko.observableArray([]);
        self.MonthList = ko.observableArray(Months);
        self.FromMonth = ko.observable();
        self.ToMonth = ko.observable();

        self.Name = ko.observable();
        self.shouldShowDetail = ko.observable(false);

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
        //var i = 0;
        //for (i = new Date().getFullYear() ; i > 1900; i--) {
        //    $('#yearpicker').append($('<option />').val(i).html(i));
        //}

        //self.MemberNo.subscribe(function () {
        //    
        //    if (self.MemberNo().length >2) {
        //        self.getMemberByNo();
        //    }
          
        //});
        self.MemberNoComputed = ko.pureComputed({
            read: function () {
                    return self.Name();
                
            },
            write: function (value) {
                //value = parseFloat(value.replace(/,/g, ""));
                self.MemberNo(value);
                if (value.length > 2) {
                    self.getMemberByNo();
                }
                //self.AppliedLoanAmount(isNaN(value) ? 0 : value);
            },
            owner: self
        });
        self.getMemberByNo = function () {
            $.getJSON("/Member/GetMemberByNo?memberNo="+ self.MemberNo(), null, function (data) {
                self.MemberId(data.Id);
                self.Name(data.Name);
            });
        };
        self.Search = function () {
            //console.log(self.MemberId());
            if (self.MemberId() >0) {
                 $.ajax({
                type: "GET",
                url: '/Somity/Member/MemberDetailCollectionReport?id=' + self.MemberId() + '&from=' + self.FromMonth() + '&to=' + self.ToMonth(),
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
           
        }
        self.getMembers = function () {
            $.getJSON("/Member/GetAllMembers/", null, function (data) {
                self.memberList(data);
            });
        };

        self.setUrl = ko.computed(function () {
            //var hospitalId = self.billNo() ? self.billNo() : 0;
            self.Link1('/Somity/Member/GetMemberDetailCollectionReport?reportTypeId=PDF&id=' + self.MemberId() + '&from=' + self.FromMonth() + '&to=' + self.ToMonth());
            self.Link2('/Somity/Member/GetMemberDetailCollectionReport?reportTypeId=Excel&id=' + self.MemberId() + '&from=' + self.FromMonth() + '&to=' + self.ToMonth());
            self.Link3('/Somity/Member/GetMemberDetailCollectionReport?reportTypeId=Word&id=' + self.MemberId() + '&from=' + self.FromMonth() + '&to=' + self.ToMonth());
        });
    }

    var vm = new MemberSearch();
    vm.getMembers();
    ko.applyBindings(vm, document.getElementById("memberSearch"));
});