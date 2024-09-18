
$(document).ready(function () { 
    function receiveDetail(data) {
        var self = this;
        self.Id = ko.observable(data.Id ? data.Id : '');
        self.Name = ko.observable(data.Name ? data.Name : '');
        self.Pick = ko.observable(data.IsHoliday ? data.IsHoliday : false);
    }
    function receiveVM() {
        var self = this;
        self.Pick = ko.observable(false);

        self.SalaryProcesses = ko.observableArray([]);

        self.PickedLeaveApplication = ko.observableArray([]);
        self.LeaveTypes = ko.observableArray([]);
        self.SeniorList = ko.observableArray([]);
        //self.LeaveStatus = ko.observableArray(leaveStatus);
        self.LeaveStatus = ko.observableArray();
        self.Id = ko.observable('');
        self.SeniorId = ko.observable('');
        self.EmployeeName = ko.observable('');
        self.From = ko.observable('');
        self.To = ko.observable('');
        self.TotalDays = ko.observable('');
        self.LeaveType = ko.observable('');
        self.Description = ko.observable('');
        self.CurrentLeaveStatus = ko.observable('');

        self.Substitutor = ko.observable('');
        self.Address = ko.observable('');
        self.Email = ko.observable('');
        self.Comments = ko.observable('');
        self.Pick = ko.observable(false);

        self.Designations = ko.observableArray([]);
        self.DesignationId = ko.observable('');

        self.OfficeUnits = ko.observableArray([]);
        self.OfficeUnitId = ko.observable('');

        self.Offices = ko.observableArray([]);
        self.OfficesId = ko.observable('').extend({ required: true, message: 'Please Select Ofiice...' });

        self.Employees = ko.observableArray([]);
        self.EmployeesId = ko.observable('');

        self.Month = ko.observable('').extend({ required: true, message: 'Please Select Month...' });

        //Edit Sal
        self.EditYearMonthId = ko.observable();
        self.EditYearMonthList = ko.observableArray([]);

        self.EmployeeId = ko.observable();//.extend({ required: true });
        self.EmployeeList = ko.observableArray([]);
        self.OfficeEmployees = ko.observableArray([]);
        self.selectedEmployees = ko.observableArray([]);
        self.TotalSal = ko.observable(0);
        self.EditedSal = ko.observable(0);
        //


        self.Month.subscribe(function () {
            self.EditYearMonthId(moment(self.Month()).format("YYYY") + "_" + moment(self.Month()).format("MM"));
        });
        self.LoadSalaryInitial = function () {
            self.getDesignationWiseOffice();
        };

        //self.getDesignationList = function () {
        //    $.ajax({
        //        type: "GET",
        //        url: '/SalaryProcess/GetDesignationList',
        //        contentType: "application/json; charset=utf-8",
        //        dataType: "json",
        //        success: function (data) {
        //            //console.log(data);
        //            self.Designations(data);
        //        },
        //        error: function (error) {
        //            alert(error.status + "<--and--> " + error.statusText);
        //        }
        //    });
        //}

        self.errors = ko.validation.group(self);
        self.IsValid = ko.computed(function () {
            //self.errors().length === 0 && 
            //&& self.TechnicianValidity().validator
            if (self.errors().length === 0)
                return true;
            else {
                return false;
            }
        });

        self.getDesignationWiseGradestep = function () {
            var designation = self.DesignationId() ? self.DesignationId() : 0;

            self.SalaryProcesses.removeAll();

         return   $.ajax({
                type: "GET",
                url: '/HRM/SalaryProcess/GetDesignationWiseGradestep?designationId=' + designation,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    //console.log("Salary Process: " + ko.toJSON(data));
                    $.each(data, function (index, value) {
                        self.SalaryProcesses.push(new receiveDetail(value));
                    });
                    self.getEmployees();
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });

        }

        self.getEmployees = function () {
            
            return $.ajax({
                type: "GET",
                url: '/HRM/SalaryProcess/GetOfficeWiseEmployee?officeId=' + self.OfficesId(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    //console.log("Employees: " + ko.toJSON(data));
                    self.OfficeEmployees(data);
                    //$.each(data, function (index, value) {
                    //    self.SalaryProcesses.push(new receiveDetail(value));
                    //});

                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });

        }
        self.getDesignationWiseOffice = function () {
            var OfficeUnit = self.OfficeUnitId() ? self.OfficeUnitId() : 0;
            //console.log(OfficeUnit);
            //self.SalaryProcesses('');
          return  $.ajax({
                type: "GET",
                url: '/HRM/SalaryProcess/GetDesignationWiseOffice?officeUnit=' + OfficeUnit,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    self.Offices(data);
                    //self.OfficesId(data.Id);
                    //console.log(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });

        }
        self.Posting = function () {
            //var OfficeUnit = self.OfficeUnitId() ? self.OfficeUnitId() : 0;
            //console.log(OfficeUnit);
            //self.SalaryProcesses('');
            $.ajax({
                type: "GET",
                url: '/HRM/SalaryProcess/SalaryPosting?fiscalYearId=' + moment(self.Month()).format("YYYY") + '&monthId=' + moment(self.Month()).format("MM") + '&officeId=' + self.OfficesId(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    $('#successModal').modal('show');
                    $('#successModalText').text(data.Message);
                    //self.Offices(data);
                    //self.OfficesId(data.Id);
                    //console.log(data);
                },
                error: function (error) {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });

        }
        self.Process = function () {
            self.LoadProcessedSalary();
            $('#processModal').modal('show');

        }

        self.Edit = function () {
            $('#editModal').modal('show');
            //$('#successModalText').text(data.Message);
        }

        self.Submit = function () {
            var postdata = {
                FiscalYearId: moment(self.Month()).format("YYYY"),
                OfficeId: self.OfficesId(),
                OfficeUnitId: self.OfficeUnitId(),
                Month: moment(self.Month()).format("MM"),
                SalaryItems: self.SalaryProcesses(),
                SelectedEmployeeIds: self.selectedEmployees()
            };


            if (self.IsValid()) {
                $("#divLoading").show();
                $.ajax({
                    type: "POST",
                    url: '/HRM/SalaryProcess/SaveSalaryProcess',
                    data: ko.toJSON(postdata),
                    contentType: "application/json",
                    success: function (data) {
                        //console.log(data);
                        $("#divLoading").hide();
                        $('#successModal').modal('show');
                        $('#successModalText').text(data.Message);
                        //self.ReceiveDetails.removeAll();
                        self.SalaryProcesses.removeAll();
                        
                    },
                    error: function () {
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            }
        };

        self.dateDetails = ko.observableArray([]);

        self.leaveDetails = function (details) {
            self.dateDetails(details);
            //console.log(details);
            self.Id(details.Id);
            self.EmployeeName(details.EmployeeName);
            self.From(details.From);
            self.To(details.To);
            self.TotalDays(details.TotalDays);
            self.LeaveType(details.LeaveTypeId);
            self.Description(details.Description);
            self.CurrentLeaveStatus(details.CurrentLeaveStatus);
            self.SeniorId('');
            self.Substitutor(details.SubstitutorName);
            self.Address(details.Address);
            self.Email(details.Email);
            self.Comments(details.Comments);

        };

        self.Reset = function () {

            self.Pick(false);
        };
        self.IsSave = function () {
            return true;
        };

        // Edit Salary

        self.LoadEditInitial = function () {
            //$.getJSON("/HRM/SalaryProcess/GetYearMonthCombo/", null, function (data) {
            //    self.EditYearMonthList(data);
            //});
            $.getJSON("/HRM/Employee/GetAllActiveEmployees/", null, function (data) {
                self.EmployeeList(data);
            });
        };

        self.LoadProcessedSalary = function () {
            jQuery("#jqGrid").jqGrid('setGridParam', { url: "/HRM/SalaryProcess/GetSalaryProcessesForPeriod/?YearMonth=" + self.EditYearMonthId() + "&officeid=" + self.OfficesId(), datatype: 'json' }); // the last setting is for demo only
            //jQuery("#jqGrid").jqGrid('setGridParam', { url: "/HRM/SalaryProcess/GetSalaryProcessesForPeriod/?YearMonth=" + self.Month() + "&empid=" + self.EmployeeId(), datatype: 'json' }); // the last setting is for demo only
            jQuery("#jqGrid").jqGrid('setCaption', 'Salary Process Records');
            jQuery("#jqGrid").trigger("reloadGrid");
            $.getJSON("/HRM/SalaryProcess/GetTotalSalaryByTimePeriod/?YearMonth=" + self.EditYearMonthId() + "&officeid=" + self.OfficesId(), null, function (data) {
                //$.getJSON("/HRM/SalaryProcess/GetTotalSalaryByTimePeriod/?YearMonth=" + self.Month() + "&empid=" + self.EmployeeId(), null, function (data) {
                self.TotalSal(data.CalculatedTotal);
                self.EditedSal(data.EditedTotal);
                console.log(self.TotalSal());
                console.log(self.EditedSal());
            });

        };

        self.EmployeeId.subscribe(function () { //DesignationList is populated with change of selectedGradeId 
            jQuery("#jqGrid").jqGrid('setGridParam', { url: "/HRM/SalaryProcess/GetSalaryProcessesForPeriod/?YearMonth=" + self.EditYearMonthId() + "&empid=" + self.EmployeeId(), datatype: 'json' }); // the last setting is for demo only
            //jQuery("#jqGrid").jqGrid('setGridParam', { url: "/HRM/SalaryProcess/GetSalaryProcessesForPeriod/?YearMonth=" + self.Month() + "&empid=" + self.EmployeeId(), datatype: 'json' }); // the last setting is for demo only
            jQuery("#jqGrid").jqGrid('setCaption', 'Salary Process Records');
            jQuery("#jqGrid").trigger("reloadGrid");
            $.getJSON("/HRM/SalaryProcess/GetTotalSalaryByTimePeriod/?YearMonth=" + self.EditYearMonthId() + "&empid=" + self.EmployeeId(), null, function (data) {
                //$.getJSON("/HRM/SalaryProcess/GetTotalSalaryByTimePeriod/?YearMonth=" + self.Month() + "&empid=" + self.EmployeeId(), null, function (data) {
                self.TotalSal(data.CalculatedTotal);
                self.EditedSal(data.EditedTotal);
                console.log(self.TotalSal());
                console.log(self.EditedSal());
            });
        });
        //
    }

    $(function () {
        $("#jqGrid").jqGrid({
            url: '/HRM/Grade/EmptyJson',
            mtype: "GET",
            datatype: "json",
            //, 'Id', 'OfficeName', 'Unit Name' , 'Month', 'Year', 'EmpName'
            colNames: ['Edit', 'Id','Employee', 'Month','CalculatedValue', 'EditedValue', 'Comments'],
            colModel: [
                {
                    label: "Edit Actions",
                    name: "actions",
                    width: 100,
                    formatter: "actions",
                    formatoptions: {
                        keys: true,
                        editOptions: {},
                        addOptions: {},
                        delOptions: {}
                    }
                },
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                { key: false, name: 'EmpName', index: 'EmpName', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                //{ key: false, name: 'OfficeName', index: 'OfficeName', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                //{ key: false, name: 'UnitName', index: 'UnitName', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                //{ key: false, name: 'SalaryItemName', index: 'SalaryItemName', editable: true, editoptions: { readonly: "readonly" }, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                { key: false, name: 'Month', index: 'Month', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                //{ key: false, name: 'Year', index: 'Year', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                //{ key: false, name: 'EmpName', index: 'EmpName', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                { key: false, name: 'CalculatedValue', index: 'CalculatedValue', editable: true, editoptions: { readonly: "readonly" }, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                { key: false, name: 'EditedValue', index: 'EditedValue', editable: true},
                { key: false, name: 'Comments', index: 'Comments', editable: true, edittype: "textarea", editoptions: { cols: 20, rows: 2 }, searchoptions: { sopt: ['eq', 'ne', 'cn'] } }
            ],
            loadComplete: function () {
                var ids = $("#jqGrid").jqGrid('getDataIDs');

                for (var i = 0; i < ids.length; i++) {
                    var id = ids[i];
                    console.log(id);
                    //if ($("#jqGrid").jqGrid('getCell', id, 'SalaryItemName') == 'Basic') {
                    //    $('#' + id, '#jqGrid').addClass('not-editable-row');
                    //}
                }
            },
            loadonce: true,
            pager: jQuery('#jqGridPager'),
            rowNum: 20,
            rowList: [10, 20, 30, 40, 50],
            hoverrows: true,
            sortable: true,
            width: '80%',
            viewrecords: true,
            caption: 'Salary Process Records',
            editurl: "/HRM/SalaryProcess/SaveSalaryProcessDetail",
            emptyrecords: 'No Records are Available to Display',
            jsonReader: {
                root: "rows",
                page: "page",
                total: "total",
                records: "records",
                repeatitems: false,
                Id: "0"
            },
            autowidth: true,
            height: 'auto',//set auto height
            multiselect: false
        }).navGrid('#jqGridPager',
        { edit: true, add: false, del: true, search: false, refresh: true },
        {
            zIndex: 100,
            url: '/HRM/SalaryProcess/SaveSalaryProcessDetail',
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterEdit: true,
            recreateForm: true,
            afterComplete: function (response) {
                Messager.ShowMessage(response.responseText);
            }
        },
        {
            zIndex: 100,
            url: "/HRM/SalaryProcess/SaveSalaryProcessDetail",
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterAdd: true,
            afterComplete: function (response) {
                Messager.ShowMessage(response.responseText);
            }
        },
        {
            zIndex: 100,
            url: "/HRM/Module/DeleteModule",
            closeOnEscape: true,
            closeAfterDelete: true,
            recreateForm: true,
            msg: "Are you sure to delete this process? ",
            afterComplete: function (response) {
                Messager.ShowMessage(response.responseText);
            }
        },
        {
            closeOnEscape: true, multipleSearch: true,
            closeAfterSearch: true
        }
        );
    });

    var vm = new receiveVM();
    vm.LoadSalaryInitial();
    vm.LoadEditInitial();
    ko.applyBindings(vm, $("#receiveDiv")[0]);
});