$(document).ready(function () {
    $(function () {
        $("#jqGrid").jqGrid({
            url: "/HRM/LeaveApplication/GetEmployeeLeaveStatus",
            datatype: 'json',
            mtype: 'Get',
            colNames: ['EmployeeId', 'Employee Name', 'Designation Name', 'Office Unit Name', 'Employee Type Name'],
            colModel: [
                { key: true, hidden: true, name: 'EmployeeId', index: 'EmployeeId', editable: false },
                { key: false, name: 'EmployeeName', index: 'EmployeeName', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                { key: false, name: 'DesignationName', index:'DesignationName', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                { key: false, name: 'OfficeUnitName', index: 'OfficeUnitName', editable: false, searchoptions: { sopt: ['eq', 'ne'] } },
                { key: false, name: 'EmployeeTypeName', index: 'EmployeeTypeName', editable: false, searchoptions: { sopt: ['eq', 'ne'] } }
            ],
            ondblClickRow: function (rowid) {
                jQuery("#jqGrid").jqGrid('editGridRow', rowid);
            },
            loadonce: true,
            pager: jQuery('#jqGridPager'),
            rowNum: 10,
            height:"100%",
            rowList:[10, 20, 30, 40, 50],
            sortable: true,
            hoverrows: true,
            width: '100%',
            viewrecords: true,
            caption: 'Employee Leave Records',
            emptyrecords: 'No Records are Available to Display',
            subGrid: true,
            subGridRowExpanded: function(subgrid_id, row_id) {
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
                var dataFromCellByColumnName = jQuery('#jqGrid').jqGrid('getCell', row_id, 'EmployeeId');
                var innergrid=jQuery("#" + subgrid_table_id).jqGrid({
                    url: "/HRM/LeaveApplication/GetLeaveStatusesForEmployee/" + dataFromCellByColumnName,
                    datatype: "json",
                    colNames: ['Leave Type Name', 'Leave Days', 'Max Carry Forward', 'Enjoyed', 'Processing', 'Remaining'],
                    colModel: [
                      { name: "LeaveTypeName", index: "LeaveTypeName", width: 130, key: false },
                      { name: "LeaveDays", index: "LeaveDays", width: 80, align: "center" },
                      { name: "MaxCarryForward", index: "MaxCarryForward", width: 130, align: "center" },
                      { name: "Enjoyed", index: "Enjoyed", width: 80, align: "center" },
                      { name: "Processing", index: "Processing", width: 80, align: "center" },
                      { name: "Remaining", index: "Remaining", width: 80, align: "center" }
                    ],
                    height: '100%',
                    rowNum: 10,
                    pager: pager_id,
                    sortname: 'LeaveTypeName',
                    sortorder: "asc",
                    cmTemplate: { align: 'center', editable: true }

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
        { edit: false, add: false, del: false, search: true, refresh: false },
        {
            closeOnEscape: true, multipleSearch: true,
            closeAfterSearch: true
        }
        );
    });
});