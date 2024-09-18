$(document).ready(function () {
    BudgetStatus  = [
        { "Name":"Rejected", "Id":"-1"}, 
        { "Name":"Drafted", "Id":"0"},
        { "Name:":"Approved", "Id":"1"}
    ]
    function BudgetConfig() {
        var self = this;

        //////////////
        self.Id = ko.observable();
        self.BudgetId = ko.observable();
        self.BudgetConfigId = ko.observable();
        self.AccGroupId = ko.observable();
        self.AccHeadName = ko.observable();
        self.Unit = ko.observable().extend({ min: 0, required:true });
        self.Quantity = ko.observable().extend({ min: 0, required: true });
        self.Amount = ko.observable().extend({ min: 0, required: true });
        self.PreviousBudget = ko.observable().extend({ min: 0, required: true });
        self.PreviousActualAmount = ko.observable().extend({ min: 0, required: true });
        self.IncreasePercentage = ko.observable().extend({ min: 0, required: true });
        self.IncreaseAmount = ko.observable().extend({ min: 0, required: true });
        self.ProposedAmount = ko.observable().extend({ min: 0, required: true });
        //////////////
        
        self.Load = function (data) {
            self.Id(data.Id);
            self.BudgetId(data.BudgetId);
            self.BudgetConfigId(data.BudgetConfigId);
            self.AccGroupId(data.AccGroupId);
            self.AccHeadName(data.AccHeadName);
            self.Unit(data.Unit);
            self.Quantity(data.Quantity);
            self.Amount(data.Amount);
            self.PreviousBudget(data.PreviousBudget);
            self.PreviousActualAmount(data.PreviousActualAmount);
            self.IncreasePercentage(data.IncreasePercentage);
            self.IncreaseAmount(data.IncreaseAmount);
            self.ProposedAmount(data.ProposedAmount);
        }
        self.PercentageChanged = function () {
            var prevBudget = 0;
            var increase = 0;
            if (self.PreviousBudget() > 0)
                prevBudget = parseFloat(self.PreviousBudget());
            if (self.IncreasePercentage() > 0)
                increase = (prevBudget*(parseFloat(self.IncreasePercentage())/100)).toFixed(2);
            self.ProposedAmount(prevBudget + parseFloat(increase));
            if (prevBudget > 0) {
                self.IncreaseAmount(parseFloat(increase));
            }
        }
        self.AmountChanged = function () {
            var prevBudget = 0;
            var increase = 0;
            if (self.PreviousBudget() > 0)
                prevBudget = parseFloat(self.PreviousBudget());
            if (self.IncreaseAmount() > 0)
                increase = parseFloat(self.IncreaseAmount());
            self.ProposedAmount(prevBudget + increase);
            if (prevBudget > 0) {
                self.IncreasePercentage(((increase/prevBudget)*100).toFixed(2));
            }
        }
    }

    function BudgetVM() {
        var self = this;

        self.Id = ko.observable();
        self.OfficeList = ko.observableArray(Companies);
        self.OfficeId = ko.observable(userCompanyId);
        self.OfficeId.subscribe(function () {
            self.Load();
        });
        self.FromDate = ko.observable();
        self.ToDate = ko.observable();
        self.BudgetStatus = ko.observable();
        self.BudgetStatusName = ko.observable("Unsaved");

        self.IncomeList = ko.observableArray([]);
        self.ExpenseList = ko.observableArray([]);
        self.Details = ko.observableArray([]);
        
        self.Save = function () {
            $.each(self.IncomeList(), function (index, value) {
                self.Details.push(value);
            })
            $.each(self.ExpenseList(), function (index, value) {
                self.Details.push(value);
            })
            $.ajax({
                type: "POST",
                url: '/Accounts/Budget/SaveBudget',
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
            if(self.Id() > 0)
                window.open("/Accounts/Budget/BudgetReport?Id=" + self.Id() + "&reportTypeId=PDF", "_blank");
        }

        self.Load = function () {
            self.IncomeList([]);
            self.ExpenseList([]);
            if (self.OfficeId() > 0) {
                self.GetToday();
                self.GetYearOpening();
                if (self.Id() > 0) {
                    return $.ajax({
                        type: "GET",
                        url: '/Accounts/Budget/GetBudgetById?id=' + self.Id(),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (data) {
                            console.log(data);
                            self.FromDate(moment(data.FromDate));
                            self.ToDate(moment(data.ToDate));
                            self.BudgetStatus(data.BudgetStatus);
                            self.BudgetStatusName(data.BudgetStatusName);
                            self.OfficeId(data.OfficeId);
                            $.each(data.Details, function (index, value) {
                                var config = new BudgetConfig();
                                config.Load(value);
                                if (value.AccGroupId == 4) {
                                    self.IncomeList.push(config);
                                } else {
                                    self.ExpenseList.push(config);
                                }
                            })
                        },
                        error: function (error) {
                            //self.isLoading(self.isLoading() - 1);
                            alert(error.status + "<--and--> " + error.statusText);
                        }
                    });
                } else {
                    return $.ajax({
                        type: "GET",
                        url: '/Accounts/Budget/GetTemplateForCreatingNewBudget?officeId=' + self.OfficeId() + '&fromDate=' + moment(self.FromDate()).format("DD/MM/YYYY") + '&toDate=' + moment(self.ToDate()).format("DD/MM/YYYY"),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (data) {
                        
                            $.each(data.Details, function (index, value) {
                                var config = new BudgetConfig();
                                config.Load(value);
                                if (value.AccGroupId == 4) {
                                    self.IncomeList.push(config);
                                } else {
                                    self.ExpenseList.push(config);
                                }
                            })
                        },
                        error: function (error) {
                            //self.isLoading(self.isLoading() - 1);
                            alert(error.status + "<--and--> " + error.statusText);
                        }
                    });
                }
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
            if (self.OfficeId() > 0) {
                return $.ajax({
                    type: "GET",
                    url: '/Auth/CompanyProfile/GetCurrentFiscalYear?CompanyProfileId=' + self.OfficeId(),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        self.FromDate(moment(data));
                    },
                    error: function (error) {
                        //self.isLoading(self.isLoading() - 1);
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            }
        };
        self.queryString = function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        };
    }

    var vm = new BudgetVM();
    vm.Id(vm.queryString("Id"));
    vm.Load();
    ko.applyBindings(vm, $('#budgetCreate')[0]);
});