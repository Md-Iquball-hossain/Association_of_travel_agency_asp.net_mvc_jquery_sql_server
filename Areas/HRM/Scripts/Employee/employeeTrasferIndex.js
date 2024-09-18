$(document).ready(function() {
    function populateParentOffice(isEdit) {
        var unitTypeCombo = $("#tr_UnitType select");
        var officeUnitCombo = $("#tr_OfficeUnitId select");
        $(unitTypeCombo).attr("id", "UnitType").attr("name", "UnitType");
        $(officeUnitCombo).attr("id", "OfficeUnitId").attr("name", "OfficeUnitId");
        var selectedUnitType = $("#jqGrid").jqGrid('getRowData', $("#jqGrid")[0].p.selrow).UnitType | 0;
        $(unitTypeCombo)
            .html("<option value=''>Loading Unit types...</option>")
            .attr("disabled", "disabled");
        $.ajax({
            url: '/HRM/OfficeUnit/GetUnitTypes',
            type: "GET",
            success: function(unittypeHtml) {
                $(unitTypeCombo).removeAttr("disabled").html(unittypeHtml);
                if (isEdit) {
                    $(unitTypeCombo).val(selectedUnitType);
                } else {
                    $(unitTypeCombo).selectedIndex = 0;
                }
                updateOfficeUnitCallBack(isEdit, $(unitTypeCombo).val(), officeUnitCombo);
            }
        });
        $(unitTypeCombo).bind("change", function (e) {
            updateOfficeUnitCallBack(false, $(unitTypeCombo).val(), officeUnitCombo);
        });
    }

    function updateOfficeUnitCallBack(isEdit, selectedUnitType, officeUnitCombo) {
        var url = '/HRM/OfficeUnit/GetOfficetUnits/?unittype=' + selectedUnitType;
        $(officeUnitCombo)
            .html("<option value=''>Loading office units...</option>")
            .attr("disabled", "disabled");
        $.ajax({
            url: url,
            type: "GET",
            success: function(officeUnitJson) {
                var data = eval(officeUnitJson);
                var officeunits = data.OfficeUnits;
                var officeUnitHtml = "";
                $(officeunits).each(function (i, option) {
                    officeUnitHtml += '<option value="' + option.Id + '">' + option.Name + '</option>';
                });
                $(officeUnitCombo).removeAttr("disabled").html(officeUnitHtml);
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

    function populateOfficeLayer(isEdit) {
        var officelayerCombo = $("#tr_OfficeLayerId select");
        var parentidCombo = $("#tr_OfficeId select");
        $(officelayerCombo).attr("id", "OfficeLayerId").attr("name", "OfficeLayerId");
        $(parentidCombo).attr("id", "OfficeId").attr("name", "OfficeId");
        var selectedOfficeLayerId = $("#jqGrid").jqGrid('getRowData', $("#jqGrid")[0].p.selrow).OfficeLayerId | 0;
        $(officelayerCombo)
            .html("<option value=''>Loading OfficeLevel...</option>")
            .attr("disabled", "disabled");
        $.ajax({
            url: '/HRM/OfficeLayer/GetAllOfficeLayers',
            type: "GET",
            success: function (officelevelHtml) {
                $(officelayerCombo).removeAttr("disabled").html(officelevelHtml);

                if (isEdit) {
                    $(officelayerCombo).val(selectedOfficeLayerId);
                } else {
                    $(officelayerCombo).selectedIndex = 0;
                }
                updateParentOfficeLayerCallBack(isEdit, $(officelayerCombo).val(), parentidCombo);
            }
        });
        $(officelayerCombo).bind("change", function (e) {
            updateParentOfficeLayerCallBack(false, $(officelayerCombo).val(), parentidCombo);
        });
    }

    function updateParentOfficeLayerCallBack(isEdit, selectedOfficeLayerId, parentidCombo) {
        var url = '/HRM/Office/GetAllOffices/?officeLayerId=' + selectedOfficeLayerId;
        $(parentidCombo)
            .html("<option value=''>Loading offices...</option>")
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
                    var selectedParentId = $("#jqGrid").jqGrid('getRowData', $("#jqGrid")[0].p.selrow).OfficeId | 0;
                    $(parentidCombo).val(selectedParentId);
                } else {
                    $(parentidCombo).selectedIndex = 0;
                }
                $(parentidCombo).focus();
            }
        });
    }

    $(document).ready(function() {
        $(function() {
            $("#jqGrid").jqGrid({
                url: "/HRM/Employee/GetEmployeeTransfers",
                datatype: 'json',
                mtype: 'Get',
                colNames: ['EmployeeId', 'EmployeeName', 'DesignationId', 'DesignationName', 'UnitType', 'OfficeUnitId', 'OfficeUnitName', 'OfficeLayerId', 'OfficeId', 'OfficeName', 'EffectiveDate', 'ToDate', 'GradeStepName', 'JobStatusName', 'Remarks'], // colNames: ['EmployeeId', 'EmployeeName', 'DesignationId', 'DesignationName', 'OfficeUnitId', 'OfficeUnitName', 'OfficeId', 'OfficeName', 'FromDate', 'ToDate'],
                colModel: [
                    {
                        key: true,
                        hidden: true,
                        name: 'EmployeeId',
                        index: 'EmployeeId',
                        editable: true,
                        edittype: "select",
                        editoptions: { dataUrl: '/HRM/Employee/GetAllEmployees', cacheUrlData: true },
                        editrules: { edithidden: true, required: true },
                        formoptions: { label: "Employee" }
                    },
                    { key: false, name: 'EmployeeName', index: 'EmployeeName', label: 'EmployeeName', editable: false },
                   
                    {
                        key: false,
                        hidden: true,
                        name: 'DesignationId',
                        width: 140,
                        index: 'DesignationId',
                        editable: true,
                        edittype: "select",
                        editoptions: { dataUrl: '/HRM/Designation/GetDesignations', cacheUrlData: true },
                        editrules: { edithidden: true, required: true },
                        formoptions: { label: "Designation" }
                    },
                    { key: false, name: 'DesignationName', index: 'DesignationName', label: "DesignationName", editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                    
                    { key: false, hidden: true, name: 'UnitType', index: 'UnitType', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/OfficeUnit/GetAllUnits', cacheUrlData: true }, editrules: { edithidden: true, required: true }, label: "UnitType", searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                   
                    { key: false, hidden: true, name: 'OfficeUnitId', index: 'OfficeUnitId', editable: true, edittype: "select", editrules: { required: true, edithidden: true }, formoptions: { label: "OfficeUnit: " } },
                    { key: false, name: 'OfficeUnitName', index: 'OfficeUnitName', label: 'OfficeUnitName', editable: false },
           
                    { key: false, hidden: true, name: 'OfficeLayerId', index: 'OfficeLayerId', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/OfficeLayer/GetAllOfficeLayers', cacheUrlData: true }, editrules: { edithidden: true, required: true }, label: "OfficeLayer", searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                   
                    { key: false, hidden: true, name: 'OfficeId', index: 'OfficeId', editable: true, edittype: "select", editrules: { required: true, edithidden: true }, formoptions: { label: "Office: " } },
                    { key: false, name: 'OfficeName', index: 'OfficeName', label: 'OfficeName', editable: false },
                    {
                        key: false,
                        name: "EffectiveDate",
                        index: 'EffectiveDate',
                        label: "EffectiveDate",
                        formatter: "date",
                        editable: true,
                        editrules: { required: true },
                        edittype: "text",
                        editoptions: {
                            dataInit: function(element) {
                                $(element).datepicker({
                                    id: 'QuarterOne_datePicker',
                                    dateFormat: 'M/d/yy',
                                    changeYear: true,
                                    showOn: 'focus'
                                });
                            }
                        }
                    },
                    {
                        key: false,
                        name: "ToDate",
                        index: 'ToDate',
                        label: "ToDate",
                        formatter: "date",
                        editable: true,
                        //editrules: { required: true },
                        edittype: "text",
                        editoptions: {
                            dataInit: function(element) {
                                $(element).datepicker({
                                    id: 'QuarterTwo_datePicker',
                                    dateFormat: 'M/d/yy',

                                    changeYear: true,
                                    showOn: 'focus'
                                });
                            }
                        }
                    },
                    { key: false, name: 'GradeStepName', index: 'GradeStepName', label: 'GradeStepName', editable: false },
                    { key: false, name: 'JobStatusName', index: 'JobStatusName', label: 'JobStatusName', editable: false },
                    { key: false, name: 'Remarks', index: 'Remarks', label: 'Remarks', editable: true }
                ],
                loadonce: true,
                pager: jQuery('#jqGridPager'),
                rowNum: 10,
                rowList: [10, 20, 30, 40, 50],
                hoverrows: true,
                sortable: true,
                width: '70%',
                viewrecords: true,
                caption: 'Fiscal Years Records',
                emptyrecords: 'No Transfer Records are Available to Display',
                jsonReader: {
                    root: "rows",
                    page: "page",
                    total: "total",
                    records: "records",
                    repeatitems: false,
                    Id: "0"
                },
                autowidth: true,
                height: 'auto', //set auto height
                multiselect: false
            }).navGrid('#jqGridPager',
                { edit: false, add: false, del: false, search: true, refresh: true },
                {
                    zIndex: 100,
                    url: '/HRM/Employee/SaveEmployeeTransfer',
                    closeOnEscape: true,
                    closeAfterEdit: true,
                    recreateForm: true,
                    onInitializeForm: function (formId) { populateParentOffice(true);
                        populateOfficeLayer(true);
                    },
                    afterComplete: function(response) {
                        Messager.ShowMessage(response.responseText);
                    }
                },
                {
                    zIndex: 100,
                    url: "/HRM/Employee/SaveEmployeeTransfer",
                    closeOnEscape: true,
                    closeAfterAdd: true,
                    onInitializeForm: function (formId) { populateParentOffice(false); populateOfficeLayer(false); },
                    afterComplete: function(response) {
                        Messager.ShowMessage(response.responseText);
                    }
                },
                {
                    zIndex: 100,
                    url: "/HRM/Employee/DeleteEmployeeTransfer",
                    closeOnEscape: true,
                    closeAfterDelete: true,
                    recreateForm: true,
                    msg: "Are you sure to delete this information? ",
                    afterComplete: function(response) {
                        Messager.ShowMessage(response.responseText);
                    }
                },
                {
                    closeOnEscape: true,
                    multipleSearch: true,
                    closeAfterSearch: true
                }
            );
        });
    });
});