$(document).ready(function () {
    $(function () {
        $("#jqGrid").jqGrid({
            url: "/HRM/Inventory/GetPersonList",
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'Name', 'Age', 'Registration Date'],
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: true },
                { key: false, name: 'Name', index: 'Name', editable: true,editrules: {required: true}, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                { key: false, name: 'Age', index: 'Age', editable: true, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                //{ key: false, name: 'Gender', index: 'Gender', editable: true, edittype: 'select', editoptions: { value: { 'M': 'Male', 'F': 'Female', 'N': 'None' } } },
                //{ key: false, name: 'ClassName', index: 'ClassName', editable: true, edittype: 'select', editoptions: { value: { '1': '1st Class', '2': '2nd Class', '3': '3rd Class', '4': '4th Class', '5': '5th Class' } } },
                { key: false, name: 'RecordDate', index: 'RecordDate', editable: true, formatter: 'date', formatoptions: { newformat: 'd/m/Y' }, searchoptions: { sopt: ['eq', 'ne'] } }
            ],
            loadonce: true,
            pager: jQuery('#jqGridPager'),
            rowNum: 10,
            rowList: [10, 20, 30, 40, 50],
            sortable: true,
            hoverrows: true,
            width: '70%',
            viewrecords: true,
            caption: 'Person Records',
            emptyrecords: 'No Person Records are Available to Display',
            jsonReader: {
                root: "rows",
                page: "page",
                total: "total",
                records: "records",
                repeatitems: false,
                Id: "0"
            },
            autowidth: true,
            multiselect: false
        }).navGrid('#jqGridPager',
        { edit: true, add: true, del: true, search: true, refresh: true },
        {
            zIndex: 100,
            url: '/HRM/inventory/UpdatePerson',
            closeOnEscape: true,
            closeAfterEdit: true,
            recreateForm: true,
            afterComplete: function (response) {
                if (response.responseText) {
                    toastr.success(response.responseText);
                }
            }
        },
        {
            zIndex: 100,
            url: "/HRM/inventory/CreatePerson",
            closeOnEscape: true,
            closeAfterAdd: true,
            afterComplete: function (response) {
                if (response.responseText) {
                    toastr.success(response.responseText);
                }
            }
        },
        {
            zIndex: 100,
            url: "/HRM/inventory/DeletePerson",
            closeOnEscape: true,
            closeAfterDelete: true,
            recreateForm: true,
            msg: "Are you sure to delete this Person? ",
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