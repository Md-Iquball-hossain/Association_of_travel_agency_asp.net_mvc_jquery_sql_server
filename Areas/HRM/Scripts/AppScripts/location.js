$(document).ready(function () {

    function populateParentLocation(isEdit) {
        var loclevelCombo = $("#tr_LocationLevel select");
        var parentidCombo = $("#tr_ParentId select");
        $(loclevelCombo).attr("id", "LocationLevel").attr("name", "LocationLevel");
        $(parentidCombo).attr("id", "ParentId").attr("name", "ParentId");

        var selectedLocationLevel = $("#jqGrid").jqGrid('getRowData', $("#jqGrid")[0].p.selrow).LocationLevel | 0;
        $(loclevelCombo)
                     .html("<option value=''>Loading LocationLevel...</option>")
                     .attr("disabled", "disabled");
        $.ajax({
            url: '/HRM/Location/GetLocationLevels',
            type: "GET",
            success: function (locationlevelHtml) {
                $(loclevelCombo).removeAttr("disabled").html(locationlevelHtml);

                if (isEdit) {
                    $(loclevelCombo).val(selectedLocationLevel);
                } else {
                    $(loclevelCombo).selectedIndex = 0;
                }
                updateParentLocationCallBack(isEdit, $(loclevelCombo).val(), parentidCombo);
            }
        });
        $(loclevelCombo).bind("change", function (e) {
            updateParentLocationCallBack(false, $(loclevelCombo).val(), parentidCombo);
        });
    }

    function updateParentLocationCallBack(isEdit, selectedLocationLevel, parentidCombo) {
        var url = '/HRM/Location/GetParentLocations/?loclevel=' + selectedLocationLevel;
        $(parentidCombo)
             .html("<option value=''>Loading parent locations...</option>")
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
            url: "/HRM/Location/GetLocations",
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'CountryId', 'Country Name', 'LocationType', 'Location Type Name', 'LocationLevel', 'Location Level Name', 'ParentId', 'Parent Location', 'Code', 'Name', ],
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                { key: false, hidden: true, name: 'CountryId', index: 'CountryId', editable: true, edittype: "select", editrules: { edithidden: true, required: true }, editoptions: { dataUrl: '/HRM/Employee/GetCorrespondingCountries', cacheUrlData: true }, formoptions: { label: "Country: " } },
                { key: false, name: 'CountryName', index: 'CountryName', editable: false, label: "CountryName", searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, hidden: true, name: 'LocationType', index: 'LocationType', editable: true, edittype: "select", editrules: { required: true, edithidden: true }, editoptions: { dataUrl: '/HRM/Location/GetLocationTypes', cacheUrlData: true }, formoptions: { label: "Location Type: " }, classes: "grid-col" },
                { key: false, name: 'LocationTypeName', index: 'LocationTypeName', label: "LocationType Name", editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, hidden: true, name: 'LocationLevel', index: 'LocationLevel', editable: true, edittype: "select", editrules: { required: true, edithidden: true },formoptions: { label: "Location Level: " }, editoptions: { cacheUrlData: true },classes: "grid-col" },
                { key: false, name: 'LocationLevelName', index: 'LocationLevelName', label: "LocationLevelName", editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, hidden: true, name: 'ParentId', index: 'ParentId', editable: true, edittype: "select", editrules: { edithidden: true, required: true}, formoptions: { label: "Parent: " } },
                { key: false, name: 'ParentLocation', index: 'ParentLocation', label: "Parent Location", editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'Code', index: 'Code', editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'Name', index: 'Name', editable: true, editrules: { custom_func: validateText, custom: true, required: true }, formoptions: { label: "Name" }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
            ],
            ondblClickRow: function (rowid) {
                jQuery("#jqGrid").jqGrid('editGridRow', rowid);
            },
            loadonce: true,
            pager: jQuery('#jqGridPager'),
            rowNum: 20,
            rowList: [20,40,60,80],
            hoverrows: true,
            sortable: true,
            width: '70%',
            viewrecords: true,
            caption:'Location Records',
            emptyrecords: 'No Location Records are Available to Display',
            jsonReader: {
                root: "rows",
                page: "page",
                total: "total",
                records: "records",
                repeatitems: false,
                Id: "0"
            },
            autowidth: true,
            height: '100%',//set auto height
            multiselect: false
        }).navGrid('#jqGridPager',
        { edit: true, add: true, del: true, search: true, refresh: true },
        {
            zIndex: 100,
            url: '/HRM/Location/SaveLocation',
            closeOnEscape: true,
            closeAfterEdit: true,
            width: 'auto',
            height: 'auto',
            recreateForm: true,
            onInitializeForm: function (formId) { populateParentLocation(true); },
            afterComplete: function (response) {
                if (response.responseText) {
                    toastr.success(response.responseText);
                }
            }
        },
        {
            zIndex: 100,
            url: '/HRM/Location/SaveLocation',
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterAdd: true,
            onInitializeForm: function (formId) { populateParentLocation(false); },
            afterComplete: function (response) {
                if (response.responseText) {
                    toastr.success(response.responseText);
                }
            }
        },
        {
            zIndex: 100,
            url: "/HRM/Location/DeleteLocation",
            closeOnEscape: true,
            closeAfterDelete: true,
            recreateForm: true,
            msg: "Are you sure to delete this Location? ",
            afterComplete: function (response) {
                if (response.responseText) {
                    toastr.info(response.responseText);
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
