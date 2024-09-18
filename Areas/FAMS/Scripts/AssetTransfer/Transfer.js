var vm = "";
$(document).on("click", '#searchleft', function (event) {
    URL = $('#partialViewLeft a').attr("href");
    event.preventDefault();
    var search = $('#searchString').val();
    var page = getParameterByName(URL, "page");
    var sourceid = vm.SourceID();
    pageLink(search, page, sourceid);
});
function pageLink(search, page, sourceid) {
    $.ajax({
        url: "/FAMS/AssetTransfer/AssetTransferLeft?page=" + page + "&sourceid=" + sourceid + "&searchString=" + search,
        type: "GET",
    })
    .done(function (partialViewResult) {
        $("#partialViewLeft").html(partialViewResult);
    });
}
function pageRLink(search, rpage, destid) {
    $.ajax({
        url: "/FAMS/AssetTransfer/AssetTransferRight?rpage=" + rpage + "&destid=" + destid,
        type: "GET",
    })
    .done(function (partialViewResult) {
        $("#partialViewRight").html(partialViewResult);
    });
}
function getParameterByName(url, name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(url);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};
$(document).on("click", '#partialViewLeft a', function (event) {
    
    URL = $(this).attr("href");
    event.preventDefault();
    var search = getParameterByName(URL, "searchString");
    var page = getParameterByName(URL, "page");
    var sourceid = vm.SourceID();
    pageLink(search, page, sourceid);
});
$(document).on("click", '#partialViewRight a', function (event) {
    
    URL = $(this).attr("href");
    event.preventDefault();
    var rpage = getParameterByName(URL, "rpage");
    var destid =vm.DestinationID();
    pageRLink("", rpage, destid);
});

