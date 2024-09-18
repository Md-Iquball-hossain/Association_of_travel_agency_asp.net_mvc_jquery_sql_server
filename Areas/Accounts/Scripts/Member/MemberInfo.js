var EduQualifications = [{ 'Id': 'SSC', 'Name': 'SSC' },
                    { 'Id': 'HSC', 'Name': 'HSC' },
                    { 'Id': 'Diploma', 'Name': 'Diploma' },
                    { 'Id': 'Hons', 'Name': 'Hons' },
                    { 'Id': 'Masters', 'Name': 'Masters' },
                    { 'Id': 'Other', 'Name': 'Other' }
                    ];

$(function () {
    $("#file").change(function () {
        console.log("changed");
        $("#dvPreview").html("");
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg|.gif|.png|.bmp)$/;
        if (regex.test($(this).val().toLowerCase())) {
            //if (parseFloat(jQuery.browser.version) <= 9.0) {
            $("#dvPreview").show();
           // $("#dvPreview")[0].filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = $(this).val();

            $("#dvPreview").append("<img />");
            var reader = new FileReader();
            reader.onload = function (e) {

                $("#dvPreview img").attr("src", e.target.result);
                $("#dvPreview img").attr("height", "80px");
                $("#dvPreview img").attr("width", "80px");
                $("#dvPreview img").attr("style", "border:1px solid #000000");
                
            }
            reader.readAsDataURL($(this)[0].files[0]);
            // }
            // else {
            //        if (typeof (FileReader) != "undefined") {

            //        } else {
            //            alert("This browser does not support FileReader.");
            //        }
            //    //}
            //} else {
            //    alert("Please upload a valid image file.");
            //}
        }
    });
});

$(function () {
    $("#nominee_file").change(function () {
        $("#nomPreview").html("");
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg|.gif|.png|.bmp)$/;
        if (regex.test($(this).val().toLowerCase())) {
            //if ($.browser.msie && parseFloat(jQuery.browser.version) <= 9.0) {
            $("#nomPreview").show();
            // $("#nomPreview")[0].filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = $(this).val();

            
                $("#nomPreview").show();
                $("#nomPreview").append("<img />");
                var reader = new FileReader();
                reader.onload = function (e) {
                    $("#nomPreview img").attr("src", e.target.result);
                    $("#nomPreview img").attr("height", "80px");
                    $("#nomPreview img").attr("width", "80px");
                    $("#nomPreview img").attr("style", "border:1px solid #000000");
                }
                reader.readAsDataURL($(this)[0].files[0]);
            
        }
    });
});

