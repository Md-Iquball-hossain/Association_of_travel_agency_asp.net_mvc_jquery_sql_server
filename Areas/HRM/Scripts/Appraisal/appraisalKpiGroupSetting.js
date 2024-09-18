$(document).ready(function () {
    $(function () {
        $("#jqGrid").jqGrid({
            url: "/HRM/Appraisal/GetAllAppraisalKpiGroupSettings",
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'AppraisalId', 'AppraisalName', 'KPIGroupId', 'KPIGroupName', 'DisplayOrder', 'Weight'],
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                { key: false, hidden: true, name: 'AppraisalId', index: 'AppraisalId', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/Appraisal/GetAllAppraisalForGroup', cacheUrlData: true }, editrules: { edithidden: true, required: true }},
                { key: false, name: 'AppraisalName', index: 'AppraisalName', label: 'AppraisalName', editable: false },
                {
                    key: false, hidden: true, name: 'KPIGroupId', width: 140, index: 'KPIGroupId', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/KPI/GetCorrespondingKPIGroups', cacheUrlData: true }, editrules: { edithidden: true, required: true },
                    formoptions: { label: "Kpi Group" }
                },
                { key: false, name: 'KPIGroupName', index: 'KPIGroupName', label: 'KPIGroupName', editable: false },
                { key: false, name: 'DisplayOrder', index: 'DisplayOrder', label: 'DisplayOrder', editable: true },
                { key: false, name: 'Weight', index: 'Weight', label: 'Weight', editable: true, editrules: { custom_func: validatePercentage, custom: true, required: true } }

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
            width: '70%',
            viewrecords: true,
            caption: 'Appraisal KPI Group Settings Records',
            emptyrecords: 'No Module Records are Available to Display',
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
            url: '/HRM/Appraisal/SaveAppraisalGroupSettings',
            closeOnEscape: true,
            closeAfterEdit: true,
            recreateForm: true,
            width: 'auto',
            height: 'auto',

            //onInitializeForm: function (formId) { populateDesignations(true); },
            afterComplete: function (response) {
                if (response.responseText) {
                    toastr.success(response.responseText);
                    location.reload(true);
                }
            }
        },
        {
            zIndex: 100,
            url: "/HRM/Appraisal/SaveAppraisalGroupSettings",
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterAdd: true,
            afterComplete: function (response) {
                Messager.ShowMessage(response.Message);
                //location.reload(true);
            }
        },
        {
            zIndex: 100,
            url: "/HRM/Appraisal/DeleteAppraisalGroupSettings",
            closeOnEscape: true,
            closeAfterDelete: true,
            recreateForm: true,
            msg: "Are you sure to delete this module? ",
            afterComplete: function (response) {
                Messager.ShowMessage(response.Message);
            }
        },
        {
            closeOnEscape: true, multipleSearch: true,
            closeAfterSearch: true
        }
        );
    });
});