$(document).ready(function () {

    ko.validation.init({
        errorElementClass: 'has-error',
        errorMessageClass: 'help-block',
        decorateInputElement: true
    });

    function TransferVm() {

        var self = this;
        var currentDate = (new Date()).toISOString().split('T')[0];
        self.SourceAssets = ko.observableArray(trnlogSource);
        self.DestAssets = ko.observableArray(trnlogDest);
        self.Id = ko.observable(0);
        self.AssetID = ko.observable();
        self.AssetName = ko.observable('');
        self.SourceType = ko.observable().extend({ required: true });
        self.DestinationType = ko.observable().extend({ required: true });
        self.TransferType = ko.observable();
        self.TransferTypeName = ko.observable();
        
        self.SourceID = ko.observable();
        self.DestinationID = ko.observable();
        self.SourceEmployeeID = ko.observable().extend({ required: true });
        self.DestinationEmployeeID = ko.observable().extend({ required: true });
        
        self.SourceTitle = ko.observable('');
        self.DestinationTitle = ko.observable('');
        self.SourceSpecificLocation = ko.observable('');
        self.DestinationSpecificLocation = ko.observable('');
        self.TransferDate = ko.observable(moment());
        self.TransferDateText = ko.observable();
        self.TransferDetails = ko.observable();
        self.Pass = ko.observable(false);

        
        //Controling Visibility of the Sources
        self.showemployee = ko.observable(false);
        self.showoffice = ko.observable(false);
        self.showebuilding = ko.observable(false);
        self.showfloor = ko.observable(false);
        self.showroom = ko.observable(false);

        //Controling Visibility of the Destinations
        self.showdestemployee = ko.observable(false);
        self.showdestoffice = ko.observable(false);
        self.showdestbuilding = ko.observable(false);
        self.showdestfloor = ko.observable(false);
        self.showdestroom = ko.observable(false);

        //Values of the Source Dropdowns
        self.OfficeID = ko.observable();
        self.BuildingID = ko.observable();
        self.FloorID = ko.observable();
        self.RoomID = ko.observable();

        //Values of the Destination Dropdowns
        self.DestOfficeID = ko.observable();
        self.DestBuildingID = ko.observable();
        self.DestFloorID = ko.observable();
        self.DestRoomID = ko.observable();

        self.ParentID = ko.observable(3);  //Default Parent=3 for Default Company
        self.Level = ko.observable();
        self.DestLevel = ko.observable();
        self.ExceptionID = ko.observable();
               
        
              
        self.LocationLevel = ko.observableArray([]);

        self.SourceEmployees = ko.observableArray([]);
        self.DestEmployees = ko.observable([]);

        //Sources Arrays
        self.Offices = ko.observable([]);
        self.Buildings = ko.observable([]);
        self.Floors = ko.observable([]);
        self.Rooms = ko.observableArray([]);

        //Destinations Arrays
        self.DestOffices = ko.observable([]);
        self.DestBuildings = ko.observable([]);
        self.DestFloors = ko.observable([]);
        self.DestRooms = ko.observableArray([]);
        
        //Controlling the Source Dropdown 
        self.LoadSources = function () {
            
            if (self.SourceType() == 6) //For Employee
            {
                self.showemployee(true);
                self.showoffice(false);
                self.showebuilding(false);
                self.showfloor(false);
                self.showroom(false);
                self.getSourceEmployees();
                self.DestinationType(6);
                self.TransferType(1);  //Emp-Emp
            }
            else if (self.SourceType() == 2) //For Office
            {
                self.showemployee(false);
                self.showoffice(true);
                self.showebuilding(false);
                self.showfloor(false);
                self.showroom(false);
                //To Load Offices
                self.Level(2);
                self.ParentID(3);
                self.CommonSource();
                //Load Offices End
                self.LoadDestinations();
            }
            else if (self.SourceType() == 3)  // For Building
            {
                self.showemployee(false);
                self.showoffice(true);
                self.showebuilding(true);
                self.showfloor(false);
                self.showroom(false);
                if (self.Offices().length == 0)
                {
                    //To Load Offices
                    self.Level(2);
                    self.ParentID(3);
                    self.CommonSource();
                    //Load Offices End
                }
                
                if (self.OfficeID())
                {
                    //To Load Buildings
                    self.Level(3);
                    self.ParentID(self.OfficeID());
                    self.CommonSource();
                    //Load Buildings End
                }
                
                self.LoadDestinations();
            }
            else if (self.SourceType() == 4)  // For Floor Level=SourceType
            {
                self.showemployee(false);
                self.showoffice(true);
                self.showebuilding(true);
                self.showfloor(true);
                self.showroom(false);
                if (self.Offices().length == 0) {
                    //To Load Offices
                    self.Level(2);
                    self.ParentID(3);
                    self.CommonSource();
                    //Load Offices End
                }
                if (self.OfficeID()) {
                    //To Load Buildings
                    self.Level(3);
                    self.ParentID(self.OfficeID());
                    self.CommonSource();
                    //Load Buildings End
                }
                if (self.BuildingID()) {
                    //To Load Floors
                    self.Level(4);
                    self.ParentID(self.BuildingID());
                    self.CommonSource();
                    //Load Floors End
                }
                self.LoadDestinations();
            }
            else if (self.SourceType() == 5)  // For Room Level=SourceType
            {
                self.showemployee(false);
                self.showoffice(true);
                self.showebuilding(true);
                self.showfloor(true);
                self.showroom(true);
                if (self.Offices().length == 0) {
                    //To Load Offices
                    self.Level(2);
                    self.ParentID(3);
                    self.CommonSource();
                    //Load Offices End
                }
                if (self.OfficeID()) {
                    //To Load Buildings
                    self.Level(3);
                    self.ParentID(self.OfficeID());
                    self.CommonSource();
                    //Load Buildings End
                }
                if (self.BuildingID()) {
                    //To Load Floors
                    self.Level(4);
                    self.ParentID(self.BuildingID());
                    self.CommonSource();
                    //Load Floors End
                }
                if (self.FloorID()) {
                    //To Load Rooms
                    self.Level(5);
                    self.ParentID(self.FloorID());
                    self.CommonSource();
                    //Load Rooms End
                }
                self.LoadDestinations();
            }
            else
            {
                self.showemployee(false);
                self.showoffice(false);
                self.showebuilding(false);
                self.showfloor(false);
                self.showroom(false);
                self.Level(3);
                self.ParentID(self.OfficeID());
                self.CommonSource();
                self.LoadDestinations();
            }
            
        }
        self.LoadDestinations = function () {

            if (self.DestinationType() == 6) //For Employee
            {
                self.showemployee(true);
                self.showdestoffice(false);
                self.showdestbuilding(false);
                self.showdestfloor(false);
                self.showdestroom(false);
                self.SetTransferType();
                self.getDestEmployees();
            }
            else if (self.DestinationType() == 2) //For Office
            {
                self.showemployee(false);
                self.showdestoffice(true);
                self.showdestbuilding(false);
                self.showdestfloor(false);
                self.showdestroom(false);
                self.SetTransferType();
                
                if (self.SourceAssets().length > 0)
                    self.getDestinations();
                else
                {
                    $('#successModal').modal('show');
                    $('#successModalText').text('Please Select a Source!');
                }
            }
            else if (self.DestinationType() == 3)  // For Building
            {
                self.showemployee(false);
                self.showdestoffice(false);
                self.showdestbuilding(true);
                self.showdestfloor(false);
                self.showdestroom(false);
                self.SetTransferType();
                self.DestLevel(self.SourceType());
                self.getDestinations();
                
            }
            else if (self.DestinationType() == 4)  // For Floor
            {
                self.showemployee(false);
                self.showdestoffice(false);
                if(self.SourceType()>=3)
                    self.showdestbuilding(false);
                else
                    self.showdestbuilding(true);
                self.showdestfloor(true);
                self.showdestroom(false);
                self.SetTransferType();
                self.DestLevel(self.SourceType());
                self.getDestinations();
            }
            else if (self.DestinationType() == 5)  // For Room
            {
                self.showemployee(false);
                self.showdestoffice(false);
                if (self.SourceType() >= 3)
                    self.showdestbuilding(false);
                else
                    self.showdestbuilding(true);
                if (self.SourceType() >= 4)
                    self.showdestfloor(false);
                else
                    self.showdestfloor(true);
                self.showdestroom(true);
                self.SetTransferType();
                self.DestLevel(self.SourceType());
                self.getDestinations();
            }
            else {
                self.showemployee(false);
                self.showdestoffice(false);
                self.showdestbuilding(false);
                self.showdestfloor(false);
                self.showdestroom(false);
                self.SetTransferType();
                if (self.SourceAssets().length > 0)
                {
                   self.getDestinations();
                }
                    
                else {
                    $('#successModal').modal('show');
                    $('#successModalText').text('Please Select a Source!');
                }
            }
        }

        self.SetTransferType =function()
        {
           // debugger
            if (self.SourceType() == 2 && self.DestinationType() == 2)
                self.TransferType(2);
            if (self.SourceType() == 3 && self.DestinationType() == 3)
                self.TransferType(3);
            if (self.SourceType() == 4 && self.DestinationType() == 4)
                self.TransferType(4);
            if (self.SourceType() == 5 && self.DestinationType() == 5)
                self.TransferType(5);
            if (self.SourceType() == 2 && self.DestinationType() == 3)
                self.TransferType(6);
            if (self.SourceType() == 2 && self.DestinationType() == 4)
                self.TransferType(7);
            if (self.SourceType() == 2 && self.DestinationType() == 5)
                self.TransferType(8);
            if (self.SourceType() == 3 && self.DestinationType() == 4)
                self.TransferType(9);
            if (self.SourceType() == 3 && self.DestinationType() == 5)
                self.TransferType(10);
            if (self.SourceType() == 4 && self.DestinationType() == 5)
                self.TransferType(11);
           
        }
        self.CommonSource = function ()
        {
            //console.log("Parent:" + self.ParentID() + ": Office: " + self.OfficeID() + ": Building: " + self.BuildingID() + ": Source: " + self.SourceID() + ": Dest: " + self.DestinationID());
            if (self.ParentID() > 0)
            {
                return $.ajax({
                    type: "GET",
                    url: '/FAMS/AssetTransfer/GetSources?level=' + self.Level() + '&parent=' + self.ParentID(),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {

                        if (self.Level() == 2) {
                            self.Offices(data);
                            
                        }

                        else if (self.Level() == 3) {
                            self.Buildings(data);
                        }

                        else if (self.Level() == 4) {
                            //self.getOffices();
                            //self.getBuildings();
                            self.Floors(data);
                        }

                        else {
                            //self.getOffices();
                            //self.getBuildings();
                            //self.getFloors();
                            self.Rooms(data);
                        }

                    },
                    error: function (error) {
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            }
            else
            {
                $('#successModal').modal('show');
                $('#successModalText').text('Please Select a valid Parent!');
            }
            
        }
        self.getDestinations = function () {
           // debugger
            if (self.TransferType() == 2) {
                self.ParentID(3);
                self.DestLevel(2);
                self.ExceptionID(self.OfficeID());
            }
            else if (self.TransferType() == 3) {
                self.ParentID(self.OfficeID());
                self.DestLevel(3);
                self.ExceptionID(self.BuildingID());
            }
            else if (self.TransferType() == 4) {
                self.ParentID(self.BuildingID());
                self.DestLevel(4);
                self.ExceptionID(self.FloorID());
            }
            else if (self.TransferType() == 5) {
                self.ParentID(self.FloorID());
                self.DestLevel(5);
                self.ExceptionID(self.RoomID());
            }
            else if (self.TransferType() == 6) { //Office to Building
                self.ParentID(self.OfficeID());
                self.DestLevel(3);
                self.ExceptionID(0);
            }
            else if (self.TransferType() == 7) { //Office to Floor
                if (self.DestinationType() == self.DestLevel()) {
                    self.ParentID(self.DestBuildingID());
                    self.DestLevel(4);
                    self.ExceptionID(0);
                }
                
                else{
                    self.ParentID(self.OfficeID());
                    self.DestLevel(3);
                    self.ExceptionID(0);
                }
             }
            else if (self.TransferType() == 8) {   //Office to Room
                if (self.DestinationType() == self.DestLevel()) {
                    self.ParentID(self.DestFloorID());
                    self.DestLevel(5);
                    self.ExceptionID(0);
                }
                else if (self.DestBuildingID()) {
                    self.ParentID(self.DestBuildingID());
                    self.DestLevel(4);
                    self.ExceptionID(0);
                }
                else
                {
                    self.ParentID(self.OfficeID());
                    self.DestLevel(3);
                    self.ExceptionID(0);
                }
            }
            else if (self.TransferType() == 9) { //Building to Floor
                    self.ParentID(self.BuildingID());
                    self.DestLevel(4);
                    self.ExceptionID(0);
                }
            else if (self.TransferType() == 10) { //Building to Room
                if (self.DestinationType() == self.DestLevel()) {
                    self.ParentID(self.DestFloorID());
                    self.DestLevel(5);
                    self.ExceptionID(0);
                }
                else {
                    self.ParentID(self.BuildingID());
                    self.DestLevel(4);
                    self.ExceptionID(0);
                }
            }
            else if (self.TransferType() == 11) { //Floor to Room
                self.ParentID(self.FloorID());
                self.DestLevel(5);
                self.ExceptionID(0);
            }
            //else
            //{
            //    self.ParentID(self.FloorID());
            //    self.ExceptionID(self.RoomID());
            //}
            //console.log('Level:' + self.DestLevel() + ' Parent: ' + self.ParentID() + ' Exception:' + self.ExceptionID());
            if (self.DestLevel()) {
                return $.ajax({
                    type: "GET",
                    url: '/FAMS/AssetTransfer/GetDestinatons?level=' + self.DestLevel() + '&parent=' + self.ParentID() + '&exceptid=' + self.ExceptionID(),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        if (self.DestLevel() == 2)
                            self.DestOffices(data);
                        else if (self.DestLevel() == 3)
                            self.DestBuildings(data);
                        else if (self.DestLevel() == 4)
                            self.DestFloors(data);
                        else if (self.DestLevel() == 5)
                            self.DestRooms(data);
                       
                    },
                    error: function (error) {
                        $('#successModal').modal('show');
                        $('#successModalText').text(error.status + "<--and--> " + error.statusText);
                        
                    }
                });
            }
            else {
                $('#successModal').modal('show');
                $('#successModalText').text('Please Select Transfer To');
            }
         }

        self.getTransferLevels = function () {
            $.ajax({
                type: "GET",
                url: '/FAMS/AssetTransfer/GetTransferLevel',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.LocationLevel(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        };
        self.getSourceEmployees = function () {
            
            if (self.SourceType() == 6)
            {
                return $.ajax({
                    type: "GET",
                    url: '/FAMS/AssetTransfer/GetSourceEmployees',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        self.SourceEmployees(data);
                    },
                    error: function (error) {

                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            }
            else
            {
                $('#successModal').modal('show');
                $('#successModalText').text('Select Employee');
            }
         }
        self.getDestEmployees = function () {
            if (self.SourceEmployeeID() > 0)
            {
                return $.ajax({
                    type: "GET",
                    url: '/FAMS/AssetTransfer/GetDestinatonEmployees?exceptid=' + self.SourceEmployeeID(),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        self.DestEmployees(data);
                        self.getSourceAssets();
                    },
                    error: function (error) {

                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            }
           else
            {
                $('#successModal').modal('show');
                $('#successModalText').text('Select Source Employee');
            }
        }

        self.getBuildings = function ()
        {
            self.Level(3);
            self.ParentID(self.OfficeID());
            return $.ajax({
                type: "GET",
                url: '/FAMS/AssetTransfer/GetSources?level=' + self.Level() + '&parent=' + self.ParentID(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.Buildings(data);
                    
                    //if (self.SourceType() == self.Level())
                    self.getSourceAssets();
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        };
        self.getFloors = function () {
            self.Level(4);
            self.ParentID(self.BuildingID());
            return $.ajax({
                type: "GET",
                url: '/FAMS/AssetTransfer/GetSources?level=' + self.Level() + '&parent=' + self.ParentID(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.Floors(data);
                   // if (self.SourceType() == self.Level())
                        self.getSourceAssets();
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        };
        self.getRooms = function () {
            self.Level(5);
            self.ParentID(self.FloorID());
            return $.ajax({
                type: "GET",
                url: '/FAMS/AssetTransfer/GetSources?level=' + self.Level() + '&parent=' + self.ParentID(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.Rooms(data);
                   // if (self.SourceType() == self.Level())
                        self.getSourceAssets();
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        };

        self.getDestBuildings = function () {
            self.DestLevel(3);
            //self.ParentID(self.OfficeID());
            self.getDestinations();
            self.getDestAssets();
        };
        self.getDestFloors = function () {
            self.DestLevel(4);
           // self.ParentID(self.BuildingID());
            self.getDestinations();
            self.getDestAssets();
         };
        self.getDestRooms = function () {
            self.DestLevel(5);
            //self.ParentID(self.FloorID());
            self.getDestinations();
            self.getDestAssets();
        };

        self.getSourceAssets = function () {
            if (self.SourceType() == 2)
                self.SourceID(self.OfficeID());
            else if (self.SourceType() == 3)
                self.SourceID(self.BuildingID());
            else if (self.SourceType() == 4)
                self.SourceID(self.FloorID());
            else
                self.SourceID(self.RoomID());
            $.ajax({
                url: "/FAMS/AssetTransfer/AssetTransferLeft?sourceid=" + self.SourceID(),
                type: "GET"
                
            })
            .done(function (partialViewResult) {
                $("#partialViewLeft").html(partialViewResult);
               
            });
            
           
            //if ((self.SourceEmployeeID() > 0 || self.SourceID() > 0) && self.SourceType() > 0)
            //{
            //     return $.ajax({
            //        type: "GET",
            //        url: '/AssetTransfer/GetSourceAssets?trantype=' + self.SourceType() + '&eid=' + self.SourceEmployeeID() + '&sourceid=' + self.SourceID(),
            //        contentType: "application/json; charset=utf-8",
            //        dataType: "json",
            //        success: function (data) {
            //            //self.SourceAssets(data);
            //            self.TransferSourceData(data);
            //            if (self.DestinationType()>self.SourceType())
            //            {
            //                self.LoadDestinations();
            //                //self.DestLevel(self.SourceType());
            //                //self.getDestinations();
            //            }
                            
            //         },
            //        error: function (error) {

            //            alert(error.status + "<--and--> " + error.statusText);
            //        }
            //    });
            //}
            //else {
            //    $('#successModal').modal('show');
            //    $('#successModalText').text('Please Select a valid Source!');
            //}
        }
        self.getDestAssets = function () {
                if (self.DestinationType() == 2)
                    self.DestinationID(self.DestOfficeID());
                else if (self.DestinationType() == 3)
                    self.DestinationID(self.DestBuildingID());
                else if (self.DestinationType() == 4)
                    self.DestinationID(self.DestFloorID());
                else
                    self.DestinationID(self.DestRoomID());

                if (self.DestinationID() > 0) {
                    return $.ajax({
                        type: "GET",
                        url: '/FAMS/AssetTransfer/AssetTransferRight?destid=' + self.DestinationID()
                        
                    }).done(function (partialViewResult) {
                        $("#partialViewRight").html(partialViewResult);

                    });
                }
                else {
                    $('#successModal').modal('show');
                    $('#successModalText').text('Please Select a Destination');
                }
                //if ((self.DestinationEmployeeID() > 0 || self.DestinationID() > 0) && self.TransferType() > 0) {
                //    return $.ajax({
                //        type: "GET",
                //        url: '/AssetTransfer/GetDestinationAssets?trantype=' + self.TransferType() + '&eid=' + self.DestinationEmployeeID() + '&destid=' + self.DestinationID(),
                //        contentType: "application/json; charset=utf-8",
                //        dataType: "json",
                //        success: function (data) {
                //            self.DestAssets(data);

                //        },
                //        error: function (error) {
                //            $('#successModal').modal('show');
                //            $('#successModalText').text(error.status + "<--and--> " + error.statusText);
                //        }
                //    });
                //}
                //else {
                //    $('#successModal').modal('show');
                //    $('#successModalText').text('Please Select Destination');
                //}
         }

        self.SaveTransfer = function (data) {
           // debugger
            if (self.SourceType() == 2)
                self.SourceID(self.OfficeID());
            else if (self.SourceType() == 3)
                self.SourceID(self.BuildingID());
            else if (self.SourceType() == 4)
                self.SourceID(self.FloorID());
            else
                self.SourceID(self.RoomID());
            console.log("Source:" + self.SourceID() + " Dest :" + self.DestinationID());
            if ((self.SourceEmployeeID() > 0 || self.SourceID() > 0) && (self.DestinationEmployeeID() > 0 || self.DestinationID() > 0)) {
                $.ajax({
                    type: "POST",
                    url: '/FAMS/AssetTransfer/SaveTransfer?assetid=' + data.AssetID,
                    data: ko.toJSON(self),
                    contentType: "application/json",
                    success: function (data) {
                        $('#successModal').modal('show');
                        $('#successModalText').text(data.Message);
                        self.getDestAssets();
                        self.getSourceAssets();
                    },
                    error: function () {
                        alert(error.status + "<--save and--> " + error.statusText);
                    }
                });
            }
            else {
                $('#successModal').modal('show');
                $('#successModalText').text('Please Select Correct Source and Destination');
            }
      
        };
        self.TransferSelectedAssets = function () {
            var saveData = ko.observableArray([]);
            $.each(self.SourceAssets(), function (index, value) {
                if (value.Pass == true) {
                    saveData.push(value.AssetID);
                }
            });
            alert(saveData());
            if (self.TransferType() == 1)
            {
                self.SourceID(self.SourceEmployeeID());
                self.DestinationID(self.DestinationEmployeeID());
            }
           //console.log("Source:" + self.SourceID() + " Dest :" + self.DestinationID());
            self.TransferDateText(moment(self.TransferDate()).format('DD/MM/YYYY'));
            if (self.SourceID() > 0 && self.DestinationID() > 0) {
                $.ajax({
                    type: "POST",
                    url: '/FAMS/AssetTransfer/TransferSelected?type=' + self.TransferType() + '&source=' + self.SourceID() + '&dest=' + self.DestinationID(),
                    data: ko.toJSON(saveData),
                    contentType: "application/json",
                    success: function (data) {
                        
                        self.getDestAssets();
                        self.getSourceAssets();
                        $('#successModal').modal('show');
                        $('#successModalText').text(data.Message);
                        
                    },
                    error: function () {
                        alert(error.statusText);
                    }
                });
            }
            else {
                $('#successModal').modal('show');
                $('#successModalText').text('Please Select Correct Source and Destination');
            }
        };

        self.InitialValueLoad = function () {
            self.getTransferLevels();
           // self.setUrl();
        };

        self.errors = ko.validation.group(self);
        self.IsValid = ko.computed(function () {
            var err = self.errors().length;
            if (err == 0)
                return true;
            return false;
        });
 
    }

    vm = new TransferVm();
    vm.InitialValueLoad();


    ko.applyBindings(vm, $('#AssetsDiv')[0]);
});