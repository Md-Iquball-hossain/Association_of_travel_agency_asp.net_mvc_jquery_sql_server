$(document).ready(function () {
    function populateOfficeLayer(isEdit) {
        var officeLayerCombo = $("#tr_OfficeLayerId select");
        var officeCombo = $("#tr_OfficeId select");
        $(officeLayerCombo).attr("id", "OfficeLayerId").attr("name", "OfficeLayerId");
        $(officeCombo).attr("id", "OfficeId").attr("name", "OfficeId");

        var selectedOfficeLayerId = $("#jqGrid").jqGrid('getRowData', $("#jqGrid")[0].p.selrow).OfficeLayerId | 0;
        $(officeLayerCombo)
                     .html("<option value=''>Loading Office Layers...</option>")
                     .attr("disabled", "disabled");
        $.ajax({
            url: '/HRM/Office/GetOfficeLayerLevels',
            type: "GET",
            success: function (officelayerHtml) {
                $(officeLayerCombo).removeAttr("disabled").html(officelayerHtml);

                if (isEdit) {
                    $(officeLayerCombo).val(selectedOfficeLayerId);
                } else {
                    $(officeLayerCombo).selectedIndex = 0;
                }
                updateOfficeCallBack(isEdit, $(officeLayerCombo).val(), officeCombo);
            }
        });
        $(officeLayerCombo).bind("change", function (e) {
            updateOfficeCallBack(false, $(officeLayerCombo).val(), officeCombo);
        });
    }

    function updateOfficeCallBack(isEdit, selectedOfficeLayerId, officeCombo) {
        var url = '/HRM/Office/GetOfficeByLayer/?officelayerid=' + selectedOfficeLayerId;
        $(officeCombo)
             .html("<option value=''>Loading offices...</option>")
             .attr("disabled", "disabled");
        $.ajax({
            url: url,
            type: "GET",
            success: function (officeJson) {
                var offices = eval(officeJson);
                var officeHtml = "";
                $(offices).each(function (i, option) {
                    officeHtml += '<option value="' + option.Id + '">' + option.Name + '</option>';
                });
                $(officeCombo).removeAttr("disabled").html(officeHtml);
                if (isEdit) {
                    var selectedOfficeId = $("#jqGrid").jqGrid('getRowData', $("#jqGrid")[0].p.selrow).OfficeId | 0;
                    $(officeCombo).val(selectedOfficeId);
                } else {
                    $(officeCombo).selectedIndex = 0;
                }
                $(officeCombo).focus();
            }
        });
    }
    $(function () {
         $("#jqGrid").jqGrid({
            url: "/HRM/OfficePosition/GetOfficePosition",
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'Name', 'OfficeLayerId', 'OfficeId', 'Office Name', 'DefaultDesignationId', 'Default Designation Name', 'Position Weight'
            ],
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                { key: false, name: 'Name', index: 'Name', editable: true, editrules: { custom_func: validateText, custom: true, required: true }, formoptions: { label: "Name" }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, hidden: true, name: 'OfficeLayerId', index: 'OfficeLayerId', editable: true, edittype: "select", editrules: { required: true, edithidden: true }, formoptions: { label: "Office Layer: " }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, hidden: true, name: 'OfficeId', index: 'OfficeId', editable: true, edittype: "select", editrules: { edithidden: true, required: true }, formoptions: { label: "Office: " } },
                { key: false, name: 'OfficeName', index: 'OfficeName', label:"OfficeName", editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                {
                    key: false, hidden: true, name: 'DefaultDesignationId', width: 140, index: 'DefaultDesignationId', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/Designation/GetDesignations', cacheUrlData: true }, editrules: { edithidden: true, required: true },
                    formoptions: { label: "Designation"}
                },
                { key: false, name: 'DefaultDesignationName', index: 'DefaultDesignationName', label: "DefaultDesignationName", editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'PositionWeight', label: 'PositionWeight', index: 'PositionWeight', width: 140,editable: true, editrules: { custom_func: validatePositive, custom: true, required: true },align: 'right', formoptions: { label: "Position Weight"}, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" }

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
            caption: 'Office Position Records',
            emptyrecords: 'No Office Position Records are Available to Display',
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
            url: '/HRM/OfficePosition/SaveOfficePosition',
            closeOnEscape: true,
            closeAfterEdit: true,
            width: 'auto',
            height: 'auto',
            recreateForm: true,
            onInitializeForm: function (formId) { populateOfficeLayer(true); },
            afterComplete: function (response) {
                if (response.responseText) {
                    Messager.ShowMessage(response.responseText);
                    location.reload(true);
                }
            }
        },
        {
            zIndex: 100,
            url: '/HRM/OfficePosition/SaveOfficePosition',
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterAdd: true,
            onInitializeForm: function (formId) { populateOfficeLayer(false);},
            afterComplete: function (response) {
                if (response.responseText) {
                    Messager.ShowMessage(response.responseText);
                    location.reload(true);
                }
            }
        },
        {
            zIndex: 100,
            url: "/HRM/OfficePosition/DeleteOfficePosition",
            closeOnEscape: true,
            closeAfterDelete: true,
            recreateForm: true,
            msg: "Are you sure to delete this Office position? ",
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