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

    function LocationReportVm() {

        var self = this;

        self.AssetID = ko.observable();
        self.AssetCode = ko.observable();
        self.AssetName = ko.observable();
        self.ParentID = ko.observable();
        self.ParentName = ko.observable();
        self.CategoryID = ko.observable();
        self.CategoryName = ko.observable();
        self.LocationID = ko.observable();
        self.LocationName = ko.observable();
        self.ParentLocID = ko.observable();
        self.Level = ko.observable();
        self.LevelName = ko.observable();
        self.LevelControl = ko.observable();
        self.LocationControl = ko.observable();

        self.OfficeID = ko.observable();
        self.BuildingID = ko.observable();
        self.FloorID = ko.observable();
        self.RoomID = ko.observable();

        self.showdestoffice = ko.observable(false);
        self.showdestbuilding = ko.observable(false);
        self.showdestfloor = ko.observable(false);
        self.showdestroom = ko.observable(false);

        self.AssetCount = ko.observable();
        self.LocationsSummary = ko.observable([]);
        

        self.Levels = ko.observableArray([]);
        self.LocationsAssets = ko.observableArray([]);
        self.Locations = ko.observableArray([]);

        self.Company = ko.observable(3);
        self.Offices = ko.observable([]);
        self.Buildings = ko.observable([]);
        self.Floors = ko.observable([]);
        self.Rooms = ko.observableArray([]);

        self.Link1 = ko.observable();
        self.Link2 = ko.observable();
        self.Link3 = ko.observable();

        self.Link4 = ko.observable();
        self.Link5 = ko.observable();
        self.Link6 = ko.observable();

        self.LevelControl.subscribe(function () {
            if (self.LevelControl() == 2) //For Office
            {
                self.showdestoffice(true);
                self.showdestbuilding(false);
                self.showdestfloor(false);
                self.showdestroom(false);
                self.getOffices();
            }
            else if (self.LevelControl() == 3)  // For Building
            {
                self.showdestoffice(true);
                self.showdestbuilding(true);
                self.showdestfloor(false);
                self.showdestroom(false);
                self.getOffices();
            }
            else if (self.LevelControl() == 4)  // For Floor
            {
                self.showdestoffice(true);
                self.showdestbuilding(true);
                self.showdestfloor(true);
                self.showdestroom(false);
                self.getOffices();
            }
            else   // For Room
            {
                self.showdestoffice(true);
                self.showdestbuilding(true);
                self.showdestfloor(true);
                self.showdestroom(true);
                self.getOffices();
            }
        });
        self.OfficeID.subscribe(function () {
            if (self.OfficeID()) {
                self.LocationControl(self.OfficeID());
                self.getBuildings();
                self.getAllLocationsAssets();
                self.getLocationsSummary();
            }
            else {
                self.BuildingID();
                self.FloorID();
                self.RoomID();
            }
         });
        self.BuildingID.subscribe(function () {
            if (self.BuildingID())
            {
            self.LocationControl(self.BuildingID());
            //self.getFloors();
            self.getAllLocationsAssets();
            self.getLocationsSummary();
            }
            else {
                self.FloorID();
                self.RoomID();
            }
         });
        self.FloorID.subscribe(function () {
            if (self.FloorID())
            {
            self.LocationControl(self.FloorID());
            //self.getRooms();
            self.getAllLocationsAssets();
            self.getLocationsSummary();
            }
        
        else {
                self.BuildingID();
                self.FloorID();
                self.RoomID();
             }
          });
        self.RoomID.subscribe(function () {
            if (self.RoomID()) {
                self.LocationControl(self.RoomID());
                self.getLocationsSummary();
            }
            else {
                self.RoomID();
            }
        });
       
       self.getOffices = function () {
            return $.ajax({
                type: "GET",
                url: '/FAMS/LocationReport/getLocationsByLevel?level=2&parent=' + self.Company(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.Offices(data);
                },
                error: function (error) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(error.status + "<--save and--> " + error.statusText);
                }
            });
        };
       self.getBuildings = function () {
           if (self.OfficeID() > 0)
           {
               return $.ajax({
                   type: "GET",
                   url: '/FAMS/LocationReport/getLocationsByLevel?level=3&parent=' + self.OfficeID(),
                   contentType: "application/json; charset=utf-8",
                   dataType: "json",
                   success: function (data) {
                       self.Buildings(data);

                   },
                   error: function (error) {
                       $('#successModal').modal('show');
                       $('#successModalText').text(error.status + "<--save and--> " + error.statusText);
                   }
               });
           }
           else
           {
               $('#successModal').modal('show');
               $('#successModalText').text('Please Select a Office!');
           }
           
       };
       self.getFloors = function () {
           if (self.BuildingID() > 0) {
               return $.ajax({
                   type: "GET",
                   url: '/FAMS/LocationReport/getLocationsByLevel?level=4&parent=' + self.BuildingID(),
                   contentType: "application/json; charset=utf-8",
                   dataType: "json",
                   success: function (data) {
                       self.Floors(data);

                   },
                   error: function (error) {
                       $('#successModal').modal('show');
                       $('#successModalText').text(error.status + "<--save and--> " + error.statusText);
                   }
               });
           }
           else {
               $('#successModal').modal('show');
               $('#successModalText').text('Please Select a Building!');
           }
       };
       self.getRooms = function () {
           if (self.FloorID() > 0) {
               return $.ajax({
                   type: "GET",
                   url: '/FAMS/LocationReport/getLocationsByLevel?level=5&parent=' + self.FloorID(),
                   contentType: "application/json; charset=utf-8",
                   dataType: "json",
                   success: function (data) {
                       self.Rooms(data);

                   },
                   error: function (error) {
                       $('#successModal').modal('show');
                       $('#successModalText').text(error.status + "<--save and--> " + error.statusText);
                   }
               });
           }
           else {
               $('#successModal').modal('show');
               $('#successModalText').text('Please select a Floor!');
           }
       };

        self.getAllLocationsAssets = function () {
            return $.ajax({
                type: "GET",
                url: '/FAMS/LocationReport/LocationDetailsReport?level=' + self.LevelControl() + '&locid=' + self.LocationControl(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.LocationsAssets(data);
                    
                   
                },
                error: function (error) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(error.status + "<--save and--> " + error.statusText);
                }
            });
        };

        self.getLocationsSummary = function () {
            return $.ajax({
                type: "GET",
                url: '/FAMS/LocationReport/LocationSummaryReport?level=' + self.LevelControl() + '&locid=' + self.LocationControl(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.LocationsSummary(data);
                    //if (self.LevelControl() > 0)
                    //    self.getLocations();
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
                url: '/FAMS/LocationReport/getLocationLevels',
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

        self.setUrl = ko.computed(function () {


            self.Link1('/FAMS/LocationReport/GetReportLocationDetails?reportTypeId=PDF&level=' + self.LevelControl() + '&locid=' + self.LocationControl() + '&office=' + self.OfficeID() + '&building=' + self.BuildingID() + '&floor=' + self.FloorID() + '&room=' + self.RoomID());
            self.Link2('/FAMS/LocationReport/GetReportLocationDetails?reportTypeId=Excel&level=' + self.LevelControl() + '&locid=' + self.LocationControl() + '&office=' + self.OfficeID() + '&building=' + self.BuildingID() + '&floor=' + self.FloorID() + '&room=' + self.RoomID());
            self.Link3('/FAMS/LocationReport/GetReportLocationDetails?reportTypeId=Word&level=' + self.LevelControl() + '&locid=' + self.LocationControl() + '&office=' + self.OfficeID() + '&building=' + self.BuildingID() + '&floor=' + self.FloorID() + '&room=' + self.RoomID());

            self.Link4('/FAMS/LocationReport/GetReportLocationSummary?reportTypeId=PDF&level=' + self.LevelControl() + '&locid=' + self.LocationControl() + '&office=' + self.OfficeID() + '&building=' + self.BuildingID() + '&floor=' + self.FloorID() + '&room=' + self.RoomID());
            self.Link5('/FAMS/LocationReport/GetReportLocationSummary?reportTypeId=Excel&level=' + self.LevelControl() + '&locid=' + self.LocationControl() + '&office=' + self.OfficeID() + '&building=' + self.BuildingID() + '&floor=' + self.FloorID() + '&room=' + self.RoomID());
            self.Link6('/FAMS/LocationReport/GetReportLocationSummary?reportTypeId=Word&level=' + self.LevelControl() + '&locid=' + self.LocationControl() + '&office=' + self.OfficeID() + '&building=' + self.BuildingID() + '&floor=' + self.FloorID() + '&room=' + self.RoomID());

        });

       

        self.InitialValueLoad = function () {
            self.getAllLocationsAssets();
            self.getLocationsSummary();
            self.getLevels();
            self.setUrl();
        };

       

        self.errors = ko.validation.group(self);
        self.IsValid = ko.computed(function () {
            var err = self.errors().length;
            if (err == 0)
                return true;
            return false;
        });

    }

    var vm = new LocationReportVm();
    vm.InitialValueLoad();


    ko.applyBindings(vm, $('#LocationDiv')[0]);
    ko.applyBindings(vm, $('#LocationDivs')[0]);
});