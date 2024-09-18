$(document).ready(function () {
    function member() {
        var self = this;
        self.IsChecked = ko.observable('');
        self.Id = ko.observable('');
        self.NameOfOrganization = ko.observable('');
        self.OwnershipStatusName = ko.observable('');
        self.OwnershipStatus = ko.observable('');
        self.ZoneName = ko.observable('');
        self.Zone = ko.observable('');
        self.IssueDate = ko.observable('');
        self.LoadData = function (data) {
            self.IsChecked(data.IsChecked);
            self.Id(data.Id);
            self.NameOfOrganization(data.NameOfOrganization);
            self.OwnershipStatusName(data.OwnershipStatusName);
            self.OwnershipStatus(data.OwnershipStatus);
            self.ZoneName(data.ZoneName);
            self.Zone(data.Zone);
            self.IssueDate(moment(data.IssueDate).format('DD/MM/YYYY'));
        }
    }
    function FeeSelectionForMembersVM() {
        var self = this;
        self.Zone = ko.observable();
        self.Division = ko.observable();
        self.Name = ko.observable('');

        self.FeeTypes = ko.observableArray([]);
        self.FeeTypeIds = ko.observableArray([]);
        self.Zones = ko.observableArray([]);
        self.Divisions = ko.observableArray([]);
        self.Members = ko.observableArray([]);

        //Code by Maruf
        self.isLoading = ko.observable(0);
        self.isLoading.subscribe(function () {
            if (self.isLoading() === 1)
                $('#loadingModal').modal('show');
            else if (self.isLoading() === 0)
                $('#loadingModal').modal('hide');
        });
        self.Subject = ko.observable();
        self.NotificationMessage = ko.observable();
        self.Id = ko.observable('');
        //self.MemberIds = ko.observableArray([]);


        self.Submit = function () {
            self.isLoading(self.isLoading() + 1); //Code by Maruf

            var submitData = {
                Members: self.Members, //application stage for underprocess at CRM
                Subject: self.Subject,
                Message: self.NotificationMessage,
                //MemberIds: self.MemberIds
            };
            //console.log(ko.toJSON(self.FeeTypeIds()));
            if (self.Members().length > 0) {
                $.ajax({
                    url: '/Membership/Notification/SaveNotification',
                    type: 'POST',
                    contentType: 'application/json',
                    data: ko.toJSON(submitData),
                    success: function (data) {
                        self.Members([]);
                        //self.FeeTypeIds([]);
                        //self.MemberIds([]);
                        $('#successModal').modal('show');
                        $('#successModalText').text(data.Message);
                        self.isLoading(self.isLoading() - 1); //Code by Maruf
                    },
                    error: function (error) {
                        alert(error.status + "<--and--> " + error.statusText);
                        self.isLoading(self.isLoading() - 1); //Code by Maruf
                    }
                });
            }
        }

        //Code by Maruf
        //self.saveNotification = function () {

        //    var formData = new FormData();

        //    $.each(self.Recipients(),
        //           function (index, value) {
        //               formData.append('MemberIds', value);
        //           });

        //    //formData.append('NotificationId', self.Id());
        //    formData.append('Id', self.Id());
        //    //formData.append('PriorityType', self.PriorityType());
        //    formData.append('Subject', self.Subject());
        //    formData.append('Message', self.NotificationMessage());


        //    $.ajax({
        //        type: "POST",
        //        url: '/Membership/Notification/SaveNotification',
        //        data: formData,
        //        //data: ko.toJSON(formData),
        //        contentType: false,
        //        processData: false,
        //        cache: false,
        //        success: function (data) {
        //            self.Id(data);
        //            $('#successModal').modal('show');
        //            $('#successModalText').text("Notification saved successfully");


        //            //self.GetAllDiv();
        //            //Need to set Issue Date to 
        //        },
        //        error: function (error) {
        //            alert(error.status + "<--and--> " + error.statusText);
        //        }
        //    });
        //}
        //
        self.GetFeeTypes = function () {
            return $.ajax({
                type: "GET",
                url: '/Membership/FeeCollection/GetAllFeetypes',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.FeeTypes(data); //Put the response in ObservableArray
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
        self.GetDivisions = function () {
            return $.ajax({
                type: "GET",
                url: '/Membership/Settings/GetDivisionList?countryId=' + 1,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.Divisions(data); //Put the response in ObservableArray
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
        self.GetZones = function () {
            return $.ajax({
                type: "GET",
                url: '/Membership/Settings/GetZoneList',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.Zones(data); //Put the response in ObservableArray
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }

        self.GetHighlights = function () {
            self.isLoading(self.isLoading() + 1); //Code by Maruf

            self.Members([]);
            var submitData = {
                //feeTypeIds: self.FeeTypeIds(),
                zone: self.Zone(),
                division: self.Division(),
                name: self.Name()
            };
                $.ajax({
                    type: "POST",
                    url: '/Membership/Notification/GetMembersForNotification',
                    contentType: "application/json;charset=utf-8",
                    data: ko.toJSON(submitData),
                    dataType: "json",
                    success: function (data) {
                        $.each(data, function (index, value) {
                            debugger;
                            console.log("ID:" + data);
                            var aDetail = new member();
                            if (typeof (value) != 'undefined') {
                                aDetail.LoadData(value);
                                self.Members.push(aDetail);
                            }
                        });
                        //self.Members(data);
                        self.isLoading(self.isLoading() - 1); //Code by Maruf
                    },
                    error: function (error) {
                        alert(error.status + "<--and--> " + error.statusText);
                        self.isLoading(self.isLoading() - 1); //Code by Maruf
                    }
                });
        }

        self.Initialize = function () {
            self.GetFeeTypes();
            self.GetZones();
            self.GetDivisions();
        }
    }

    var pavm = new FeeSelectionForMembersVM();
    pavm.Initialize();
    ko.applyBindings(pavm, document.getElementById("NotificationDiv"));
});