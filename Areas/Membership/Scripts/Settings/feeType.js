$(document).ready(function () {
    $(function () {
        $("#jqGrid").jqGrid({
            url: "/Membership/Settings/GetFeeTypes",
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'Name', 'Quantitive', 'Mandatory', 'Account Receivable', 'Recuring Type', 'Amount', 'CompanyProfileId'],
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                { key: false, name: 'Name', index: 'Name', label: 'Name', editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                 {
                     key: false,
                     name: 'IsQuantitive',
                     index: 'IsQuantitive',
                     label: 'IsQuantitive',
                     editable: true,
                     formatter: 'checkbox',
                     align: 'center',
                     width: 15,
                     edittype: 'checkbox',
                     editoptions: { value: "True:true;False:false" },
                     stype: "select",
                     searchoptions: { sopt: ['eq', 'ne'], value: "True:true;False:false" }
                 },
                 {
                     key: false,
                     name: 'Mandatory',
                     index: 'Mandatory',
                     label: 'Mandatory',
                     editable: true,
                     formatter: 'checkbox',
                     align: 'center',
                     width: 20,
                     edittype: 'checkbox',
                     editoptions: { value: "True:true;False:false" },
                     stype: "select",
                     searchoptions: { sopt: ['eq', 'ne'], value: "True:true;False:false" }
                 },
                 {
                     key: false,
                     name: 'AccountReceivable',
                     index: 'AccountReceivable',
                     label: 'AccountReceivable',
                     editable: true,
                     formatter: 'checkbox',
                     align: 'center',
                     width: 20,
                     edittype: 'checkbox',
                     editoptions: { value: "True:true;False:false" },
                     stype: "select",
                     searchoptions: { sopt: ['eq', 'ne'], value: "True:true;False:false" }
                 },
                 {
                     key: false, name: 'RecuringType', index: 'RecuringType', editable: true, edittype: 'text', editrules: { required: true },width: 25,
                 },
                   //{ key: false, name: 'RecuringType', index: 'RecuringType', width: 75, formatter: 'number', sorttype: 'number', align: 'right' },
                {
                    key: false, name: 'Amount', index: 'Amount', editable: true, edittype: 'text',
                    editoptions: {
                        dataInit: function (element) {
                            $(element).keypress(function (e) {
                                if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                                    return false;
                                }

                            });
                        }
                    },
                    editrules: { required: true }
                },
                {
                    key: false, hidden: true, name: 'CompanyProfileId', index: 'OfficeId', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/Office/GetAllOffice', cacheUrlData: true }, editrules: { edithidden: true, required: true },
                    formoptions: { label: "Office" }
                }
            ],
            pager: jQuery('#jqControls'),
            rowNum: 10,
            rowList: [10, 20, 30, 40, 50],
            hoverrows: true,
            sortable: true,
            width: '50%',
            viewrecords: true,
            caption: 'Fee Type Record',
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
            url: '/Membership/Settings/SaveFeeType',
            closeOnEscape: true,
            closeAfterEdit: true,
            recreateForm: true,
            width: 'auto',
            height: 'auto',

            //onInitializeForm: function (formId) { populateDesignations(true); },
            afterComplete: function (response) {
                if (response.responseText) {
                    toastr.success("Fee Type Edited Successfully");
                }
            }
        },
        {
            zIndex: 100,
            url: "/Membership/Settings/SaveFeeType",
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterAdd: true,
            afterComplete: function (response) {
                //Messager.ShowMessage(response.Message);
                toastr.success("Fee Type Saved Successfully");
            }
        },

        {
            closeOnEscape: true, multipleSearch: true,
            closeAfterSearch: true
        }
        );
    });
});