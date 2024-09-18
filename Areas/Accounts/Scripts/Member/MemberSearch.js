$(document).ready(function () {
    function MemberSearch() {
        var self = this;
        self.errors = ko.validation.group(self);
        self.memberInfo = ko.observable();
        self.MemberId = ko.observable().extend({ required: true });
        self.memberList = ko.observableArray([]);
        self.Name = ko.observable();
        self.shouldShowDetail = ko.observable(false);
        self.Search = function () {
            $.getJSON("/Member/GetMemberById/?memberInfo=" + self.memberInfo(), null, function (data) {
                console.log(data);
                self.shouldShowDetail(true);
                self.memberList(data);
               
            });
        };
        self.memberDetails = function (details) {
            console.log("det " + details.Name);
           window.location.href = "/Somity/Member/MemberSavings?memberId=" + details.MemberIdNo + "&memberName=" + details.Name;
        };

        self.ViewSavingDetails = function (details){
            console.log("det " + details.Name);
            window.location.href = "/Somity/Member/SavingDetails?memberId=" + details.MemberIdNo + "&memberName=" + details.Name;
        };
    }

    var vm = new MemberSearch();
    ko.applyBindings(vm, document.getElementById("memberSearch"));
});