$(document).ready(function () {
    function populateParentOffice(isEdit) {
        var officelayerCombo = $("#tr_OfficeLayerId select");
        var parentidCombo = $("#tr_ParentId select");
        $(officelayerCombo).attr("id", "OfficeLayerId").attr("name", "OfficeLayerId");
        $(parentidCombo).attr("id", "ParentId").attr("name", "ParentId");
        var selectedOfficeLayerId = $("#jqGrid").jqGrid('getRowData', $("#jqGrid")[0].p.selrow).OfficeLayerId | 0;
        $(officelayerCombo)
                     .html("<option value=''>Loading OfficeLevel...</option>")
                     .attr("disabled", "disabled");
        $.ajax({
            url: '/HRM/Office/GetOfficeLayerLevels',
            type: "GET",
            success: function (officelevelHtml) {
                $(officelayerCombo).removeAttr("disabled").html(officelevelHtml);

                if (isEdit) {
                    $(officelayerCombo).val(selectedOfficeLayerId);
                } else {
                    $(officelayerCombo).selectedIndex = 0;
                }
                updateParentOfficeCallBack(isEdit, $(officelayerCombo).val(), parentidCombo);
            }
        });
        $(officelayerCombo).bind("change", function (e) {
            updateParentOfficeCallBack(false, $(officelayerCombo).val(), parentidCombo);
        });
    }

    function updateParentOfficeCallBack(isEdit, selectedOfficeLayerId, parentidCombo) {
        var url = '/HRM/Office/GetParentOffices/?officelayerid=' + selectedOfficeLayerId;
        $(parentidCombo)
             .html("<option value=''>Loading parent offices...</option>")
             .attr("disabled", "disabled");
        $.ajax({
            url: url,
            type: "GET",
            success: function (parentJson) {
                var parents = eval(parentJson);
                var parentHtml = "";
                $(parents).each(function (i, option) {
                    parentHtml += '<option value="' + option.Id + '">' + option.Name + '</option>';
                });
                $(parentidCombo).removeAttr("disabled").html(parentHtml);
                if (isEdit) {
                    var selectedParentId = $("#jqGrid").jqGrid('getRowData', $("#jqGrid")[0].p.selrow).ParentId | 0;
                    $(parentidCombo).val(selectedParentId);
                } else {
                    $(parentidCombo).selectedIndex = 0;
                }
                $(parentidCombo).focus();
            }
        });
    }

    $(function () {
        $("#jqGrid").jqGrid({
            url: "/HRM/Office/GetOffice",
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'Name', 'OfficeLayerId', 'Office Layer Name', 'ParentId', 'Parent Name'],
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                { key: false, name: 'Name', index: 'Name', editable: true, editrules: { custom_func: validateText, custom: true, required: true }, formoptions: { label: "Name" }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, hidden: true, name: 'OfficeLayerId', index: 'OfficeLayerId', editable: true, edittype: "select", editrules: { required: true, edithidden: true },formoptions: { label: "Office Layer: " }, editoptions: { cacheUrlData: true }, classes: "grid-col" },
                { key: false, name: 'OfficeLayerName', index: 'OfficeLayerName', label: "OfficeLayerName", editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, hidden: true, name: 'ParentId', index: 'ParentId', editable: true, edittype: "select", editrules: { required: true,edithidden: true }, formoptions: { label: "Parent: " } },
                { key: false, name: 'ParentName', index: 'ParentName', label: "ParentName", editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
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
            caption: 'Office Records',
            emptyrecords: 'No Office Records are Available to Display',
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
            url: '/HRM/Office/SaveOffice',
            closeOnEscape: true,
            closeAfterEdit: true,
            width: 'auto',
            height: 'auto',
            recreateForm: true,
            onInitializeForm: function (formId) { populateParentOffice(true); },
            afterComplete: function (response) {
                if (response.responseText) {
                    Messager.ShowMessage(response.responseText);
                    location.reload(true);
                }
            }
        },
        {
            zIndex: 100,
            url: '/HRM/Office/SaveOffice',
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterAdd: true,
            onInitializeForm: function (formId) { populateParentOffice(false); },
            afterComplete: function (response) {
                if (response.responseText) {
                    Messager.ShowMessage(response.responseText);
                    location.reload(true);
                }
            }
        },
        {
            zIndex: 100,
            url: "/HRM/Office/DeleteOffice",
            closeOnEscape: true,
            closeAfterDelete: true,
            recreateForm: true,
            msg: "Are you sure to delete this Office? ",
            afterComplete: function (response) {
                if (response.responseText) {
                    Messager.ShowMessage(response.responseText);
                }
            }
        },
        {
            closeOnEscape: true, multipleSearch: true,
            closeAfterSearch: true
        }
        );

        // filter on column header
        $("#jqGrid").jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false, defaultSearch: "cn" });
    });
});
