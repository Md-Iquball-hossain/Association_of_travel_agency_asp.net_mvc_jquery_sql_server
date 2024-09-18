$(document).ready(function () {
    BudgetStatus = [
        { "Name": "Rejected", "Id": "-1" },
        { "Name": "Drafted", "Id": "0" },
        { "Name:": "Approved", "Id": "1" }
    ]
    function Detail() {
        var self = this;

        self.Id = ko.observable();
        self.FDRScheduleId = ko.observable();
        self.SLNo = ko.observable();
        self.BankName = ko.observable();
        self.BranchName = ko.observable();
        self.AccountHeadCode = ko.observable();
        self.FDRNo = ko.observable().extend({ required: true });
        self.PrincipleAmount = ko.observable(0).extend({ min: 10000, required: true });
        self.OpeningBalance = ko.observable(0).extend({ min: 0, required: true });
        self.AdditionAmount = ko.observable(0).extend({ min: 0, required: true });
        self.InterestIncome = ko.observable(0).extend({ min: 0, required: true });
        self.ChargeDeduction = ko.observable(0).extend({ min: 0, required: true });
        self.Encashment = ko.observable(0).extend({ min: 0, required: true });
        self.ClosingBalance = ko.computed(function () {
            var balance = 0;

            if (parseFloat(self.OpeningBalance()) > 0)
                balance += parseFloat(self.OpeningBalance());
            if (parseFloat(self.AdditionAmount()) > 0)
                balance += parseFloat(self.AdditionAmount());
            if (parseFloat(self.InterestIncome()) > 0)
                balance += parseFloat(self.InterestIncome());
            if (parseFloat(self.ChargeDeduction()) > 0)
                balance -= parseFloat(self.ChargeDeduction());
            if (parseFloat(self.Encashment()) > 0)
                balance -= parseFloat(self.Encashment());
            return balance;
        });

        self.Load = function (data) {
            self.Id(data.Id);
            self.FDRScheduleId(data.FDRScheduleId);
            self.SLNo(data.SLNo);
            self.BankName(data.BankName);
            self.BranchName(data.BranchName);
            self.AccountHeadCode(data.AccountHeadCode);
            self.FDRNo(data.FDRNo);
            self.PrincipleAmount(data.PrincipleAmount);
            self.OpeningBalance(data.OpeningBalance);
            self.AdditionAmount(data.AdditionAmount);
            self.InterestIncome(data.InterestIncome);
            self.ChargeDeduction(data.ChargeDeduction);
            self.Encashment(data.Encashment);
        }
    }

    function FDRVM() {
        var self = this;

        self.Id = ko.observable();
        self.OfficeList = ko.observableArray(Companies);
        self.OfficeId = ko.observable(userCompanyId);
        self.SLNo = 1;

        self.SelectedFDRNo = ko.observable();
        self.SelectedBank = ko.observable();
        self.SelectedSLNo = ko.observable();
        self.SelectedLine;
        //self.OfficeId.subscribe(function () {
        //    self.Load();
        //});
        self.FromDate = ko.observable();
        self.FromDateText = ko.computed(function () {
            return moment(self.FromDate()).format('DD/MM/YYYY');
        });
        self.ToDate = ko.observable();
        self.ToDateText = ko.computed(function () {
            return moment(self.ToDate()).format('DD/MM/YYYY');
        });
        //self.BudgetStatus = ko.observable();
        //self.BudgetStatusName = ko.observable("Unsaved");

        self.Details = ko.observableArray([]);
        self.AddDetail = function () {
            var detail = new Detail();
            detail.SLNo(self.SLNo++);
            self.Details.push(detail);
        }
        self.RemoveDetail = function () {
            self.Details.remove(self.SelectedLine);
        }
        self.TotalPrinciple = ko.computed(function () {
            var balance = 0;
            $.each(self.Details(), function (index, value) {
                if (parseFloat(value.PrincipleAmount()) > 0)
                    balance += parseFloat(value.PrincipleAmount());
            })
            return balance;
        });
        self.TotalOpeningBalance = ko.computed(function () {
            var balance = 0;
            $.each(self.Details(), function (index, value) {
                if (parseFloat(value.OpeningBalance()) > 0)
                    balance += parseFloat(value.OpeningBalance());
            })
            return balance;
        });
        self.TotalAdditionAmount = ko.computed(function () {
            var balance = 0;
            $.each(self.Details(), function (index, value) {
                if (parseFloat(value.AdditionAmount()) > 0)
                    balance += parseFloat(value.AdditionAmount());
            })
            return balance;
        });
        self.TotalInterestIncome = ko.computed(function () {
            var balance = 0;
            $.each(self.Details(), function (index, value) {
                if (parseFloat(value.InterestIncome()) > 0)
                    balance += parseFloat(value.InterestIncome());
            })
            return balance;
        });
        self.TotalChargeDeduction = ko.computed(function () {
            var balance = 0;
            $.each(self.Details(), function (index, value) {
                if (parseFloat(value.ChargeDeduction()) > 0)
                    balance += parseFloat(value.ChargeDeduction());
            })
            return balance;
        });
        self.TotalEncashment = ko.computed(function () {
            var balance = 0;
            $.each(self.Details(), function (index, value) {
                if (parseFloat(value.Encashment()) > 0)
                    balance += parseFloat(value.Encashment());
            })
            return balance;
        });
        self.TotalClosingBalance = ko.computed(function () {
            var balance = 0;
            $.each(self.Details(), function (index, value) {
                if (parseFloat(value.ClosingBalance()) > 0)
                    balance += parseFloat(value.ClosingBalance());
            })
            return balance;
        });
        self.SetSelectedFDR = function (line) {
            self.SelectedFDRNo(line.FDRNo());
            self.SelectedBank(line.BankName());
            self.SelectedSLNo(line.SLNo());
            self.SelectedLine = line;
        }
        self.Remarks = ko.observable();
        self.Save = function () {
            $.ajax({
                type: "POST",
                url: '/Accounts/FDR/SaveFDR',
                data: ko.toJSON(self),
                contentType: "application/json",
                success: function (data) {
                    $('#SuccessModal').modal('show');
                    $('#SuccessModalText').text(data.Message);
                    self.Id(data.Id);
                    self.Load();
                },
                error: function () {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        };

        self.Reset = function () {
            self.Load();
        };
        self.Print = function () {
            if (self.Id() > 0)
                window.open("/Accounts/FDR/FDRScheduleReport?Id=" + self.Id() + "&reportTypeId=PDF", "_blank");
        }
        self.Forward = function(){
            var fromDate = self.FromDate();
            var toDate = self.ToDate();
            var difference = toDate.diff(fromDate, 'days');
            self.FromDate(moment(self.ToDate()).add('days', 1));
            self.ToDate(moment(toDate).add('days', difference));
            self.Remarks('');
            self.Id('');
            $.each(self.Details(), function (index, value) {
                value.Id('');
                value.OpeningBalance(value.ClosingBalance());
                value.AdditionAmount(0);
                value.InterestIncome(0);
                value.ChargeDeduction(0);
                value.Encashment(0);
            })
        }

        self.Load = function () {
            if (self.Id() > 0) {
                return $.ajax({
                    type: "GET",
                    url: '/Accounts/FDR/GetFDRScheduleById?Id=' + self.Id(),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        
                        self.FromDate(moment(data.FromDate));
                        self.ToDate(moment(data.ToDate));
                        self.OfficeId(data.OfficeId);
                        self.Remarks(data.Remarks);
                        $.each(data.Details, function (index, value) {
                            var config = new Detail();
                            config.Load(value);
                            self.Details.push(config);
                            
                        })
                    },
                    error: function (error) {
                        //self.isLoading(self.isLoading() - 1);
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            }

        };
        self.GetToday = function () {
            if (self.OfficeId() > 0) {
                return $.ajax({
                    type: "GET",
                    url: '/Auth/CompanyProfile/DateToday?CompanyProfileId=' + self.OfficeId(),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        self.ToDate(moment(data));
                    },
                    error: function (error) {
                        //self.isLoading(self.isLoading() - 1);
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            }
        };
        self.GetYearOpening = function () {
            //if (self.OfficeId() > 0) {
            //    return $.ajax({
            //        type: "GET",
            //        url: '/Auth/CompanyProfile/GetCurrentFiscalYear?CompanyProfileId=' + self.OfficeId(),
            //        contentType: "application/json; charset=utf-8",
            //        dataType: "json",
            //        success: function (data) {
            //            self.FromDate(moment(data));
            //        },
            //        error: function (error) {
            //            //self.isLoading(self.isLoading() - 1);
            //            alert(error.status + "<--and--> " + error.statusText);
            //        }
            //    });
            //}
        };
        self.queryString = function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        };
    }

    var vm = new FDRVM();
    vm.Id(vm.queryString("Id"));
    vm.Load();
    ko.applyBindings(vm, $('#fdrCreate')[0]);
});