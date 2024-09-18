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
        self.IsQuantitive = ko.observable('');
        self.Quantity = ko.observable('');
        self.LoadData = function (data) {
            self.IsChecked(data.IsChecked);
            self.Id(data.Id);
            self.NameOfOrganization(data.NameOfOrganization);
            self.OwnershipStatusName(data.OwnershipStatusName);
            self.OwnershipStatus(data.OwnershipStatus);
            self.ZoneName(data.ZoneName);
            self.Zone(data.Zone);
            self.IssueDate(moment(data.IssueDate).format('DD/MM/YYYY'));
            self.IsQuantitive(true);
            //self.Quantity(data.Quantity);
        }
       

    }
    function FeeSelectionForMembersVM() {
        var self = this;
        var count = 0;
        self.Zone = ko.observable();
        self.Division = ko.observable();
        self.Name = ko.observable('');

        self.FeeTypes = ko.observableArray([]);
        self.FeeTypeId = ko.observable('');
        self.Zones = ko.observableArray([]);
        self.Divisions = ko.observableArray([]);
        self.Members = ko.observableArray([]);
        self.FeeTypeIds = ko.observableArray([]);
        //self.Disable = ko.observable(false);
        //self.IsChecked = ko.observable(false);
        //self.IsChecked.subscribe(function () {
        //    if (self.IsChecked() == true) {
        //        count = count + 1;
        //    }
        //    else {
        //        count = count - 1;
        //    }
            
        //});

        //self.Disable = ko.computed(function () {
        //    if (count > 0)
        //        return true;
        //    else
        //        return false;
        //});
        self.Submit = function () {
            self.FeeTypeIds([]);
            self.FeeTypeIds.push(self.FeeTypeId);
            var submitData = {
                FeeTypeIds: self.FeeTypeIds,
                Members: self.Members //application stage for underprocess at CRM
            };
            if (self.FeeTypeIds().length > 0 && self.Members().length > 0) {
                $.ajax({
                    url: '/Membership/FeeCollection/SaveMemberFeeCollectionRenewal',
                    type: 'POST',
                    contentType: 'application/json',
                    data: ko.toJSON(submitData),
                    success: function (data) {
                        self.Members([]);
                        self.FeeTypeIds([]);
                        $('#successModal').modal('show');
                        $('#successModalText').text(data.Message);

                    },
                    error: function (error) {
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            }
            else {
                $('#successModal').modal('show');
                $('#successModalText').text('Please select  Fees and Members');
            }
        }

        self.GetFeeTypes = function () {
            return $.ajax({
                type: "GET",
                url: '/Membership/FeeCollection/GetQuantitiveFeetypes',
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
            self.Members([]);
            self.FeeTypeIds([]);
            self.FeeTypeIds.push(self.FeeTypeId);
            var submitData = {
                feeTypeIds: self.FeeTypeIds(),
                zone: self.Zone(),
                division: self.Division(),
                name: self.Name()
            };
            if (self.FeeTypeIds().length > 0) {
                 $.ajax({
                    type: "POST",
                    url: '/Membership/FeeCollection/GetEmployeesForFeeCollection',
                    contentType: "application/json;",
                    data: ko.toJSON(submitData),
                    dataType: "json",
                    success: function (data) {
                        $.each(data, function (index, value) {
                            var aDetail = new member();
                            if (typeof (value) != 'undefined') {
                                aDetail.IsQuantitive('true');
                                aDetail.LoadData(value);
                                self.Members.push(aDetail);
                            }
                        });
                        //self.Members(data);
                    },
                    error: function (error) {
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            }
            else {
                $('#successModal').modal('show');
                $('#successModalText').text('Please select Fee First');
            }
        }

        self.Initialize = function () {
            self.GetFeeTypes();
            self.GetZones();
            self.GetDivisions();
        }
    }

    var pavm = new FeeSelectionForMembersVM();
    pavm.Initialize();
    ko.applyBindings(pavm, document.getElementById("FeeSelectionForMembersDiv"));
});