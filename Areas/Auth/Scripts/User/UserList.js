
$(document).ready(function () {
    function userListVm() {
        var self = this;
        self.Id = ko.observable();
        self.LoadData = ko.observableArray(userInfo);
        self.Link1 = ko.observable();
        self.Title1 = ko.observable('PDF');

        self.DataForUser = function (data) {
            console.log(data);
            console.log(ko.toJSON(data));
            var parameters = [
                {
                    Name: 'Id',
                    Value: data.UserId
                }
            ];
            var menuInfo = {
                Id: 165,
                Menu: 'User Details',
                Url: '/Auth/User/UserDetails',
                Parameters: parameters
            }
            window.parent.AddTabFromExternal(menuInfo);
        }

        self.queryString = function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }
    }

    var aabmvm = new userListVm();
    ko.applyBindings(aabmvm, document.getElementById("UserDtlVW"));
});