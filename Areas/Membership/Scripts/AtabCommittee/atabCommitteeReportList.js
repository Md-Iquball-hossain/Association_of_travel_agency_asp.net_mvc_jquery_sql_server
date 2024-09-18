$(document).ready(function () {
    function IUOSlipVM() {
        var self = this;
        //self.Type = ko.observable();
        self.PageData = ko.observableArray(pageData);
        self.CommitteeTypes = ko.observableArray([]);
        self.AtabCommitteeList = ko.observableArray([]);
        //self.FromDate = ko.observable(fromDate ? moment(fromDate, "DD/MM/YYYY") : moment());
        //self.ToDate = ko.observable(toDate ? moment(toDate, "DD/MM/YYYY") : moment());
        //self.FromDate.subscribe(function () {
        //    $('#fromDate').val(moment(self.FromDate()).format("DD/MM/YYYY"));
        //});
        //self.ToDate.subscribe(function () {
        //    $('#toDate').val(moment(self.ToDate()).format("DD/MM/YYYY"));
        //});
        self.Link1 = ko.observable();
        self.Link2 = ko.observable();
        self.Link3 = ko.observable();
        self.Title1 = ko.observable('PDF');
        self.Title2 = ko.observable('Excel');
        self.Title3 = ko.observable('Word');
        self.setUrl = ko.computed(function () {
            self.Link1('/Membership/AtabCommittee/GetAtabCommitteeReportList?reportTypeId=PDF&search=' + searchString + '&type=' + committeeType + '&range=' + range); //range moment(self.FromDate()).format("DD/MM/YYYY") + '&toDate=' + moment(self.ToDate()).format("DD/MM/YYYY")
            self.Link2('/Membership/AtabCommittee/GetAtabCommitteeReportList?reportTypeId=Excel&search=' + searchString + '&type=' + committeeType + '&range=' + range);
            self.Link3('/Membership/AtabCommittee/GetAtabCommitteeReportList?reportTypeId=Word&search=' + searchString + '&type=' + committeeType + '&range=' + range);
        });

        self.GetCommitteeTypes = function () {
            return $.ajax({
                type: "GET",
                url: '/Membership/Settings/GetCommitteeTypes',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.CommitteeTypes(data);
                },
                error: function (error) {

                    $('#successModal').modal('show');
                    $('#successModalText').text(error.status + "<--save and--> " + error.statusText);
                }
            });
        }
        self.GetTimeRanges = function () {
            return $.ajax({
                type: "GET",
                url: '/Membership/AtabCommittee/GetAllAtabCommitteeList',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.AtabCommitteeList(data);
                },
                error: function (error) {

                    $('#successModal').modal('show');
                    $('#successModalText').text(error.status + "<--save and--> " + error.statusText);
                }
            });
        }
        self.Adjust = function (data) {
            var parameters = [{
                Name: 'Id',
                Value: data.Id
            }];
            var menuInfo = {
                Id: 93,
                Menu: 'Atab Committee',
                Url: '/Membership/AtabCommittee/Index',
                Parameters: parameters
            }
            window.parent.AddTabFromExternal(menuInfo);
        }
    }
    var pavm = new IUOSlipVM();
    pavm.GetCommitteeTypes();
    pavm.GetTimeRanges();
    ko.applyBindings(pavm, document.getElementById("IUOSlipList"));
});