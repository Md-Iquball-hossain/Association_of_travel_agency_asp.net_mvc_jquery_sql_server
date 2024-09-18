$(document).ready(function () {
    $(function () {
        $("#jqGrid").jqGrid({
            url: "/HRM/PostOffice/GetPostOffices",
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'Code', 'Name', 'LocationId', 'Location Name'],
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                { key: false, name: 'Code', label: 'Code', index: 'Code', width: 140, editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'Name', label: 'Name', index: 'Name', width: 140, editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                {
                    key: false, hidden: true, name: 'LocationId', width: 140, index: 'LocationId', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/PostOffice/GetLastLocations', cacheUrlData: true }, editrules: { edithidden: true, required: true },
                    formoptions: { label: "Location"}
                },//edithidden can allowus to edit hidden col
                { key: false, name: 'LocationName', label: 'LocationName', index: 'LocationName', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" }

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
            caption: 'Location Records',
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

            height: 'auto',//set auto height
            multiselect: false
        }).navGrid('#jqGridPager',
        { edit: true, add: true, del: true, search: true, refresh: true },
        {
            zIndex: 100,
            url: '/HRM/PostOffice/SavePostOffice',
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
            url: "/HRM/PostOffice/SavePostOffice",
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
            url: "/HRM/PostOffice/DeletePostOffice",
            closeOnEscape: true,
            closeAfterDelete: true,
            recreateForm: true,
            msg: "Are you sure to delete this Post Office?",
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

