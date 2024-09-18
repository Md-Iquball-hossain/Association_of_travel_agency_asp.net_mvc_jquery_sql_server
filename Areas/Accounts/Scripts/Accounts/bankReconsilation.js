$(document).ready(function () {
    ko.validation.init({
        errorElementClass: 'has-error',
        errorMessageClass: 'help-block',
        decorateInputElement: true
    });
    function bankReconsilationDetail() {
        var self = this;
        self.Id = ko.observable('');
        self.BRId = ko.observable('');
        self.BankReconsilationType = ko.observable('');
        self.BankReconsilationTypeName = ko.observable('');
        self.TranDate = ko.observable(moment());
        self.TranDateTxt = ko.observable('');
        self.Amount = ko.observable('');
        //self.IsChanged = ko.observable(false);
        self.Initialize = function (data) {

            self.Id(data ? data.Id : "");
            self.BRId(data ? data.BRId : "");
            self.BankReconsilationType(data ? data.BankReconsilationType : "");
            self.BankReconsilationTypeName(data ? data.BankReconsilationTypeName : "");
            self.TranDate(data ? data.TranDate : "");
            self.TranDateTxt(data ? data.TranDateTxt : "");
            self.Amount(data ? data.Amount : "");
            //self.IsChanged(data ? data.IsChanged : "");
        }
    }
    var bankReconsilationVM = function () {
        var self = this;
        self.Id = ko.observable();
        self.BankId = ko.observable();
        self.AccontNumber = ko.observable();
        self.MonthEndingDate = ko.observable(moment());
        self.MonthEndingDateTxt = ko.observable();
        self.ActualBankBalance = ko.observable();
        //self.AdjustedBankBalance = ko.observable();
        self.BalancePerLedger = ko.observable();
        //self.AdjustedLedgerBalance = ko.observable();
        //self.Variance = ko.observable();
        //public List<BankReconsilationDetailsDto> Details = ko.observable();  
        self.ReviewedBy = ko.observable();
        self.ReviewDate = ko.observable();
        self.ReviewDateTxt = ko.observable();
        /////////////////Newly Modified
        self.BankList = ko.observableArray([]);
        self.DepositsDetails = ko.observableArray([]);
        self.RemovedReconsilationDetail = ko.observableArray([]);
        self.OutStandingChecks = ko.observableArray([]);
        self.NotRecDeposits = ko.observableArray([]);
        self.NotRecChecks = ko.observableArray([]);
        self.BankReconsilationTypes = ko.observableArray([]);
        //self.BankList = ko.observableArray([]);
        /////////////////Deposits/////////////////
        self.AddReconsilationDetails = function () {
            var dtl = new bankReconsilationDetail();
            dtl.BankReconsilationType(1);
            self.DepositsDetails.push(dtl);
        }
        self.RemoveReconsilationDetails = function (line) {
            if (line.Id() > 0)
                self.RemovedReconsilationDetail.push(line.Id());
            self.DepositsDetails.remove(line);
        }
        /////////////////Outstandings/////////////////
        self.AddOutstandings = function () {
            var dtl = new bankReconsilationDetail();
            dtl.BankReconsilationType(2);
            self.OutStandingChecks.push(dtl);
        }
        self.RemoveOutstandings = function (line) {
            if (line.Id() > 0)
                self.RemovedReconsilationDetail.push(line.Id());
            self.OutStandingChecks.remove(line);
        }
        /////////////////NotRecordedDpst/////////////////
        self.AddNotRecordedDpsts = function () {
            var dtl = new bankReconsilationDetail();
            dtl.BankReconsilationType(3);
            self.NotRecDeposits.push(dtl);
        }
        self.RemoveNotRecordedDpsts = function (line) {
            if (line.Id() > 0)
                self.RemovedReconsilationDetail.push(line.Id());
            self.NotRecDeposits.remove(line);
        }
        /////////////////NotRecordedChecks/////////////////
        self.AddNotRecordedChecks = function () {
            var dtl = new bankReconsilationDetail();
            dtl.BankReconsilationType(4);
            self.NotRecChecks.push(dtl);
        }
        self.RemoveNotRecordedChecks = function (line) {
            if (line.Id() > 0)
                self.RemovedReconsilationDetail.push(line.Id());
            self.NotRecChecks.remove(line);
        }
        //////////////////////////////////////////////////BankReconsilationTypes
        self.getBanks = function () {
            return $.ajax({
                type: "GET",
                url: '/Accounts/Bank/GetBankList',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.BankList(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
        self.getBankReconsilationTypes = function () {
            return $.ajax({
                type: "GET",
                url: '/Accounts/Accounts/GetBankReconsilationTypes',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.BankReconsilationTypes(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
        self.DistressedValue = ko.computed(function () {
            var tlAmount = 0;
            if (self.BankId() > 0) {
                $.each(self.BankList(), function (index, value) {
                    console.log(value.Id);
                    console.log(ko.toJSON(value.Id));
                    if (value.Id == self.BankId()) {
                        self.AccontNumber(parseFloat(value ? value.AccountNo : 0));
                        self.GetLedgerAmount();
                    }
                });
           }
            return tlAmount.toFixed(2);
        });
        self.GetLedgerAmount = function () {
           
            console.log(self.AccontNumber());
            return $.ajax({
                type: "GET",
                url: '/Accounts/ReportAccount/GetLedgerAmount?toDate=' + moment(self.MonthEndingDate()).format('DD/MM/YYYY') + '&accHeadCode=' + self.AccontNumber(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    var result = data.result.Debit;
                    self.BalancePerLedger(result);
                    //self.reportLedgerData(data.rptVoucherlst);
                    //if (data.rptVoucherlst.length === 0) {
                    //    $('#successModal').modal('show');
                    //    $('#successModalText').text("No Entry Found");

                    //}
                    //if (data.response.Message !== "") {
                    //    $('#successModal').modal('show');
                    //    $('#successModalText').text(data.response.Message);

                    //}

                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                },
                complete: function () {
                }
            });
        }
        //AdjustedBankBalance
        self.AdjustedBankBalance = ko.pureComputed(function () {
            var tlAmount = 0;
            tlAmount += parseFloat(self.ActualBankBalance() != null ? self.ActualBankBalance() : 0);
            $.each(self.DepositsDetails(), function (index, value) {
                if (!isNaN(value.Amount()) && value.Amount().length>0) {
                    tlAmount += parseFloat(!isNaN(value.Amount()) ? value.Amount() : 0);
                }
                    
                });
            $.each(self.OutStandingChecks(), function (index, value) {
                if (!isNaN(value.Amount()) && value.Amount().length > 0) {
                    tlAmount -= parseFloat(!isNaN(value.Amount()) ? value.Amount() : 0);
                }
            });
            return tlAmount.toFixed(2);
        });
        self.AdjustedLedgerBalance = ko.pureComputed(function () {
            var tlAmount = 0;
            tlAmount += parseFloat(self.BalancePerLedger() != null ? self.BalancePerLedger() : 0);
            $.each(self.NotRecDeposits(), function (index, value) {
                if (!isNaN(value.Amount()) && value.Amount().length > 0) {
                    tlAmount += parseFloat(!isNaN(value.Amount()) ? value.Amount() : 0);
                }
            });
            $.each(self.NotRecChecks(), function (index, value) {
                if (!isNaN(value.Amount()) && value.Amount().length > 0) {
                    tlAmount -= parseFloat(!isNaN(value.Amount()) ? value.Amount() : 0);
                }
            });
            return tlAmount.toFixed(2);
        });
        //self.Variance
        self.Variance = ko.pureComputed(function () {
            var tlAmount = 0;
            tlAmount += parseFloat(self.AdjustedBankBalance() != null ? self.AdjustedBankBalance() : 0);
            tlAmount -= parseFloat(self.AdjustedLedgerBalance() != null ? self.AdjustedLedgerBalance() : 0);
            return tlAmount.toFixed(2);
        });
        self.Save = function () {
            var detailsData = ko.observableArray([]);
            $.each(self.DepositsDetails(),
                function (index, value) {
                    detailsData.push({
                        Id: value.Id(),
                        BRId: value.BRId(),
                        BankReconsilationType: value.BankReconsilationType(),
                        BankReconsilationTypeName: value.BankReconsilationTypeName(),
                        TranDate: value.TranDate(),
                        TranDateTxt: moment(value.TranDate()).format('DD/MM/YYYY'),
                        Amount: value.Amount()
                    });
                });
            $.each(self.OutStandingChecks(),
                function (index, value) {
                    detailsData.push({
                        Id: value.Id(),
                        BRId: value.BRId(),
                        BankReconsilationType: value.BankReconsilationType(),
                        BankReconsilationTypeName: value.BankReconsilationTypeName(),
                        TranDate: value.TranDate(),
                        TranDateTxt: moment(value.TranDate()).format('DD/MM/YYYY'),
                        Amount: value.Amount()
                    });
                });
            $.each(self.NotRecDeposits(),
                function (index, value) {
                    detailsData.push({
                        Id: value.Id(),
                        BRId: value.BRId(),
                        BankReconsilationType: value.BankReconsilationType(),
                        BankReconsilationTypeName: value.BankReconsilationTypeName(),
                        TranDate: value.TranDate(),
                        TranDateTxt: moment(value.TranDate()).format('DD/MM/YYYY'),
                        Amount: value.Amount()
                    });
                });
            $.each(self.NotRecChecks(),
                function (index, value) {
                    detailsData.push({
                        Id: value.Id(),
                        BRId: value.BRId(),
                        BankReconsilationType: value.BankReconsilationType(),
                        BankReconsilationTypeName: value.BankReconsilationTypeName(),
                        TranDate: value.TranDate(),
                        TranDateTxt: moment(value.TranDate()).format('DD/MM/YYYY'),
                        Amount: value.Amount()
                    });
                });
            var submitData = {
                Id: self.Id(),
                BankId: self.BankId(),
                AccontNumber: self.AccontNumber(),
                MonthEndingDate: self.MonthEndingDate(),
                MonthEndingDateTxt: moment(self.MonthEndingDate()).format('DD/MM/YYYY'),
                ActualBankBalance: self.ActualBankBalance(),
                AdjustedBankBalance: self.AdjustedBankBalance(),
                BalancePerLedger: self.BalancePerLedger(),
                AdjustedLedgerBalance: self.AdjustedLedgerBalance(),
                Variance: self.Variance(),
                Details: detailsData,
                RemovedDetails: self.RemovedReconsilationDetail(),
                ReviewedBy: self.ReviewedBy(),
                ReviewDate: self.ReviewDate(),
                ReviewDateTxt: moment(self.ReviewDate()).format('DD/MM/YYYY')
            }
            $.ajax({
                type: "POST",
                url: '/Accounts/Accounts/SaveBankReconsilation',
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

        self.LoadUOMList = function () {
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
        self.loadInitialData = function () {
            self.getBanks();
            self.getBankReconsilationTypes();
        }


        self.queryString = function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        };
    }

    var vm = new bankReconsilationVM();
    //vm.Id(vm.queryString("Id"));
    vm.loadInitialData();

    ko.applyBindings(vm, document.getElementById("bankReconsilationDiv")[0]);

});




