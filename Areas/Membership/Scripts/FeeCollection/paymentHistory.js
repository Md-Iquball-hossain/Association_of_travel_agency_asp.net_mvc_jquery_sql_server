$(document).ready(function () {
    function PaymentHistory() {
        var self = this;
        self.Id = ko.observable();
        self.PaymentList = ko.observableArray([]);
        self.MemberName = ko.observable('');
        self.MemberNo = ko.observable('');
   
        self.LoadPaymentHistory = function () {
            debugger;
            return $.ajax({
                type: "GET",
                url: '/Membership/Membership/GetMemberPaymentHistory?memberId=' + 1,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    console.log("Data : " + ko.toJSON(data));
                    self.MemberNo(data.MemberNo);
                    self.MemberName(data.MemberName);
                    self.PaymentList(data.PaymentList);

                },
                error: function (error) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(error.statusText);
                }
            });
        }
        self.InitialValueLoad = function () {
            self.LoadPaymentHistory();
        };
        self.queryString = function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        };

    }

    var vm = new PaymentHistory();
    vm.InitialValueLoad();
    vm.Id(vm.queryString("Id"));
    ko.applyBindings(pavm, document.getElementById("PaymentHistory"));
});