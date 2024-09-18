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

    function LocationVm() {

        var self = this;

        self.Id = ko.observable();
        self.LocationTitle = ko.observable().extend({ required: true, pattern: { message: 'Only alphabetical values required.', params: "^[\\w ]+$", maxLength: "100" } });
        self.Details = ko.observable('').extend({  pattern: { message: 'Only alphabetical values required.', params: "^[\\w ]+$", maxLength: "250" } });
        self.ParentID = ko.observable();
        self.ParentName = ko.observable('');
        self.Level = ko.observable().extend({ required: true });
        self.LevelName = ko.observable('');
        self.IsValid = ko.observable(false);
        
        self.Levels = ko.observableArray([]);
        self.Locations = ko.observableArray([]);
        self.Parents = ko.observableArray([]);

        self.Reset = function () {
            self.Id();
            self.LocationTitle();
            self.Details();
            self.ParentID();
           // self.ParentName('');
            self.Level();
           // self.LevelName('');
             };

        self.SaveLocation = function () {
            if (self.IsValid()) {
                $.ajax({
                    type: "POST",
                    url: '/FAMS/Location/SaveLocation',
                    data: ko.toJSON(this),
                    contentType: "application/json",
                    success: function (data) {
                        $('#successModal').modal('show');
                        $('#successModalText').text(data.Message);

                        self.getAllLocations();
                        self.Reset();
                    },
                    error: function () {
                        $('#successModal').modal('show');
                        $('#successModalText').text(error.status + "<--save and--> " + error.statusText);
                       
                    }
                });
            }
            else {
                $('#successModal').modal('show');
                $('#successModalText').text(error.status + "<--save and--> " + error.statusText);
            }

        };

        self.getAllLocations = function () {
           return $.ajax({
                type: "GET",
                url: '/FAMS/Location/getLocations',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.Locations(data);
                },
                error: function (error) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(error.status + "<--save and--> " + error.statusText);
                }
            });
        };

        self.getParents = function () {
          return  $.ajax({
                type: "GET",
                url: '/FAMS/Location/getParents?level=' + self.Level(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.Parents(data);
                },
                error: function (error) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(error.status + "<--save and--> " + error.statusText);
                }
            });
        };

        self.getLevels = function () {

            return $.ajax({
                type: "GET",
                url: '/FAMS/Location/getLocationLevels',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.Levels(data);

                },
                error: function (error) {

                    $('#successModal').modal('show');
                    $('#successModalText').text(error.status + "<--save and--> " + error.statusText);
                }
            });
        }


        self.InitialValueLoad = function () {
            self.getAllLocations();
            self.getLevels();
        };

        

        self.getEditUrl = function (data) {
            return '/FAMS/Location/Edit?id=' + data.Id;
        };

        

        self.editLocation = function (data) {
            
            self.Id(data.Id);
            self.LocationTitle(data.LocationTitle);
            self.Details(data.Details);
            self.Level(data.Level);
            self.LevelName(data.LevelName);
            $.when(self.getParents()).done(function () {
                    self.ParentID(data.ParentID);
                    self.ParentName(data.ParentName);
                });
        };

        self.errors = ko.validation.group(self);
        self.IsValid = ko.computed(function () {
            var err = self.errors().length;
            if (err == 0)
                return true;
            return false;
        });

    }

    var vm = new LocationVm();
    vm.InitialValueLoad();


    ko.applyBindings(vm, $('#LocationDiv')[0]);
});