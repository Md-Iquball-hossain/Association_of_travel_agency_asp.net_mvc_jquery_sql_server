$(document).ready(function () {
    ko.validation.init({
        errorElementClass: 'has-error',
        errorMessageClass: 'help-block',
        decorateInputElement: true
    });


    function ReportVM() {
        var self = this;

        //self.FromDate = ko.observable(moment());
        //self.ToDate = ko.observable(moment());
        //self.FromDateText = ko.observable();
        //self.ToDateText = ko.observable();
        self.Id = ko.observable();

        self.AreaOptions = ko.observableArray();
        self.AreaId = ko.observable();
        self.AreaTypes = ko.observableArray([
                { "Id": 1, "Name": "Dhaka" },
                { "Id": 2, "Name": "Barisal" },
                { "Id": 2, "Name": "Bhola" },
                { "Id": 2, "Name": "Jhalokati" },
                { "Id": 2, "Name": "Patuakhali" },
                { "Id": 2, "Name": "Bandarban" },
                { "Id": 2, "Name": "Chandpur" },
                { "Id": 3, "Name": "Chittagong" },
               { "Id": 1, "Name": "Comilla" },
              { "Id": 2, "Name": "Cox's Bazar" },
              { "Id": 2, "Name": "Feni" },
              { "Id": 2, "Name": "Khagrachhari" },
              { "Id": 2, "Name": "Lakshmipur" },
              { "Id": 2, "Name": "Noakhali" },
              { "Id": 2, "Name": "Mymensingh" },
              { "Id": 3, "Name": "Faridpur" },
        { "Id": 1, "Name": "Kishoregonj" },
         { "Id": 2, "Name": "Barisal" },
         { "Id": 2, "Name": "Bhola" },
         { "Id": 2, "Name": "Jhalokati" },
         { "Id": 2, "Name": "Patuakhali" },
         { "Id": 2, "Name": "Bandarban" },
         { "Id": 2, "Name": "Chandpur" },
         { "Id": 3, "Name": "Chittagong" },
        { "Id": 1, "Name": "Comilla" },
       { "Id": 2, "Name": "Cox's Bazar" },
       { "Id": 2, "Name": "Feni" },
       { "Id": 2, "Name": "Khagrachhari" },
       { "Id": 2, "Name": "Lakshmipur" },
       { "Id": 2, "Name": "Noakhali" },
       { "Id": 2, "Name": "Mymensingh" },
       { "Id": 3, "Name": "Faridpur" }
        ]);

        self.ZoneOptions = ko.observableArray();
        self.ZoneId = ko.observable();
        self.ZoneTypes = ko.observableArray([

                { "Id": 1, "Name": "Dhaka" },
                { "Id": 2, "Name": "Chittagong" },
                { "Id": 2, "Name": "Sylhet" },
                { "Id": 2, "Name": "Khulna" },
                { "Id": 2, "Name": "Rajshahi" },
                { "Id": 2, "Name": "Rangpur" },
                { "Id": 2, "Name": "Mymensingh" },
                { "Id": 3, "Name": "Barisal" }]);


        self.FromDate = ko.observable(moment());
        self.FromDateText = ko.observable();
        self.FromDate.subscribe(function () {
            self.FromDateText(moment(self.FromDate()).format("DD/MM/YYYY"));
        });

        self.ToDate = ko.observable(moment());
        self.ToDateText = ko.observable();
        self.ToDate.subscribe(function () {
            self.ToDateText(moment(self.ToDate()).format("DD/MM/YYYY"));
        });

        self.Products = ko.observableArray([]);
        self.ProductId = ko.observable().extend({ required: true });

        self.Warehouses = ko.observableArray([]);
        self.WarehouseId = ko.observable().extend({ required: true });

        self.Categories = ko.observableArray([]);
        self.ProductCategoryId = ko.observable();
        self.CategoryName = ko.observable();

        self.UomId = ko.observable();
        self.UomName = ko.observable('');
        self.UOMList = ko.observableArray([]);

        self.ProductSizeList = ko.observableArray([]);
        self.SizeId = ko.observable();
        self.SizeName = ko.observable();


     
       



        self.errors = ko.validation.group(self);
        self.IsSaved = ko.observable(false);

       
        self.GetZoneWiseMemberListReport = function () {
            window.open('/Membership/MembershipReport/GetAreaWiseMembersList?reportTypeId=PDF', '_blank');

        }

        self.GetActiveMemberListReport = function () {
            var fDate = self.FromDate() ? self.FromDate() : '';
            var tDate = self.ToDate() ? self.ToDate() : '';
            //window.open('/Membership/MembershipReport/GetZoneWiseReport?reportTypeId=PDF&fromDate=' + self.FromDateText() + '&toDate=' + self.ToDateText() + '&categoryId=' + categoryId, '_blank');

            window.open('/Membership/MembershipReport/GetActiveMemberListReport?reportTypeId=PDF', '_blank');
           
        }
        self.GetAllMemberListReport = function () {
            window.open('/Membership/MembershipReport/GetAllMemberListReport?reportTypeId=PDF', '_blank');

        }
        self.getLatePaymentReport = function () {
            window.open('/Membership/MembershipReport/GetLatePaymentsReport?reportTypeId=PDF', '_blank');

        }
        self.getDuePaymentReport = function () {
            window.open('/Membership/MembershipReport/GetDefaulterMembersReport?reportTypeId=PDF', '_blank');

        }
        self.loadInitialData = function () {

        }



    }

    var vm = new ReportVM();
    vm.loadInitialData();
    ko.applyBindings(vm, $('#ReportId')[0]);


});




