/// <reference path="../knockout-3.4.0.debug.js" />
/// <reference path="../jquery-2.1.4.js" />
/// <reference path="../finix.util.js" />
/// <reference path="~/Scripts/knockout.validation.min.js" />


//start of auto complete

//jqAuto -- main binding (should contain additional options to pass to autocomplete)
//jqAutoSource -- the array of choices
//jqAutoValue -- where to write the selected value
//jqAutoSourceLabel -- the property that should be displayed in the possible choices
//jqAutoSourceInputValue -- the property that should be displayed in the input box
//jqAutoSourceValue -- the property to use for the value
ko.bindingHandlers.jqAuto = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {

        var options = valueAccessor() || {},
            allBindings = allBindingsAccessor(),
            unwrap = ko.utils.unwrapObservable,
            modelValue = allBindings.jqAutoValue,
            source = allBindings.jqAutoSource,
            valueProp = allBindings.jqAutoSourceValue,
            inputValueProp = allBindings.jqAutoSourceInputValue || valueProp,
            labelProp = allBindings.jqAutoSourceLabel || valueProp;

        //function that is shared by both select and change event handlers
        function writeValueToModel(valueToWrite) {
            if (ko.isWriteableObservable(modelValue)) {
                modelValue(valueToWrite);
            } else {  //write to non-observable
                if (allBindings['_ko_property_writers'] && allBindings['_ko_property_writers']['jqAutoValue'])
                    allBindings['_ko_property_writers']['jqAutoValue'](valueToWrite);
            }
        }

        //on a selection write the proper value to the model
        options.select = function (event, ui) {
            writeValueToModel(ui.item ? ui.item.actualValue : null);
        };

        $(element).keyup(function () {
            //console.log("key up fired");
            var currentValue = $(element).val();
            //viewModel.loadChequeNoList(currentValue);
            viewModel.loadChequeNoList(currentValue);
        });

        //on a change, make sure that it is a valid value or clear out the model value
        //options.change = function (event, ui) {
        //    var currentValue = $(element).val();
        //    viewModel.getData(currentValue);
        //    var matchingItem = ko.utils.arrayFirst(unwrap(source), function (item) {
        //        return unwrap(item[inputValueProp]) === currentValue;
        //    });

        //    if (!matchingItem) {
        //        writeValueToModel(null);
        //    }
        //}


        //handle the choices being updated in a DO, to decouple value updates from source (options) updates
        var mappedSource = ko.dependentObservable(function () {
            mapped = ko.utils.arrayMap(unwrap(source), function (item) {
                var result = {};
                result.label = labelProp ? unwrap(item[labelProp]) : unwrap(item).toString();  //show in pop-up choices
                result.value = inputValueProp ? unwrap(item[inputValueProp]) : unwrap(item).toString();  //show in input box
                result.actualValue = valueProp ? unwrap(item[valueProp]) : item;  //store in model
                return result;
            });
            return mapped;
        });

        //whenever the items that make up the source are updated, make sure that autocomplete knows it
        mappedSource.subscribe(function (newValue) {
            $(element).autocomplete("option", "source", newValue);
        });

        options.source = mappedSource();

        //initialize autocomplete
        $(element).autocomplete(options);
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        //update value based on a model change
        var allBindings = allBindingsAccessor(),
            unwrap = ko.utils.unwrapObservable,
            modelValue = unwrap(allBindings.jqAutoValue) || '',
            valueProp = allBindings.jqAutoSourceValue,
            inputValueProp = allBindings.jqAutoSourceInputValue || valueProp;

        //if we are writing a different property to the input than we are writing to the model, then locate the object
        if (valueProp && inputValueProp !== valueProp) {
            var source = unwrap(allBindings.jqAutoSource) || [];
            var modelValue = ko.utils.arrayFirst(source, function (item) {
                return unwrap(item[valueProp]) === modelValue;
            }) || {};  //probably don't need the || {}, but just protect against a bad value          
        }

        //update the element with the value that should be shown in the input
        $(element).val(modelValue && inputValueProp !== valueProp ? unwrap(modelValue[inputValueProp]) : modelValue.toString());
    }
};

