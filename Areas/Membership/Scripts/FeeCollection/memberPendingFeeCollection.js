var month = [{ 'Id': 'January', 'Name': 'January' },
                    { 'Id': 'February', 'Name': 'February' },
                    { 'Id': 'March', 'Name': 'March' },
                    { 'Id': 'April', 'Name': 'April' },
                    { 'Id': 'May', 'Name': 'May' },
                    { 'Id': 'June', 'Name': 'June' },
                    { 'Id': 'July', 'Name': 'July' },
                    { 'Id': 'August', 'Name': 'August' },
                    { 'Id': 'September', 'Name': 'September' },
                    { 'Id': 'October', 'Name': 'October' },
                    { 'Id': 'November', 'Name': 'November' },
                    { 'Id': 'December', 'Name': 'December' }];
var trasactionType = [
    { 'Id': 1, 'Name': 'Deposit' },
    { 'Id': 2, 'Name': 'Withdraw' }
];

$(document).ready(function () {
    ko.validation.init({
        errorElementClass: 'has-error',
        errorMessageClass: 'help-block',
        decorateInputElement: true,
        grouping: { deep: true, observable: true }
    });
    function Pendings() {
        var self = this;
        self.PendingFeeId = ko.observable();
        self.MemberId = ko.observable();
        self.MemberPendingFeeId = ko.observable();
        self.FeeTypeId = ko.observable();
        self.FeeTypeName = ko.observable();
        self.TotalAmount = ko.observable();
        self.PaidAmount = ko.observable();
        self.Due = ko.observable();
        self.ForYear = ko.observable();
        self.IsChecked = ko.observable(false);
        self.IsDue = ko.observable(true);
        self.LoadData = function (data) {
            //console.log("data.ForYear : " + data.ForYear)
            self.PendingFeeId(data.PendingFeeId);;
            self.MemberId(data.MemberId);
            self.MemberPendingFeeId(data.MemberPendingFeeId);
            self.FeeTypeId(data.FeeTypeId);
            self.FeeTypeName(data.FeeTypeName);
            self.TotalAmount(data.TotalAmount);
            self.PaidAmount(data.PaidAmount);
            self.Due(data.Due);
            self.ForYear(data.ForYear);
            self.IsChecked(data.IsChecked);
            self.IsDue(data.IsDue);
        }
        
       
    }
    function feeCollection() {
        var self = this;
        
        self.MemberId = ko.observable();
        self.PendingFeeId = ko.observable();
        self.FeeTypeId = ko.observable().extend({ required: true });
        self.SubscriptionDate = ko.observable(moment());
        self.ChequeDate = ko.observable(moment());
        self.ChequeDatetxt = ko.observable();
        self.Year = ko.observable();
        self.FromYear = ko.observable().extend({ required: true });
        self.PendingFeeList = ko.observableArray([]);
        // self.PayType = ko.observable();
        self.ChequeNo = ko.observable();
        self.Bank = ko.observable();
        self.BankBranch = ko.observable(); //Code by Maruf
        self.CollectedAmount = ko.observable();
        self.IsChequeVisible = ko.observable(true);
        self.IsEditableAmount = ko.observable(true);
        
        
        self.LoadData = function (data) {
            //console.log("Load Fee Collection : " + ko.toJSON(data));
            //console.log("data.FromYear : " + ko.toJSON(data.FromYear));
            self.MemberId(data.MemberId);
            self.PendingFeeId(data.PendingFeeId);
            self.FeeTypeId(data.FeeTypeId);
            self.SubscriptionDate(moment());
            self.ChequeDate(moment());
            self.ChequeDatetxt(data.ChequeDatetxt)
            self.FromYear(data.FromYear);
            self.ToYear(data.ToYear);
            self.Year(data.Year);
            self.PendingFeeList(data.PendingFeeList);
            
            
           // self.PayType(data.PayType);
            self.CollectedAmount(data.CollectedAmount);
            self.ChequeNo(data.ChequeNo);
            self.Bank(data.Bank);
            self.BankBranch(data.BankBranch); //Code by Maruf
        }
        self.Reset = function () {
            self.FeeTypeId('');
            //self.PayType('');
            self.CollectedAmount('');
            self.ChequeNo('');
            self.Bank('');
            self.BankBranch(''); //Code by Maruf
            self.Year('');
            self.FromYear('');
            
        };
        self.FeeTypeId.subscribe(function () {
          
            if (self.FeeTypeId() > 0) {
                ko.utils.arrayForEach(self.PendingFeeList(), function (fee) {
                    if (fee.FeeTypeId() == self.FeeTypeId()) {
                        self.CollectedAmount(fee.Due());
                        self.PendingFeeId(fee.PendingFeeId());
                        //console.log(self.PendingFeeId());
                        if (self.FeeTypeId() == 2)
                        {
                            self.Years = ko.observableArray([]);
                            self.Years = ko.computed(function () { return fee.ForYear() && fee.ForYear().split(" - ") || []; });
                            self.FromYear(self.Years()[0]);
                            //console.log("self.Years()[0] : " + self.Years()[0]);
                            self.IsEditableAmount(false);
                            
                        }
                        else
                            //console.log("fee.ForYear() : " + fee.ForYear());
                            self.FromYear("2018");
                    }
                });
                
            }
        });
        
    }
    function memberSavingDetails() {
        var self = this;
        self.Id = ko.observable('');
        self.Pendings = ko.observable(new Pendings());
        //self.feecollections = ko.observable(new feeCollection());
        self.MemberNo = ko.observable('');
        self.NameOfOrganization = ko.observable('');
        self.Phone = ko.observable('');
        self.TotalAmount = ko.observable('');
        self.PaidAmount = ko.observable('');
        self.Due = ko.observable('');

        self.MemberId = ko.observable('');


        self.Member = ko.observable('');
        self.BankAccHead = ko.observable('');
        self.MRAuthorizedPerson = ko.observable('Account Manager').extend({ required: true });
        self.Description = ko.observable('').extend({ required: true });
        //self.FeeTypeId = ko.observable();
        self.FeeType = ko.observable();
        self.SubscriptionDate = ko.observable(moment());
        
       
        self.PayType = ko.observable('').extend({ required: true });
        self.CollectedAmount = ko.observable('');
        self.PendingFeeList = ko.observableArray([]);
        self.FeeTypeList = ko.observableArray([]);
        self.FeeTypeIdList = ko.observableArray([]);
        self.Payments = ko.observableArray([]);
        self.Collection = ko.observableArray([]);
        self.Heads = ko.observableArray([]);
        self.Years = ko.observableArray([]);
        self.FiscalYears = ko.observableArray([]);
        self.SelectPayType = ko.observable(true);
        self.IsDuplicate = ko.observable(false);


        self.CheckFee = ko.observable(false);
        self.IsChecked = ko.observable();
        //self.Pendings.IsChecked.subscribe(function () {
        //    if (self.Pendings.IsChecked() == true) {
        //        console.log("data : " + self.FeeTypeId());
        //        //self.GetFeeTypes();
        //    }

        //});

        self.PayType.subscribe(function () {
            if (self.PayType() == 1) {
                //self.feecollections().IsChequeVisible(false);
                self.CheckFee(false);
            }
            else {
                //self.feecollections().IsChequeVisible(true);
                self.CheckFee(true);
            }

        });

        self.IsChecked.subscribe(function () {
            if (self.IsChecked() == true) {
                //self.Pendings.GetFeeTypes();
            }
            else
            {

            }

        });
     
        self.GetFeeTypes = function () {
           //console.log("self.FeeType : " + data);
            return $.ajax({
                type: "GET",
                url: '/Membership/FeeCollection/GetFeeTypes',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    //console.log("FeeType :" + ko.toJSON(data));
                    self.FeeTypeList(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }

        self.GetYears = function () {
            //console.log("self.FeeType : " + data);
            return $.ajax({
                type: "GET",
                url: '/Membership/FeeCollection/GetYearList',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    
                    self.Years(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }

        self.GetBankAccHeads = function () {
           
            return $.ajax({
                type: "GET",
                url: '/Membership/FeeCollection/GetBankAccHeads',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    //console.log("FeeType :" + ko.toJSON(data));
                    self.Heads(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }

        self.LoadAfterSubmit = function () {
            self.PendingFeeList([]);
            $.getJSON("/Membership/FeeCollection/GetFeePendingMemberWise/?memberId=" + self.Id(), null, function (data) {
                self.MemberNo(data.MemberNo);
                self.NameOfOrganization(data.NameOfOrganization);
                self.Phone(data.Phone);
                $.each(data.PendingFeeList,
                           function (index, value) {
                               //console.log("data.PendingFeeList : " + ko.toJSON(value));
                               var aDetail = new Pendings();
                               if (typeof (value) != 'undefined') {
                                   aDetail.LoadData(value);
                                   console.log("aDetail : " + ko.toJSON(aDetail));

                                   self.PendingFeeList.push(aDetail);
                               }
                           });
              
                //self.getBanks();
                self.GetPaymentTypes();
                self.Reset();
                
            });
        };
        self.LoadInitial = function () {
            $.getJSON("/Membership/FeeCollection/GetFeePendingMemberWise/?memberId=" + self.Id(), null, function (data) {
                self.MemberNo(data.MemberNo);
                self.NameOfOrganization(data.NameOfOrganization);
                self.Phone(data.Phone);
                $.each(data.PendingFeeList,
                           function (index, value) {
                               //console.log("data.PendingFeeList : " + ko.toJSON(value));
                               var aDetail = new Pendings();
                               if (typeof (value) != 'undefined') {
                                   aDetail.LoadData(value);
                                  console.log("aDetail : " + ko.toJSON(aDetail));
                         
                                   self.PendingFeeList.push(aDetail);
                               }
                           });
               
                
                self.GetPaymentTypes();
                self.GetBankAccHeads();
                self.GetYears();
            });
        };
        self.GetFees = function () {
            var saveData = ko.observableArray([]);
            $.each(self.PendingFeeList(), function (index, value) {
                if (value.IsChecked() == true) {
                    saveData.push(value.FeeTypeId);
                   
                }
            });
            return $.ajax({
                type: "POST",
                url: '/Membership/FeeCollection/GetFeeTypes',
                data: ko.toJSON(saveData),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.FeeTypeList(data);
                },
                error: function (error) {

                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
        self.Bool = ko.observable(true);
        self.TotalPendingAmount = ko.computed(function () {
            var totalAmount = 0;
            var result = 0.0;
            $.each(self.PendingFeeList(), function (index, value) {
                if (value.IsChecked() == true) {
                    totalAmount += parseFloat(value.Due() ? value.Due() : 0);

                }

            });
            self.GetFees();
            result = totalAmount;
            return result.toFixed(2);
        });
        self.TotalPayableAmount = ko.computed(function () {
            var totalAmount = 0;
            var result = 0.0;
            $.each(self.Payments(), function (index, value) {
                if (self.TotalPendingAmount() == 0.00)
                {
                        self.Payments.remove(value);
                        result = totalAmount;
                        return result.toFixed(2);
              
                }
                else
                {
                    if (self.TotalPendingAmount() > totalAmount) {
                        totalAmount += parseFloat(value.CollectedAmount() ? value.CollectedAmount() : 0);
                    }
                }
                    //if (self.TotalPendingAmount() > totalAmount) {
                    //    totalAmount += parseFloat(value.CollectedAmount() ? value.CollectedAmount() : 0);
                    //}
                    //else {
                    //    self.Payments.remove(value);
                    //    $('#successModal').modal('show');
                    //    $('#successModalText').text("Amount is greater than due");
                    //    result = totalAmount;
                    //    return result.toFixed(2);
                    //}
                
             
               
            });
            result = totalAmount;
            return result.toFixed(2);
        });

        self.AddPayments = function () {
            if (self.TotalPendingAmount() != 0) {
                    var payment = new feeCollection();
                    payment.MemberId(self.Id());
                    //console.log("Fees : " + ko.toJSON(self.PendingFeeList()));
                    payment.PendingFeeList(self.PendingFeeList());
                    if (self.PayType() == 1)
                        payment.IsChequeVisible(false);
                    else
                        payment.IsChequeVisible(true);
                    self.SelectPayType(false);

                    $.each(self.Payments(), function (key, value) {
                        if (payment.FeeTypeId() == value.FeeTypeId()) {
                            self.IsDuplicate(true);
                        }
                        else {
                            self.IsDuplicate(false);
                        }

                    });

                    if (self.IsDuplicate() == false) {

                        self.Payments.push(payment);
                        payment.Reset();
                    }
                    else {
                        $('#successModal').modal('show');
                        $('#successModalText').text("This row already exist!");
                        payment.Reset();
                    }
                
            }
            else {
                $('#successModal').modal('show');
                $('#successModalText').text('Select a Fee First!');
            }
        }
        self.RemovedPayments = ko.observableArray([]);
        self.RemovePayments = function (line) {
            line.Reset();
            self.Payments.remove(line);
        }


        self.ChequeNo = ko.observable();
        self.ChequeDate = ko.observable();
        self.AccountHeadCode = ko.observable();

        self.PaytypesList = ko.observableArray([]);
        self.GetPaymentTypes = function () {
            return $.ajax({
                type: "GET",
                url: '/Membership/FeeCollection/GetPaymentTypes',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.PaytypesList(data);
                },
                error: function (error) {
                    self.pendingItemsDecrement();
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
       
        
        
        self.Reset = function () {
            self.SelectPayType(true);
            self.CheckFee(true);
            self.PayType('');
            self.Payments([]);
            self.Description('');
        }

        self.Submit = function () {
            
            if (self.TotalPendingAmount() == self.TotalPayableAmount()) {


                var payable = ko.observableArray([]);
                //console.log(':' + ko.toJSON(self.Payments()));
                $.each(self.Payments(),
                function (index, value) {

                    payable.push({
                        MemberId: value.MemberId(),
                        FeeTypeId: value.FeeTypeId(),
                        SubscriptionDate: value.SubscriptionDate(),
                        SubscriptionDateTxt: moment(value.SubscriptionDate()).format("DD/MM/YYYY"),
                        ChequeDate: value.ChequeDate(),
                        ChequeDateTxt: moment(value.ChequeDate()).format("DD/MM/YYYY"),
                        Year: value.Year(),
                        Bank: value.Bank(),
                        BankBranch: value.BankBranch(), //Code by Maruf
                        //PayType: value.PayType(),
                        CollectedAmount: value.CollectedAmount(),
                        ChequeNo: value.ChequeNo()
                    });
                });
                var submitData = {
                    FeeCollectionTrans: payable,
                    PendingFeeList: self.PendingFeeList(),
                    TotalPayableAmount: self.TotalPayableAmount(),
                    BankAccHead: self.BankAccHead(),
                    PayType: self.PayType()
                }
                debugger;
                if (self.PayType() != 1 && self.BankAccHead() == null) {
                    debugger;
                    $('#successModal').modal('show');
                    $('#successModalText').text('Please Select a Bank Account!');
                  }
                else {
                    debugger;
                    if (self.IsValid())
                    {
                        $.ajax({
                            type: "POST",
                            url: '/Membership/FeeCollection/SaveFeePayment/',
                            data: ko.toJSON(submitData),
                            contentType: "application/json",
                            success: function (data) {
                                self.LoadAfterSubmit();
                                self.Payments([]);
                                $('#successModal').modal('show');
                                $('#successModalText').text(data.Message);
                                if (data.MrId)
                                    $('#successModalLinks').append("<a class='btn btn-success' target='_blank' href='/Membership/FeeCollection/GetMoneyReceiptById?reportTypeId=PDF&receiptId=" + data.MrId + "'>Money Receipt</a>");
                                if (data.VoucherNo)
                                    $('#successModalLinks').append("<a class='btn btn-success' target='_blank' href='/Accounts/Accounts/GetVoucherPrintByVoucherNo?reportTypeId=PDF&voucherNo=" + data.VoucherNo + "&companyProfileId=" + data.CompanyId + "'>Voucher</a>");
                            },
                            error: function () {
                                alert(error.status + "<--and--> " + error.statusText);
                            }
                        });
                    }
                    
                }
            }
            else {
                $('#successModal').modal('show');
                $('#successModalText').text('Total Payable amount should be Paid!');
            }
        };

        self.SubmitExisting = function () {
            //debugger;
            if (parseFloat(self.TotalPendingAmount()) >= parseFloat(self.TotalPayableAmount())){


                var payable = ko.observableArray([]);
                $.each(self.Payments(),
                function (index, value) {

                    payable.push({
                        MemberId: value.MemberId(),
                        FeeTypeId: value.FeeTypeId(),
                        SubscriptionDate: value.SubscriptionDate(),
                        SubscriptionDateTxt: moment(value.SubscriptionDate()).format("DD/MM/YYYY"),
                        ChequeDate: value.ChequeDate(),
                        ChequeDateTxt: moment(value.ChequeDate()).format("DD/MM/YYYY"),
                        Year: value.Year(),
                        FromYear: value.FromYear(),
                        Bank: value.Bank(),
                        BankBranch: value.BankBranch(), //Code by Maruf
                        //PayType: value.PayType(),
                        PendingFeeId:value.PendingFeeId(),
                        CollectedAmount: value.CollectedAmount(),
                        ChequeNo: value.ChequeNo()
                    });
                });
                var submitData = {
                    FeeCollectionTrans: payable,
                    PendingFeeList: self.PendingFeeList(),
                    TotalPayableAmount: self.TotalPayableAmount(),
                    BankAccHead: self.BankAccHead(),
                    MRAuthorizedPerson: self.MRAuthorizedPerson(),
                    Description: self.Description,
                    PayType: self.PayType()
                }
                //debugger;
                if (self.PayType() != 1 && self.BankAccHead() == null) {
                    //debugger;
                    $('#successModal').modal('show');
                    $('#successModalText').text('Please Select a Bank Account!');
                }
                else {
                    //debugger;
                    console.log("self.IsValid() : " + self.IsValid());
                    if (self.IsValid()) {
                        $.ajax({
                            type: "POST",
                            url: '/Membership/FeeCollection/SaveExistingMemberFeePayment/',
                            data: ko.toJSON(submitData),
                            contentType: "application/json",
                            success: function (data) {
                                self.LoadAfterSubmit();
                                self.Payments([]);
                                $('#successModal').modal('show');
                                $('#successModalText').text(data.Message);
                                $('#successModalLinks').text('');
                                if (data.MrId)
                                    //$('#successModalLinks').append("<a class='btn btn-success' target='_blank' href='/Membership/FeeCollection/GetMoneyReceiptById?mtype=2&reportTypeId=PDF&receiptId=" + data.MrId + "'>Money Receipt</a>"); //Commented by Maruf
                                    $('#successModalLinks').append("<a class='btn btn-success' target='_blank' href='/Membership/FeeCollection/GetMoneyReceiptById?mtype=" + 2 + "&reportTypeId=PDF&receiptId=" + data.MrId + "'>Money Receipt</a>"); //Code by Maruf
                                if (data.VoucherNo)
                                    $('#successModalLinks').append("<a class='btn btn-success' target='_blank' href='/Accounts/Accounts/GetVoucherPrintByVoucherNo?reportTypeId=PDF&voucherNo=" + data.VoucherNo + "&companyProfileId=" + data.CompanyId + "'>Voucher</a>");
                            },
                            error: function () {
                                alert(error.status + "<--and--> " + error.statusText);
                            }
                        });
                    }

                }
            }
            else {
                $('#successModal').modal('show');
                $('#successModalText').text('More than Payable amount can not be Paid!');
            }
        };
       
        self.queryString = function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));

        }

        self.sparepartErrors = ko.computed(function () {
            var totalErrors = 0;
            $.each(self.Payments(), function (index, value) {
                var selferror = ko.validation.group(value);
                totalErrors += selferror().length;
            });
            return totalErrors;
        });

        /////////////////////////
        self.errors = ko.validation.group(self);
        self.IsValid = ko.computed(function () {
            if (self.errors().length == 0 && self.sparepartErrors() == 0)
                return true;
            return false;
        });
       
    }

    var vm = new memberSavingDetails();
    var qValue = vm.queryString('Id');
    vm.Id(qValue);
    //var qValueId = vm.queryString('MemberPendingFeeId');
    //vm.MemberPendingFeeId(qValueId);
    vm.LoadInitial();
    ko.applyBindings(vm, document.getElementById("memberSavings"));
});