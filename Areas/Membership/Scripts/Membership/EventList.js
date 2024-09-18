$(document).ready(function () {

    function EventListVm() {

        var self = this;
        self.PageData = ko.observableArray(pageData);

        self.ParticipantList = function (data) {
            window.open('/Membership/Membership/GetAllEventParticipant?reportTypeId=Excel&eventId=' + data.Id, '_blank');

        }
        self.EditArea = function (data) {
            var parameters = [{
                Name: 'Id',
                Value: data.Id
            }];
            var menuInfo = {
                //Id: 133,
                Menu: 'Edit Area',
                Url: '/Membership/Settings/EventCreate',
                Parameters: parameters
            }
            window.parent.AddTabFromExternal(menuInfo);
            //console.log(menuInfo);
        }
    }
    var vm = new EventListVm();
    //vm.InitialValueLoad();

    ko.applyBindings(vm, $('#EventListVm')[0]);
})