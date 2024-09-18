

function getParameterByName(url, name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(url);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};


$(document).ready(function () {

    function VoucherList() {
        var self = this;
        self.test = ko.observable('');
        self.VoucherListData = ko.observableArray(voucherList);

        self.CompanyList = ko.observableArray(Companies);
        self.CompanyProfileIds = ko.observableArray([]);
        if (CompanySelectedIds != null && CompanySelectedIds.length > 0) {
            $.each(CompanySelectedIds, function (index, value) {
                self.CompanyProfileIds.push(value);
            })
        } else {
            self.CompanyProfileIds.push(userCompanyId);
        }
        self.Details = function (data) {

        //    var parameters = [{
        //        Name: 'vId',
        //        Value: data.Id
        //    }];
        //    var menuInfo = {
        //        Id: 133,
        //        Menu: 'Voucher Edit',
        //        Url: '/Cardiac/Accounts/VoucherEdit',
        //        Parameters: parameters
        //    }
        //    window.parent.AddTabFromExternal(menuInfo);
            window.open("/Accounts/Accounts/GetVoucherPrintByVoucherNo?reportTypeId=PDF&voucherNo=" + data.VoucherNo, "_blank");
        }

        $("#submit").on('click', function (event) {
            //event.preventDefault();
            $.each(self.CompanyProfileIds(), function (index, value) {
                $("#voucherCreatorForm").append("<input type=\"hidden\" name=\"companyIds\" value=" + value + ">")
            })
            return true;
        })
        $(document).on("click", '.pagination-container a', function (event) {

            URL = $(this).attr("href");
            event.preventDefault();
            var currentFilter = getParameterByName(URL, "currentFilter");
            var page = getParameterByName(URL, "page");
            var searchDate = getParameterByName(URL, "searchDate");;
            pageLink(currentFilter, page, searchDate);
        });
        function pageLink(currentFilter, page, searchDate) {
            var url = "/Accounts/Accounts/VoucherListForCreator?page=" + page + "&currentFilter=" + currentFilter + "&searchDate=" + searchDate;
            $.each(self.CompanyProfileIds(), function (index, value) {
                url += "&companyIds=" + value
            })
            window.location.href = url;
        }
        self.setUrl = ko.computed(function () {           
            return '/Accounts/Accounts/GetVoucherListForCreatorReport?reportTypeId=PDF&date=' + moment($("#searchDate").val()).format("DD/MM/YYYY");
        });
     
    }

    var vm = new VoucherList();
    //vm.Search();
    ko.applyBindings(vm, document.getElementById("VoucherListForCreator"));
});