$(document).ready(function () {
    ko.validation.init({
        errorElementClass: 'has-error',
        errorMessageClass: 'help-block',
        decorateInputElement: true,
        grouping: { deep: true, observable: true }
    });

    //ko.fileBindings.defaultOptions = {
    //    wrapperClass: 'input-group',
    //    fileNameClass: 'disabled form-control',
    //    noFileText: 'No file chosen',
    //    buttonGroupClass: 'input-group-btn',
    //    buttonClass: 'btn btn-primary',
    //    clearButtonClass: 'btn btn-default',
    //    buttonText: 'Choose File',
    //    changeButtonText: 'Change',
    //    clearButtonText: 'Clear',
    //    fileName: true, // show the selected file name?
    //    clearButton: true, // show clear button?
    //    onClear: function (fileData, options) {
    //        if (typeof fileData.clear === 'function') {
    //            fileData.clear();
    //        }
    //    }
    //};
    //// change a default option
    //ko.fileBindings.defaultOptions.buttonText = 'Browse';
    function memberInfo(){
        var self = this;
        self.errors = ko.validation.group(self);
        self.MemberIdNo = ko.observable().extend({ required: true });
        self.Name = ko.observable().extend({ required: true });
        self.FathersName = ko.observable().extend({ required: true, pattern: { message: 'Only alpha value required.', params: "^[_A-Za-z ]{1,}$", maxLength: "100" } });
        self.MothersName = ko.observable().extend({ required: true, pattern: { message: 'Only alpha value required.', params: "^[_A-Za-z ]{1,}$", maxLength: "100" } });
        self.HusbandsName = ko.observable()//;.extend({ required: true, pattern: { message: 'Only alpha value required.', params: "^[_A-Za-z ]{1,}$", maxLength: "100" } });
        //self.Nationality = ko.observable().extend({ required: true, pattern: { message: 'Only alpha value required.', params: "^[_A-Za-z ]{1,}$", maxLength: "100" } });
        self.CurrentAddress = ko.observable().extend({ required: true });
        self.PermanemtAddress = ko.observable().extend({ required: true });
        self.PassportNumber = ko.observable().extend({ required: true });
        self.NID = ko.observable().extend({ required: true, pattern: { message: 'Enter correct NID.', params: "^[0-9]{17}$", maxLength: "100" } });
        self.Nationality = ko.observable().extend({ required: true });
        self.EduQualifications = ko.observableArray(EduQualifications);
        self.EducationalQualification = ko.observable().extend({ required: true });
        self.Profession = ko.observable().extend({ required: true });
        self.Phone = ko.observable().extend({ required: true, digit: true });
        self.Email = ko.observable().extend({ required: true, email: true });
        self.References = ko.observableArray([]);
        self.ReferenceId = ko.observable();
        self.Religions = ko.observableArray([]);
        self.Religion = ko.observable().extend({ required: true });
        self.Tenure = ko.observable().extend({ required: true });
        self.BloodGroups = ko.observableArray([]);
        self.BloodGroup = ko.observable().extend({ required: true });
        self.BirthDay = ko.observable();
        self.BirthDayTxt = ko.observable();
        self.BirthCertificate = ko.observable();
        self.fileData = ko.observable({
            file: ko.observable()
        });
        self.TotalSavings = ko.observable().extend({ required: true, digit: true });
        self.NomineeName = ko.observable().extend({ required: true });
        self.NomineeFathersName = ko.observable().extend({ required: true });
        self.NomineeAddress = ko.observable().extend({ required: true });
        self.Relation = ko.observable().extend({ required: true });
        self.nomineeFileData = ko.observable({
            file: ko.observable()
        });

        ////////New Addition/////
        self.UserId = ko.observable('');
        self.UserName = ko.observable().extend({ required: true, pattern: { message: 'Only alphabetical values required.', params: "^[_A-Za-z ]{1,}$", maxLength: "100" } });
        self.Password = ko.observable().extend({ required: true, pattern: { message: 'valid password required.', params: "^[_A-Za-z0-9_*]{6,12}$", maxLength: "100" } });
        self.ConfirmPassword = ko.observable().extend({ required: true, areSame: self.Password });
        ////////

        self.GetInitialDropdown = function (){
            $.getJSON("/Member/GetReligion/", null, function (data) {
                self.Religions(data);
            });
            $.getJSON("/Member/GetBloodGroup/", null, function (data) {
                self.BloodGroups(data);
            });
            $.getJSON("/Member/GetReferences/", null, function (data) {
                self.References(data);
            });
        };

        self.ResetMember = function (vm) {
            console.log("resetted");
            vm.MemberIdNo('');
            vm.Name('');
            vm.FathersName('');
            vm.MothersName('');
            vm.CurrentAddress('');
            vm.PermanemtAddress('');
            vm.Phone('');
            vm.Email('');
            vm.BirthCertificate('');
            vm.PassportNumber('');
            vm.Religion('');
            vm.NID('');
            vm.BirthDay('');
            vm.EducationalQualification('');
            vm.Nationality('');
            vm.Profession('');
            vm.BloodGroup('');
            vm.ReferenceId('');
            vm.TotalSavings('');
            vm.Tenure('');
            vm.fileData().file('');
        };

        self.ResetNominee = function (vm) {
            vm.NomineeName('');
            vm.NomineeAddress('');
            vm.NomineeFathersName('');
            vm.nomineeFileData().file('');
            
        };
        self.errors = ko.validation.group(self);
        self.IsValid = ko.computed(function () {
            if (self.errors().length == 0)
                return true;
            return false;
        });
        self.Submit = function () {
            
            console.log(self.IsValid());
            if (self.IsValid()) {
                var fileInput = document.getElementById('file');
                var nomineeFileInput = document.getElementById("nominee_file");
                var file = fileInput.files[0];
                var nomineeFile = nomineeFileInput.files[0];
                var formData = new FormData();
                formData.append('Photo', file);
                formData.append('NomineePhoto', nomineeFile);
                self.BirthDayTxt(moment(self.BirthDay()).format('DD/MM/YYYY'));
                formData.append('data', ko.toJSON(this));
                console.log(formData);
                $.ajax({
                    method: 'POST',
                    url: '/Member/AddMembers/',
                    data: formData,
                    dataType: 'json',
                    contentType: false,
                    processData: false,
                    success: function (data){
                        toastr.success(data);
                        // window.location.href = "/Employee/Index"
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
            } else {
                 self.errors.showAllMessages();
            }
        };

        self.Refresh = function () {
            window.location.href = "/Somity/Member/MemberCreate";
        };
    }

    var member = new memberInfo();
    member.GetInitialDropdown();
    ko.applyBindings(member, document.getElementById("whole"));
});