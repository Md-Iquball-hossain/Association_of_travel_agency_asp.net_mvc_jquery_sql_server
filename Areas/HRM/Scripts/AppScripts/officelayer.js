$(document).ready(function () {
    function populateParentOffice(isEdit) {

        var parentidCombo = $("#tr_ParentId select");

        $(parentidCombo).attr("id", "ParentId").attr("name", "ParentId");
        var selectedOfficeLayerId = $("#jqGrid").jqGrid('getRowData', $("#jqGrid")[0].p.selrow).Id | 0;
        console.log("levelid " + selectedOfficeLayerId);
        $.ajax({
            url: '/HRM/Office/GetParentOffices/?officelayerid=' + selectedOfficeLayerId,
            type: "GET",
            success: function (officejson) {
                var offices = eval(officejson);
                var officeHtml = "";
                $(offices).each(function (i, option) {
                    officeHtml += '<option value="' + option.Id + '">' + option.Name + '</option>';
                });
                $(parentidCombo).removeAttr("disabled").html(officeHtml);
                if (isEdit) {
                    var selectedParentId = $("#jqGridDetails").jqGrid('getRowData', $("#jqGridDetails")[0].p.selrow).ParentId | 0;
                    $(parentidCombo).val(selectedParentId);
                } else {
                    $(parentidCombo).selectedIndex = 0;
                }
                $(parentidCombo).focus();
            }
        });

    }
    function populateParentUnit(isEdit) {
        var unittypeCombo = $("#tr_UnitType select");
        var parentUnitCombo = $("#tr_ParentUnitId select");
        var OfficeUnitCombo = $("#tr_OfficeUnitId select");
        $(unittypeCombo).attr("id", "UnitType").attr("name", "UnitType");
        $(OfficeUnitCombo).attr("id", "OfficeUnitId").attr("name", "OfficeUnitId");
        $(parentUnitCombo).attr("id", "ParentUnitId").attr("name", "ParentUnitId");
        var selectedUnitType = $("#jqGridUnitDetails").jqGrid('getRowData', $("#jqGridUnitDetails")[0].p.selrow).UnitType | 0;
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
                updateOfficeUnitCallBack(isEdit, $(unittypeCombo).val(), OfficeUnitCombo, parentUnitCombo);
            }
        });
        $(unittypeCombo).bind("change", function (e) {
            updateOfficeUnitCallBack(false, $(unittypeCombo).val(), OfficeUnitCombo, parentUnitCombo);
        });
    }
    function updateOfficeUnitCallBack(isEdit, selectedUnitType, OfficeUnitCombo, parentUnitCombo) {
        var url = '/HRM/OfficeUnit/GetOfficetUnits/?unittype=' + selectedUnitType;
        $(OfficeUnitCombo)
             .html("<option value=''>Loading office units...</option>")
             .attr("disabled", "disabled");
        $(parentUnitCombo)
            .html("<option value=''>Loading parent units...</option>")
            .attr("disabled", "disabled");
        $.ajax({
            url: url,
            type: "GET",
            success: function (officeUnitJson) {
                var data = eval(officeUnitJson);
                var officeunits = data.OfficeUnits;
                var parentunits = data.ParentUnits;
                var officeUnitHtml = "";
                var parentUnitHtml = "";
                $(officeunits).each(function (i, option) {
                    officeUnitHtml += '<option value="' + option.Id + '">' + option.Name + '</option>';
                });
                $(OfficeUnitCombo).removeAttr("disabled").html(officeUnitHtml);
                $(parentunits).each(function (i, option) {
                    parentUnitHtml += '<option value="' + option.Id + '">' + option.Name + '</option>';
                });
                $(parentUnitCombo).removeAttr("disabled").html(parentUnitHtml);
                if (isEdit) {
                    var selectedOfficeUnitId = $("#jqGridUnitDetails").jqGrid('getRowData', $("#jqGridUnitDetails")[0].p.selrow).OfficeUnitId | 0;
                    $(OfficeUnitCombo).val(selectedOfficeUnitId);
                    var selectedParentUnitId = $("#jqGridUnitDetails").jqGrid('getRowData', $("#jqGridUnitDetails")[0].p.selrow).ParentUnitId | 0;
                    $(parentUnitCombo).val(selectedParentUnitId);
                } else {
                    $(OfficeUnitCombo).selectedIndex = 0;
                    $(parentUnitCombo).selectedIndex = 0;
                }
                $(OfficeUnitCombo).focus();
                $(parentUnitCombo).focus();
            }
        });
    }
    $(function () {
        $("#jqGrid").jqGrid({
            url: "/HRM/OfficeLayer/GetOfficeLayers",
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'Name', 'Level'],
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                { key: false, name: 'Name', index: 'Name', editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'Level', index: 'Level', editable: true, editrules: { number: true, maxValue: 100, required: true }, align: "right", searchoptions: { sopt: ['eq', 'ne'] }, classes: "grid-col" },

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
            caption: 'OfficeLayer Records',
            onSelectRow: function (rowid, selected) {
                if (rowid != null) {
                    var dataFromCellByColumnName = jQuery('#jqGrid').jqGrid('getCell', rowid, 'Level');
                    var valueFromCellByColumnName = jQuery('#jqGrid').jqGrid('getCell', rowid, 'Name');
                    jQuery("#jqGridDetails").jqGrid('setGridParam', { url: "/HRM/Office/GetOfficeByLayers/?officelevel=" + dataFromCellByColumnName, datatype: 'json' }); // the last setting is for demo only
                    jQuery("#jqGridDetails").jqGrid('setCaption', 'Office Records::' + valueFromCellByColumnName);
                    jQuery("#jqGridDetails").trigger("reloadGrid");

                }
            }, // use the onSelectRow that is triggered on row click to show a details grid
            emptyrecords: 'No OfficeLayer Records are Available to Display',
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
            url: '/HRM/OfficeLayer/SaveOfficeLayer',
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterEdit: true,
            recreateForm: true,

            afterComplete: function (response) {
                if (response.responseText) {
                    Messager.ShowMessage(response.responseText);
                    location.reload(true);
                }
            }
        },
        {
            zIndex: 100,
            url: "/HRM/OfficeLayer/SaveOfficeLayer",
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterAdd: true,

            afterComplete: function (response) {
                if (response.responseText) {
                    Messager.ShowMessage(response.responseText);
                    location.reload(true);
                }
            }
        },
        {
            zIndex: 100,
            url: "/HRM/OfficeLayer/DeleteOfficeLayer",
            closeOnEscape: true,
            closeAfterDelete: true,
            recreateForm: true,
            msg: "Are you sure to delete this Submodule? ",
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
        //selRowId = $('#jqGrid').jqGrid('getGridParam', 'selrow');
        //IdFromCellByColumnName = $('#jqGrid').jqGrid('getCell', selRowId, 'Id');
        //console.log("levelid " + IdFromCellByColumnName);

        $("#jqGridDetails").jqGrid({
            url: '/HRM/Grade/EmptyJson',
            mtype: "GET",
            datatype: "json",

            colNames: ['Id', 'Name', 'OfficeLayerName', 'ParentId', 'ParentName'],
            colModel: [
                    { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                    { key: false, name: 'Name', index: 'Name', editable: true, editrules: { custom_func: validateText, custom: true, required: true }, formoptions: { label: "Name" }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                    { key: false, name: 'OfficeLayerName', index: 'OfficeLayerName', label: "OfficeLayerName", editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                    { key: false, hidden: true, name: 'ParentId', index: 'ParentId', editable: true, edittype: "select", editrules: { edithidden: true }, formoptions: { label: "Parent: " } },

                    { key: false, name: 'ParentName', index: 'ParentName', label: "ParentName", editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },

            ],
            ondblClickRow: function (rowid) {
                jQuery("#jqGrid").jqGrid('editGridRow', rowid);
            },
            width: 780,
            rowNum: 5,
            loadonce: false,
            height: '100',
            viewrecords: true,
            caption: 'Detail grid::',
            onSelectRow: function (rowid, selected) {
                if (rowid != null) {
                    var dataFromCellByColumnName = jQuery('#jqGridDetails').jqGrid('getCell', rowid, 'Id');
                    var valueFromCellByColumnName = jQuery('#jqGridDetails').jqGrid('getCell', rowid, 'Name');
                    jQuery("#jqGridUnitDetails").jqGrid('setGridParam', { url: "/HRM/OfficeUnit/GetOfficeUnitSettingsByOfficeId/?officeid=" + dataFromCellByColumnName, datatype: 'json' }); // the last setting is for demo only
                    jQuery("#jqGridUnitDetails").jqGrid('setCaption', 'Office Unit Records::' + valueFromCellByColumnName);
                    jQuery("#jqGridUnitDetails").trigger("reloadGrid");

                }
            },
            // use the onSelectRow that is triggered on row click to show a details grid
            loadonce: true,
            pager: "#jqGridDetailsPager"
        }).navGrid('#jqGridDetailsPager',
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
                onclickSubmit: function (params, postdata) {
                    postdata = $.extend({}, postdata, { OfficeLayerId: $("#jqGrid").jqGrid('getRowData', $("#jqGrid")[0].p.selrow).Id });
                    return postdata;
                },
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
                onclickSubmit: function (params, postdata) {
                    postdata = $.extend({}, postdata, { OfficeLayerId: $("#jqGrid").jqGrid('getRowData', $("#jqGrid")[0].p.selrow).Id });
                    return postdata;
                },
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
            });

        $("#jqGridUnitDetails").jqGrid({
            url: '/HRM/Grade/EmptyJson',
            mtype: "GET",
            datatype: "json",

            colNames: ['Id', 'OfficeName', 'UnitType', 'OfficeUnitId', 'OfficeUnitName', 'ParentUnitId', 'ParentUnitName'],
            colModel: [
                    { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                    { key: false, name: 'OfficeName', index: 'OfficeName', editable: false, formoptions: { label: "Office Name" }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                    { key: false, hidden: true, name: 'UnitType', index: 'UnitType', editable: true, edittype: "select", editrules: { required: true, edithidden: true }, formoptions: { label: "Unit Type" }, editoptions: { cacheUrlData: true }, classes: "grid-col" },
                    { key: false, hidden: true, name: 'OfficeUnitId', index: 'OfficeUnitId', editable: true, edittype: "select", editrules: { edithidden: true }, formoptions: { label: "OfficeUnit: " } },

                    { key: false, name: 'OfficeUnitName', index: 'OfficeUnitName', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                    { key: false, hidden: true, name: 'ParentUnitId', index: 'ParentUnitId', editable: true, edittype: "select", editrules: { edithidden: true }, formoptions: { label: "Parent Unit: " } },
                    { key: false, name: 'ParentUnitName', index: 'ParentUnitName', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" }
            ],
            ondblClickRow: function (rowid) {
                jQuery("#jqGridUnitDetails").jqGrid('editGridRow', rowid);
            },
            width: 780,
            rowNum: 5,
            loadonce: false,
            height: '100',
            viewrecords: true,
            caption: 'Detail grid::',
            loadonce: true,
            pager: "#jqGridUnitDetailsPager"
        }).navGrid('#jqGridUnitDetailsPager',
  { edit: true, add: true, del: true, search: true, refresh: true },
  {
      zIndex: 100,
      url: '/HRM/OfficeUnit/SaveOfficeUnitSetting',
      closeOnEscape: true,
      closeAfterEdit: true,
      width: 'auto',
      height: 'auto',
      recreateForm: true,
      onInitializeForm: function (formId) { populateParentUnit(true); },
      onclickSubmit: function (params, postdata) {
          postdata = $.extend({}, postdata, { OfficeId: $("#jqGridDetails").jqGrid('getRowData', $("#jqGridDetails")[0].p.selrow).Id });
          return postdata;
      },
      afterComplete: function (response) {
          if (response.responseText) {
              Messager.ShowMessage(response.responseText);
              location.reload(true);
          }
      }
  },
  {
      zIndex: 100,
      url: '/HRM/OfficeUnit/SaveOfficeUnitSetting',
      closeOnEscape: true,
      width: 'auto',
      height: 'auto',
      closeAfterAdd: true,
      onInitializeForm: function (formId) { populateParentUnit(false); },
      onclickSubmit: function (params, postdata) {
          postdata = $.extend({}, postdata, { OfficeId: $("#jqGridDetails").jqGrid('getRowData', $("#jqGridDetails")[0].p.selrow).Id });
          return postdata;
      },
      afterComplete: function (response) {
          if (response.responseText) {
              Messager.ShowMessage(response.responseText);
              location.reload(true);
          }
      }
  },
  {
      zIndex: 100,
      url: "/HRM/OfficeUnit/DeleteOfficeUnitSetting",
      closeOnEscape: true,
      closeAfterDelete: true,
      recreateForm: true,
      msg: "Are you sure to delete this Office Unit Setting? ",
      afterComplete: function (response) {
          if (response.responseText) {
              Messager.ShowMessage(response.responseText);
          }
      }
  },
  {
      closeOnEscape: true, multipleSearch: true,
      closeAfterSearch: true
  });
    });

});
