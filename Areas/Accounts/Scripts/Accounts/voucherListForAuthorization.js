function getParameterByName(url, name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(url);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

$(document).ready(function () {
    function voucher(data) {
        var self = this;

        self.Id = ko.observable(data ? data.Id : '');
        self.VoucherNo = ko.observable(data ? data.VoucherNo : '');
        self.VoucherDate = ko.observable(data ? moment(data.VoucherDate).format('DD/MM/YYYY') : '');
        self.RecordStatus = ko.observable(data ? data.RecordStatus : '');
        self.RecordStatusName = ko.observable(data ? data.RecordStatusName : '');
        self.Debit = ko.observable(data ? data.Debit : '-');
        self.Credit = ko.observable(data ? data.Credit : '-');
        self.Pass = ko.observable('');
        self.UniqueName = ko.observable(data ? 'id-' + data.Id : '');
        self.UniqueId1 = ko.observable(data ? 'id-' + data.Id + '-1' : '');
        self.UniqueId2 = ko.observable(data ? 'id-' + data.Id + '-2' : '');
    }

    function VoucherList() {
        var self = this;
        
        self.CompanyList = ko.observableArray(Companies);
        self.CompanyProfileIds = ko.observableArray([]);
        if (CompanySelectedIds != null && CompanySelectedIds.length > 0) {
            $.each(CompanySelectedIds, function (index, value) {
                self.CompanyProfileIds.push(value);
            })
        } else {
            self.CompanyProfileIds.push(userCompanyId);
        }

        self.VoucherListData = ko.observableArray();
        if (voucherList.length > 0) {
            $.each(voucherList, function (index, value) {
                self.VoucherListData.push(new voucher(value));
            })
        }
        
        self.Details = function (data) {
            //var parameters = [{
            //    Name: 'vId',
            //    Value: data.Id
            //}];
            //var menuInfo = {
            //    Id: 13300,
            //    Menu: 'Voucher Edit',
            //    Url: '/Cardiac/Accounts/VoucherEdit',
            //    Parameters: parameters
            //}
            //window.parent.AddTabFromExternal(menuInfo);
            window.open("/Accounts/Accounts/GetVoucherPrintByVoucherNo?reportTypeId=PDF&voucherNo=" + data.VoucherNo(), "_blank")
        }

        $("#submit").on('click', function (event) {
            //event.preventDefault();
            $.each(self.CompanyProfileIds(), function (index, value) {
                $("#voucherAuthorizerForm").append("<input type=\"hidden\" name=\"companyIds\" value=" + value + ">")
            })
            return true;
        });

        $(document).on("click", '.pagination-container a', function (event) {

            URL = $(this).attr("href");
            event.preventDefault();
            var currentFilter = getParameterByName(URL, "currentFilter");
            var page = getParameterByName(URL, "page");
            var searchDate = getParameterByName(URL, "searchDate");;
            pageLink(currentFilter, page, searchDate);
        });
        function pageLink(currentFilter, page, searchDate) {
            var url = "/Accounts/Accounts/VoucherListForAuthorization?page=" + page + "&currentFilter=" + currentFilter + "&searchDate=" + searchDate;
            $.each(self.CompanyProfileIds(), function (index, value) {
                url += "&companyIds=" + value
            })
            window.location.href = url;
        }

        self.saveVoucherAuthorization = function () {
            var saveData = ko.observableArray();
            $.each(self.VoucherListData(), function (index, value) {
                if (value.Pass().length > 0) {
                    saveData.push({ Id: value.Id(), Pass: value.Pass() });
                }
            })
            $.ajax({
                type: "POST",
                url: '/Accounts/Accounts/SaveVouchersAuthorization',
                data: ko.toJSON(saveData),
                contentType: "application/json",
                success: function (data) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(data.Message);
                },
                error: function () {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        };

        self.Refresh = function () {
            var url = "/Accounts/Accounts/VoucherListForAuthorization?page=" + page + "&searchDate=" + searchDate;
            $.each(self.CompanyProfileIds(), function (index, value) {
                url += "&companyIds=" + value
            })
            window.location.href = url;
        }
        self.setUrl = ko.computed(function () {
            return '/Accounts/Accounts/GetDateWiseVoucherSummary?reportTypeId=PDF&date=' + moment($("#searchDate").val()).format("DD/MM/YYYY");
        });
    }

    var vm = new VoucherList();
    ko.applyBindings(vm, document.getElementById("VoucherList"));
});