$(document).ready(function () {
    
    ko.validation.init({
        errorElementClass: 'has-error',
        errorMessageClass: 'help-block',
        decorateInputElement: true,
        grouping: { deep: true, observable: true }
    });
    
    function get_label(val) {
        console.log(val);
        for (var propt in vm.Members()) {
            console.log(vm.Members()[propt].value);
            if (vm.Members()[propt].value === val) {
                console.log("matched"+vm.Members()[propt].value);
                return vm.Members()[propt].label;
            }
        }
       
        return null;
    }

    function assignNominee() {
        var self = this;
        self.errors = ko.validation.group(self);
        self.MemberIds = ko.observableArray([]);
        self.MemberId = ko.observable();
        self.Members = ko.observableArray([]);
        self.Name = ko.observable();
        self.NomineeName = ko.observable().extend({ required: true });
        self.NomineeFathersName = ko.observable().extend({ required: true });
        self.NomineeAddress = ko.observable().extend({ required: true });
        self.Relation = ko.observable().extend({ required: true });
        self.LoadInitial = function () {
            $.getJSON("/Member/getMemberIdList/", null, function (data) {
                console.log(data);
                self.MemberIds(data);
                self.testFunction();
                console.log(ko.toJSON(self.MemberIds()));
            });
            $.getJSON("/Member/getMemberNameList/", null, function (data) {
                self.Members(data);
            });
        };
        self.testFunction = function () {
            $(".memberId").autocomplete({
                source: self.MemberIds(),
                focus: function (event, ui) {
                    $(this).val(ui.item.value);
                    return false;
                },
                select: function (event, ui) {
                    $(this).val(ui.item.value);
                    self.MemberId(ui.item.value);
                    var memberName = get_label(ui.item.value);
                    console.log(memberName);
                    if (memberName)
                        self.Name(memberName);
                    return false;
                }
            });
        };
        
        self.Submit = function () {
            // self.DateOfBirth(dobDate);
            if (self.errors().length == 0) {
                $.ajax({
                    type: "POST",
                    url: "/Member/AddNominee/",

                    data: ko.toJSON(self),
                    contentType: 'application/json',
                    success: function (data) {
                        toastr.success(data);
                        self.errors = ko.validation.group(self);
                        self.IsValid = ko.computed(function () {
                            if (self.errors().length == 0)
                                return true;
                            return false;
                        });
                        // window.location.href = "/Employee/Index"
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) { }
                });
            } else {
                self.errors.showAllMessages();
            }
        };
    }
    var vm = new assignNominee();
    vm.LoadInitial();
    ko.applyBindings(vm, document.getElementById("nominee"));

   
});