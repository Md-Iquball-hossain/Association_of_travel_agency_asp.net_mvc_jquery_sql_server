$(document).ready(function () {
    $(function () {
        $("#jqGrid").jqGrid({
            url: "/HRM/LeaveType/GetLeaveTypes",
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'Code', 'Name', 'Leave Days', 'Maximum Carryforward', 'LeaveApplicableTo', 'LeaveApplicableToName'],
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                { key: false, name: 'Code', index: 'Code', width: 140, editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'Name', index: 'Name', width: 140, editable: true, editrules: { custom_func: validateText, custom: true, required: true },formoptions: {},searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                
                { key: false, name: 'LeaveDays', index: 'LeaveDays', width: 140, editable: true, editrules:{ custom_func: validatePositive, custom: true, required: true },label: "LeaveDays", formoptions: { label: "Leave Days" }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'MaxCarryForward', index: 'MaxCarryForward', label: "Maximum Carry Forward", width: 140, editable: true, editrules: { custom_func: validatePositive, custom: true, required: true }, formoptions: { label: "Maximum Carryforward" }, align: 'right', searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                {
                    key: false, hidden: true, name: 'LeaveApplicableTo', index: 'LeaveApplicableTo', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/LeaveType/GetLeaveApplicableTo', cacheUrlData: true }, editrules: { edithidden: true, required: true },
                    formoptions: { label: "LeaveApplicable To" }
                },
                { key: false, name: 'LeaveApplicableToName', index: 'LeaveApplicableToName', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" }
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
            caption: 'Leave Type Records',
            emptyrecords: 'No Leave Type Records are Available to Display',
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
            url: '/HRM/LeaveType/SaveLeaveType',
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterEdit: true,
            recreateForm: true,
            afterComplete: function (response) {
                Messager.ShowMessage(response.responseText);
                location.reload(true);
            }
        },
        {
            zIndex: 100,
            url: '/HRM/LeaveType/SaveLeaveType',
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterAdd: true,
            afterComplete: function (response) {
                Messager.ShowMessage(response.responseText);
                location.reload(true);
            }
        },
        {
            zIndex: 100,
            url: '/HRM/LeaveType/DeleteLeaveType',
            closeOnEscape: true,
            closeAfterDelete: true,
            recreateForm: true,
            msg: "Are you sure to delete this Leave type? ",
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

