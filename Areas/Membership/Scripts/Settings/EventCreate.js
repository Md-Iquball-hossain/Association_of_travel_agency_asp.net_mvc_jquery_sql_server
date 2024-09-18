/// <reference path="../knockout-3.4.0.debug.js" />
/// <reference path="../jquery-2.1.4.js" />
/// <reference path="../finix.util.js" />
/// <reference path="~/Scripts/knockout.validation.min.js" />
$(document).ready(function () {

    function EventVm() {

        var self = this;
        self.Id = ko.observable();
        self.MemberType = ko.observableArray([]);
        self.MemberTypeId = ko.observable();
        self.Tittle = ko.observable();
        self.Description = ko.observable();
        self.EventAddress = ko.observable();
        self.EventType = ko.observable();
        self.EventDate = ko.observable();
        self.RegistrationStartDate = ko.observable();
        self.RegistrationEndDate = ko.observable();
        self.CompanyProfileId = ko.observable(userCompanyId);
        
        self.GetAllEventType = function () {
            //self.CompanyList([]);
            return $.ajax({
                type: "GET",
                url: '/Membership/Settings/GetAllEventType',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.MemberType(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        };
        self.SaveEvent = function () {
            var saveData = {
                Id: self.Id() ? self.Id() : 0,
                Tittle: self.Tittle(),
                Description: self.Description(),
                EventAddress: self.EventAddress(),
                EventType: self.EventType(),
                EventDate: self.EventDate(),
                RegistrationStartDate: self.RegistrationStartDate(),
                RegistrationEndDate: self.RegistrationEndDate(),
                CompanyProfileId: self.CompanyProfileId()
            };
            $.ajax({
                type: "POST",
                url: '/Membership/Settings/SaveEvent',
                data: ko.toJSON(saveData),
                contentType: "application/json",
                success: function (data) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(data.Message);

                },
                error: function () {
                    alert(error.status + "<--save and--> " + error.statusText);
                }
            });
        }
        self.LoadEvent = function () {
            if (self.Id() > 0) {
                return $.ajax({
                    type: "GET",
                    url: "/Membership/Settings/GetEventById?Id=" + self.Id(),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        self.Id(data.Id);
                        self.Tittle(data.Tittle);
                        self.Description(data.Description);
                        self.EventAddress(data.EventAddress);
                        
                        $.when(self.GetAllEventType()).done(function () {
                            if (data.EventType !== null) {
                                self.EventType(data.EventType);
                            }
                        });
                        
                        self.EventDate(moment(data.EventDate));
                        self.RegistrationStartDate(moment(data.RegistrationStartDate));
                        self.RegistrationEndDate(moment(data.RegistrationEndDate));

                    },
                    error: function (error) {
                        alert(error.status + "<--and--> " + error.statusText);
                        //self.isLoading(self.isLoading() - 1);
                    }
                });
            }
        }
        self.InitialValueLoad = function () {
            self.GetAllEventType();
            self.LoadEvent();
        };
        self.queryString = function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        };
    }
    var vm = new EventVm();
    
    vm.Id(vm.queryString("Id"));
    vm.InitialValueLoad();
    ko.applyBindings(vm, $('#EventVm')[0]);
})