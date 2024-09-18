
$(document).ready(function () {

    function AreaList() {
        var self = this;
        self.Id = ko.observable();
        self.AreaListData = ko.observableArray(Info);


        self.EditArea = function (data) {
            var parameters = [{
                Name: 'Id',
                Value: data.Id
            }];
            var menuInfo = {
                //Id: 133,
                Menu: 'Edit Area',
                Url: '/Membership/Settings/AreaEntryNew',
                Parameters: parameters
            }
            window.parent.AddTabFromExternal(menuInfo);
            //console.log(menuInfo);
        }

        self.CreateArea = function (data) {
            var parameters = [{
                Name: 'Id',
                Value: null
            }];
            var menuInfo = {
                //Id: 133,
                Menu: 'Area Create',
                Url: '/Membership/Settings/AreaEntryNew',
                Parameters: parameters
            }
            window.parent.AddTabFromExternal(menuInfo);
        }

    }

    var vm = new AreaList();
    //vm.Search();
    ko.applyBindings(vm, document.getElementById("AreaList"));

});