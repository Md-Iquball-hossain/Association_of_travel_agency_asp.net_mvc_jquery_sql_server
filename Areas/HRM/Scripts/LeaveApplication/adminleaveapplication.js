$(document).ready(function () {
    var phone, email;
    function populateEmployee(isEdit) {
        var EmployeeCombo = $("#tr_EmployeeId select");
        var SubstitutorCombo = $("#tr_SubstitutorId select");
        var LeaveTypeCombo = $("#tr_LeaveTypeId select");
        $(EmployeeCombo).attr("id", "EmployeeId").attr("name", "EmployeeId");
        $(SubstitutorCombo).attr("id", "SubstitutorId").attr("name", "SubstitutorId");
        $(LeaveTypeCombo).attr("id", "LeaveTypeId").attr("name", "LeaveTypeId");
        var selectedEmployeeId = $("#jqGrid").jqGrid('getRowData', $("#jqGrid")[0].p.selrow).EmployeeId | 0;
        $(EmployeeCombo)
                     .html("<option value=''>Loading Employees...</option>")
                     .attr("disabled", "disabled");
        $.ajax({
            url: '/HRM/LeaveApplication/GetCorrespondingEmployees',
            type: "GET",
            success: function (employeeHtml) {
                $(EmployeeCombo).removeAttr("disabled").html(employeeHtml);
                if (isEdit) {
                    $(EmployeeCombo).val(selectedEmployeeId);
                } else {
                    $(EmployeeCombo).selectedIndex = 0;
                }
                updateSubstitutorCallBack(isEdit, $(EmployeeCombo).val(), SubstitutorCombo, LeaveTypeCombo);
            }
        });
        $(EmployeeCombo).bind("change", function (e) {
            updateSubstitutorCallBack(false, $(EmployeeCombo).val(), SubstitutorCombo, LeaveTypeCombo);
        });
    }
    function updateSubstitutorCallBack(isEdit, selectedEmployeeId, SubstitutorCombo, LeaveTypeCombo) {
        var url = '/HRM/LeaveApplication/GetSubstitutorForLeave/' + selectedEmployeeId;
        $(SubstitutorCombo)
             .html("<option value=''>Loading substitutors...</option>")
             .attr("disabled", "disabled");
        $(LeaveTypeCombo)
             .html("<option value=''>Loading substitutors...</option>")
             .attr("disabled", "disabled");
        $.ajax({
            url: url,
            type: "GET",
            success: function (substitutorJson) {
                var data = eval(substitutorJson);
                var substitutors = data.emplist;
                var leavetypes = data.leavetypelist;
                phone = data.phone;
                //console.log("phone " + phone);
                email = data.email;
                $("#Email").val(email);
                $("#Phone").val(phone);
                var substitutorHtml = "";
                var leaveTypeHtml = "";
                $(substitutors).each(function (i, option) {
                    substitutorHtml += '<option value="' + option.Id + '">' + option.FirstName + " " + option.LastName + '</option>';
                });
                $(leavetypes).each(function (i, option) {
                    leaveTypeHtml += '<option value="' + option.Id + '">' + option.Name + '</option>';
                });
                $(SubstitutorCombo).removeAttr("disabled").html(substitutorHtml);
                $(LeaveTypeCombo).removeAttr("disabled").html(leaveTypeHtml);
                if (isEdit) {
                    var selectedSubstitutorId = $("#jqGrid").jqGrid('getRowData', $("#jqGrid")[0].p.selrow).SubstitutorId | 0;
                    var selectedLeaveTypeId = $("#jqGrid").jqGrid('getRowData', $("#jqGrid")[0].p.selrow).LeaveTypeId | 0;
                    $(SubstitutorCombo).val(selectedSubstitutorId);
                    $(LeaveTypeCombo).val(selectedLeaveTypeId);
                } else {
                    $(SubstitutorCombo).selectedIndex = 0;
                    $(LeaveTypeCombo).selectedIndex = 0;
                }
                $(SubstitutorCombo).focus();
                $(LeaveTypeCombo).focus();
            }
        });
    }
    $(function () {
        $("#jqGrid").jqGrid({
            url: "/HRM/LeaveApplication/GetLeaveApplicationsForApproval",
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'EmployeeId', 'Employee', 'From Date', 'To Date', 'Total Days', 'LeaveTypeId', 'Leave Type', 'Description', 'CurrentLeaveStatus', 'Leave-Status', 'SubstitutorId', 'Substitutor', 'Address', 'Email', 'Phone', 'Comments'],
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                { key: false, hidden: true, name: 'EmployeeId', index: 'EmployeeId', editable: true, edittype: "select", editrules: { required: true, edithidden: true }, formoptions: { label: "Employee " }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'EmployeeName', index: 'EmployeeName', label: "Employee Name", width: 140, editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                {
                    name: "FromDate", index: 'FromDate', label: "From Date", formatter: "date", editable: true, edittype: "text",
                    editoptions: {
                        dataInit: function (element) {
                            $(element).datepicker({
                                id: 'fromDate_datePicker',
                                //dateFormat: 'M/d/yy',
                                //minDate: new Date(2010, 0, 1),
                                maxDate: new Date(2020, 0, 1),
                                dateFormat: 'dd-M-yy',
                                changeYear: true,
                                showOn: 'focus',
                                onClose: function () {
                                    var dt1 = $('#FromDate').datepicker('getDate');
                                    var dt2 = $('#ToDate').datepicker('getDate');
                                    //check to prevent a user from entering a date below date of dt1
                                    if (dt2 <= dt1) {
                                        //var minDate = $('#ToDate').datepicker('option', 'minDate');
                                        $('#FromDate').datepicker('setDate', new Date());
                                    } else {
                                        var totaldays = (dt2 - dt1) / (1000 * 60 * 60 * 24);
                                        $("#TotalDays").val(totaldays);
                                    }
                                }
                            });
                        }, editrules: { required: true }, formoptions: { label: "From Date: " }
                    }
                },
                {
                    name: "ToDate", index: 'ToDate', label: "To Date", formatter: "date", editable: true, edittype: "text",
                    editoptions: {
                        dataInit: function (element) {
                            $(element).datepicker({
                                id: 'toDate_datePicker',
                                //dateFormat: 'M/d/yy',
                                //minDate: new Date(2010, 0, 1),
                                dateFormat: 'dd-M-yy',
                                maxDate: new Date(2020, 0, 1),
                                changeYear: true,
                                showOn: 'focus',
                                onClose: function () {
                                    var dt1 = $('#FromDate').datepicker('getDate');
                                    var dt2 = $('#ToDate').datepicker('getDate');
                                    //check to prevent a user from entering a date below date of dt1
                                    if (dt2 <= dt1) {
                                        var minDate = $('#ToDate').datepicker('option', 'minDate');
                                        $('#FromDate').datepicker('setDate', minDate);
                                    } else {
                                        var totaldays = (dt2 - dt1) / (1000 * 60 * 60 * 24);
                                        $("#TotalDays").val(totaldays);
                                    }
                                }
                            });
                        }, editrules: { required: true }, formoptions: { label: "To Date: " }
                    }
                },
                { key: false, name: 'TotalDays', index: 'TotalDays', width: 140, editable: true, label: "Total Days", editrules: { custom_func: validatePositive, custom: true, required: true }, align: 'right', formoptions: { label: "Total Days" }, searchoptions: { sopt: ['eq', 'ne'] }, classes: "grid-col" },
                { key: false, hidden: true, name: 'LeaveTypeId', width: 140, index: 'LeaveTypeId', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/LeaveApplication/GetCorrespondingLeaveTypes', cacheUrlData: true }, editrules: { edithidden: true, required: true }, formoptions: { label: "Leave Type: " } },
                { key: false, name: 'LeaveTypeName', index: 'LeaveTypeName', label: "Leave Type Name", editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'Description', index: 'Description', width: 140, editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, hidden: true, name: "CurrentLeaveStatus", index: "CurrentLeaveStatus", width: 140, editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/LeaveApplication/GetCorrespondingLeaveApplicationStatus', cacheUrlData: true }, editrules: { edithidden: true, required: true }, formoptions: { label: "Current Leave-Status: " } },
                { key: false, name: 'CurrentLeaveStatusName', index: 'CurrentLeaveStatusName', width: 140, editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, hidden: true, name: 'SubstitutorId', width: 140, index: 'SubstitutorId', editable: true, edittype: "select", editoptions: { dataUrl: '' + $("#EmployeeId").val }, editrules: { edithidden: true, required: true }, formoptions: { label: "Substitutor: " } },
                { key: false, name: 'SubstitutorName', index: 'SubstitutorName', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'Address', index: 'Address', width: 140, editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'Email', index: 'Email', width: 140, editable: true, editrules: { email: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'Phone', index: 'Phone', width: 140, editable: true, editrules: { number: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'Comments', index: 'Comments', width: 140, editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" }
            ],
            ondblClickRow: function (rowid) {
                jQuery("#jqGrid").jqGrid('editGridRow', rowid);
            },
            loadonce: true,
            pager: jQuery('#jqGridPager'),
            rowNum: 10,
            rowList: [10, 20, 30, 40, 50],
            hoverrows: true,
            sortable: true,
            //width: '70%',
            viewrecords: true,
            caption: 'Leave Application Records',
            emptyrecords: 'No Leave Application Records are Available to Display',
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
        { edit: true, add: true, del: true, search: true, refresh: true },
        {
            zIndex: 100,
            url: '/HRM/LeaveApplication/SaveLeaveApplication',
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterEdit: true,
            recreateForm: true,
            onInitializeForm: function (formId) { populateEmployee(true); },
            afterComplete: function (response) {
                Messager.ShowMessage(response.responseText);
            }
        },
        {
            zIndex: 100,
            url: '/HRM/LeaveApplication/SaveLeaveApplication',
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterAdd: true,
            onInitializeForm: function (formId) { populateEmployee(false); },
            afterComplete: function (response) {
                Messager.ShowMessage(response.responseText);
            }
        },
        {
            zIndex: 100,
            url: '/HRM/LeaveApplication/DeleteLeaveApplication',
            closeOnEscape: true,
            closeAfterDelete: true,
            recreateForm: true,
            msg: "Are you sure to delete this Leave application?",
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
    $.extend($.jgrid.edit, {
        bSubmit: "Save",
        bCancel: "Cancel",
        width: 370,
        recreateForm: true,
        beforeShowForm: function (form) {
            var myGrid = $('#jqGrid'),
            selectedRowId = myGrid.jqGrid('getGridParam', 'selrow'),
            id = myGrid.jqGrid('getCell', selectedRowId, 'Id'); 
            console.log(id);
            $('<a href="#">Forward<span class="ui-icon ui-icon-disk"></span></a>')
                .click(function (params, postdata) {
                    //var myPostData = $('#jqGrid').jqGrid("getGridParam", "postData");
                    //console.log(myPostData); 
                    $.ajax({
                        type: "POST",
                        url: '/HRM/LeaveApplication/ForwardLeaveApplication?id=' + id,
                        //data: myPostData,
                        contentType: "application/json",

                        //onclickSubmit: function (params, postdata) {
                        //   postdata = $.extend({}, postdata);
                        //   return postdata;
                        //},
                        success: function (data) {
                            //console.log(data);

                        },
                        error: function () {
                            alert(error.status + "<--and--> " + error.statusText);
                        }
                    });


                    //alert("click!");
                    //$self.jqGrid("editGridRow", $self.jqGrid("SaveLeaveApplication", "LeaveApplication"), {
                    //    editData: {//Function to Add parameters to the status 
                    //        oper: 'add', //trying to pass parameter to server
                    //    },
                    //});

                }).addClass("fm-button ui-state-default ui-corner-all fm-button-icon-left")
                  .prependTo("#Act_Buttons>td.EditButton");
        }
    });
    // $grid.jqGrid('navGrid', '#pager');


});

