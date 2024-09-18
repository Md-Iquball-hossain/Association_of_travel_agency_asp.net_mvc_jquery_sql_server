$(document).ready(function () {
    function LeaveSupervision() {
        var self = this;
        //self.Id = ko.observable();
        self.SupervisorComments = ko.observable().extend({ required: true, pattern: { message: 'Only alphanumeric value required.', params: "^[_A-Za-z ]{1,}$", maxLength: "100" } });
        self.CommentList = ko.observableArray([]);
        
        self.errors = ko.validation.group(self);
        self.IsValid = ko.computed(function () {
            if (self.errors().length == 0)
                return true;
            return false;
        });
        self.getCommentList = function () {
            return $.ajax({
                type: "GET",
                url: "/HRM/LeaveApplication/GetCommentHistory",
                dataType: "json",
                success: function (data) {
                    self.CommentList(data);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) { }
            });
        }
        self.Submit = function (data, event,paramval) {
            if (self.errors().length == 0) {
                console.log(paramval);
                self.ActionType = ko.observable(paramval);
                self.LeaveApplicationId = ko.observable(IdVal);
                console.log(self.SupervisorComments());
                console.log(self.LeaveApplicationId());
                $.ajax({
                    type: "POST",
                    url: "/HRM/LeaveApplication/SaveLeaveSupervisions/",
                    data: ko.toJSON(self),
                    contentType: 'application/json',
                    success: function (data) {
                       // Messager.ShowMessage(data);
                        alert(data);
                        window.location.href = "/HRM/LeaveApplication/LeaveSupervision/"
                        self.SupervisorComments('');
                        self.IsValid = ko.computed(function () {
                            if (self.errors().length == 0)
                                return true;
                            return false;
                        });
                        //window.location.href = "/LeaveApplication/LeaveSupervision/"
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) { }
                });
            } else {
                self.errors.showAllMessages();
            }
        }

      
    }
    var vm = new LeaveSupervision();
    vm.getCommentList();
    ko.applyBindings(vm);
    
    $('.tree-toggle').click(function () {
        //$(this).parent().children('ul.tree').toggle(200);
        alert();
    });
    $(function () {
        $('.tree-toggle').parent().children('ul.tree').toggle(200);
    })
});