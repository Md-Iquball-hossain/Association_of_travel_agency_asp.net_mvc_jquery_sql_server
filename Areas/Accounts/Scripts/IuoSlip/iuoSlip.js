$(document).ready(function () {
    ko.validation.init({
        errorElementClass: 'has-error',
        errorMessageClass: 'help-block',
        decorateInputElement: true
    });
    var requisitionEntryVM = function () {
        var self = this;
        self.Id = ko.observable();
        self.ReceiverName = ko.observable();
        self.Designation = ko.observable();
        self.Amount = ko.observable();
        self.ReceiveDate = ko.observable();
        self.Remarks = ko.observable();
        self.IuoSlipStatus = ko.observable();
        self.IuoPurpose = ko.observable();
        self.IsBank = ko.observable();
        self.CreditAccHeadCode = ko.observable();
        self.DebitAccHeadCode = ko.observable();
        self.CompanyProfileId = ko.observable(userCompanyId);
        self.BankId = ko.observable();
        
        /////////////////Newly Modified
        self.IuoSlipStatusList = ko.observableArray([]);
        self.AccountHeads = ko.observableArray([]);
        self.Banks = ko.observableArray([]);
        self.CompanyList = ko.observableArray(Companies);
        self.IuoPurposeList = ko.observableArray();

        self.BankName = ko.observable();
        self.BranchName = ko.observable();
        self.ChequeNo = ko.observable();
        self.ChequeDate = ko.observable();
        self.AccountHeadCode = ko.observable();
        self.ChequeNo = ko.observable('');
        self.ChequeDate = ko.observable();
        self.ChequeDateTxt = ko.observable();
        function getPaytypes() {
            return ['cash', 'bank'];
        }
        function getTransactiontypes() {
            return ['monthly', 'yearly'];
        }

        self.paytypes = ko.observableArray(getPaytypes());
        self.trantypes = ko.observableArray(getTransactiontypes());
        self.selectedTransactiontype = ko.observable(self.trantypes()[0]);
        self.selectedPaytype = ko.observable(self.paytypes()[0]);
        self.selectedBankAccountHeadCode = ko.observable(0).extend({ required: { onlyIf: function () { return (self.selectedPaytype() === "bank"); } } });

        self.IsMonthly = ko.computed(
             function () {
                 if (self.selectedTransactiontype() === 'monthly') {
                     $("#month").show();
                     return true;
                 }
                 if (self.selectedTransactiontype() === 'yearly') {
                     $("#month").hide();
                     return true;

                 }
                 return false;
             });

        self.IsBank = ko.computed(
           function () {
               if (self.selectedPaytype() === 'bank') {
                   return true;
               }
               return false;
           });

        self.getBanks = function () {
            var currentCompany = self.CompanyProfileId() > 0 ? self.CompanyProfileId() : null;
            //self.isLoading(self.isLoading() + 1);

            return $.ajax({
                type: "GET",
                url: '/Accounts/Bank/GetBankList?CompanyProfileId=' + currentCompany,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.Banks(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
        self.getAccHeads = function () {
            var currentCompany = self.CompanyProfileId() > 0 ? self.CompanyProfileId() : 1;
            return $.ajax({
                type: "GET",
                url: '/Accounts/Accounts/GetConcatedAccHeads?companyProfileId=' + currentCompany,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.AccountHeads(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
       
        self.Save = function () {
            var submitData = {
                Id: self.Id(),
                ReceiverName: self.ReceiverName(),
                Designation: self.Designation(),
                Amount: self.Amount(),
                ReceiveDate: self.ReceiveDate(),
                ReceiveDateTxt: moment(self.ReceiveDate()).format('DD/MM/YYYY'),
                Remarks: self.Remarks(),
                CompanyProfileId: self.CompanyProfileId(),
                IuoSlipStatus: self.IuoSlipStatus(),
                IuoPurpose : self.IuoPurpose(),
                IsBank: self.IsBank(),
                BankId: self.BankId(),
                CreditAccHeadCode: self.CreditAccHeadCode(),
                DebitAccHeadCode: self.DebitAccHeadCode(),
                ChequeNo :self.ChequeNo(),
                ChequeDate :self.ChequeDate(),
                ChequeDateTxt: moment(self.ChequeDate()).format('DD/MM/YYYY')

            }
            $.ajax({
                type: "POST",
                url: '/Accounts/IuoSlip/SaveIuoSlip',
                data: ko.toJSON(submitData),
                contentType: "application/json",
                success: function (data) {
                    $('#SuccessModal').modal('show');
                    $('#SuccessModalText').text(data.Message);
                },
                error: function () {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });

        }

     
        self.GetIuoStatuses = function () {
            return $.ajax({
                type: "GET",
                url: '/Accounts/IuoSlip/GetIuoSlipStatuses',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.IuoSlipStatusList(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        };
        self.GetIuoPurposes = function () {
            return $.ajax({
                type: "GET",
                url: '/Accounts/IuoSlip/GetIuoPurposes',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.IuoPurposeList(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        };
       

        self.loadInitialData = function () {
            self.GetIuoStatuses();
            self.GetIuoPurposes();
            self.getAccHeads();
            self.getBanks();
        }


        self.queryString = function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        };
    }

    var vm = new requisitionEntryVM();
    vm.Id(vm.queryString("Id"));
    vm.loadInitialData();

    ko.applyBindings(vm, document.getElementById("purchaseRequisitionId")[0]);

});




