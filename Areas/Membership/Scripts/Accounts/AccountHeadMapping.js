$(document).ready(function () {

    function AccHeadMapping() {

        var self = this;

        self.Id = ko.observable();
        self.RefOptions = ko.observableArray();
        self.RefId = ko.observable();
        self.RefTypes = ko.observableArray([
                { "Id": 1, "Name": "Income" },
                { "Id": 2, "Name": "Receivable" },
                { "Id": 3, "Name": "Liability" },
                { "Id": 4, "Name": "Cash in Hand" },
                { "Id": 5, "Name": "Cash at Bank" },
                { "Id": 6, "Name": "Income ATTI" },
                { "Id": 7, "Name": "Receivable ATTI" }
                ]);
        self.RefType = ko.observable();
        
        self.AccountHeadCode = ko.observable();
        self.AccountHeadCode.subscribe(function () {
            self.AccountHeadName = self.AccountHeadCode().Name;
        });
        

        self.RefName = ko.observable();
        self.AccHeads = ko.observableArray([]);

        self.ListData = ko.observable(listData);

        self.Reset = function ()
        {
            if (self.Id() > 0)
            {
                self.Id('');
                self.RefId('');
                self.RefType('');
            }
  
        }

        self.SaveAccHeadMapping = function () {
            $.ajax({
                type: "POST",
                url: '/Membership/Accounts/SaveAccHeadMapping',
                data: ko.toJSON(self),
                contentType: "application/json",
                success: function (data) {
                   
                    $('#successModal').modal('show');
                    $('#successModalText').text(data.Message);

                    
                },
                error: function () {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }

        self.getRefOptions = function () {
          return  $.ajax({
                type: "GET",
                url: '/Membership/Accounts/GetRefOptions?refType=' + self.RefType(),
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
                url: '/Membership/Accounts/GetAccHeads?refType=' + self.RefType(),
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
                url: '/Membership/Accounts/GetAccountHeadMappingById?id=' + self.Id(),
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
                //self.AccountHeadName(data.AccountHeadName);
            });
            
            $('#entryModal').modal('show');
            
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