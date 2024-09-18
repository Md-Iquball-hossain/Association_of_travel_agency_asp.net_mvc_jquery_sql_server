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

    function CategoryVm() {

        var self = this;

        self.Id = ko.observable();
        self.CategoryName = ko.observable('').extend({ required: true, pattern: { message: 'Only alphabetical values required.', params: "[^\p{L}\d\s_]", maxLength: "100" } });
        self.Code = ko.observable().extend({ required: true, minLength: 3, maxLength: 10 });
        self.ParentId = ko.observable();
        self.ParentName = ko.observable('');
        self.Details = ko.observable();
        self.Level = ko.observable().extend({ required: true });
        self.LevelName = ko.observable('');
        
        self.Levels = ko.observableArray([]);
        self.CategoryList = ko.observableArray([]);
        self.Categories=ko.observableArray([]);

        self.Link1 = ko.observable();
        self.Link2 = ko.observable();
        self.Link3 = ko.observable();

        self.Title1 = ko.observable('PDF');
        self.Title2 = ko.observable('Excel');
        self.Title3 = ko.observable('Word');

        self.Level.subscribe( function()
        {
            self.getParents();
            //self.getCategoriesByLevel();
        });

        self.Reset = function () {
            self.Id('');
            self.CategoryName('');
            self.Code('');
            self.Level();
            self.ParentId('');
            self.Details('');
            
        };

        self.SaveCategory = function () {
            if (self.IsValid()) {
                $.ajax({
                    type: "POST",
                    url: '/FAMS/Category/SaveCategory',
                    data: ko.toJSON(this),
                    contentType: "application/json",
                    success: function (data) {
                        $('#successModal').modal('show');
                        $('#successModalText').text(data.Message);
                         self.getAllCategories();
                         self.Reset();
                    },
                    error: function () {
                        $('#successModal').modal('show');
                        $('#successModalText').text(error.status + "<--save and--> " + error.statusText);
                       
                    }
                });
            }
            else
            {
                $('#successModal').modal('show');
                $('#successModalText').text(error.status + "<--save and--> " + error.statusText);
            }

        };
        self.getLevels = function () {

            return $.ajax({
                type: "GET",
                url: '/FAMS/Category/getCategoryLevels',
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
        self.getAllCategories = function () {
           return $.ajax({
                type: "GET",
                url: '/FAMS/Category/GetAllCategories',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.Categories(data);
                },
                error: function (error) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(error.status + "<--save and--> " + error.statusText);
                }
            });
        };
        self.getCategoriesByLevel = function () {
            return $.ajax({
                type: "GET",
                url: '/FAMS/Depreciation/GetAllCategoriesByLevel?level=' + self.Level(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.Categories(data);

                },
                error: function (error) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(error.status + "<--save and--> " + error.statusText);
                }
            });
        };
        self.SearchCategories= function (data) {
              if (self.Level() > 0) {
                return $.ajax({
                    type: "POST",
                    url: '/FAMS/CategoryReports/getFilturedCategory?level=' + self.Level() + '&catid=' + self.Id(),
                    data: ko.toJSON(this),
                    contentType: "application/json",
                    success: function (data) {
                        self.Categories(data);
                        self.setUrl();
                    },
                    error: function () {
                        $('#successModal').modal('show');
                        $('#successModalText').text(error.status + "<--save and--> " + error.statusText);
                    }
                });
            }
            else {
                $('#successModal').modal('show');
                $('#successModalText').text('Please Select Category Level');
            }
        };

        self.getParents = function () {
            if (self.Level() > 0) {
                return $.ajax({
                    type: "GET",
                    url: '/FAMS/Category/getParents?level=' + self.Level(),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        self.CategoryList(data);
                    },
                    error: function (error) {
                        $('#successModal').modal('show');
                        $('#successModalText').text(error.statusText);
                    }
                });
            }
            else {
                $('#successModal').modal('show');
                $('#successModalText').text('Please select Level!');
            }

        };
       
        self.setUrl = ko.computed(function () {
            self.Link1('/FAMS/CategoryReports/getReport?level=' + self.Level() + '&reportTypeId=PDF&catid=' + self.Id());
            self.Link2('/FAMS/CategoryReports/getReport?level=' + self.Level() + '&reportTypeId=Excel&catid=' + self.Id());
            self.Link3('/FAMS/CategoryReports/getReport?level=' + self.Level() + '&reportTypeId=Word&catid=' + self.Id());
        });

        self.errors = ko.validation.group(self);
        self.IsValid = ko.computed(function () {
            var err = self.errors().length;
            if (err == 0)
                return true;
            return false;
        });

        self.InitialValueLoad = function () {
            self.getAllCategories();
            self.getLevels();
            self.errors.showAllMessages(true);
           };

        

        self.getEditUrl = function (data) {
            return '/FAMS/Category/Edit?id=' + data.Id;
        };

        

        self.editCategory = function (data) {
            self.Id(data.Id);
            self.CategoryName(data.CategoryName);
            self.Code(data.Code);
            self.Details(data.Details);
            self.Level(data.Level);
            self.LevelName(data.LevelName);
            $.when(self.getParents()).done(function () {
                self.ParentId(data.ParentId);
                self.ParentName(data.ParentName);
            });
      
        };

        
    }

    var vm = new CategoryVm();
    vm.InitialValueLoad();
  

    ko.applyBindings(vm, $('#CategoryDiv')[0]);
});