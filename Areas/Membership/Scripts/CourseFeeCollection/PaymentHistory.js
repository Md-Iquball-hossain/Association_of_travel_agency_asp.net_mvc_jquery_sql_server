$(document).ready(function () {
    function PaymentHistoryVM() {
        var self = this;
        self.TraineeID = ko.observable(traineeid);
        self.PageData = ko.observableArray(pageData);
        self.FromDate = ko.observable(fromDate ? moment(fromDate,"DD/MM/YYYY") : moment());
        self.ToDate = ko.observable(toDate ? moment(toDate, "DD/MM/YYYY") : moment());
        self.Courses = ko.observableArray(courses);
        self.Course = ko.observable(course);
        self.PayTypes = ko.observableArray(paytypes);
        self.PayBy = ko.observable(payby);
        
        self.FromDate.subscribe(function () {
            $('#fromDate').val(moment(self.FromDate()).format("DD/MM/YYYY"));
        });
        self.ToDate.subscribe(function () {
            $('#toDate').val(moment(self.ToDate()).format("DD/MM/YYYY"));
        });


        //self.queryString = function getParameterByName(name) {
        //    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        //    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        //        results = regex.exec(location.search);
        //    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        //};

    }

    var pavm = new PaymentHistoryVM();
    //pavm.TraineeID(pavm.queryString("TraineeId"));
    ko.applyBindings(pavm, document.getElementById("paymentHistory"));
});