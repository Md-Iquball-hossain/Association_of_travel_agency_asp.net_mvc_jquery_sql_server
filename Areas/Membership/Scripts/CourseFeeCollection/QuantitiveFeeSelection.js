$(document).ready(function () {
    function Trainee() {
        var self = this;
        self.IsChecked = ko.observable('');
        self.Id = ko.observable('');
        self.Name = ko.observable('');
        self.TraineeNo = ko.observable('');
        self.LastAcademicQualification = ko.observable('');
        self.DateOfAdmission = ko.observable();
        self.Gender = ko.observable('');
        self.Batch = ko.observable('');
        self.Quantity = ko.observable(0);
        self.IsQuantitive = ko.observable(true);
        self.LoadData = function (data) {
            self.IsChecked(data.IsChecked);
            self.Id(data.Id);
            self.Name(data.Name);
            self.TraineeNo(data.TraineeNo);
            self.LastAcademicQualification(data.LastAcademicQualification);
            self.Batch(data.Batch);
            self.Quantity(data.Quantity);
            self.Gender(data.Gender);
            self.DateOfAdmission(data.DateOfAdmission);
            self.IsQuantitive(data.IsQuantitive);
        }
       

    }
    function FeeSelectionForTraineeVM() {
        var self = this;
        var count = 0;
        self.Batch = ko.observable('');
        self.TraineeNo = ko.observable('');
        self.Name = ko.observable('');

        self.FeeTypes = ko.observableArray([]);
        self.FeeTypeId = ko.observable();
        
        self.Trainees = ko.observableArray([]);
        self.FeeTypeIds = ko.observableArray([]);
        self.SetFeeTypeIds = ko.observableArray([]);
        
        self.Submit = function () {
            
            var submitData = {
                feeTypeId: self.FeeTypeId(),
                Trainees: self.Trainees() //application stage for underprocess at CRM
            };
            //console.log(self.SetFeeTypeIds());
            
            if (self.FeeTypeId()> 0 && self.Trainees().length > 0) {
                $.ajax({
                    url: '/Membership/CourseFeeCollection/SaveOtherFees',
                    type: 'POST',
                    contentType: "application/json;",
                    data: ko.toJSON(submitData),
                    dataType: "json",
                    success: function (data) {
                        self.Trainees([]);
                        
                        $('#successModal').modal('show');
                        $('#successModalText').text(data.Message);

                    },
                    error: function (error) {
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            }
            else {
                $('#successModal').modal('show');
                $('#successModalText').text('Please select  Fees and Members');
            }
        }

        self.GetFeeTypes = function () {
            return $.ajax({
                type: "GET",
                url: '/Membership/CourseFeeCollection/GetNormalQuantitiveFeetypes',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.FeeTypes(data); //Put the response in ObservableArray
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
        }
        
        self.GetHighlights = function () {
            self.Trainees([]);
            self.FeeTypeIds([]);
            self.FeeTypeIds.push(self.FeeTypeId);
            var submitData = {
                feeTypeIds: self.FeeTypeIds(),
                batch: self.Batch(),
                traineeno: self.TraineeNo(),
                name: self.Name()
            };
            if (self.FeeTypeIds().length > 0) {
                 $.ajax({
                    type: "POST",
                    url: '/Membership/CourseFeeCollection/GetTraineesForFeeSetup',
                    contentType: "application/json;",
                    data: ko.toJSON(submitData),
                    dataType: "json",
                    success: function (data) {
                        self.Trainees(data);
                        //$.each(data, function (index, value) {
                        //    var aDetail = new Trainee();
                        //    if (typeof (value) != 'undefined') {
                        //        aDetail.IsQuantitive('true');
                        //        aDetail.LoadData(value);
                        //        self.Trainees.push(aDetail);
                        //    }
                        //});
                        //self.Members(data);
                    },
                    error: function (error) {
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            }
            else {
                $('#successModal').modal('show');
                $('#successModalText').text('Please select Fee First');
            }
        }

        self.Initialize = function () {
            self.GetFeeTypes();
            
        }
    }

    var pavm = new FeeSelectionForTraineeVM();
    pavm.Initialize();
    ko.applyBindings(pavm, document.getElementById("FeeSelectionForTraineesDiv"));
});