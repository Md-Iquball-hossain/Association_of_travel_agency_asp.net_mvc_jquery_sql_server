
$(document).ready(function () {

    //$('#myTable').pageMe({ pagerSelector: '#myPager', showPrevNext: true, hidePageNumbers: false, perPage: 3 });

    ko.validation.init({
        errorElementClass: 'has-error',
        errorMessageClass: 'help-block',
        decorateInputElement: true,
        grouping: { deep: true, observable: true }
    });

    function memberList() {
        var self = this;
        self.errors = ko.validation.group(self);
        self.memberInfo = ko.observable();
        self.MemberIdNo = ko.observable();
        self.Name = ko.observable();
        self.Phone = ko.observable();
        self.memberList = ko.observableArray([]);
        self.pageNumber = ko.observable(0);
        self.nbPerPage = 2;
        this.totalPages = ko.computed(function () {
            var div = Math.floor(self.memberList().length / self.nbPerPage);
            div += self.memberList().length % self.nbPerPage > 0 ? 1 : 0;
            return div - 1;
        });
        
        this.hasPrevious = ko.computed(function () {
            return self.pageNumber() !== 0;
        });
        this.hasNext = ko.computed(function () {
            return self.pageNumber() !== self.totalPages();
        });
        this.next = function () {
            if (self.pageNumber() < self.totalPages()) {
                self.pageNumber(self.pageNumber() + 1);
            }
        }
        this.previous = function () {
            if (self.pageNumber() != 0) {
                self.pageNumber(self.pageNumber() - 1);
            }
        }
        
        self.getMembers = function () {
            $.getJSON("/Member/GetAllMembers/", null, function (data) {
                self.memberList(data);
            });
        };

        self.Search = function () {
            $.getJSON("/Member/GetMemberById/?memberInfo=" + self.memberInfo(), null, function (data) {
                console.log(data);
                
                self.memberList(data);

            });
        };
        self.memberDetails = function (details) {
            console.log("det " + details.Name);
            window.location.href = "/Somity/Member/MemberDetails?memberId=" + details.MemberIdNo + "&memberName=" + details.Name;
        };
    }

    var vm = new memberList();
    vm.getMembers();
    ko.applyBindings(vm, document.getElementById("list"));
});