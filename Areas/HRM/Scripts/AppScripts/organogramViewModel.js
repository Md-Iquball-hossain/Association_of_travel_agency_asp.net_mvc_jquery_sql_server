$(document).ready(function () {
    ko.validation.init({
        errorElementClass: 'has-error',
        errorMessageClass: 'help-block',
        decorateInputElement: true,
        grouping: { deep: true, observable: true }
    });
    function OrganogramInfo(){
        var self = this;
        self.OfficeLayerId = ko.observable({ required: true });
        self.OfficeId = ko.observable({ required: true });
        self.OfficeLayerList = ko.observableArray([]);
        self.OfficeList = ko.observableArray([]);
        self.errors = ko.validation.group(self);
        console.log("Error Contact:" + self.errors());
        self.IsValid = ko.computed(function () {
            if (self.errors().length == 0)
                return true;
            return false;
        });
        self.GetOfficeLayers = function () {
            $.getJSON("/HRM/OfficeLayer/GetOfficeLayers/", null, function (data) {
                console.log(data);
                OrganogramInfovm.OfficeLayerList(data);
            });
        }
        self.OfficeLayerId.subscribe(function () {                    //DesignationList is populated with change of selectedGradeId 
            //console.log("id is: " + self.selectedGradeId());
            $.getJSON("/HRM/Office/GetOfficeByLayer/?officelayerid=" + self.OfficeLayerId(), null, function (data) {
                OrganogramInfovm.OfficeList(data);

            });
            // self.DesignationList([{ Id: 1, Name: "mili" }, { Id: 2, Name: "mili" }]);
            //console.log("Entered")
        }, this);
        self.Submit = function () {
            $('#myModal').modal('show');
        }
    }

    var OrganogramInfovm = new OrganogramInfo();
    OrganogramInfovm.GetOfficeLayers();
    ko.applyBindings(OrganogramInfovm);
});