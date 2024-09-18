$(document).ready(function () {

    function AttendanceCopy() {
        var self = this;
        self.File = ko.observable().extend({ required: true });
        self.Attendances = ko.observableArray([]);
        self.errors = ko.validation.group(self);
        self.fileUpload = function (data, e) {
            var file = e.target.files[0];
            var reader = new FileReader();

            reader.onloadend = function (onloadend_e) {
                var result = reader.result; // Here is your base 64 encoded file. Do with it what you want.
                self.File(result);
            };

            if (file) {
                reader.readAsDataURL(file);
            }
        };

        self.AddNewFile = function (content) {
            //if (self.errors().length == 0) {
            //console.log("submitted.." + content);
            //initial EmployeeId of BasicInfoDto,can't be initialized outside submit function
            //var form = $('form')[0];
            var file_data = $('#UploadedFile').prop('files')[0];
            var formData = new FormData();
            formData.append('UploadedFile', file_data);
            $.ajax({
                type: "POST",
                url: "/HRM/OfficeOutTime/GetEmployeeAttendanceExcel/",
                data: formData,
                contentType: false,//'application/json',
                processData: false,
                cache: false,
                //mimeType: "multipart/form-data",
                success: function (data) {
                    console.log(data);
                    self.Attendances(data);
                    self.errors = ko.validation.group(self);
                    self.IsValid = ko.computed(function () {
                        if (self.errors().length == 0)
                            return true;
                        return false;
                    });
                    // window.location.href = "/Employee/Index"
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) { }
            });
            //} else {
            //    self.errors.showAllMessages();
            //}
        };
    }

    var vm = new AttendanceCopy();
    ko.applyBindings(vm, document.getElementById("EmpAttendance"));

});