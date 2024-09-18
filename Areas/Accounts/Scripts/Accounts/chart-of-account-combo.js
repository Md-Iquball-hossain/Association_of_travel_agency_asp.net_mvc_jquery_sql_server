/// <reference path="../knockout-3.4.0.debug.js" />
/// <reference path="../jquery-2.1.4.js" />
referenceTypes = [{ 'name': 'Product', 'Id': 1 }, { 'name': 'Bank', 'Id': 2 }, { 'name': 'Supplier', 'Id': 3 }, { 'name': 'Customer', 'Id': 4 }];


$(document).ready(function () {
    ko.validation.init({
        errorElementClass: 'has-error',
        errorMessageClass: 'help-block',
        decorateInputElement: true
    });
    function ChartOfAccountsVM() {
        var self = this;
        self.pendingItems = ko.observable(0);
        self.pendingItemPreviousCount = ko.observable('');
        self.pendingItems.subscribe(function () {
            //console.log("pending items - " + self.pendingItems())
            if (self.pendingItems() === 1 && self.pendingItemPreviousCount() === 0){
                //console.log("show loading");
                $('#loadingModal').modal('show');
            }
            else if (self.pendingItems() === 0 && self.pendingItemPreviousCount() === 1) {
                //console.log("hide loading");
                $('#loadingModal').modal('hide');
                $('.modal-backdrop').remove();
            }
        });
        self.pendingItemsIncrement = function () {
            //console.log("increment");
            self.pendingItemPreviousCount(self.pendingItems());
            self.pendingItems(self.pendingItems() + 1);
        };

        self.pendingItemsDecrement = function () {
            //console.log("decrement");
            self.pendingItemPreviousCount(self.pendingItems());
            self.pendingItems(self.pendingItems() - 1);
        };

        //self.Expenditures = ko.observableArray([]);
        self.CompanyList = ko.observableArray([]);
        self.CompanyProfileId = ko.observable();

        self.AccHeads = ko.observableArray([]);
        self.Id = ko.observable(0);
        self.Name = ko.observable('');

        self.AccountGroups = ko.observableArray([]);
        self.AccGroupId = ko.observable();
        self.AccGroupName = ko.observable();

        self.AccountSubGroups = ko.observableArray([]);
        self.AccSubGroupId = ko.observable(0.00);
        self.AccSubGroupName = ko.observable();

        self.AccountHeadGroups = ko.observableArray([]);
        self.AccHeadGroupId = ko.observable(0.00);
        self.AccHeadGroupName = ko.observable();

        self.AccountHeadSubGroups = ko.observableArray([]);
        self.AccHeadSubGroupId = ko.observable(0.00);
        self.AccHeadSubGroupName = ko.observable();

        self.TierId = ko.observable();
        self.References = ko.observableArray([]);
        self.RefId = ko.observable();
        self.RefTypes = ko.observableArray(referenceTypes);
        self.RefType = ko.observable();
        self.Code = ko.observable('');

        self.CurrentCode = ko.observable(0.00);

        self.getAccGroupCode = function () {
            for (var i = 0, len = self.AccountGroups().length; i < len; i++) {
                if (self.AccountGroups()[i].Id === self.AccGroupId()) {

                    self.CurrentCode(self.AccountGroups()[i].AccountGroupCode);
                    self.getAccountSubGroupsByGroupId();
                    self.getAllAccHeadsByStartCode();
                    self.Name('');
                }
            }
        };

        self.getAccSubGroupCode = function () {
            for (var i = 0, len = self.AccountSubGroups().length; i < len; i++) {
                if (self.AccountSubGroups()[i].Id === self.AccSubGroupId()) {

                    self.CurrentCode(self.AccountSubGroups()[i].AccountSubGroupCode);
                    self.getAccountHeadGroupsBySubGroupId();
                    self.getAllAccHeadsByStartCode();
                    self.Name('');

                }
            }
        };

        self.getAccHeadGroupCode = function () {
            for (var i = 0, len = self.AccountHeadGroups().length; i < len; i++) {
                if (self.AccountHeadGroups()[i].Id === self.AccHeadGroupId()) {

                    self.CurrentCode(self.AccountHeadGroups()[i].AccountHeadGroupCode);
                    self.getAccountHeadSubGroupsByHeadGroupId();
                    self.getAllAccHeadsByStartCode();
                    self.Name('');

                }
            }
        };

        self.getAccHeadSubGroupCode = function () {
            for (var i = 0, len = self.AccountHeadSubGroups().length; i < len; i++) {
                if (self.AccountHeadSubGroups()[i].Id === self.AccHeadSubGroupId()) {

                    self.CurrentCode(self.AccountHeadSubGroups()[i].AccountHeadSubGroupCode);
                    self.getAllAccHeadsByStartCode();
                    self.Name('');

                }
            }
        };

        self.getBanks = function () {
            self.pendingItemsIncrement();
            return $.ajax({
                type: "GET",
                //url: '/Accounts/Bank/GetBankList',
                url: '/Accounts/Bank/GetBankList?CompanyProfileId=' + self.CompanyProfileId(),                
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.pendingItemsDecrement();
                    self.References(data);
                },
                error: function (error) {
                    self.pendingItemsDecrement();
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
        self.getCustomers = function () {
            self.pendingItemsIncrement();;
            return $.ajax({
                type: "GET",
                url: '/Accounts/Customer/GetAllCustomers',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.pendingItemsDecrement();
                    self.References(data);
                },
                error: function (error) {
                    self.pendingItemsDecrement();
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
        self.getSuppliers = function () {
            self.pendingItemsIncrement();;
            return $.ajax({
                type: "GET",
                url: '/Accounts/Supplier/GetAllSuppliers',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.pendingItemsDecrement();
                    self.References(data);
                },
                error: function (error) {
                    self.pendingItemsDecrement();
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
        self.getProducts = function () {
            self.pendingItemsIncrement();;
            return $.ajax({
                type: "GET",
                url: '/Accounts/Product/GetProductList',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.pendingItemsDecrement();
                    self.References(data);
                },
                error: function (error) {
                    self.pendingItemsDecrement();
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
        self.getReferencesByRefType = function () {
            var reftype = self.RefType();
            if (reftype == 1) {
                self.getProducts();
                return;
            } else if (reftype == 2) {
                self.getBanks();
                return;
            } else if (reftype == 3) {
                self.getSuppliers();
                return;
            } else if (reftype == 4) {
                self.getCustomers();
                return;
            } else return;
        };

        self.getAllAccHeadsByStartCode = function () {
            self.AccHeads([]);
            var code = self.CurrentCode() ? self.CurrentCode() : 0;
            if (code > 0) {
                self.pendingItemsIncrement();;
                $.ajax({
                    type: "GET",
                    url: '/Accounts/Accounts/GetAccountHeadsByStartWithCode?code=' + code,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        self.pendingItemsDecrement();
                        //return data;
                        self.AccHeads(data);
                        //console.log(self.AccountGroups());
                    },
                    error: function (error) {
                        self.pendingItemsDecrement();
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            }

        }

        self.getAllCompanies = function () {
            if (userCompanyId != null && userCompanyId > 0) {
                self.CompanyProfileId(userCompanyId);
            } else {
                self.CompanyList([]);
                self.pendingItemsIncrement();;
                return $.ajax({
                    type: "GET",
                    url: '/Auth/CompanyProfile/GetAllCompanyList',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        self.pendingItemsDecrement();
                        self.CompanyList(data);
                    },
                    error: function (error) {
                        self.pendingItemsDecrement();
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            }
        }

        self.getAllAccountGroups = function () {
            self.pendingItemsIncrement();;
            return $.ajax({
                type: "GET",
                url: '/Accounts/Accounts/GetAllAccGroups',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.pendingItemsDecrement();
                    //return data;
                    self.AccountGroups(data);
                    self.AccSubGroupId('');
                    self.AccountSubGroups([]);
                    self.AccHeadGroupId('');
                    self.AccountHeadGroups([]);
                    self.AccHeadSubGroupId('');
                    self.AccountHeadSubGroups([]);
                },
                error: function (error) {
                    self.pendingItemsDecrement();
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }

        self.getAccountSubGroupsByGroupId = function () {
            var groupId = self.AccGroupId() ? self.AccGroupId() : 0;
            if (groupId > 0) {
                self.pendingItemsIncrement();;
                return $.ajax({
                    type: "GET",
                    url: '/Accounts/Accounts/GetAccSubGroupsByAccGroupId?accGroupId=' + groupId,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        //return data;
                        self.pendingItemsDecrement();
                        self.AccountSubGroups(data);

                        self.AccHeadGroupId('');
                        self.AccountHeadGroups([]);
                        self.AccHeadSubGroupId('');
                        self.AccountHeadSubGroups([]);
                    },
                    error: function (error) {
                        self.pendingItemsDecrement();
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            }

        }

        self.getAccountHeadGroupsBySubGroupId = function () {
            var subGroupId = self.AccSubGroupId() ? self.AccSubGroupId() : 0;
            if (subGroupId > 0) {
                self.pendingItemsIncrement();;
                return $.ajax({
                    type: "GET",
                    url: '/Accounts/Accounts/GetAccHeadGroupsByAccSubGroupId?accSubGroupId=' + subGroupId,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        //return data;
                        self.pendingItemsDecrement();
                        self.AccountHeadGroups(data);
                        self.AccHeadSubGroupId('');
                        self.AccountHeadSubGroups([]);
                    },
                    error: function (error) {
                        self.pendingItemsDecrement();
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            }

        }

        self.getAccountHeadSubGroupsByHeadGroupId = function () {
            var headGroupId = self.AccHeadGroupId() ? self.AccHeadGroupId() : 0;
            if (headGroupId > 0) {
                self.pendingItemsIncrement();;
                return $.ajax({
                    type: "GET",
                    url: '/Accounts/Accounts/GetAccHeadSubGroupsByAccHeadGroupId?accHeadGroupId=' + headGroupId,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        //return data;
                        self.pendingItemsDecrement();
                        self.AccountHeadSubGroups(data);
                    },
                    error: function (error) {
                        self.pendingItemsDecrement();
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            }

        }

        self.errors = ko.validation.group(self);
        self.IsAccHeadValid = ko.computed(function () {
            if (self.AccGroupId() != null && self.Name().length > 0)
                return true;
            return false;
        });

        self.saveAccHead = function () {
            self.pendingItemsIncrement();;
            $.ajax({
                type: "POST",
                url: '/Accounts/Accounts/SaveAccHead',
                data: ko.toJSON(self),
                contentType: "application/json",
                success: function (data) {
                    self.pendingItemsDecrement();
                    self.Id(0);
                    self.Name('');
                    var aDetail = { Id: data.Id, AccountHeadCode: data.AccountHeadCode, name: data.Name };
                    var arr = self.AccHeads();
                    arr.push(aDetail);
                    self.AccHeads(arr);
                    //alert(data.Message);
                    $('#SuccessModal').modal('show');
                    $('#SuccessModalText').text(data.Message);
                },
                error: function () {
                    self.pendingItemsDecrement();
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });

            //Ends Here
        };

        self.assignment = function (data) {
            //self.AccGroupId(data.AccGroupId);
            //self.AccSubGroupId(data.AccSubGroupId);
            //self.AccHeadGroupId(data.AccHeadGroupId);
            //self.AccHeadSubGroupId(data.AccHeadSubGroupId);
            //self.RefId(data.RefId);
            //self.AccHeadName(data.Name);
            //self.RefType(data.RefType);
        }

        self.editAccHead = function (element) {
            self.pendingItemsIncrement();;
            $.ajax({
                type: "GET",
                url: '/Accounts/Accounts/GetAccHeadByAccHeadId?accHeadId=' + element.Id,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    //console.log(ko.toJSON(data));
                    self.Id(data.Id);
                    self.AccGroupId(data.AccGroupId);
                    $.when(self.getAccountSubGroupsByGroupId()).done(function () {
                        self.AccSubGroupId(data.AccSubGroupId);
                        self.Name(data.Name);
                        self.Code(data.Code);
                        $.when(self.getAccountHeadGroupsBySubGroupId()).done(function () {
                            self.AccHeadGroupId(data.AccHeadGroupId);
                            $.when(self.getAccountHeadSubGroupsByHeadGroupId()).done(function () {
                                self.AccHeadSubGroupId(data.AccHeadSubGroupId);
                                self.RefType(data.RefType);
                                if (data.RefType == 1) {
                                    $.when(self.getProducts()).done(function () {
                                        self.RefId(data.RefId);
                                    });
                                }
                                else if (data.RefType == 2) {
                                    $.when(self.getBanks()).done(function () {
                                        self.RefId(data.RefId);
                                    });
                                } else if (data.RefType == 3) {
                                    $.when(self.getSuppliers()).done(function () {
                                        self.RefId(data.RefId);
                                    });
                                } else if (data.RefType == 4) {
                                    $.when(self.getCustomers()).done(function () {
                                        self.RefId(data.RefId);
                                    });
                                }
                            })
                        });

                        //console.log("all assigned");
                    });
                    self.pendingItemsDecrement();
                },
                error: function (error) {
                    self.pendingItemsDecrement();
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }

    }

    var vm = new ChartOfAccountsVM();
    vm.getAllCompanies();
    vm.getAllAccountGroups();
    //vm.getExpenditures();

    ko.applyBindings(vm, $('#chartOfAccount')[0]);



    $(function () {
        $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
        $('.tree li.parent_li > span').on('click', function (e) {
            var children = $(this).parent('li.parent_li').find(' > ul > li');
            if (children.is(":visible")) {
                children.hide('fast');
                $(this).attr('title', 'Expand this branch').find(' > i').addClass('icon-plus-sign').removeClass('icon-minus-sign');
            } else {
                children.show('fast');
                $(this).attr('title', 'Collapse this branch').find(' > i').addClass('icon-minus-sign').removeClass('icon-plus-sign');
            }
            e.stopPropagation();
        });
    });
});