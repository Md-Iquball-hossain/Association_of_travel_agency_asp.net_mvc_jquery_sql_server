$(document).ready(function () {

    ko.validation.init({
        errorElementClass: 'has-error',
        errorMessageClass: 'help-block',
        decorateInputElement: true
    });

    function TransferVm() {

        var self = this;
        var currentDate = (new Date()).toISOString().split('T')[0];

        self.ParentCategoryName=ko.observable();
        self.AssetCount=ko.observable();


        self.Id = ko.observable(0);
        self.AssetID = ko.observable();
        self.AssetName = ko.observable('');
        self.TransferType = ko.observable();
        self.TransferTypeName = ko.observable();
        self.SourceDetails = ko.observable();
        self.DestinationDetails = ko.observable();

        self.SourceID = ko.observable();
        self.DestinationID = ko.observable();
        self.SourceEmployeeID = ko.observable().extend({ required: true });
        self.DestinationEmployeeID = ko.observable().extend({ required: true });

        self.CategoryId = ko.observable();
        self.CategoryName = ko.observable('');
        self.ParentId = ko.observable();
        self.ParentName = ko.observable('');

        self.SourceTitle = ko.observable('');
        self.DestinationTitle = ko.observable('');
        self.SourceSpecificLocation = ko.observable('');
        self.DestinationSpecificLocation = ko.observable('');
        self.TransferDate = ko.observable(moment());
        self.TransferDateText = ko.observable();
        self.TransferDetails = ko.observable();


        self.FromDate = ko.observable(currentDate);
        self.ToDate = ko.observable(currentDate);
        self.FromDateText = ko.observable();
        self.ToDateText = ko.observable();
        self.Levels = ko.observable([]);
        self.Logs = ko.observable([]);
        self.Summary = ko.observable([]);

        //Source Location Start
        self.FromLevelControl = ko.observable();
        self.FromLocationControl = ko.observable();

        self.SrcOfficeID = ko.observable();
        self.SrcBuildingID = ko.observable();
        self.SrcFloorID = ko.observable();
        self.SrcRoomID = ko.observable();

        self.showsrcoffice = ko.observable(false);
        self.showsrcbuilding = ko.observable(false);
        self.showsrcfloor = ko.observable(false);
        self.showsrcroom = ko.observable(false);

        self.Company = ko.observable(3);
        self.Offices = ko.observable([]);
        self.Buildings = ko.observable([]);
        self.Floors = ko.observable([]);
        self.Rooms = ko.observableArray([]);
        //Source Location End

        //Destination Location Start
        self.DestLevelControl = ko.observable();
        self.DestLocationControl = ko.observable();

        self.DestOfficeID = ko.observable();
        self.DestBuildingID = ko.observable();
        self.DestFloorID = ko.observable();
        self.DestRoomID = ko.observable();

        self.showdestoffice = ko.observable(false);
        self.showdestbuilding = ko.observable(false);
        self.showdestfloor = ko.observable(false);
        self.showdestroom = ko.observable(false);

        self.DestOffices = ko.observable([]);
        self.DestBuildings = ko.observable([]);
        self.DestFloors = ko.observable([]);
        self.DestRooms = ko.observableArray([]);
        //Destination Location End

        self.FromLevelControl.subscribe(function () {
            if (self.FromLevelControl() == 2) //For Office
            {
                self.showsrcoffice(true);
                self.showsrcbuilding(false);
                self.showsrcfloor(false);
                self.showsrcroom(false);
                self.getOffices();
            }
            else if (self.FromLevelControl() == 3)  // For Building
            {
                self.showsrcoffice(true);
                self.showsrcbuilding(true);
                self.showsrcfloor(false);
                self.showsrcroom(false);
                self.getOffices();
            }
            else if (self.FromLevelControl() == 4)  // For Floor
            {
                self.showsrcoffice(true);
                self.showsrcbuilding(true);
                self.showsrcfloor(true);
                self.showsrcroom(false);
                self.getOffices();
            }
            else   // For Room
            {
                self.showsrcoffice(true);
                self.showsrcbuilding(true);
                self.showsrcfloor(true);
                self.showsrcroom(true);
                self.getOffices();
            }
        });
        self.SrcOfficeID.subscribe(function () {
            if (self.SrcOfficeID()) {
                self.FromLocationControl(self.SrcOfficeID());
                self.getSrcBuildings();
                
            }
            else {
                self.SrcBuildingID();
                self.SrcFloorID();
                self.SrcRoomID();
            }
        });
        self.SrcBuildingID.subscribe(function () {
            if (self.SrcBuildingID()) {
                self.FromLocationControl(self.SrcBuildingID());
                //self.getFloors();
                
            }
            else {
                self.SrcFloorID();
                self.SrcRoomID();
            }
        });
        self.SrcFloorID.subscribe(function () {
            if (self.SrcFloorID()) {
                self.FromLocationControl(self.SrcFloorID());
                //self.getRooms();
                
            }

            else {
                self.SrcBuildingID();
                self.SrcFloorID();
                self.SrcRoomID();
            }
        });
        self.SrcRoomID.subscribe(function () {
            if (self.SrcRoomID()) {
                self.FromLocationControl(self.SrcRoomID());
                
            }
            else {
                self.SrcRoomID();
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
        self.getSrcBuildings = function () {
            if (self.SrcOfficeID() > 0) {
                return $.ajax({
                    type: "GET",
                    url: '/FAMS/LocationReport/getLocationsByLevel?level=3&parent=' + self.SrcOfficeID(),
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
            else {
                $('#successModal').modal('show');
                $('#successModalText').text('Please Select a Office!');
            }

        };
        self.getSrcFloors = function () {
            if (self.SrcBuildingID() > 0) {
                return $.ajax({
                    type: "GET",
                    url: '/FAMS/LocationReport/getLocationsByLevel?level=4&parent=' + self.SrcBuildingID(),
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
        self.getSrcRooms = function () {
            if (self.SrcFloorID() > 0) {
                return $.ajax({
                    type: "GET",
                    url: '/FAMS/LocationReport/getLocationsByLevel?level=5&parent=' + self.SrcFloorID(),
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

        self.DestLevelControl.subscribe(function () {
            if (self.DestLevelControl() == 2) //For Office
            {
                self.showdestoffice(true);
                self.showdestbuilding(false);
                self.showdestfloor(false);
                self.showdestroom(false);
                self.getOffices();
            }
            else if (self.DestLevelControl() == 3)  // For Building
            {
                self.showdestoffice(true);
                self.showdestbuilding(true);
                self.showdestfloor(false);
                self.showdestroom(false);
                self.getOffices();
            }
            else if (self.DestLevelControl() == 4)  // For Floor
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
                self.showdestcroom(true);
                self.getOffices();
            }
        });
        self.DestOfficeID.subscribe(function () {
            if (self.DestOfficeID()) {
                self.DestLocationControl(self.DestOfficeID());
                self.getDestBuildings();

            }
            else {
                self.DestBuildingID();
                self.DestFloorID();
                self.DestRoomID();
            }
        });
        self.DestBuildingID.subscribe(function () {
            if (self.DestBuildingID()) {
                self.DestLocationControl(self.DestBuildingID());
                //self.getFloors();

            }
            else {
                self.DestFloorID();
                self.DestRoomID();
            }
        });
        self.DestFloorID.subscribe(function () {
            if (self.DestFloorID()) {
                self.DestLocationControl(self.DestFloorID());
                //self.getRooms();

            }

            else {
                self.DestBuildingID();
                self.DestFloorID();
                self.DestRoomID();
            }
        });
        self.DestRoomID.subscribe(function () {
            if (self.DestRoomID()) {
                self.DestLocationControl(self.DestRoomID());

            }
            else {
                self.DestRoomID();
            }
        });

        self.getDestBuildings = function () {
            if (self.DestOfficeID() > 0) {
                return $.ajax({
                    type: "GET",
                    url: '/FAMS/LocationReport/getLocationsByLevel?level=3&parent=' + self.DestOfficeID(),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        self.DestBuildings(data);

                    },
                    error: function (error) {
                        $('#successModal').modal('show');
                        $('#successModalText').text(error.status + "<--save and--> " + error.statusText);
                    }
                });
            }
            else {
                $('#successModal').modal('show');
                $('#successModalText').text('Please Select a Office!');
            }

        };
        self.getDestFloors = function () {
            if (self.DestBuildingID() > 0) {
                return $.ajax({
                    type: "GET",
                    url: '/FAMS/LocationReport/getLocationsByLevel?level=4&parent=' + self.DestBuildingID(),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        self.DestFloors(data);

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
        self.getDestRooms = function () {
            if (self.DestFloorID() > 0) {
                return $.ajax({
                    type: "GET",
                    url: '/FAMS/LocationReport/getLocationsByLevel?level=5&parent=' + self.DestFloorID(),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        self.DestRooms(data);

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

        self.Link1 = ko.observable();
        self.Link2 = ko.observable();
        self.Link3 = ko.observable();

        self.Title1 = ko.observable('PDF');
        self.Title2 = ko.observable('Excel');
        self.Title3 = ko.observable('Word');

        self.Link4 = ko.observable();
        self.Link5 = ko.observable();
        self.Link6 = ko.observable();

        self.Title4 = ko.observable('PDF');
        self.Title5 = ko.observable('Excel');
        self.Title6 = ko.observable('Word');

        self.getTransferLog = function () {
            self.FromDateText(moment(self.FromDate()).format('DD/MM/YYYY'));
            self.ToDateText(moment(self.ToDate()).format('DD/MM/YYYY'));
                       
            return $.ajax({
                type: "GET",
                url: '/FAMS/TransferReport/TransferDetailsReport?from=' + self.FromDateText() + '&end=' + self.ToDateText() + '&srcid=' + self.FromLocationControl() + '&destid=' + self.DestLocationControl(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.Logs(data);
                },
                error: function (error) {

                    $('#successModal').modal('show');
                    $('#successModalText').text(error.status + "<--save and--> " + error.statusText);
                }
            });
        }

        self.getTransferLogSummary = function () {
            self.FromDateText(moment(self.FromDate()).format('DD/MM/YYYY'));
            self.ToDateText(moment(self.ToDate()).format('DD/MM/YYYY'));

            return $.ajax({
                type: "GET",
                url: '/FAMS/TransferReportSummary/TransferSummary?from=' + self.FromDateText() + '&end=' + self.ToDateText() + '&srcid=' + self.FromLocationControl() + '&destid=' + self.DestLocationControl(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.Summary(data);
                    console.log(data);
                },
                error: function (error) {

                    $('#successModal').modal('show');
                    $('#successModalText').text(error.status + "<--save and--> " + error.statusText);
                }
            });
        }

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
            self.FromDateText(moment(self.FromDate()).format('DD/MM/YYYY'));
            self.ToDateText(moment(self.ToDate()).format('DD/MM/YYYY'));
            
            
            self.Link1('/FAMS/TransferReport/getReport?reportTypeId=PDF&fromDate=' + self.FromDateText() + '&toDate=' + self.ToDateText() + '&srcid=' + self.FromLocationControl() + '&destid=' + self.DestLocationControl());
            self.Link2('/FAMS/TransferReport/getReport?reportTypeId=Excel&fromDate=' + self.FromDateText() + '&toDate=' + self.ToDateText() + '&srcid=' + self.FromLocationControl() + '&destid=' + self.DestLocationControl());
            self.Link3('/FAMS/TransferReport/getReport?reportTypeId=Word&fromDate=' + self.FromDateText() + '&toDate=' + self.ToDateText() + '&srcid=' + self.FromLocationControl() + '&destid=' + self.DestLocationControl());

            self.Link4('/FAMS/TransferReportSummary/TransferSummaryReport?reportTypeId=PDF&fromDate=' + self.FromDateText() + '&toDate=' + self.ToDateText() + '&srcid=' + self.FromLocationControl() + '&destid=' + self.DestLocationControl());
            self.Link5('/FAMS/TransferReportSummary/TransferSummaryReport?reportTypeId=Excel&fromDate=' + self.FromDateText() + '&toDate=' + self.ToDateText() + '&srcid=' + self.FromLocationControl() + '&destid=' + self.DestLocationControl());
            self.Link6('/FAMS/TransferReportSummary/TransferSummaryReport?reportTypeId=Word&fromDate=' + self.FromDateText() + '&toDate=' + self.ToDateText() + '&srcid=' + self.FromLocationControl() + '&destid=' + self.DestLocationControl());
        });

        self.InitialValueLoad = function () {
            self.getLevels();
           // self.getTransferLevels();
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