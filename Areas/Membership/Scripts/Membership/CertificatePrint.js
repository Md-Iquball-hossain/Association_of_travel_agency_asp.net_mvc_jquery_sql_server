$(document).ready(function () {
    function CertificatePrintVM() {
        var self = this;
        self.Id = ko.observable();
        self.CertificateNo = ko.observable();
        self.Certificate = ko.observable();
        self.CertificateRegisterId = ko.observable();
        self.CertificateStatus = ko.observable();
        self.IssueDate = ko.observable(moment());
        self.ExpiryDate = ko.observable(moment());
        self.IssuedBy = ko.observable();
        self.IssuedPerson = ko.observable('');
        self.MemberNo = ko.observable();
        self.TransactionDate = ko.observable();
        self.CertificateType = ko.observable();
        self.CTypes = ko.observableArray([]);
        self.Books = ko.observableArray([]);
        self.CertificateNoList = ko.observableArray([]);
        self.CertificateList = ko.observableArray([]);
        
        self.Certificate.subscribe(function () {
            self.CertificateNo(self.Certificate().key);
            self.Id(self.Certificate().value);
        });

        self.loadTypes = function () {
            self.CTypes([]);
            var currentCompany = 1;
            return $.ajax({
                type: "GET",
                url: '/Membership/Settings/GetCertificateTypes?companyid=' + currentCompany,
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

        self.loadBooks = function () {
            return $.ajax({
                type: "GET",
                url: '/Membership/Membership/GetCertificateBooks?type=' + self.CertificateType(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.Books(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        };

        self.LoadAvailableList = function (searchTerm, callback) {
            var submitData = {
                prefix: searchTerm,
                exclusionList: self.CertificateNoList()
            };
            if (self.CertificateRegisterId() > 0) {
            $.ajax({
                type: "POST",
                url: '/Membership/Membership/GetAvailableCertificateNo?bookid=' + self.CertificateRegisterId(),
                data: ko.toJSON(submitData),
                contentType: "application/json",
                success: function () {
                },
                error: function () {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            }).done(callback);
            }
            else {
                $('#successModal').modal('show');
                $('#successModalText').text('Please select a Register!');
            }
        };

        self.saveCertificate = function () {
                $.ajax({
                    type: "POST",
                    url: '/Membership/Membership/SaveCertificate',
                    data: ko.toJSON(this),
                    contentType: "application/json",
                    success: function (data) {
                        //console.log("Save certificate data=" + ko.toJSON(this));
                        $('#successModal').modal('show');
                        $('#successModalText').text(data.Message);
                        self.getcertificateList();
                    },
                    error: function () {
                        $('#successModal').modal('show');
                        $('#successModalText').text(error.status + "<--and--> " + error.statusText);

                    }
                });
          };

        self.getcertificateList = function () {
            return $.ajax({
                type: "GET",
                url: '/Membership/Membership/CertificateList?memid=' + self.MemberNo(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.CertificateList(data);

                },
                error: function (error) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(error.status + "<--and--> " + error.statusText);
                }
            });
            //Ends Here
        }

        self.LoadCertificate = function (data) {
            if (data.Id > 0) {
                return $.ajax({
                    type: "GET",
                    url: '/Membership/Membership/CertificatebyId?cerid=' + data.Id,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        console.log("data=" + ko.toJSON(data));
                        self.CertificateType(data.CertificateType ? data.CertificateType : '');
                        self.Certificate(data.CertificateNo ? data.CertificateNo : '');
                        
                        self.CertificateStatus(data.CertificateStatus ? data.CertificateStatus : '');
                        self.IssueDate(data.IssueDate ? moment(data.IssueDate) : '');
                        self.ExpiryDate(data.ExpiryDate ? moment(data.ExpiryDate) : '');
                        
                        $.when(self.CertificateType()).done(function () {
                            self.loadBooks();
                        });
                        $.when(self.loadBooks()).done(function () {
                            self.CertificateRegisterId(data.CertificateRegisterId ? data.CertificateRegisterId : '');
                        });
                        $.when(self.Certificate()).done(function () {
                            self.CertificateNo(data.CertificateNo);
                            self.Id(data.Id);
                        });
                    },
                    error: function (error) {
                        $('#successModal').modal('show');
                        $('#successModalText').text(error.status + "<--and--> " + error.statusText);
                    }
                });
            }
        }

        self.GetMemberMembershipCertificate = function (data) {
            window.open('/Membership/MembershipReport/GetMemberMembershipCertificate?reportTypeId=PDF&certificateid=' + data.Id, '_blank');

        }

        self.InitialValueLoad = function () {
            self.loadTypes();
            self.getcertificateList();

        };

        self.queryString = function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        };
    }

    var pavm = new CertificatePrintVM();
    pavm.MemberNo(pavm.queryString("MemberId"))
    pavm.InitialValueLoad();
    ko.applyBindings(pavm, document.getElementById("CertificatePrintDiv"));
});