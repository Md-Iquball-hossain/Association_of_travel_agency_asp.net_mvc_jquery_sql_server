$(document).ready(function () {
    function PendingApplicationVM() {
        var self = this;

        self.PageData = ko.observableArray(pageData);

    }

    var pavm = new PendingApplicationVM();
    ko.applyBindings(pavm, document.getElementById("approvedMembers"));
});