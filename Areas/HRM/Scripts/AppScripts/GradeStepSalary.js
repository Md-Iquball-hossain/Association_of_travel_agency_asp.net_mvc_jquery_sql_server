$(document).ready(function () {
    function populateGrade(isEdit) {
        var gradeCombo = $("#tr_GradeId select");
        var gradeStepCombo = $("#tr_GradeStepId select");
        $(gradeCombo).attr("id", "GradeId").attr("name", "GradeId");
        $(gradeStepCombo).attr("id", "GradeStepId").attr("name", "GradeStepId");

        var selectedGradeId = $("#jqGrid").jqGrid('getRowData', $("#jqGrid")[0].p.selrow).GradeId | 0;
        $(gradeCombo)
                     .html("<option value=''>Loading Grades...</option>")
                     .attr("disabled", "disabled");
        $.ajax({
            url: '/HRM/Designation/GetCorrespondingGrade',
            type: "GET",
            success: function (gradeHtml) {
                $(gradeCombo).removeAttr("disabled").html(gradeHtml);

                if (isEdit) {
                    $(gradeCombo).val(selectedGradeId);
                } else {
                    $(gradeCombo).selectedIndex = 0;
                }
                updateGradeStepCallBack(isEdit, $(gradeCombo).val(), gradeStepCombo);
            }
        });
        $(gradeCombo).bind("change", function (e) {
            updateGradeStepCallBack(false, $(gradeCombo).val(), gradeStepCombo);
        });
    }

    function updateGradeStepCallBack(isEdit, selectedGradeId, gradeStepCombo) {
        var url = '/HRM/Grade/GetGradeStepByGrade/?gradeid=' + selectedGradeId;
        $(gradeStepCombo)
             .html("<option value=''>Loading grade steps...</option>")
             .attr("disabled", "disabled");
        $.ajax({
            url: url,
            type: "GET",
            success: function (gradeStepJson) {
                var gradesteps = eval(gradeStepJson);
                var gradeStepHtml = "";
                $(gradesteps).each(function (i, option) {
                    gradeStepHtml += '<option value="' + option.Id + '">' + option.StepName + '</option>';
                });
                $(gradeStepCombo).removeAttr("disabled").html(gradeStepHtml);
                if (isEdit) {
                    var selectedGradeStepId = $("#jqGrid").jqGrid('getRowData', $("#jqGrid")[0].p.selrow).GradeStepId | 0;
                    $(gradeStepCombo).val(selectedGradeStepId);
                } else {
                    $(gradeStepCombo).selectedIndex = 0;
                }
                $(gradeStepCombo).focus();
            }
        });
    }
    $(function () {
        $("#jqGrid").jqGrid({
            url: "/HRM/Grade/GetGradeStepSalaryItems",
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'GradeId', 'GradeName', 'GradeStepId', 'GradeStepName', 'SalaryItemId', 'SalaryItemName', 'SalaryItemUnit', 'Amount'
            ],
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                
                { key: false, hidden: true, name: 'GradeId', index: 'GradeId', editable: true, edittype: "select", editrules: { required: true, edithidden: true }, formoptions: { label: "Grade" }, classes: "grid-col" },
                { key: false, name: 'GradeName', index: 'GradeName', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, hidden: true, name: 'GradeStepId', index: 'GradeStepId', editable: true, edittype: "select", editrules: { edithidden: true, required: true }, formoptions: { label: "Grade Step" } },
                { key: false, name: 'GradeStepName', index: 'GradeStepName',editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                {
                    key: false, hidden: true, name: 'SalaryItemId', width: 140, index: 'SalaryItemId', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/SalaryItem/GetSalaryItemList', cacheUrlData: true }, editrules: { edithidden: true, required: true },
                    formoptions: { label: "Salary Item" }
                },
                { key: false, name: 'SalaryItemName', index: 'SalaryItemName', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'SalaryItemUnit', index: 'SalaryItemUnit', editable: true, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                {
                    key: false, name: 'Amount', index: 'Amount',
                    summaryTpl: "Sum: {0}",
                    summaryType: "sum",

                    editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col"
                }
                
                
            ],
            ondblClickRow: function (rowid) {
                jQuery("#jqGrid").jqGrid('editGridRow', rowid);
            },
            loadonce: true,
            pager: jQuery('#jqGridPager'),
            footerrow: true,
            userDataOnFooter: true,
            grouping: true,
            groupingView:{
                groupField: ["GradeName"],
                groupColumnShow: [false],
                groupText: ["<b>{0}</b>"],
                groupOrder: ["asc","asc"],
                groupSummary: [true],
                groupCollapse: false
                    
            },
            rowNum: 10,
            rowList: [10, 20, 30, 40, 50],
            hoverrows: true,
            sortable: true,
            width: '70%',
            viewrecords: true,
            caption: 'Grade Step Salary Item Records',
            emptyrecords:'No Records are Available to Display',
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
       { edit: true, add: true, del: false, search: true, refresh: true },
       {
           zIndex: 100,
           url: '/HRM/Grade/SaveGradeStepSalaryItem',
           closeOnEscape: true,
           closeAfterEdit: true,
           width: 'auto',
           height: 'auto',
           recreateForm: true,
           onInitializeForm: function (formId) { populateGrade(true); },
           afterComplete: function (response) {
               if (response.responseText) {
                   Messager.ShowMessage(response.responseText);
               }
           }
       },
       {
           zIndex: 100,
           url: '/HRM/Grade/SaveGradeStepSalaryItem',
           closeOnEscape: true,
           width: 'auto',
           height: 'auto',
           closeAfterAdd: true,
           onInitializeForm: function (formId) { populateGrade(false); },
           afterComplete: function (response) {
               if (response.responseText) {
                   Messager.ShowMessage(response.responseText);
               }
           }
       },
       {
           zIndex: 100,
           url: "/HRM/Grade/DeleteGradeStepSalaryItem",
           closeOnEscape: true,
           closeAfterDelete: true,
           recreateForm: true,
           msg: "Are you sure to delete this Grade step salary? ",
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

   // $("#jqGrid").jqGrid('groupingGroupBy', ['GradeName', 'GradeStepName']);
});