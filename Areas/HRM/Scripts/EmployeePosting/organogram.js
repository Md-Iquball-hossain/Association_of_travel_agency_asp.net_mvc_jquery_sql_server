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
        var employeeCombo = $("#tr_EmployeeId select");
        var officePositionCombo = $("#tr_PositionId select");
        $(employeeCombo).attr("id", "EmployeeId").attr("name", "EmployeeId");
        $(officePositionCombo).attr("id", "PositionId").attr("name", "PositionId");
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
                //$(officeCombo).focus();
                updateEmployeeCallBack(isEdit, $(officeCombo).val(), employeeCombo, officePositionCombo);
            }
        });
        
        $(officeCombo).bind("change", function (e) {
            updateEmployeeCallBack(isEdit, $(officeCombo).val(), employeeCombo, officePositionCombo);
        });
        
    }

    function updateEmployeeCallBack(isEdit, selectedOfficeId, employeeCombo, officePositionCombo) {
        var url = '/HRM/Organogram/GetEmployeesByOffice/?officeid=' + selectedOfficeId;
        $(employeeCombo)
             .html("<option value=''>Loading employees...</option>")
             .attr("disabled", "disabled");
        $(officePositionCombo)
             .html("<option value=''>Loading office positions...</option>")
             .attr("disabled", "disabled");
        $.ajax({
            url: url,
            type: "GET",
            success: function (empJson) {
                var units = eval(empJson);
                var emps = units.Employees;
                var positions = units.OfficePositions;
                var empHtml = "";
                $(emps).each(function (i, option) {
                    empHtml += '<option value="' + option.Id + '">' + option.Name + '</option>';
                    console.log("id.." + option.Id);
                });
                var positionHtml = "";
                $(positions).each(function (i, option) {
                    positionHtml += '<option value="' + option.Id + '">' + option.Name + '</option>';
                });
                $(employeeCombo).removeAttr("disabled").html(empHtml);
                $(officePositionCombo).removeAttr("disabled").html(positionHtml);
                if (isEdit) {
                    var selectedEmployeeId = $("#jqGrid").jqGrid('getRowData', $("#jqGrid")[0].p.selrow).EmployeeId | 0;
                    var selectedPositionId = $("#jqGrid").jqGrid('getRowData', $("#jqGrid")[0].p.selrow).PositionId | 0;
                    $(employeeCombo).val(selectedEmployeeId);
                    $(officePositionCombo).val(selectedPositionId);
                } else {
                    $(employeeCombo).selectedIndex = 0;
                    $(officePositionCombo).selectedIndex = 0;
                }
                $(employeeCombo).focus();
                $(officePositionCombo).focus();
            }
        });
    }

    function populateUnitType(isEdit) {
        var unittypeCombo = $("#tr_UnitType select");
        var officeUnitCombo = $("#tr_OfficeUnitId select");
        $(unittypeCombo).attr("id", "UnitType").attr("name", "UnitType");
        $(officeUnitCombo).attr("id", "OfficeUnitId").attr("name", "OfficeUnitId");

        var selectedUnitType = $("#jqGrid").jqGrid('getRowData', $("#jqGrid")[0].p.selrow).UnitType | 0;
        $(unittypeCombo)
                     .html("<option value=''>Loading Unit Types...</option>")
                     .attr("disabled", "disabled");
        $.ajax({
            url: '/HRM/Organogram/GetUnitTypes',
            type: "GET",
            success: function (unitTypeHtml) {
                $(unittypeCombo).removeAttr("disabled").html(unitTypeHtml);

                if (isEdit) {
                    $(unittypeCombo).val(selectedUnitType);
                } else {
                    $(unittypeCombo).selectedIndex = 0;
                }
                updateOfficeUnitCallBack(isEdit, $(unittypeCombo).val(), officeUnitCombo);
            }
        });
        $(unittypeCombo).bind("change", function (e) {
            updateOfficeUnitCallBack(false, $(unittypeCombo).val(), officeUnitCombo);
        });
    }
    function updateOfficeUnitCallBack(isEdit, selectedUnitType, officeUnitCombo) {
        var url = '/HRM/Organogram/GetCorrespondingOfficeUnit/?unittype=' + selectedUnitType;
        $(officeUnitCombo)
             .html("<option value=''>Loading office units...</option>")
             .attr("disabled", "disabled");
        $.ajax({
            url: url,
            type: "GET",
            success: function (officeUnitJson) {
                var officeunits = eval(officeUnitJson);
                var officeunitHtml = "";
                $(officeunits).each(function (i, option) {
                    officeunitHtml += '<option value="' + option.Id + '">' + option.Name + '</option>';
                });
                $(officeUnitCombo).removeAttr("disabled").html(officeunitHtml);
                if (isEdit) {
                    var selectedOfficeUnitId = $("#jqGrid").jqGrid('getRowData', $("#jqGrid")[0].p.selrow).OfficeUnitId | 0;
                    $(officeUnitCombo).val(selectedOfficeUnitId);
                } else {
                    $(officeUnitCombo).selectedIndex = 0;
                }
                $(officeUnitCombo).focus();
            }
        });
    }

    function populateOfficePosition(isEdit) {
        var officePositionCombo = $("#tr_PositionId select");
        var parentCombo = $("#tr_ParentId select");
        $(officePositionCombo).attr("id", "PositionId").attr("name", "PositionId");
        $(parentCombo).attr("id", "ParentId").attr("name", "ParentId");
        var selectedOfficePositionId = $("#jqGrid").jqGrid('getRowData', $("#jqGrid")[0].p.selrow).PositionId | 0;
        $(officePositionCombo)
                     .html("<option value=''>Loading Office Positions...</option>")
                     .attr("disabled", "disabled");
        $.ajax({
            url: '/HRM/Organogram/GetOfficePositions',
            type: "GET",
            success: function (officePositionHtml) {
                $(officePositionCombo).removeAttr("disabled").html(officePositionHtml);

                if (isEdit) {
                    $(officePositionCombo).val(selectedOfficePositionId);
                } else {
                    $(officePositionCombo).selectedIndex = 0;
                }
                updateParentOrganogramCallBack(isEdit, $(officePositionCombo).val(), parentCombo);
            }
        });
        $(officePositionCombo).bind("change", function (e) {
            updateParentOrganogramCallBack(false, $(officePositionCombo).val(), parentCombo);
        });
    }

    function updateParentOrganogramCallBack(isEdit, selectedOfficePositionId, parentCombo) {
        var url = '/HRM/Organogram/GetParentOrganogramsByPosition/?positionid=' + selectedOfficePositionId + "&officeid=" + $("#OfficeId").val();
        $(parentCombo)
             .html("<option value=''>Loading parent organograms...</option>")
             .attr("disabled", "disabled");
        $.ajax({
            url: url,
            type: "GET",
            success: function (parentJson) {
                var parents = eval(parentJson);
                var parentHtml = "";
                $(parents).each(function (i, option) {
                    parentHtml += '<option value="' + option.Id + '">' + option.EmployeeName + '</option>';
                });
                $(parentCombo).removeAttr("disabled").html(parentHtml);
                if (isEdit) {
                    var selectedParentId = $("#jqGrid").jqGrid('getRowData', $("#jqGrid")[0].p.selrow).ParentId | 0;
                    $(parentCombo).val(selectedParentId);
                } else {
                    $(parentCombo).selectedIndex = 0;
                }
                $(parentCombo).focus();
            }
        });
    }

    $(function () {
        $("#jqGrid").jqGrid({
            url: "/HRM/Organogram/GetOrganograms",
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'OfficeLayerId', 'OfficeId', 'Office Name', 'UnitType', 'OfficeUnitId', 'Office Unit Name', 'PositionId', 'Position Name', 'ParentId', 'Parent Name','EmployeeId', 'EmployeeName', 'DesignationId', 'Designation Name'
            ],
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                { key: false, hidden: true, name: 'OfficeLayerId', index: 'OfficeLayerId', editable: true, edittype: "select", editrules: { required: true, edithidden: true }, formoptions: { label: "Office Layer" }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, hidden: true, name: 'OfficeId', index: 'OfficeId', editable: true, edittype: "select", editrules: {required: true ,edithidden: true }, formoptions: { label: "Office" } },
                { key: false, name: 'OfficeName', index: 'OfficeName', label: "OfficeName", editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, hidden: true, name: 'UnitType', index: 'UnitType', editable: true, edittype: "select", editrules: { required: true, edithidden: true }, formoptions: { label: "Unit Type" }, classes: "grid-col" },
                { key: false, hidden: true, name: 'OfficeUnitId', index: 'OfficeUnitId', editable: true, edittype: "select", editrules: { required: true, edithidden: true }, formoptions: { label: "Office Unit" } },
                { key: false, name: 'OfficeUnitName', index: 'OfficeUnitName', label: "OfficeUnitName", editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, hidden: true, name: 'PositionId', index: 'PositionId', editable: true, edittype: "select", editrules: { required: true, edithidden: true }, formoptions: { label: "Office Position: " }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'PositionName', index: 'PositionName', label: "PositionName", editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, hidden: true, name: 'ParentId', index: 'ParentId', editable: true, edittype: "select", editrules: { required: true, edithidden: true }, formoptions: { label: "Parent" }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'ParentName', index: 'ParentName', label: "ParentName", editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, hidden: true, name: 'EmployeeId', index: 'EmployeeId', editable: true, edittype: "select", editrules: { required: true, edithidden: true }, formoptions: { label: "Employee" } },
                { key: false, name: 'EmployeeName', index: 'EmployeeName',editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                //{ key: false, name: 'Name', index: 'Name', editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                {
                    key: false, hidden: true, name: 'DesignationId', width: 140, index: 'DesignationId', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/Designation/GetDesignations', cacheUrlData: true }, editrules: { edithidden: true, required: true },
                    formoptions: { label: "Designation", required: true }
                },
            { key: false, name: 'DesignationName', index: 'DesignationName', label: "DesignationName", editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" }
            ],
            ondblClickRow: function (rowid) {
                jQuery("#jqGrid").jqGrid('editGridRow', rowid);
            },
            pager: jQuery('#jqControls'),
            rowNum: 10,
            rowList: [10, 20, 30, 40, 50],
            hoverrows: true,
            sortable: true,
            width: '70%',
            viewrecords: true,
            caption: 'Organogram Records',
            emptyrecords: 'No Organogram Records are Available to Display',
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
        }).navGrid('#jqControls',
        { edit: true, add: true, del: true, search: true, refresh: true },
        {
            zIndex: 100,
            url: '/HRM/Organogram/SaveOrganogram',
            closeOnEscape: true,
            closeAfterEdit: true,
            width: 'auto',
            height: 'auto',
            recreateForm: true,
            onInitializeForm: function (formId) { populateOfficeLayer(true); populateUnitType(true); populateOfficePosition(true);},
            afterComplete: function (response) {
                if (response.responseText) {
                    Messager.ShowMessage(response.responseText);
                }
            }
        },
        {
            zIndex: 100,
            url: '/HRM/Organogram/SaveOrganogram',
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterAdd: true,
            onInitializeForm: function (formId) { populateOfficeLayer(false); populateUnitType(false); populateOfficePosition(false);},
            afterComplete: function (response) {
                if (response.responseText) {
                    Messager.ShowMessage(response.responseText);
                }
            }
        },
        {
            zIndex: 100,
            url: "/HRM/Organogram/DeleteOrganogram",
            closeOnEscape: true,
            closeAfterDelete: true,
            recreateForm: true,
            msg: "Are you sure to delete this Organogram? ",
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
