$(document).ready(function () {
    $(function () {
        $("#jqGrid").jqGrid({
            url: "/Membership/Settings/GetBusinessCategories",
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'Name', 'Description'],
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                { key: false, name: 'Name', index: 'Name', label: 'Name', editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                { key: false, name: 'Description', index: 'Description', label: 'Description', editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] } }
               
            ],
            pager: jQuery('#jqControls'),
            rowNum: 10,
            rowList: [10, 20, 30, 40, 50],
            hoverrows: true,
            sortable: true,
            width: '70%',
            viewrecords: true,
            caption: 'Business Category Records',
            emptyrecords: 'No Module Records are Available to Display',
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
        { edit: true, add: true, del: true, search: true, refresh: true, },
        {

            zIndex: 100,
            url: '/Membership/Settings/SaveBusinessCategory',
            closeOnEscape: true,
            closeAfterEdit: true,
            recreateForm: true,
            width: 'auto',
            height: 'auto',

            //onInitializeForm: function (formId) { populateDesignations(true); },
            afterComplete: function (response) {
                if (response.responseText) {
                    toastr.success("Business Category Edited Successfully");
                }
            }
        },
        {
            zIndex: 100,
            url: "/Membership/Settings/SaveBusinessCategory",
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterAdd: true,
            afterComplete: function (response) {
                //Messager.ShowMessage(response.Message);
                toastr.success("Business Category Saved Successfully");
            }
        },
        //Code by Maruf
        {
            zIndex: 100,
            url: '/Membership/Settings/DeleteBusinessCategory',
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterDelete: true,
            recreateForm: true,
            msg: "Are you sure to delete this Business Category? ",
            afterComplete: function (response) {
                //Messager.ShowMessage(response.Message);
                toastr.success("Business Category Deleted!");
            }
        },
        //
        {
            closeOnEscape: true, multipleSearch: true,
            closeAfterSearch: true
        }
        );
    });
});