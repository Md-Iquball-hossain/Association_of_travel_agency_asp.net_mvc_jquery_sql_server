$(document).ready(function () {
    function TranDetail() {
        var self = this;

        self.Id = ko.observable();
        self.StockTranId = ko.observable();
        self.SelectedProduct = ko.observable();
        self.ProductId = ko.observable();
        self.MaxQuantity = ko.observable();
        self.SelectedProduct.subscribe(function () {
            if (self.SelectedProduct().Id > 0) {
                self.ProductId(self.SelectedProduct().Id);
                self.MaxQuantity(self.SelectedProduct().Balance);
            }
        });
        self.Quantity = ko.observable(0).extend({
            required: "Please enter a quantity", min: 1,
            max: {
                message: function () {
                    return "Current stock value is " + self.MaxQuantity();
                },
                onlyIf: function () {
                    return (self.Quantity() > self.MaxQuantity());

                }
            }
        });
        self.UnitPrice = ko.observable(0).extend({ required: "Please enter a unit price", min: 1 });
        self.Price = ko.computed(function () {
            var price = 0;
            if (self.Quantity() > 0 && self.UnitPrice() > 0)
                price = parseFloat(self.UnitPrice()) * parseFloat(self.Quantity());
            return price;
        });
    }

    function StockInVM() {
        var self = this;

        self.Id = ko.observable();
        self.TranDate = ko.observable();
        self.ChallanNo = ko.observable();
        self.Details = ko.observableArray([new TranDetail()]);
        self.ProductList = ko.observableArray([]);
        self.CompanyProfileId = ko.observable(userCompanyId);
        self.StockTranType = ko.observable(1);
        self.FromOfficeId = ko.observable(userCompanyId);
        self.ToOfficeId = ko.observable(0);
        self.Remarks = ko.observable();

        self.TotalQuantity = ko.computed(function () {
            var qty = 0;
            $.each(self.Details(), function (index, value) {
                qty += parseFloat(value.Quantity());
            });
            return qty;
        });

        self.TotalPrice = ko.computed(function () {
            var price = 0;
            $.each(self.Details(), function (index, value) {
                price += parseFloat(value.Price());
            });
            return price;
        });

        self.AddProduct = function () {
            self.Details.push(new TranDetail());
        }

        self.RemovedLines = ko.observableArray([]);

        self.RemoveProduct = function (line) {
            if (line.Id() > 0)
                self.RemovedLines.push(line.Id());
            self.Details.remove(line);
        }

        self.queryString = function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));

        }

        self.GetProducts = function () {
            return $.ajax({
                type: "GET",
                url: '/Membership/Inventory/GetStockedProducts?officeId=' + self.CompanyProfileId(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.ProductList(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
        self.getToday = function () {
            url = '/Auth/CompanyProfile/DateToday';
            if (self.CompanyProfileId() > 0)
                url += '?CompanyProfileId=' + self.CompanyProfileId();
            return $.ajax({
                type: "GET",
                url: url,
                contentType: "application/json",
                success: function (data) {
                    self.TranDate(moment(data));
                },
                error: function () {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        };

        self.LoadInitial = function () {
            self.GetProducts();
            self.getToday();
        }
        self.errors = ko.validation.group(self);
        self.IsValid = ko.computed(function () {
            var err = self.errors().length;
            
            if (err == 0)
                return true;
            return false;
        });
        self.Submit = function () {
            var details = ko.observableArray([]);
            var TranDateText = moment(self.TranDate()).format('DD/MM/YYYY');

            $.each(self.Details(),
                function (index, value) {
                    details.push({
                        Id: value.Id(),
                        StockTranId: self.Id(), //id of parent
                        ProductId: value.ProductId(),
                        Quantity: value.Quantity(),
                        UnitPrice: value.UnitPrice(),
                        Price: value.Price()
                    });
                });

            var submitData = {
                Id: self.Id(),
                TranDate: self.TranDate(),
                TranDateText: TranDateText,
                Details: details,
                RemovedDetailIds: self.RemovedLines(),
                ChallanNo: self.ChallanNo(),
                TotalPrice: self.TotalPrice(),
                TotalQuantity: self.TotalQuantity(),
                Remarks: self.Remarks(),
                FromOfficeId: self.FromOfficeId(),
                ToOfficeId: self.ToOfficeId(),
                StockTranType: self.StockTranType()
            };
            if (self.IsValid()) {
                $.ajax({
                    url: '/Membership/Inventory/SaveStockOut',
                    type: 'POST',
                    contentType: 'application/json',
                    data: ko.toJSON(submitData),
                    success: function (data) {
                        $('#successModal').modal('show');
                        $('#successModalText').text(data.Message);
                        //if (data.Id > 0) {
                        //    self.LoadJobCardData();
                        //}
                        //self.Id(data.Id);

                    },
                    error: function (error) {
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            } 
        };
        self.Reload = function () {
            window.location.href = '/Membership/Inventory/StockOut'
        };
    }

    var vm = new StockInVM();
    var qValue = vm.queryString('Id');
    vm.Id(qValue);
    //var qValueId = vm.queryString('MemberPendingFeeId');
    //vm.MemberPendingFeeId(qValueId);
    vm.LoadInitial();
    ko.applyBindings(vm, document.getElementById("stockIn"));
});