ko.bindingHandlers.jqAutoCombo = {
    init: function (element, valueAccessor) {
        var autoEl = $("#" + valueAccessor());

        $(element).click(function () {
            // close if already visible
            if (autoEl.autocomplete("widget").is(":visible")) {
                // console.log("close");
                autoEl.autocomplete("close");
                return;
            }

            //autoEl.blur();
            //console.log("search");
            autoEl.autocomplete("search", " ");
            autoEl.focus();

        });

    }
};
//end of auto complete


$(document).ready(function () {
    var currentDate = (new Date()).toISOString().split('T')[0];
    //$('#loadingModal').modal('show');
    ko.validation.init({
        errorElementClass: 'has-error',
        errorMessageClass: 'help-block',
        decorateInputElement: true
    });
    function getVouchertypes() {
        return ['pmnt', 'rcv', 'jrnl'];
    }
    function getPaytypes() {
        return ['cash', 'bank'];
    }
    function getTrantypes() {
        return ['dr', 'cr'];
    }
    function voucherDetail(data) {
        var self = this;

        self.entryType = ko.observable(data.entryType);
        self.TransactionNo = ko.observable(data.TransactionNo);
        self.paytype = ko.observable(data.paytype);
        self.VoucherNo = ko.observable(data.VoucherNo);
        self.VoucherDate = ko.observable(data.VoucherDate);
        self.VoucherDateTxt = ko.observable(data.VoucherDateTxt);

        self.accountHeadName = ko.observable(data.accountHeadName);
        self.AccountHeadCode = ko.observable(data.AccountHeadCode);
        self.BankAccountHead = ko.observable(data.BankAccountHead);

        self.Description = ko.observable(data.Description);
        self.Amount = ko.observable(data.Amount);
        self.Debit = ko.observable(0.00);
        self.Credit = ko.observable(0.00);

        self.IsCheque = ko.observable(false);
        self.Banks = ko.observableArray([]);
        self.BankId = ko.observable(data.BankId);
        self.BankName = ko.observable(data.BankName);
        self.BranchName = ko.observable(data.BranchName);
        self.ChequeNo = ko.observable(data.ChequeNo);
        self.ChequePayTo = ko.observable(data.ChequePayTo);
        self.ChequeDate = ko.observable(moment(data.ChequeDate));
        self.ChequeDateTxt = ko.observable(data.ChequeDateTxt);
        //console.log(data.entryType);
        //console.log(self.entryType());
        self.isEntryTypeDr = ko.computed(function () {
            //debugger;
            if (self.entryType() === 'dr') {
                self.Debit(self.Amount());
                return true;
            }
            return false;
        });
        self.isEntryTypeCr = ko.computed(function () {
            if (self.entryType() === 'cr') {
                self.Credit(self.Amount());
                return true;
            }
            return false;
        });


        self.PaymentType = ko.computed(function () {

            if (self.paytype() === 'cash') {
                self.BankName('');
                self.BranchName('');
                self.ChequeNo('');
                self.ChequeDate(moment(currentDate));
                self.IsCheque(false);
                return 1;
            } else if (self.paytype() === 'bank') {
                if (self.ChequeNo().length > 0)  //Commented by Maruf
                    self.IsCheque(true);
                return 2;
            } else {
                self.BankName('');
                self.ChequeNo(''); //Commented by Maruf
                self.ChequeDate(moment(currentDate));
                self.IsCheque(false);
                return 1;
            }

        });
        self.AccTranType = ko.observable(data.AccTranType);
        self.CompanyProfileId = ko.observable(data.CompanyProfileId);
        //self.AccTranType = ko.computed(function () {

        //    if (self.paytype() === 'other') {
        //        return 3;
        //    }
        //    return 1;
        //});

        return self;
    }

    function receiveVoucherVM() {
        var self = this;
        self.isLoading = ko.observable(0);
        self.isLoading.subscribe(function () {
            if (self.isLoading() === 1)
                $('#loadingModal').modal('show');
            else if (self.isLoading() === 0)
                $('#loadingModal').modal('hide');
        });
        
        self.CompanyList = ko.observableArray(Companies);
        self.CompanyProfileId = ko.observable(userCompanyId);
        console.log(userCompanyId);
        console.log(self.CompanyProfileId());
        //console.log(ko.toJSON(self.CompanyProfileId()));
        //console.log(self.entryType());
        self.vouchertypes = ko.observableArray(getVouchertypes());
        self.selectedVouchertype = ko.observable(self.vouchertypes()[0]);
        self.VoucherType = ko.computed(function () {
            if (self.selectedVouchertype() == 'pmnt')
                return 2;
            else if (self.selectedVouchertype() == 'rcv')
                return 1;
            else if (self.selectedVouchertype() == 'cont')
                return 4;
            else
                return 3;
        });

        //ko.observable();

        self.paytypes = ko.observableArray(getPaytypes());
        self.selectedPaytype = ko.observable(self.paytypes()[0]);

        self.trantypes = ko.observableArray(getTrantypes());
        self.selectedTrantype = ko.observable(self.trantypes()[0]);

        self.vouNo = ko.observable('');
        self.VoucherDate = ko.observable('');
        self.VoucherDateTxt = ko.observable('');

        self.accountHeads = ko.observableArray([]);
        self.filteredAccHeads = ko.observableArray([]);
        self.selectedAccountHeadCode = ko.observable(0.00).extend({ required: true }); //self.accountHeads()[2].AccountHeadCode
        self.selectedBankAccountHeadCode = ko.observable(0).extend({ required: { onlyIf: function () { return (self.selectedPaytype() === "bank"); } } });

        //voucher info
        self.Description = ko.observable('');
        self.Amount = ko.observable(0.00).extend({ required: true });
        self.TotalDr = ko.observable(0.00);
        self.TotalCr = ko.observable(0.00);

        self.IsCash = ko.computed(
            function () {
                if (self.selectedPaytype() === 'cash')
                    return true; //cheque
                return false; //cash
            });
        self.VoucherDetails = ko.observableArray([]);

        // for cheque type
        self.selectedBank = ko.observable();
        self.BankId = ko.observable();
        self.Banks = ko.observableArray([]);
        self.BankName = ko.observable('');
        self.BranchName = ko.observable('');

        self.prefix = ko.observable('');

        self.ChequeNoList = ko.observableArray([]);
        self.ChequeNo = ko.observable('');
        self.ChequePayTo = ko.observable('');
        self.Branch = ko.observable('');
        self.ChequeDate = ko.observable(moment(currentDate));
        self.IsBank = ko.computed(
            function () {
                if (self.selectedPaytype() === 'bank') {
                    return true;
                }
                return false;
            });

        self.loadChequeNoList = function (prefix) {
            console.log("loading cheque list");
            $.getJSON("/Accounts/Bank/GetAvailableChequeNo?BankId=" + self.BankId() + "&prefix=" + prefix, function (data) {//$.getJSON("/Purchase/GetPONumberList/?prefix=" + prefix, function (data) {
                console.log(data);
                self.ChequeNoList(data);
            });
        }

        //Code by Maruf //Commented by Maruf
        //self.GetChequeNoList = function (searchTerm, callback) {
        //    var submitData = {
        //        prefix: searchTerm,
        //        BankId: self.BankId()
        //    };
        //    $.ajax({
        //        type: "POST",
        //        url: '/Accounts/Bank/GetAvailableChequeNo',
        //        data: ko.toJSON(submitData),
        //        contentType: "application/json",
        //        success: function (data) {
        //            self.ChequeNoList(data);
        //            console.log(data);
        //        },
        //        error: function (error) {
        //            alert(error.status + "<--and--> " + error.statusText);
        //        }
        //    }).done(callback);
        //}


        self.IsNotJournal = ko.computed(function () {
            if (self.selectedVouchertype() === 'jrnl' || self.selectedVouchertype() === 'cont') {
                return false;
            }
            return true;
        });
        self.IsJournal = ko.computed(function () {
            if (self.selectedVouchertype() === 'jrnl' || self.selectedVouchertype() === 'cont') {
                self.selectedTrantype(self.trantypes()[0]);
                self.selectedPaytype('bank');
                self.getBanks();
                return true;
            }
            else if (self.selectedVouchertype() === 'pmnt')
                self.selectedTrantype(self.trantypes()[0]);
            else
                self.selectedTrantype(self.trantypes()[1]);
            return false;
        });
        self.getAccountHeadName = function (code) {
            debugger;
            for (var i = 0, len = self.accountHeads().length; i < len; i++) {
                if (self.accountHeads()[i].AccountHeadCode === code)
                    return self.accountHeads()[i].name;
            }
            return '';
        };
        //self.getAllCompanies = function () {
        //    if (userCompanyId != null && userCompanyId > 0) {
        //        self.CompanyProfileId(userCompanyId);
        //    } else {
        //        self.CompanyList([]);
        //        self.isLoading(self.isLoading() + 1);
        //        return $.ajax({
        //            type: "GET",
        //            url: '/Auth/CompanyProfile/GetAllCompanyList',
        //            contentType: "application/json; charset=utf-8",
        //            dataType: "json",
        //            success: function (data) {
        //                self.CompanyList(data);
        //                self.isLoading(self.isLoading() - 1);
        //            },
        //            error: function (error) {
        //                self.isLoading(self.isLoading() - 1);
        //                alert(error.status + "<--and--> " + error.statusText);
        //            }
        //        });
        //    }
        //}
        self.VoucherNo = ko.observable('');
        //    ko.computed(function () {
        //    if (self.vouNo().length > 0) {
        //        if (self.selectedVouchertype() == 'pmnt' && self.selectedPaytype() == 'cash') {
        //            self.VoucherType(2);
        //            return 'DV-' + self.vouNo();
        //        }
        //        else if (self.selectedVouchertype() == 'rcv' && self.selectedPaytype() == 'cash') {
        //            self.VoucherType(1);
        //            return 'CV-' + self.vouNo();
        //        }
        //        else if (self.selectedVouchertype() == 'jrnl' && self.selectedPaytype() == 'cash') {
        //            self.VoucherType(3);
        //            return 'JV-' + self.vouNo();
        //        }
        //        else if (self.selectedVouchertype() == 'pmnt' && self.selectedPaytype() == 'bank') {
        //            self.VoucherType(2);
        //            return 'BDV-' + self.vouNo();
        //        }
        //        else if (self.selectedVouchertype() == 'rcv' && self.selectedPaytype() == 'bank') {
        //            self.VoucherType(1);
        //            return 'BCV-' + self.vouNo();
        //        }
        //        else if (self.selectedVouchertype() == 'jrnl' && self.selectedPaytype() == 'bank') {
        //            self.VoucherType(3);
        //            return 'JV-' + self.vouNo();
        //        }

        //    }
        //    return '';
        //});

        self.getBanks = function () {
            var currentCompany = self.CompanyProfileId() > 0 ? self.CompanyProfileId() : null;
            //self.isLoading(self.isLoading() + 1);

            return $.ajax({
                type: "GET",
                url: '/Accounts/Bank/GetBankList?CompanyProfileId=' + currentCompany,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    //self.isLoading(self.isLoading() - 1);
                    self.Banks(data);
                },
                error: function (error) {
                    //self.isLoading(self.isLoading() - 1);
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
            //$.ajax({
            //    type: "GET",
            //    url: '/Accounts/GetBankAccHeads',
            //    contentType: "application/json; charset=utf-8",
            //    dataType: "json",
            //    success: function (data) {
            //        //return data;
            //        self.Banks(data);
            //        //console.log(ko.toJSON(data));
            //    },
            //    error: function (error) {
            //        alert(error.status + "<--and--> " + error.statusText);
            //    }
            //});
        }

        self.GetBankAccCode = function () {
            console.log("Bank - " + ko.toJSON(self.selectedBank()));
            self.BankId(self.selectedBank().Id);
            self.BankName(self.selectedBank().Name);
            self.BranchName(self.selectedBank().BranchName);
            self.isLoading(self.isLoading() + 1);


            return $.ajax({
                type: "GET",
                url: '/Accounts/Accounts/GetBankAccHeadByBankId?BankId=' + self.BankId(),
                contentType: "application/json",
                success: function (data) {
                    self.isLoading(self.isLoading() - 1);
                    //console.log(data);
                    self.selectedBankAccountHeadCode(data.Code);
                    if (self.selectedVouchertype() == "jrnl")
                        self.selectedAccountHeadCode(data.Code);
                },
                error: function() {
                    self.isLoading(self.isLoading() - 1);
                    alert("No account head found for the bank - " + self.BankName())
                    //alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }

        self.getToData = function () {
            self.isLoading(self.isLoading() + 1);
            url = '/Auth/CompanyProfile/DateToday';
            if (self.CompanyProfileId() > 0)
                url += '?CompanyProfileId=' + self.CompanyProfileId();
            return $.ajax({
                type: "GET",
                url: url,
                contentType: "application/json",
                success: function (data) {
                    self.isLoading(self.isLoading() - 1);
                    self.VoucherDate(moment(data));
                },
                error: function () {
                    self.isLoading(self.isLoading() - 1);
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        };
        //self.getBranchName = function () {
        //    //alert("fired");
        //    $.grep(self.Banks(), function (e) {
        //        if (e.Id === self.BankId()) {
        //            console.log(e.BranchName);
        //            self.BranchName(e.BranchName);
        //            return e.BranchName;
        //        }
        //    });
        //}

        self.addVaoucher = function () {
            console.log("VoucherDate - " + self.VoucherDate());
            console.log("ChequeDate - " + self.ChequeDate());
            if (self.errors().length == 0) {
                var aDetail = new voucherDetail(
                    {
                        TransactionNo: self.VoucherNo(),
                        entryType: self.selectedTrantype(),
                        paytype: self.selectedPaytype(),
                        AccTranType: self.VoucherType(),
                        BankAccountHead: self.selectedBankAccountHeadCode(),
                        Description: self.Description(),
                        AccountHeadCode: self.selectedAccountHeadCode(),
                        accountHeadName: self.getAccountHeadName(self.selectedAccountHeadCode()),
                        VoucherNo: self.VoucherNo(),
                        VoucherDate: self.VoucherDate(),//moment(self.VoucherDate()).format('DD/MM/YYYY'), //self.VoucherDate(),
                        VoucherDateTxt: moment(self.VoucherDate()).format('DD/MM/YYYY'),
                        Amount: self.Amount(),
                        BankId: self.BankId(),
                        BankName: self.BankName(),
                        BranchName: self.BranchName(),
                        ChequeNo: self.ChequeNo(),
                        ChequeDate: self.ChequeDate(),
                        ChequeDateTxt : moment(self.ChequeDate()).format('DD/MM/YYYY'),
                        CompanyProfileId: self.CompanyProfileId(),
                        ChequePayTo: self.ChequePayTo()
                    });

                var arr = self.VoucherDetails();
                console.log(ko.toJSON(aDetail));
                arr.push(aDetail);
                self.VoucherDetails(arr);
                self.clearAddedControls();
            }
            else {
                self.errors.showAllMessages();
            }
        };
        //self.removeReceiveVaoucsers = function (voucherDetail) {
        //    var tn = voucherDetail.TransactionNo();
        //    var arr = self.VoucherDetails();
        //    var newArr = arr.filter(function (obj) {
        //        return obj.TransactionNo() !== tn;
        //    });
        //    self.VoucherDetails(newArr);
        //};
        self.removeVaoucser = function (voucherDetail) {
            self.VoucherDetails.remove(voucherDetail);
        };
        self.IsAmount = ko.observable(false);
        self.IsAmount = ko.computed(function () {
            if (self.Amount() > 0)
                return true;
            else
                return false;
        });
        self.IsSave = ko.computed(function () {

            var drAmount = 0.00;
            var crAmount = 0.00;
            if (self.VoucherDetails().length > 0) {
                $.each(self.VoucherDetails(), function (key, value) {
                    if (!isNaN(value.Debit()) && !isNaN(value.Credit())) {
                        drAmount += parseInt(value.Debit());
                        crAmount += parseInt(value.Credit());
                    }

                });
                self.TotalDr(drAmount);
                self.TotalCr(crAmount);
                if (self.selectedVouchertype() !== 'jrnl' && self.selectedVouchertype() !== 'cont') {
                    return true;
                }
                if (drAmount === crAmount && drAmount > 0) {

                    return true;
                }
            }
            else
                return false;
            

            //return false;
        });

        self.IsSaved = ko.observable(false);
        self.saveVoucher = function () {
            
            self.isLoading(self.isLoading() + 1);
            self.CompanyProfileId(userCompanyId);
                $.ajax({
                    type: "POST",
                    url: '/Accounts/Accounts/SaveVoucher',
                    data: ko.toJSON(self),
                    contentType: "application/json",
                    success: function (data) {
                        
                       // self.filteredAccHeads('');
                        //self.accountHeads('');
                        self.selectedAccountHeadCode('');
                        $('#SuccessModalText').text(' ');
                        $('#successModalLinks').text(' ');
                        
                        //self.IsSaved(true);
                        //self.VoucherNo(data.VoucherNo);
                        //self.setUrl();
                        self.reset();
                        //self.clearSavedControls();
                        self.isLoading(self.isLoading() - 1);
                        console.log('checque:' + data.ChequeId);
                        $('#SuccessModal').modal('show');
                        $('#SuccessModalText').text(data.Message);
                        if (data.VoucherNo)
                        $('#successModalLinks').append("<a class='btn btn-success' target='_blank' href='/Accounts/Accounts/GetVoucherPrintByVoucherNo?reportTypeId=PDF&voucherNo=" + data.VoucherNo + "&companyProfileId=" + self.CompanyProfileId() + "'>Voucher</a>");
                        if (data.ChequeId)
                         $('#successModalLinks').append("<a class='btn btn-success' target='_blank' href='/Accounts/Bank/ChequePrint?reportTypeId=Word&chequeId=" + data.ChequeId + "'>Cheque</a>");
                    },
                    error: function () {
                        self.isLoading(self.isLoading() - 1);
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            //} else {
            //    self.isLoading(self.isLoading() - 1);
            //    $('#SuccessModal').modal('show');
            //    $('#SuccessModalText').text("Debit & Credit need to be same");
            //    //self.getAccHeads();
            //}


            //Ends Here
        };
        //self.saveVoucher = function () {
        //    self.filteredAccHeads('');
        //    self.accountHeads('');
        //    self.isLoading(self.isLoading() + 1);
        //    //console.log(ko.toJSON(self));
        //    $.ajax({
        //        type: "POST",
        //        url: '/Accounts/Accounts/SaveVoucher',
        //        data: ko.toJSON(self),
        //        contentType: "application/json",
        //        success: function (data) {
        //            alert(data.Message);
        //            //console.log(data);
        //            //alert(data.response.Message + "\n\nVoucherNo - " + data.VoucherNo);
        //            //window.location.href = "/Accounts/Accounts/GenAccounts";
        //            self.IsSaved(true);
        //            self.setUrl();
        //            self.clearSavedControls();
        //            self.isLoading(self.isLoading() - 1);
        //        },
        //        error: function () {
        //            self.isLoading(self.isLoading() - 1);
        //            alert(error.status + "<--and--> " + error.statusText);
        //        }
        //    });

        //    //Ends Here
        //};


        self.getAccHeads = function () {
            var currentCompany = self.CompanyProfileId() > 0 ? self.CompanyProfileId() : 1;
            self.isLoading(self.isLoading() + 1);
            return $.ajax({
                type: "GET",
                url: '/Accounts/Accounts/GetConcatedAccHeads?companyProfileId=' + currentCompany,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    //console.log(ko.toJSON(data));
                    self.accountHeads(data);
                    self.setFilteredAccHeads();
                    self.isLoading(self.isLoading() - 1);
                },
                error: function (error) {
                    self.isLoading(self.isLoading() - 1);
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
        self.setFilteredAccHeads = function () {
            var filterArray = [];
            $.each(self.accountHeads(), function (i, v) {
                //if (self.selectedVouchertype() === 'pmnt') {
                //    var regex = new RegExp('^(204|101|10201|10203|10204|501|502|504)');
                //    if (regex.test(v.AccountHeadCode)) {
                //        filterArray.push(self.accountHeads()[i]);
                //    }
                //}
                //else if (self.selectedVouchertype() === 'rcv') {
                //    var regex = new RegExp('^(203|10201|10202|404|405|305|204|503)');
                //    if (regex.test(v.AccountHeadCode)) {
                //        filterArray.push(self.accountHeads()[i]);
                //    }
                //}
                //else 
                if (self.selectedVouchertype() === 'cont') {
                    var regex = new RegExp('^(10202)');
                    if (regex.test(v.AccountHeadCode)) {
                        filterArray.push(self.accountHeads()[i]);
                    }
                }
                else {
                    filterArray.push(self.accountHeads()[i]);
                }

            })
            self.filteredAccHeads(filterArray);
            //console.log("filtered data - " + ko.toJSON(self.filteredAccHeads()));
        };
        //self.setFilteredAccHeads = function () {
        //    var filterArray = [];
        //    $.each(self.accountHeads(), function (i, v) {
        //        if (self.selectedVouchertype() === 'pmnt') {
        //            var regex = new RegExp('^(204|101|10201|10203|10204|501|502|504)');
        //            if (regex.test(v.AccountHeadCode)) {
        //                filterArray.push(self.accountHeads()[i]);
        //            }
        //        }
        //        else if (self.selectedVouchertype() === 'rcv') {
        //            var regex = new RegExp('^(203|10201|10202|404|405|305|204|503)');
        //            if (regex.test(v.AccountHeadCode)) {
        //                filterArray.push(self.accountHeads()[i]);
        //            }
        //        }
        //        else {
        //            filterArray.push(self.accountHeads()[i]);
        //        }
        //    })
        //    self.filteredAccHeads(filterArray);
        //};
        //self.getUpdateVoucherNo = function () {
        //    $.ajax({
        //        type: "GET",
        //        url: '/CompanyProfile/GetUpdateVoucherNo',
        //        contentType: "application/json; charset=utf-8",
        //        dataType: "json",
        //        success: function (data) {
        //            //return data;
        //            self.vouNo(data);
        //        },
        //        error: function (error) {
        //            alert(error.status + "<--and--> " + error.statusText);
        //        }
        //    });
        //}
        self.errors = ko.validation.group(self);
        self.IsValid = ko.computed(function () {
            var err = self.errors().length;
            //console.log(err);
            if (err == 0)//&& self.VoucherNo().length > 0
                return true;
            return false;
        });
        self.EnableHeader = ko.computed(function () {
            var i = 0.00;
            $.each(self.VoucherDetails(), function (key, value) {
                i++;
            });
            if (i > 0)
                return false;
            return true;
        });
        self.reset = function () {
            self.clearSavedControls();
            self.clearAddedControls();
            self.getAccHeads();
        }
        self.clearSavedControls = function () {
            self.VoucherDetails([]);
            self.VoucherNo('');
            //self.VoucherDate();
            //self.AccountHeadCode('');
            self.selectedAccountHeadCode(0);

            self.BankName('');
            self.ChequeNo('');
            //self.ChequeDate(moment(currentDate));
            self.Description('');
            self.Amount(0);
        }
        self.clearAddedControls = function () {
            self.selectedAccountHeadCode(0); currentDate
            self.BankName('');
            self.BranchName('');
            self.ChequeNo('');
            self.ChequePayTo('');
            //self.ChequeDate(moment(currentDate));
            self.Description('');
            self.Amount(0);
        }
        self.Link1 = ko.observable();
        self.Link2 = ko.observable();
        self.Link3 = ko.observable();
        self.Title1 = ko.observable('PDF');
        self.Title2 = ko.observable('Excel');
        self.Title3 = ko.observable('Word');

        self.setUrl = ko.computed(function () {
            var vn = self.VoucherNo() ? self.VoucherNo() : '';
            if (vn.length > 0) {
                self.Link1('/Accounts/Accounts/GetVoucherReport?reportTypeId=PDF&voucherNo=' + vn);
                self.Link2('/Accounts/Accounts/GetVoucherReport?reportTypeId=Excel&voucherNo=' + vn);
                self.Link3('/Accounts/Accounts/GetVoucherReport?reportTypeId=Word&voucherNo=' + vn);
            }
        });
    }

    var vm = new receiveVoucherVM();

    vm.getAccHeads();
    vm.getToData();
    vm.setUrl();
    ko.applyBindings(vm, $('#VoucherEntry')[0]);
    //$('#loadingModal').modal('hide');

});