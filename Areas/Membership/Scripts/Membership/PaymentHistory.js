$(document).ready(function () {
    ko.validation.init({
        errorElementClass: 'has-error',
        errorMessageClass: 'help-block',
        decorateInputElement: true
    });
    function PaymentHistory() {
        var self = this;
        self.Id = ko.observable();
        self.PaymentList = ko.observableArray([]);
        self.MemberName = ko.observable('');
        self.MemberNo = ko.observable('');
        self.FromDate=ko.observable(moment());
        self.ToDate=ko.observable(moment());
        self.FromDateText=ko.observable();
        self.ToDateText=ko.observable();
        
        self.LoadPaymentHistory = function () {
            //console.log("self.Id() : " + self.Id());
            return $.ajax({
                type: "GET",
                url: '/Membership/Membership/GetMemberPaymentHistory?memberId=' + self.Id(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    //console.log("Data : " + ko.toJSON(data));
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

        self.GetMemberLedgerReport = function () {

            self.FromDateText(moment(self.FromDate()).format('DD/MM/YYYY'));
            self.ToDateText(moment(self.ToDate()).format('DD/MM/YYYY'));
            window.open('/Membership/MembershipReport/GetMemberLedgerReport?reportTypeId=PDF&memberId=' + self.Id() + '&fromDate=' + self.FromDateText()  +'&toDate='+ self.ToDateText() , '_blank');
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
    vm.Id(vm.queryString("Id"));
    vm.InitialValueLoad();
    
    //ko.applyBindings(vm, document.getElementById("PaymentHistory"));
    ko.applyBindings(vm, $('#PaymentHistory')[0]);
});