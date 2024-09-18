$(document).ready(function () {
    $(function () {
        $("#jqGrid").jqGrid({
            url: "/HRM/LeaveApplication/GetLeaveSupervisions",
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'Employee Name', 'Department', 'Description', 'Leave Type Name', 'Range', 'Total Days', 'Comments', 'Current Leave-Status'],
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                { key: false, name: 'EmployeeName', index: 'EmployeeName', label: "Employee Name", width: 140, editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'OfficeUnitName', index: 'OfficeUnitName', width: 140, editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'Description', index: 'Description', width: 140, editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'LeaveTypeName', index: 'LeaveTypeName', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'Range', index: 'Range', width: 190, editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'TotalDays', index: 'TotalDays', width: 140, editable: false, searchoptions: { sopt: ['eq', 'ne'] }, classes: "grid-col" },
                { key: false, name: 'Comments', index: 'Comments', width: 140, editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'CurrentLeaveStatusName', index: 'CurrentLeaveStatusName', width: 140, editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" }
                
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
        { edit: false, add: false, del: false, search: true, refresh: true },
        {
        closeOnEscape: true, multipleSearch: true,
        closeAfterSearch: true
        }
        );
        jQuery("#jqGrid").jqGrid('navButtonAdd', '#jqControls', {                   //add icon to pop-up modal
            caption: "Action",
            position: "first",
            //buttonicon: "ui-icon-pencil",
            title: "Add new",
            onClickButton: function () {
                if (check()) {
                    $('#myModalNorm').modal('show');

                } else {
                    toastr.info("Please select a row");
                }
                
            }
        });
    });
});

var IdVal;
function check() {
    var myGrid = $('#jqGrid');
    selRowId = myGrid.jqGrid('getGridParam', 'selrow');
    if (selRowId != null) {
        IdVal = myGrid.jqGrid('getCell', selRowId, 'Id');
        return true;
    } else {
        return false;
    }

}