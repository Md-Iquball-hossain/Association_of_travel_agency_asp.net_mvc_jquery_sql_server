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
        self.MemberId = ko.observable();
        self.FromDate=ko.observable(moment());
        self.ToDate=ko.observable(moment());
        self.FromDateText=ko.observable();
        self.ToDateText = ko.observable();
        self.Members = ko.observableArray([]);
        
        self.GetMemberList = function (searchTerm, callback) {
            var submitData = {
                prefix: searchTerm,
                exclusionList: self.Members()
            };
            $.ajax({
                type: "POST",
                url: '/Membership/Membership/GeMemberListForAutoFill',
                data: ko.toJSON(submitData),
                contentType: "application/json",
                success: function (data) {
                    
                    self.Members(data);
                    
                },
                error: function () {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            }).done(callback);
        };

        self.LoadPaymentHistory = function () {
            
            return $.ajax({
                type: "GET",
                url: '/Membership/Membership/GetMemberPaymentHistory?memberId=' + self.MemberId(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    //console.log("Data : " + ko.toJSON(data));
                    self.MemberNo(data.MemberNo);
                    //self.MemberName(data.MemberName);
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
            window.open('/Membership/MembershipReport/GetMemberLedgerReport?reportTypeId=PDF&memberId=' + self.MemberId() + '&fromDate=' + self.FromDateText() + '&toDate=' + self.ToDateText(), '_blank');
        }
        self.LoadData = function () {
            self.MemberId(self.MemberName().key);
            self.LoadPaymentHistory();
        };
        

    }

    var vm = new PaymentHistory();
    
    //vm.InitialValueLoad();
    
    //ko.applyBindings(vm, document.getElementById("PaymentHistory"));
    ko.applyBindings(vm, $('#PaymentHistory')[0]);
});