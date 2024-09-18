$(document).ready(function () {
    ko.validation.init({
        errorElementClass: 'has-error',
        errorMessageClass: 'help-block',
        decorateInputElement: true,
        grouping: { deep: true, observable: true }
    });

    function SavingDetails() {
        var self = this;
        self.MemberSavingsId = ko.observable();
        self.MemberIdNo = ko.observable(memberId);
        self.CurrentFiscalYear = ko.observable();
        self.Month = ko.observable();
        self.SavingsAmount = ko.observable();
        self.PaymentDate = ko.observable();
        self.SavingDetailList = ko.observableArray([]);
        self.LoadList = function () {
            $.getJSON("/Somity/Member/ViewSavingDetails/?memberId=" + memberId, null, function (data) {
                console.log("list " + data);
                self.SavingDetailList(data);
                
            });
        };

        self.GoBack = function () {
            console.log("hitted ");
            window.location.href = "/Somity/Member/Index";
        };
    }

    var vm = new SavingDetails();
    vm.LoadList();
    ko.applyBindings(vm, document.getElementById("savingDetails"));
});