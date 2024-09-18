$(document).ready(function () {

    function AccHeadMapping() {

        var self = this;

        self.Id = ko.observable();
        self.RefOptions = ko.observableArray();
        self.RefId = ko.observable();
        self.RefTypes = ko.observableArray([
                { "Id": 1, "Name": "Asset Purchase" },
                { "Id": 2, "Name": "Asset Depreciation" },
                { "Id": 3, "Name": "Accumulated Depreciation" },
                { "Id": 5, "Name": "Cash in Hand" }]);
        self.RefType = ko.observable();
        
        self.AccountHeadCode = ko.observable();
        self.RefName = ko.observable();
        self.AccHeads = ko.observableArray([]);

        self.Reset = function () {
            if (self.Id() > 0) {
                self.Id('');
                self.RefId('');
                self.RefType('');
            }

        }
        self.ListData = ko.observable(listData);

        self.SaveAccHeadMapping = function () {
            $.ajax({
                type: "POST",
                url: '/FAMS/Accounts/SaveAccHeadMapping',
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
          return  $.ajax({
                type: "GET",
                url: '/FAMS/Accounts/GetRefOptions?refType=' + self.RefType(),
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
          return  $.ajax({
                type: "GET",
                url: '/FAMS/Accounts/GetAccHeads?refType=' + self.RefType(),
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
            self.getRefOptions();
            self.getAccHeads();
        });

        self.getAccHeadMappingIdWise = function () {
            return $.ajax({
                type: "GET",
                url: '/FAMS/Accounts/GetAccountHeadMappingById?id=' + self.Id(),
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
            self.RefType(data.RefType);
            $.when(self.getRefOptions()).done(function () {
                self.RefId(data.RefId);
                self.RefName(data.RefName);
            });
            $.when(self.getAccHeads()).done(function () {
                self.AccountHeadCode(data.AccountHeadCode);

            });

            $('#entryModal').modal('show');
            
        }

        self.getTitle = function (data) {
            return self.titleEdit('Edit');
        }

       

    }

    var vm = new AccHeadMapping();
    //vm.InitialValueLoad();

    ko.applyBindings(vm, $('#accountsHeadMappingEntry')[0]);



});