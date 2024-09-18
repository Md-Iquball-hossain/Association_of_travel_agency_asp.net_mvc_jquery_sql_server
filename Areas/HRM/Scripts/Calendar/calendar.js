var holidayTypes = [{ 'Id': 1, 'Name': 'Public' },
                    { 'Id': 2, 'Name': 'Festival' }
                    ];
var days = [{ 'Id':'Saturday' }, { 'Id': 'Sunday' }, {'Id': 'Monday' }, {'Id': 'Tuesday' }, { 'Id': 'Wednesday' }, {'Id': 'Thursday' }, {'Id': 'Friday' }];
$(document).ready(function () {
    function receiveDetail(data) {
        var self = this;
        self.Id = ko.observable(data.Id ? data.Id : '');
        self.Year = ko.observable(data.Year ? data.Year : '');
        self.Month = ko.observable(data.Month ? data.Month : '');
        self.PresentDate = ko.observable(data.PresentDate ? moment(data.PresentDate).format('DD/MM/YYYY') : '');
        self.HolidayType = ko.observable(data.HolidayType ? data.HolidayType : '');
        self.HolidayId = ko.observable(data.HolidayId ? data.HolidayId : '');
        self.IsHoliday = ko.observable(data.IsHoliday ? data.IsHoliday : false);
    };
    function receiveVM(){
        var self = this;
        self.IsHoliday = ko.observable(false);
        self.IsOneDay = ko.observable(false);
        self.IsTwoday = ko.observable(false);
       
        self.Id = ko.observable('');
        self.Year = ko.observable('');
        self.Month = ko.observable('');
        self.DateDetails = ko.observableArray([]);
        self.Month.subscribe(function () {
            self.Year(moment(self.Month()).format("YYYY"));
            //self.Month(moment(self.Month()).format("MM")); holidayTypes Days
        });
        self.Days = ko.observableArray(days);
        self.Day = ko.observable('');
        self.DayTwo = ko.observable('');

        self.PresentDate = ko.observable('');
        self.HolidayId = ko.observable();
        //self.HolidayType = ko.observableArray(holidayTypes);
        self.HolidayType = ko.observableArray([]);

        self.LoadInitial = function () {
        };

        self.pageReload = function () {
            window.location.href = "/HRM/Production/Receive";
        };

        self.addDateDetail = function () {
            //console.log("year -" + self.Year());
            //console.log("Month -" + moment(self.Month()).format("MM"));
            self.DateDetails([]);
            //console.log(self.HolidayType());
            return $.ajax({
                type: "GET",
                url: '/HRM/Calendar/GetAllDateData?year=' + moment(self.Month()).format("YYYY") + '&month=' + moment(self.Month()).format("MM") + '&dayOne=' + self.Day() + '&dayTwo=' + self.DayTwo(),
                contentType: "application/json",
                success: function (data) {
                    $.each(data, function (index, value) {
                        //console.log(value);
                        self.DateDetails.push(new receiveDetail(value));
                    });
                    //self.DateDetails(data);
                    //console.log(data);
                },
                error: function () {
                    alert(error.status + "<--and-->" + error.statusText);
                }
            });
        }

        self.getAllHolidayTypes = function () {
            $.ajax({
                type: "GET",
                url: '/HRM/Calendar/GetHolidayTypes',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.HolidayType(data); //Put the response in ObservableArray
                    console.log(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
            //Ends Here
        }

        self.removeDetail = function (receiveDetail) {
            self.ReceiveDetails.remove(receiveDetail);
        };

        self.Reset = function () {
            self.DateDetails('');
        
        };

        self.Submit = function () {
            console.log(self.DateDetails());
            var dateDetails = ko.observableArray([]);
            $.each(self.DateDetails(), function (index, value) {
                console.log("value: " + value);
                dateDetails.push({
                    Id: value.Id,
                    Year: value.Year,
                    Month: value.Month,
                    PresentDate: value.PresentDate, // moment(value.PresentDate).format('DD/MM/YYYY'),
                    HolidayType: value.HolidayType
                    
                });
            });
            
            console.log(dateDetails);
            $.ajax({
                type: "POST",
                url: '/HRM/Calendar/SaveDate',
                data: ko.toJSON(dateDetails),
                contentType: "application/json",
                success: function (data) {
                    console.log(data);
                    $('#successModal').modal('show');
                    $('#successModalText').text(data);
                    if (data.Count > 0) {
                        self.Reset();
                    }

                },
                error: function () {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        };

        self.IsSave = function () {
            return true;
        };

    }

    var vm = new receiveVM();
    vm.LoadInitial();
    vm.getAllHolidayTypes();
    ko.applyBindings(vm, $("#receiveDiv")[0]);
});