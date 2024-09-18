$(document).ready(function () {
 function populateParentUnit(isEdit) {
     var unittypeCombo = $("#tr_UnitType select");
     var parentidCombo = $("#tr_ParentId select");
     $(unittypeCombo).attr("id", "UnitType").attr("name", "UnitType");
     $(parentidCombo).attr("id", "ParentId").attr("name", "ParentId");

     var selectedUnitType = $("#jqGrid").jqGrid('getRowData', $("#jqGrid")[0].p.selrow).UnitType | 0;
     $(unittypeCombo)
                     .html("<option value=''>Loading unit types...</option>")
                     .attr("disabled", "disabled");
        $.ajax({
            url: '/HRM/OfficeUnit/GetUnitTypes',
            type: "GET",
            success: function (unittypeHtml) {
                $(unittypeCombo).removeAttr("disabled").html(unittypeHtml);

                if (isEdit) {
                    $(unittypeCombo).val(selectedUnitType);
                } else {
                    $(unittypeCombo).selectedIndex = 0;
                }
                updateParentUnitCallBack(isEdit, $(unittypeCombo).val(), parentidCombo);
            }
        });
        $(unittypeCombo).bind("change", function (e) {
            updateParentUnitCallBack(false, $(unittypeCombo).val(), parentidCombo);
        });
    }

 function updateParentUnitCallBack(isEdit, selectedUnitType, parentidCombo) {
     var url = '/HRM/OfficeUnit/GetParentUnits/?unittype=' + selectedUnitType;
        $(parentidCombo)
             .html("<option value=''>Loading parent units...</option>")
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
            url: "/HRM/OfficeUnit/GetOfficeUnits",
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'Name', 'UnitType', 'Unit Type Name', 'ParentId', 'Parent Name', ],
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                { key: false, name: 'Name', index: 'Name', editable: true, editrules: { custom_func: validateText, custom: true, required: true }, formoptions: { label: "Name" }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, hidden: true, name: 'UnitType', index: 'UnitType', editable: true, edittype: "select", editrules: { required: true, edithidden: true }, formoptions: { label: "Unit Type" }, editoptions: { cacheUrlData: true }, classes: "grid-col" },
                { key: false, name: 'UnitTypeName', index: 'UnitTypeName', label: "UnitType Name", editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, hidden: true, name: 'ParentId', index: 'ParentId', editable: true, edittype: "select", editrules: { required: true, edithidden: true }, formoptions: { label: "Parent: " } },
                { key: false, name: 'ParentName', index: 'ParentName', label: "ParentName", editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" }
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
            caption: 'Office Unit Records',
            emptyrecords: 'No Office Unit Records are Available to Display',
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
            url: '/HRM/OfficeUnit/SaveOfficeUnit',
            closeOnEscape: true,
            closeAfterEdit: true,
            width: 'auto',
            height: 'auto',
            recreateForm: true,
            onInitializeForm: function (formId) { populateParentUnit(true); },
            afterComplete: function (response) {
                if (response.responseText) {
                    Messager.ShowMessage(response.responseText);
                }
            }
        },
        {
            zIndex: 100,
            url: '/HRM/OfficeUnit/SaveOfficeUnit',
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterAdd: true,
            onInitializeForm: function (formId) { populateParentUnit(false); },
            afterComplete: function (response) {
                if (response.responseText) {
                    Messager.ShowMessage(response.responseText);
                }
            }
        },
        {
            zIndex: 100,
            url: "/HRM/OfficeUnit/DeleteOfficeUnit",
            closeOnEscape: true,
            closeAfterDelete: true,
            recreateForm: true,
            msg: "Are you sure to delete this Office Unit? ",
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

        

    });
});
