$(document).ready(function () {
    $(function () {
        $("#jqGrid").jqGrid({
            url: "/Membership/Settings/GetAssociations",
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
            caption: 'Association Records',
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
        { edit: true, add: true, search: true, refresh: true },
        {

            zIndex: 100,
            url: '/Membership/Settings/SaveAssociation',
            closeOnEscape: true,
            closeAfterEdit: true,
            recreateForm: true,
            width: 'auto',
            height: 'auto',

            //onInitializeForm: function (formId) { populateDesignations(true); },
            afterComplete: function (response) {
                if (response.responseText) {
                    toastr.success("Association Edited Successfully");
                }
            }
        },
        {
            zIndex: 100,
            url: "/Membership/Settings/SaveAssociation",
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterAdd: true,
            afterComplete: function (response) {
                //Messager.ShowMessage(response.Message);
                toastr.success("Association Saved Successfully");
            }
        },

        {
            closeOnEscape: true, multipleSearch: true,
            closeAfterSearch: true
        }
        );
    });
});