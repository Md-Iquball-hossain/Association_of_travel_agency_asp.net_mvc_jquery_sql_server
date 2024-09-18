
$(document).ready(function () {
    ko.validation.init({
        errorElementClass: 'has-error',
        errorMessageClass: 'help-block',
        decorateInputElement: true,
        grouping: { deep: true, observable: true }
    });
    function Pendings() {
        var self = this;
        self.PendingId = ko.observable();
        self.TraineeId = ko.observable();
        self.Course = ko.observable();
        self.CourseName = ko.observable();
        self.ForYear = ko.observable();
        self.TotalAmount = ko.observable(0.00).extend({ pattern: { message: 'Numaric value is required.', params: '^[0-9]*$', maxLength: "10" } });
        self.CollectedAmount = ko.observable(0.00).extend({ pattern: { message: 'Numaric value is required.', params: '^[0-9]*$', maxLength: "10" } });
        self.CourseFee = ko.observable(0.00).extend({ pattern: { message: 'Numaric value is required.', params: '^[0-9]*$', maxLength: "10" } });
        self.MRNo = ko.observable();
        self.Due = ko.observable(0.00).extend({ pattern: { message: 'Numaric value is required.', params: '^[0-9]*$', maxLength: "10" } });
        self.IsChecked = ko.observable(false);
        self.IsDue = ko.observable(true);
        self.LoadData = function (data) {
            self.PendingId(data.PendingId);
            self.TraineeId(data.TraineeId);
            self.MRNo(data.MRNo);
            self.Course(data.Course);
            self.CourseName(data.CourseName);
            self.TotalAmount(data.TotalAmount);
            self.CollectedAmount(data.CollectedAmount);
            self.CourseFee(data.CourseFee);
            self.IsChecked(data.IsChecked);
            self.Due(data.Due);
            self.ForYear = ko.observable(data.ForYear);
            self.IsDue(data.IsDue);
        }
    }
    function feeCollection() {
        var self = this;
        self.TraineeId = ko.observable();
        self.PendingFeeId = ko.observable();
        self.Course = ko.observable().extend({ required: true});
        self.CourseName = ko.observable();
        self.SubscriptionDate = ko.observable(moment());
        self.SubscriptionDateTxt = ko.observable();
        self.ChequeDate = ko.observable(moment());
        self.ChequeDatetxt = ko.observable();
        self.ForYear = ko.observable().extend({ required: true });
        self.PayType = ko.observable();
        self.Bank = ko.observable();
        self.PendingFeeList = ko.observableArray([]);
        self.IsChequeVisible = ko.observable(true);
        self.ChequeNo = ko.observable();
        self.CollectedAmount = ko.observable(0.00).extend({ pattern: { message: 'Numaric value is required.', params: '^[0-9]*$', maxLength: "10" } });
        self.Due = ko.observable(0.00).extend({ pattern: { message: 'Numaric value is required.', params: '^[0-9]*$', maxLength: "10" } });
        self.LoadData = function (data) {
            self.TraineeId(data.TraineeId);
            self.Course(data.Course);
            self.SubscriptionDate(data.SubscriptionDate);
            self.ChequeDate(moment());
            self.ChequeDatetxt(data.ChequeDatetxt)
            self.PendingFeeId(data.PendingFeeId);
            self.Bank(data.Bank);
            self.ForYear(data.ForYear);
            self.PayType(data.PayType);
            self.CollectedAmount(data.CollectedAmount);
            self.ChequeNo(data.ChequeNo);
            self.Due(data.Due);
            self.PendingFeeList(data.PendingFeeList);
        }
        self.Reset = function () {
            self.Course('');
            self.CollectedAmount('');
            self.ChequeNo('');
            self.Bank('');
            self.ForYear('');
        };

        self.Course.subscribe(function () {
            if (self.Course() > 0) {
                ko.utils.arrayForEach(self.PendingFeeList(), function (fee) {
                    
                    if (fee.Course() == self.Course()) {
                        self.CollectedAmount(fee.Due());
                        self.PendingFeeId(fee.PendingId());
                        //console.log(self.PendingFeeId());
                        self.ForYear(fee.ForYear());
                    }
                });

            }
        });
        
    }
    function TraineeDetails() {
        var self = this;
        self.Id = ko.observable('');
       
        self.TraineeNo = ko.observable('');
        self.Name = ko.observable('');
        self.Batch = ko.observable('');
        self.TotalFeeAmount = ko.observable('');
        self.TotalCollectedAmount = ko.observable('');
        self.DiscountAmount = ko.observable('');
        self.Phone = ko.observable();

        self.TraineeId = ko.observable();
        self.BankAccHead = ko.observable('');
        self.Trainee = ko.observable('');
        self.Course = ko.observable();
        self.SubscriptionDate = ko.observable(moment());
        self.ForYear = ko.observable('');
        self.PayType = ko.observable('').extend({ required: true });
        self.MRAuthorizedPerson = ko.observable('').extend({ required: true });
        self.CollectedAmount = ko.observable('');
        self.Description = ko.observable('').extend({ required: true });
        self.PendingFeeList = ko.observableArray([]);
        self.CourseList = ko.observableArray([]);
        self.Payments = ko.observableArray([]);
        self.Collection = ko.observableArray([]);
        self.Heads = ko.observableArray([]);
        self.Years = ko.observableArray([]);
        self.FiscalYears = ko.observableArray();
        self.SelectPayType = ko.observable(true);
        self.CheckFee = ko.observable(false);
        self.IsDuplicate = ko.observable(false);

        self.GetCourses = function () {
            var saveData = ko.observableArray([]);
            $.each(self.PendingFeeList(), function (index, value) {
                if (value.IsChecked() == true) {
                    saveData.push(value.Course);

                }
            });
            return $.ajax({
                type: "POST",
                url: '/Membership/CourseFeeCollection/GetCourses',
                data: ko.toJSON(saveData),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.CourseList(data);
                },
                error: function (error) {

                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
        var i = 0;
        for (i = new Date().getFullYear() ; i > 1900; i--) {
            $('#yearpicker').append($('<option />').val(i).html(i));
        }
       
        self.PayType.subscribe(function () {
            if (self.PayType() == 1) {
                self.CheckFee(false);
            }
            else {
                self.CheckFee(true);
            }

        });

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

        self.LoadInitial = function () {
            $.getJSON("/Membership/CourseFeeCollection/GetPendingCourseFeeTraineeWise?traineeId=" + self.Id(), null, function (data) {
                self.TraineeNo(data.TraineeNo);
                self.Name(data.Name);
                self.Phone(data.Phone);
                $.each(data.PendingFeeList,
                           function (index, value) {
                               var aDetail = new Pendings();
                               if (typeof (value) != 'undefined') {
                                   aDetail.LoadData(value);
                                   self.PendingFeeList.push(aDetail);
                                   
                               }
                           });
              
                self.GetBankAccHeads();
                self.GetPaymentTypes();
                self.GetYears();
            });
        };
        self.TotalPendingAmount = ko.computed(function () {
           // var selctedfees = ko.observableArray([]);
            var totalAmount = 0;
            var result = 0.0;
            $.each(self.PendingFeeList(), function (index, value) {
                if (value.IsChecked() == true) {
                    totalAmount += parseFloat(value.Due() ? value.Due() : 0);
                   
                }

            });
           
            self.GetCourses();
            result = totalAmount;
            return result.toFixed(2);
        });
        self.TotalPayableAmount = ko.computed(function () {
            var totalAmount = 0;
            var result = 0.0;
            $.each(self.Payments(), function (index, value) {
                if (self.TotalPendingAmount() > totalAmount) {
                    totalAmount += parseFloat(value.CollectedAmount() ? value.CollectedAmount() : 0);
                        //$('#successModal').modal('show');
                        //$('#successModalText').text("Amount is greater than due");
                } else {
                    self.Payments.remove(value);
                    result = totalAmount;
                    return result.toFixed(2);
                }
            });
            result = totalAmount;
            return result.toFixed(2);
        });

        self.AddPayments = function () {
            
            if (self.TotalPendingAmount() > 0)
            {
                var payment = new feeCollection();
                payment.TraineeId(self.Id());
                payment.PendingFeeList(self.PendingFeeList());
                if (self.PayType() == 1)
                    payment.IsChequeVisible(false);
                else
                    payment.IsChequeVisible(true);

                $.each(self.Payments(), function (key, value) {
                    if (payment.Course() == value.Course()) {
                        self.IsDuplicate(true);
                    }
                    else {
                        self.IsDuplicate(false);
                    }
                });

                if (self.IsDuplicate() == false) {

                    self.Payments.push(payment);
                    payment.Reset();
                    self.SelectPayType(false);
                    self.GetCourses();
                }
                else {
                    $('#successModal').modal('show');
                    $('#successModalText').text("This row already exist!");
                    payment.Reset();
                }

                
            }
            else
            {
                $('#successModalText').text('');
                $('#successModal').modal('show');
                $('#successModalText').text("Please Select a Course Fee First!");
            }
           
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
        self.RemovedPayments = ko.observableArray([]);
        self.RemovePayments = function (line) {
            line.Reset();
           self.Payments.remove(line);
        }
        /////////////////Newly Modified
        
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

        self.LoadAfterSubmit = function () {
            self.PendingFeeList([]);
            $.getJSON("/Membership/CourseFeeCollection/GetPendingCourseFeeTraineeWise/?traineeId=" + self.Id(), null, function (data) {
                self.TraineeNo(data.TraineeNo);
                self.Name(data.Name);
                self.Phone(data.Phone);
                $.each(data.PendingFeeList,
                           function (index, value) {
                               //console.log("data.PendingFeeList : " + ko.toJSON(value));
                               var aDetail = new Pendings();
                               if (typeof (value) != 'undefined') {
                                   aDetail.LoadData(value);
                                   //console.log("aDetail : " + ko.toJSON(aDetail));

                                   self.PendingFeeList.push(aDetail);
                               }
                           });

                self.GetPaymentTypes();

            });
        };
       
        

        self.Reset = function () {
            self.SelectPayType(true);
            self.CheckFee(true);
            self.PayType('');
            self.Payments([]);
        }

        self.Submit = function () {
            //if (value.IsRequired() && !value.IsObtained()) {
            if (parseFloat(self.TotalPayableAmount()) <= parseFloat(self.TotalPendingAmount())) {
                var payable = ko.observableArray([]);
                $.each(self.Payments(),
                function (index, value) {
                    payable.push({
                        TraineeId: value.TraineeId(),
                        Course: value.Course(),
                        SubscriptionDate: value.SubscriptionDate(),
                        SubscriptionDateTxt: moment(value.SubscriptionDate()).format("DD/MM/YYYY"),
                        ChequeDate: value.ChequeDate(),
                        ChequeDateTxt: moment(value.ChequeDate()).format("DD/MM/YYYY"),
                        ForYear: value.ForYear(),
                        Bank: value.Bank(),
                        PendingFeeId: value.PendingFeeId,
                        //PayType: value.PayType(),
                        CollectedAmount: value.CollectedAmount(),
                        ChequeNo: value.ChequeNo()
                        //TotalPayableAmount: self.TotalPayableAmount()
                    });
                });
                var submitData = {
                    FeeCollectionTrans: payable,
                    PendingFeeList: self.PendingFeeList(),
                    TotalPayableAmount: self.TotalPayableAmount(),
                    BankAccHead: self.BankAccHead(),
                    PayType: self.PayType(),
                    Description: self.Description(),
                    MRAuthorizedPerson: self.MRAuthorizedPerson()
                }
                if (self.PayType() != 1 && self.BankAccHead() == null) {
                    $('#successModal').modal('show');
                    $('#successModalText').text('Please Select a Bank Account!');
                }
                else {
                    if (self.IsValid()) {
                        $.ajax({
                            type: "POST",
                            url: '/Membership/CourseFeeCollection/SaveFeePayment/',
                            data: ko.toJSON(submitData),
                            contentType: "application/json",
                            success: function (data) {
                                self.LoadAfterSubmit();
                                self.Payments([]);
                                $('#successModal').modal('show');
                                $('#successModalText').text(data.Message);
                                if (data.MrId)
                                    $('#successModalLinks').append("<a class='btn btn-success' target='_blank' href='/Membership/FeeCollection/GetMoneyReceiptById?mtype=1&reportTypeId=PDF&receiptId=" + data.MrId + "'>Money Receipt</a>");
                                if (data.VoucherNo)
                                    $('#successModalLinks').append("<a class='btn btn-success' target='_blank' href='/Accounts/Accounts/GetVoucherPrintByVoucherNo?reportTypeId=PDF&voucherNo=" + data.VoucherNo + "&companyProfileId=" + data.CompanyId + "'>Voucher</a>");
                                //$('#successModalLinks').append("<a class='btn btn-success' target='_blank' href='/Membership/CourseFeeCollection/GetMoneyReceiptById?reportTypeId=PDF&receiptId=" + data.MrId + "'>Money Receipt</a>");

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
                $('#successModalText').text('Full Amount Need to be Paid');
            }
        };

      
        self.queryString = function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));

        }

        /////////////////////////
        self.sparepartErrors = ko.computed(function () {
            var totalErrors = 0;
            $.each(self.Payments(), function (index, value) {
                var selferror = ko.validation.group(value);
                totalErrors += selferror().length;
            });
            return totalErrors;
        });

        self.errors = ko.validation.group(self);
        self.IsValid = ko.computed(function () {
            if (self.errors().length == 0 && self.sparepartErrors() == 0)
                return true;
            return false;
        });
        
    }

    var vm = new TraineeDetails();
    var qValue = vm.queryString('Id');
    vm.Id(qValue);
    vm.LoadInitial();
    ko.applyBindings(vm, document.getElementById("traineeDetails"));
});