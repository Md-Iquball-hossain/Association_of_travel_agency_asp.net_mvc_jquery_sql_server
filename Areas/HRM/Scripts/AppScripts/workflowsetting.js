$(document).ready(function () {
    $(function () {
        $("#jqGrid").jqGrid({
            url: "/HRM/WorkFlow/GetAllWorkFlowSettings",
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'Name', 'WFType', 'WFTypeName', 'TotalSteps', 'TotalActiveWF', 'Description', 'OfficeId', 'OfficeName', 'OfficeUnitId', 'OfficeUnitName'],
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                { key: false, name: 'Name',index: 'Name', width: 140, editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                {
                    key: false, hidden: true, name: 'WFType', index: 'WFType', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/WorkFlow/GetWFTypes', cacheUrlData: true }, editrules: { edithidden: true, required: true },
                    formoptions: { label: "WF Type" }
                },
                { key: false, name: 'WFTypeName', index: 'WFTypeName', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },

                { key: false, name: 'TotalSteps', index: 'TotalSteps', width: 140, editable: true, editrules: { custom_func: validatePositive, custom: true, required: true }, formoptions: { label: "Total Steps" }, searchoptions: { sopt: ['eq', 'ne'] }, classes: "grid-col" },
                { key: false, name: 'TotalActiveWF', index: 'TotalActiveWF', width: 140, editable: true, editrules: { custom_func: validatePositive, custom: true, required: true }, formoptions: { label: "Total Active WF" }, align: 'right', searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'Description', index: 'Description', width: 140, editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                {
                    key: false, hidden: true, name: 'OfficeId', index: 'OfficeId', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/Office/GetAllOffice', cacheUrlData: true }, editrules: { edithidden: true, required: true },
                    formoptions: { label: "Office" }
                },
                { key: false, name: 'OfficeName', index: 'OfficeName', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                {
                    key: false, hidden: true, name: 'OfficeUnitId', index: 'OfficeUnitId', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/OfficeUnit/GetAllOfficeUnits', cacheUrlData: true }, editrules: { edithidden: true, required: true },
                    formoptions: { label: "Office Unit" }
                },
                { key: false, name: 'OfficeUnitName', index: 'OfficeUnitName', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" }
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
            caption: 'WF Setting Records',
            emptyrecords: 'No WF Setting Records are Available to Display',
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
            url: '/HRM/WorkFlow/SaveWorkFlowSettings',
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
            url: '/HRM/WorkFlow/SaveWorkFlowSettings',
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
            url: '/HRM/WorkFlow/DeleteWFSetting',
            closeOnEscape: true,
            closeAfterDelete: true,
            recreateForm: true,
            msg: "Are you sure to delete this WF setting? ",
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

