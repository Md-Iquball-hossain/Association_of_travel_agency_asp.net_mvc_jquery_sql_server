$(document).ready(function () {

    ko.validation.init({
        errorElementClass: 'has-error',
        errorMessageClass: 'help-block',
        decorateInputElement: true
    });


    function AreaVm() {
        var self = this;
        self.Id = ko.observable();
        self.AreaId = ko.observable();
        //self.AreaName = ko.observable();
        self.Name = ko.observable('').extend({ required: true });
        self.CountryId = ko.observable();
        self.CountryName = ko.observable('');
        self.DivisionId = ko.observable().extend({required: true});
        self.DivisionNameEng = ko.observable('');
        self.DistrictId = ko.observable().extend({ required: true });
        self.DistrictNameEng = ko.observable('');
        self.ThanaId = ko.observable().extend({ required: true });
        self.ThanaNameEng = ko.observable('');

        self.AreaList = ko.observableArray([]);
        self.ThanaList = ko.observableArray([]);
        self.DistrictList = ko.observableArray([]);
        self.DivisionList = ko.observableArray([]);



        self.LoadDivisionList = function () {
                return $.ajax({
                    type: "GET",
                    url: '/Membership/Settings/GetDivisionList?countryId=1',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        self.DivisionList(data); //Put the response in ObservableArray
                    },
                    error: function (error) {
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
        }
        self.LoadDistrictList = function () {

                if(self.DivisionId() > 0)
                {
                    return $.ajax({
                        type: "GET",
                        url: '/Membership/Settings/GetDistrictList?divisionId=' + self.DivisionId(),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (data) {
                            self.DistrictList(data); //Put the response in ObservableArray
                        },
                        error: function (error) {
                            alert(error.status + "<--and--> " + error.statusText);
                        }
                    });
                }
        }

        self.LoadThanaList = function () {

            if (self.DistrictId() > 0)
            {
                return $.ajax({
                    type: "GET",
                    url: '/Membership/Settings/GetThanaList?districtId=' + self.DistrictId(),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        self.ThanaList(data); //Put the response in ObservableArray
                    },
                    error: function (error) {
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            }
        }

        self.LoadAreaDetails = function () {
            if (self.Id() > 0) {
                return $.ajax({
                    type: "GET",
                    url: "/Membership/Settings/GetAreaById?Id=" + self.Id(),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        self.Id(data.Id);
                        self.Name(data.Name);
                        
                        $.when(self.LoadDivisionList()).done(function () {                           
                            self.DivisionId(data.DivisionId);
                            $.when(self.LoadDistrictList()).done(function () {
                                self.DistrictId(data.DistrictId);
                                $.when(self.LoadThanaList()).done(function () {
                                    self.ThanaId(data.ThanaId);
                                    
                                })
                            })
                        })


                    },
                    error: function (error) {
                        alert(error.status + "<--and--> " + error.statusText);
                        //self.isLoading(self.isLoading() - 1);
                    }
                });
            }
        }
        self.saveArea = function () {
            if (self.IsValid()) {
                $.ajax({
                    type: "POST",
                    url: '/Membership/Settings/SaveArea',
                    data: ko.toJSON(this),
                    contentType: "application/json",
                    success: function (data) {
                        $('#successModal').modal('show');
                        $('#successModalText').text(data.Message);
                    },
                    error: function () {
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            }
            else {
                $('#successModal').modal('show');
                $('#successModalText').text('Please fill all information');
            }
        };



        self.errors = ko.validation.group(self);
        self.IsValid = ko.computed(function () {
            var err = self.errors().length;
            if (err == 0)
                return true;
            return false;
        });
        self.loadInitialData = function () {

            self.LoadAreaDetails();
            self.LoadDivisionList();
            self.LoadDistrictList();
            self.LoadThanaList();
        };
        self.queryString = function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        };

    };
    var vm = new AreaVm();
    vm.Id(vm.queryString("Id"));
    vm.loadInitialData();

    ko.applyBindings(vm, $('#AreaVm')[0]);
});