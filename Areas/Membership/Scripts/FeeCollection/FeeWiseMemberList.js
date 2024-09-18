$(document).ready(function () { 
    function FeeWiseMembersVM() {
        var self = this;

        
        var currentDate = (new Date()).toISOString().split('T')[0];
        self.Id = ko.observable();
        self.FromDate = ko.observable(currentDate);
        self.FeeTypeId = ko.observable()
        self.ToDate = ko.observable(currentDate);
        self.FeeTypeList = ko.observableArray([]);

        //self.CompanyList = ko.observableArray(Companies);
        //self.CompanyProfileId = ko.observable(userCompanyId);

        self.GetFeeTypes = function () {
            //console.log("self.FeeType : " + data);
            return $.ajax({
                type: "GET",
                url: '/Membership/Settings/GetFeeTypes',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    //console.log("FeeType :" + ko.toJSON(data));
                    self.FeeTypeList(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
      
        self.ShowReport = function () {
            window.open('/Membership/MembershipReport/GetFeeWiseMemberList?reportTypeId=PDF&feeType=' + self.FeeTypeId() + '&fromDate=' + moment(self.FromDate()).format("DD/MM/YYYY") + '&toDate=' + moment(self.ToDate()).format("DD/MM/YYYY"), '_blank');
        }

        self.InitialValueLoad = function () {
            self.GetFeeTypes();
        };
       
    }
    var vm = new FeeWiseMembersVM();
    vm.InitialValueLoad();
    ko.applyBindings(vm, $('#rptFee')[0]);
});