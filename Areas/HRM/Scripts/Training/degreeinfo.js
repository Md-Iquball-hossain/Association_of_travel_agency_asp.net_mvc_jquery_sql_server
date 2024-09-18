$(document).ready(function () {
    $(function () {
        $("#jqGrid").jqGrid({
            url: "/HRM/Training/GetDegree",
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'Name', 'DegreeLevel', 'Degree Level Name', 'DegreeMajor', 'Degree Major Name', 'Duration'],
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                { key: false, name: 'Name', label: 'Name', index: 'Name', width: 140, editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                {
                    key: false, hidden: true, name: 'DegreeLevel', width: 140, index: 'DegreeLevel', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/Training/GetDegreeLevels', cacheUrlData: true }, editrules: { edithidden: true, required: true },
                    formoptions: { label: "Degree Level"}
                },//edithidden can allowus to edit hidden col
                { key: false, name: 'DegreeLevelName', label: 'DegreeLevelName', index: 'DegreeLevelName', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                {
                    key: false, hidden: true, name: 'DegreeMajor', width: 140, index: 'DegreeMajor', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/Training/GetDegreeMajors', cacheUrlData: true }, editrules: { edithidden: true, required: true },
                    formoptions: {label: "Degree Major"}
                },
                { key: false, name: 'DegreeMajorName', label: 'DegreeMajorName', index: 'DegreeMajorName', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },

                { key: false, name: 'Duration', label: 'Duration', index: 'Duration', width: 140, editable: true, editrules: { custom_func: validatePositive, custom: true, required: true }, align: 'right', searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
               

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
            //width: '70%',
            viewrecords: true,
            caption: 'Degree Records',
            emptyrecords: 'No Degree Records are Available to Display',
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
            url: '/HRM/Training/SaveDegree',
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterEdit: true,
            recreateForm: true,
            afterComplete: function (response) {
                Messager.ShowMessage(response.responseText);
                location.reload(true);
            }
        },
        {
            zIndex: 100,
            url: "/HRM/Training/SaveDegree",
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterAdd: true,
            afterComplete: function (response) {
                Messager.ShowMessage(response.responseText);
                location.reload(true);
            }
        },
        {
            zIndex: 100,
            url: "/HRM/Training/DeleteDegree",
            closeOnEscape: true,
            closeAfterDelete: true,
            recreateForm: true,
            msg: "Are you sure to delete this degree? ",
            afterComplete: function (response) {
                Messager.ShowMessage(response.responseText);
            }
        },
        {
            closeOnEscape: true, multipleSearch: true,
            closeAfterSearch: true
        }
        );
    });
});

