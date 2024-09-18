$(document).ready(function () {

    function EventParticipantListVm() {
        var self = this;
        self.particiapantData = ko.observableArray([]);

        self.LoadEventParticipantList = function () {
            return $.ajax({
                type: "GET",
                url: "/Membership/Membership/GetMemberApplication?memberId=" + self.Id(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {

                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                    //self.isLoading(self.isLoading() - 1);
                }
            });
        }

    }
    var vm = new EventParticipantListVm();
    vm.LoadEventParticipantList();
    ko.applyBindings(vm, $('#EventParticipantListVm')[0]);
});