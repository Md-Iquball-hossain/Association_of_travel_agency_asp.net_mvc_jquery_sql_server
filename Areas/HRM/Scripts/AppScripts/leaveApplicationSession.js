$(document).ready(function () {
    function updateSubstitutor(isEdit) {
        var SubstitutorCombo = $("#tr_SubstitutorId select");
        var LeaveTypeCombo = $("#tr_LeaveTypeId select");
        $(SubstitutorCombo).attr("id", "SubstitutorId").attr("name", "SubstitutorId");
        $(LeaveTypeCombo).attr("id", "LeaveTypeId").attr("name", "LeaveTypeId");
        var url = '/HRM/LeaveApplication/GetSubstitutorForLeave/' + 1;
        $(SubstitutorCombo)
             .html("<option value=''>Loading substitutors...</option>")
             .attr("disabled", "disabled");
        $(LeaveTypeCombo)
             .html("<option value=''>Loading leave types...</option>")
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
            url: "/HRM/LeaveApplication/GetLeaveApplicationForSession/" + 1,
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'FromDate', 'ToDate', 'TotalDays', 'LeaveTypeId', 'LeaveTypeName', 'CurrentLeaveStatusName', 'Description', 'SubstitutorId', 'Address', 'Email', 'Phone', 'Comments','SeniorId'],//, 'CurrentLeaveStatus'
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                {
                     name: "FromDate", index: 'FromDate', formatter: "date", editable: true, edittype: "text",
                     editoptions: {
                         dataInit: function (element) {
                             $(element).datepicker({
                                 id: 'fromDate_datePicker',
                                 //dateFormat: 'M/d/yy',
                                 //minDate: new Date(2010, 0, 1),
                                 maxDate: new Date(2020, 0, 1),
                                 dateFormat: 'dd-M-yy',
                                 changeYear: true,
                                 showOn: 'focus'

                             });
                         }, editrules: { required: true }, formoptions: { label: "From Date: " }
                     }
                 },
                 {
                     name: "ToDate", index: 'ToDate', formatter: "date", editable: true, edittype: "text",
                     editoptions: {
                         dataInit: function (element) {
                             $(element).datepicker({
                                 id: 'toDate_datePicker',
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
                         }, editrules: { required: true }, formoptions: { label: "To Date: " }
                     }
                 },
                { key: false, name: 'TotalDays', index: 'TotalDays', width: 140, editable: true, editrules: { custom_func: validatePositive, custom: true, required: true }, formoptions: { label: "Total Days" }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                {
                    key: false, hidden: true, name: 'LeaveTypeId', index: 'LeaveTypeId', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/LeaveApplication/GetCorrespondingLeaveTypes', cacheUrlData: true }, editrules: { edithidden: true, required: true },
                    formoptions: { label: "LeaveType" }
                },
                { key: false, name: 'LeaveTypeName', index: 'LeaveTypeName', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                //{
                //    key: false, hidden: true, name: 'CurrentLeaveStatus', index: 'CurrentLeaveStatus', editable: true, edittype: "select", editoptions: { dataUrl: '/LeaveApplication/GetCorrespondingLeaveApplicationStatus', cacheUrlData: true }, editrules: { edithidden: true, required: true },
                //    formoptions: { label: "Leave Status" }
                //},
                { key: false, name: 'CurrentLeaveStatusName', index: 'CurrentLeaveStatusName', width: 140, editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, hidden: true, name: 'Description', index: 'Description', width: 140, editable: true, editrules: { edithidden: true, custom_func: validateText, custom: true, required: true }, formoptions: { label: "Description" }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, hidden: true, name: 'SubstitutorId', width: 140, index: 'SubstitutorId', editable: true, edittype: "select", editoptions: { dataUrl: '' + $("#EmployeeId").val }, editrules: { edithidden: true, required: true }, formoptions: { label: "Substitutor: " } },
                { key: false, hidden: true, name: 'Address', index: 'Address', width: 140, editable: true, editrules: { edithidden: true, custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, hidden: true, name: 'Email', index: 'Email', width: 140, editable: true, editrules: { edithidden: true, email: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, hidden: true, name: 'Phone', index: 'Phone', width: 140, editable: true, editrules: { edithidden: true, custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, hidden: true, name: 'Comments', index: 'Comments', width: 140, editable: true, editrules: { edithidden: true, custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, hidden: true, name: 'SeniorId', index: 'SeniorId', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/LeaveApplication/GetSeniorsLeaveApplicationStatus', cacheUrlData: true }, editrules: { edithidden: true, required: true }, label: "SeniorEmployee", searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" }
            ],
            ondblClickRow: function (rowid) {
                jQuery("#jqGrid").jqGrid('editGridRow', rowid);
            },
            loadonce: true,
            pager: jQuery('#jqGridPager'),
            rowNum: 10,
            height: "100%",
            rowList: [10, 20, 30, 40, 50],
            sortable: true,
            hoverrows: true,
            width: '70%',
            viewrecords: true,
            caption: 'Employee Leave Records',
            emptyrecords: 'No Records are Available to Display',
            subGrid: true,
            subGridRowExpanded: function (subgrid_id, row_id) {
                // we pass two parameters
                // subgrid_id is a id of the div tag created within a table
                // the row_id is the id of the row
                // If we want to pass additional parameters to the url we can use
                // the method getRowData(row_id) - which returns associative array in type name-value
                // here we can easy construct the following
                var subgrid_table_id, pager_id;
                subgrid_table_id = subgrid_id + "_t";
                pager_id = "p_" + subgrid_table_id;
                jQuery("#" + subgrid_id).html("<table id='" + subgrid_table_id + "' class='scroll'></table><div id='" + pager_id + "' class='scroll'></div>");
                var dataFromCellByColumnName = jQuery('#jqGrid').jqGrid('getCell', row_id, 'Id');
                console.log("leaveid " + dataFromCellByColumnName);
                $.ajax({
                    url: '/HRM/LeaveApplication/GetLeaveApplicationDetailForSession/?leaveid=' + dataFromCellByColumnName,
                    type: "GET",
                    datatype: "json",
                    success: function (datahtml) {
                        var html = "<span style='font-size:120%;'><b>Description</b> " +
               datahtml.Description + "</span><br/><span style='font-size:120%;'><b>SubstitutorName</b> " +
               datahtml.SubstitutorName + "</span><br/><span style='font-size:120%;'><b>Address</b> " +
               datahtml.Address + "</span><br/><span style='font-size:120%;'><b>Email</b> " +
               datahtml.Email + "</span><br/><span style='font-size:120%;'><b>Phone</b> " +
               datahtml.Phone + "</span><br/><span style='font-size:120%;'><b>Comments</b> " +
               datahtml.Comments + "</span><br/>";
                        $("#" + subgrid_id).append(html);
                    }
                });
                // jQuery("#" + subgrid_table_id).jqGrid('navGrid', "#" + pager_id, { edit: true, add: true, del: true });

            },
            subGridOptions: {
                // configure the icons from theme rolloer
                plusicon: "ui-icon-triangle-1-e",
                minusicon: "ui-icon-triangle-1-s",
                openicon: "ui-icon-arrowreturn-1-e"
            },
            jsonReader: {
                root: "rows",
                page: "page",
                total: "total",
                records: "records",
                repeatitems: false,
                Id: "0"
            },
            autowidth: true,
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
            onInitializeForm: function (formId) { updateSubstitutor(true); },
            //onclickSubmit: function (params, postdata) {
            //    postdata = $.extend({}, postdata, { EmployeeId: 1 });
            //    return postdata;
            //},
            afterComplete: function (response) {
                Messager.ShowMessage(response.responseText);
                location.reload(true);
            }
        },
        {
            zIndex: 100,
            url: '/HRM/LeaveApplication/SaveLeaveApplication',
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterAdd: true,
            onInitializeForm: function (formId) { updateSubstitutor(false); },
            //onclickSubmit: function (params, postdata) {
            //    postdata = $.extend({}, postdata, { EmployeeId: 1 });
            //    return postdata;
            //},
            afterComplete: function (response) {
                Messager.ShowMessage(response.responseText);
                location.reload(true);
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
});