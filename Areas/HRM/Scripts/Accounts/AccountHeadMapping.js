$(document).ready(function () {

    function AccHeadMapping() {

        var self = this;

        self.Id = ko.observable();
        self.RefOptions = ko.observableArray();
        self.RefId = ko.observable();
        self.RefTypes = ko.observableArray([
                { "Id": 1, "Name": "Salary Expense" },
                { "Id": 2, "Name": "Salary Payable" },
                { "Id": 3, "Name": "Cash in Hand" },
                { "Id": 4, "Name": "Cash at Bank" }]);
        self.RefType = ko.observable();
        
        self.AccountHeadCode = ko.observable();
        self.AccHeads = ko.observableArray([]);

        self.ListData = ko.observable(listData);

        self.SaveAccHeadMapping = function () {
            $.ajax({
                type: "POST",
                url: '/HRM/Accounts/SaveAccHeadMapping',
                data: ko.toJSON(self),
                contentType: "application/json",
                success: function (data) {

                    $('#successModal').modal('show');
                    $('#successModalText').text(data.Message);

                    self.Id = ko.observable(data.Id);
                },
                error: function () {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }

        self.getRefOptions = function () {
            $.ajax({
                type: "GET",
                url: '/HRM/Accounts/GetRefOptions?refType=' + self.RefType(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.RefOptions(data); //Put the response in ObservableArray
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
        self.getAccHeads = function () {
            $.ajax({
                type: "GET",
                url: '/HRM/Accounts/GetAccHeads?refType=' + self.RefType(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    if(data)
                        self.AccHeads(data); //Put the response in ObservableArray
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
        self.RefType.subscribe(function () {
            //self.getRefOptions();
            self.getAccHeads();
        });

        self.getAccHeadMappingIdWise = function () {

            return $.ajax({
                type: "GET",
                url: '/HRM/Accounts/GetAccountHeadMappingById?id=' + self.Id(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.RefType(data.RefType);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }

        self.getEditUrl = function (data) {
            //return '/Southern/Supplier/Edit?id=' + data.Id;
        }

        self.editSupplier = function (data) {
            self.Id(data.Id);
            self.RefId(data.RefId);
            self.RefType(data.RefType);
            self.AccountHeadCode(data.AccountHeadCode);
        }

        self.getTitle = function (data) {
            return self.titleEdit('Edit');
        }

        //self.getDeleteUrl = function (data) {
        //    return '/Supplier/Delete?id=' + data.Id;
        //}

    }

    var vm = new AccHeadMapping();
    //vm.InitialValueLoad();

    ko.applyBindings(vm, $('#accountsHeadMappingEntry')[0]);



});