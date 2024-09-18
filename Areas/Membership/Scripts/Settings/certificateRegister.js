/// <reference path="../knockout-3.4.0.debug.js" />
/// <reference path="../jquery-2.1.4.js" />
/// <reference path="../finix.util.js" />
/// <reference path="~/Scripts/knockout.validation.min.js" />

$(document).ready(function () {

    ko.validation.init({
        errorElementClass: 'has-error',
        errorMessageClass: 'help-block',
        decorateInputElement: true
    });
    function CertificateRegisterDetail() {
        var self = this;

        self.CertificateNo = ko.observable();
        self.CertificateRegisterId = ko.observable();
        self.CertificateStatus = ko.observable();
        self.IssueDate = ko.observable();
        self.ExpiryDate = ko.observable();
        self.IssuedBy = ko.observable();
        self.IssuedPerson = ko.observable('');
        self.MemberNo = ko.observable();
        self.TraineeNo = ko.observable();
        self.TransactionDate = ko.observable();
       
    }

    function CertificateRegisterVm() {

        var self = this;

        self.Id = ko.observable();
        self.CompanyList = ko.observableArray([]);
        self.CTypes = ko.observableArray([]);
        self.CompanyProfileId = ko.observable();
        self.CertificateName = ko.observable('').extend({ required: true });//.extend({ required: { message: 'Only alphanumeric valu required.' }, params: '^[a-zA-Z]', minLength: 3 });
        
        self.BookIssueDate = ko.observable(moment());
        self.Details = ko.observableArray([]);
        self.Prefix = ko.observable('');
        self.StartingNumber = ko.observable(0);
        self.EndingNumber = ko.observable(0);
        self.TotalPages = ko.observable(0);
        self.CertificateType = ko.observable();

        self.EndingNumber = ko.computed(function () {
            var result = 0;
            var pages = self.TotalPages();
            var strating = self.StartingNumber();
            result = Number(strating) + Number(pages);
            return result;
            });
  
        self.Reset = function () {
            self.Id('');
            //self.CompanyList([]);
            //self.CertificateName('');
            self.BookIssueDate('');
            self.Prefix('');
            self.StartingNumber(0);
            self.EndingNumber(0);
            self.TotalPages(0);
            self.CertificateType();
            self.Details([]);
        };

        self.saveCertificateBook = function () {
           
            var saveData = {
                Id: self.Id() ? self.Id() : 0,
                CompanyProfileId: self.CompanyProfileId(),
                CertificateName: self.CertificateName(),
                BookIssueDate: self.BookIssueDate(),
                Details: self.Details(),
                Prefix: self.Prefix(),
                StartingNumber: self.StartingNumber(),
                TotalPages: self.TotalPages(),
                EndingNumber: self.EndingNumber(),
                CertificateType: self.CertificateType()
            };
           // console.log(saveData);
            $.ajax({
                type: "POST",
                url: '/Membership/Settings/SaveCertificateRegister',
                data: ko.toJSON(saveData),
                contentType: "application/json",
                success: function (data) {
                    self.Reset();
                    $('#successModal').modal('show');
                    $('#successModalText').text(data.Message);
   
                },
                error: function () {
                    alert(error.status + "<--save and--> " + error.statusText);
                }
            });

            //Ends Here
            // } 
            //else {
            //            self.errors.showAllMessages();
            //        }
        };

        self.loadTypes = function () {
            self.CTypes([]);
            //var currentCompany = self.CompanyProfileId() > 0 ? self.CompanyProfileId() : null;
            return $.ajax({
                    type: "GET",
                    url: '/Membership/Settings/GetCertificateTypes',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        self.CTypes(data);
                    },
                    error: function (error) {
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
        };

        self.getAllCompanies = function () {
            if (userCompanyId != null && userCompanyId > 0) {
                self.CompanyProfileId(userCompanyId);
            } else {
                self.CompanyList([]);
                return $.ajax({
                    type: "GET",
                    url: '/Auth/CompanyProfile/GetAllCompanyList',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        self.CompanyList(data);
                    },
                    error: function (error) {
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            }
        }

        self.InitialValueLoad = function () {
            self.getAllCompanies();
            self.loadTypes();
        
        };

        self.errors = ko.validation.group(self);
        self.IsValid = ko.computed(function () {
            var err = self.errors().length;
            if (err == 0)
                return true;
            return false;
        });

       
        //self.editBank = function (data) {
        //    self.Id(data.Id);
        //    self.Name(data.Name);
        //    self.Address(data.Address);
        //    self.PhoneNo(data.PhoneNo);
        //    self.Email(data.Email);
        //    self.Fax(data.Fax);
        //    self.Phone(data.Phone);
        //    self.AccountNo(data.AccountNo);
            
        //};


    }

    var vm = new CertificateRegisterVm();
    vm.InitialValueLoad();

    ko.applyBindings(vm, $('#CertificateRegisterDiv')[0]);
});