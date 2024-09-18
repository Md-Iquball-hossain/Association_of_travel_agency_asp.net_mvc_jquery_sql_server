$(document).ready(function () {
    $(function () {
        $("#jqGrid").jqGrid({
            url: "/HRM/Designation/GetDesign",
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'Name', 'GradeId', 'Grade Name'],
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                { key: false, name: 'Name', index: 'Name', editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                {
                    key: false, hidden: true, name: 'GradeId', width: 140, index: 'GradeId', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/Designation/GetCorrespondingGrade', cacheUrlData: true }, editrules: { edithidden: true, required: true },
                    formoptions: { label: "Grade"}
                },//edithidden can allowus to edit hidden col                
                { key: false, name: 'GradeName', index: 'GradeName', label: "Grade Name", editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" }

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
            caption: 'Designation Records',
            emptyrecords: 'No Designation Records are Available to Display',
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
            url: '/HRM/Designation/SaveDesign',
            closeOnEscape: true,
            closeAfterEdit: true,
            width: 'auto',
            height: 'auto',
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
            url: "/HRM/Designation/SaveDesign",
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
            url: "/HRM/Designation/DeleteDesign",
            closeOnEscape: true,
            closeAfterDelete: true,
            recreateForm: true,
            msg: "Are you sure to delete this Designation? ",
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