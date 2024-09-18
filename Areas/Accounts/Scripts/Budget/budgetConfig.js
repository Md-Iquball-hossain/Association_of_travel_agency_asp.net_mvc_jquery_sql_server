$(document).ready(function () {
    function BudgetConfig() {
        var self = this;

        self.Id = ko.observable();
        self.AccGroupId = ko.observable();
        self.AccHeadId = ko.observable();
        self.AccHead = ko.observable();
        self.AccHead.subscribe(function () {
            self.AccHeadId(self.AccHead().key)
        });
        
        self.ControlHead = ko.observable();
        self.ControlHeadAuto = ko.observable();
        self.ControlHeadAuto.subscribe(function () {
            if (typeof (self.ControlHeadAuto()) == "object" && self.ControlHeadAuto() != null)
                self.ControlHead(self.ControlHeadAuto().key);
            else
                self.ControlHead(self.ControlHeadAuto());
        });
        self.HasUnit = ko.observable(false);
        self.OfficeId = ko.observable();
        
        self.Load = function (data) {
            self.Id(data.Id);
            self.AccGroupId(data.AccGroupId);
            self.AccHeadId(data.AccHeadId);
            self.AccHead(data.AccHead);
            self.ControlHead(data.ControlHead);
            self.ControlHeadAuto(data.ControlHead);
            self.HasUnit(data.HasUnit);
            self.OfficeId(data.OfficeId);
        }

        
    }

    function BudgetConfigVM() {
        var self = this;

        self.OfficeList = ko.observableArray(Companies);
        self.OfficeId = ko.observable(userCompanyId);
        self.OfficeId.subscribe(function () {
            self.Load();
        });

        self.IncomeList = ko.observableArray([]);
        self.ExpenseList = ko.observableArray([]);

        self.AccHeadList = ko.observableArray([]);
        self.ControlHeadList = ko.observableArray([]);

        self.GetExpenseAccHeadList = function (searchTerm, callback) {
            var exclusionList = [];
            $.each(self.IncomeList(), function (index, value) {
                if (value.AccHeadId() > 0)
                    exclusionList.push(value.AccHeadId());
            });
            $.each(self.ExpenseList(), function (index, value) {
                if (value.AccHeadId() > 0)
                    exclusionList.push(value.AccHeadId());
            });
            var submitData = {
                prefix: searchTerm,
                exclusionList: exclusionList,
                officeId: self.OfficeId(),
                groupid: 5
            };
            $.ajax({
                type: "POST",
                url: '/Accounts/Accounts/GetAccHeadsForAutoComplete',
                data: ko.toJSON(submitData),
                contentType: "application/json",
                success: function (data) {
                    self.AccHeadList(data);
                },
                error: function () {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            }).done(callback);
        };
        self.GetIncomeAccHeadList = function (searchTerm, callback) {
            var exclusionList = [];
            $.each(self.IncomeList(), function (index, value) {
                if (value.AccHeadId() > 0)
                    exclusionList.push(value.AccHeadId());
            });
            $.each(self.ExpenseList(), function (index, value) {
                if (value.AccHeadId() > 0)
                    exclusionList.push(value.AccHeadId());
            });
            var submitData = {
                prefix: searchTerm,
                exclusionList: exclusionList,
                officeId: self.OfficeId(),
                groupid: 4
            };
            $.ajax({
                type: "POST",
                url: '/Accounts/Accounts/GetAccHeadsForAutoComplete',
                data: ko.toJSON(submitData),
                contentType: "application/json",
                success: function (data) {
                    self.AccHeadList(data);
                },
                error: function () {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            }).done(callback);
        };
        self.GetControlHeadList = function (searchTerm, callback) {
            var submitData = {
                prefix: searchTerm
            };
            $.ajax({
                type: "POST",
                url: '/Accounts/Budget/GetExistingControlHeads',
                data: ko.toJSON(submitData),
                contentType: "application/json",
                success: function (data) {
                    self.ControlHeadList(data);
                },
                error: function () {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            }).done(callback);
        };
        self.AddIncome = function () {
            var incomeHead = new BudgetConfig();
            incomeHead.AccGroupId(4);
            incomeHead.OfficeId(self.OfficeId());
            self.IncomeList.push(incomeHead);
        }
        self.RemoveIncome = function (line) {
            self.IncomeList.remove(line);
        }
        self.AddExpense = function () {
            var expenseHead = new BudgetConfig();
            expenseHead.AccGroupId(5);
            expenseHead.OfficeId(self.OfficeId());
            self.ExpenseList.push(expenseHead);
        }
        self.RemoveExpense = function (line) {
            self.ExpenseList.remove(line);
        }
        self.Save = function () {
            var dtos = [];
            $.each(self.IncomeList(), function (index, value) {
                if(value.AccHeadId() > 0)
                    dtos.push(value);
            });
            $.each(self.ExpenseList(), function (index, value) {
                if (value.AccHeadId() > 0)
                    dtos.push(value);
            });
            var submitData = {
                dtos: dtos,
                officeId: self.OfficeId()
            }
            $.ajax({
                type: "POST",
                url: '/Accounts/Budget/SaveBudgetConfigs',
                data: ko.toJSON(submitData),
                contentType: "application/json",
                success: function (data) {
                    self.AccHeadList(data);
                    $('#SuccessModal').modal('show');
                    $('#SuccessModalText').text(data.Message);
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

        self.Load = function () {
            self.IncomeList([]);
            self.ExpenseList([]);
            if (self.OfficeId() > 0) {
                return $.ajax({
                    type: "GET",
                    url: '/Accounts/Budget/GetBudgetConfigsByOfficeId?officeId=' + self.OfficeId(),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        
                        $.each(data, function (index, value) {
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
        };
    }

    var vm = new BudgetConfigVM();
    vm.Load();
    ko.applyBindings(vm, $('#budgetConfig')[0]);
});