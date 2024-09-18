$(document).ready(function () {
    function populateKPIGroup(isEdit) {
        var kpiGroupCombo = $("#tr_KPIGroupId select");
        var kpiCombo = $("#tr_KPIId select");

        $(kpiGroupCombo).attr("id", "KPIGroupId").attr("name", "KPIGroupId");
        $(kpiCombo).attr("id", "KPIId").attr("name", "KPIId");

        var selectedKPIGroupId = $("#jqGrid").jqGrid('getRowData', $("#jqGrid")[0].p.selrow).KPIGroupId | 0;
        $(kpiGroupCombo)
                     .html("<option value=''>Loading Kpi Group...</option>")
                     .attr("disabled", "disabled");
        $.ajax({
            url: '/HRM/KPI/GetCorrespondingKPIGroups',
            type: "GET",
            success: function (kpigrouphtml) {
                $(kpiGroupCombo).removeAttr("disabled").html(kpigrouphtml);
                if (isEdit) {
                    $(kpiGroupCombo).val(selectedKPIGroupId);
                } else {
                    $(kpiGroupCombo).selectedIndex = 0;
                }
                updateKpiCallBack(isEdit, $(kpiGroupCombo).val(), kpiCombo);
            }
        });
        $(kpiGroupCombo).bind("change", function (e) {
            updateKpiCallBack(false, $(kpiGroupCombo).val(), kpiCombo);
        });
    }
    function updateKpiCallBack(isEdit, selectedKPIGroupId, kpiCombo) {
        var url = '/HRM/KPI/GetKpiForKpiGroups/' + selectedKPIGroupId;
        $(kpiCombo)
             .html("<option value=''>Loading kpis...</option>")
             .attr("disabled", "disabled");
        $.ajax({
            url: url,
            type: "GET",
            success: function (kpiJson) {
                var data = eval(kpiJson);
                var kpiHtml = "";
                $(data).each(function (i, option){
                    kpiHtml += '<option value="' + option.Id + '">' + option.Name + '</option>';
                });
                $(kpiCombo).removeAttr("disabled").html(kpiHtml);
                if (isEdit) {
                    var selectedKpiId = $("#jqGrid").jqGrid('getRowData', $("#jqGrid")[0].p.selrow).KPIId | 0;
                    $(kpiCombo).val(selectedKpiId);
                } else {
                    $(kpiCombo).selectedIndex = 0;
                }
                $(kpiCombo).focus();
            }
        });
    }
    $(function () {
        $("#jqGrid").jqGrid({
            url: "/HRM/KPI/GetAllKpiGroupSettings",
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'AppraisalId', 'Appraisal Name', 'KPIGroupId','KPI Group Name', 'KPIId', 'KPI Name', 'Display Order', 'Weight'],
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                { key: false, hidden: true, name: 'AppraisalId', index: 'AppraisalId', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/Appraisal/GetAllAppraisalForGroup', cacheUrlData: true }, editrules: { edithidden: true, required: true }, label: "Appraisal", searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'AppraisalName', index: 'AppraisalName', label: 'AppraisalName', editable: false },
                { key: false, hidden: true, name: 'KPIGroupId', index: 'KPIGroupId', editable: true, edittype: "select", editrules: { required: true, edithidden: true }, formoptions: { label: "KPI Group " }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'KPIGroupName', index: 'KPIGroupName', label: 'KPIGroupName', editable: false },
                { key: false, hidden: true, name: 'KPIId', index: 'KPIId', editable: true, edittype: "select", editrules: { required: true, edithidden: true }, formoptions: { label: "KPI " }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'KPIName', index: 'KPIName', label: 'KPIName', editable: false },
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
            caption: 'KPI Group Settings Records',
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
            url: '/HRM/KPI/SaveKPIGroupSettings',
            closeOnEscape: true,
            closeAfterEdit: true,
            recreateForm: true,
            onInitializeForm: function (formId) { populateKPIGroup(true); },
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
            url: "/HRM/KPI/SaveKPIGroupSettings",
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterAdd: true,
            onInitializeForm: function (formId) { populateKPIGroup(false); },
            afterComplete: function (response) {
                Messager.ShowMessage(response.Message);
                //location.reload(true);
            }
        },
        {
            zIndex: 100,
            url: "/HRM/KPI/DeleteKPIGroupSettings",
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