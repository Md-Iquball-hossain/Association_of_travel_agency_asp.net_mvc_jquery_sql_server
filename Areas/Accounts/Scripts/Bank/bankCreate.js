$(document).ready(function () {
    $(function () {
        $("#jqGrid").jqGrid({
            url: "/Accounts/Bank/GetBankList",
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'CompanyProfile', 'Name', 'Branch Name', 'Address', 'Phone', 'Email', 'Fax', 'Account No', 'Account Type', 'Signatories'], //validatePositive
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                { key: false, hidden: true, name: 'CompanyProfileId', index: 'CompanyProfileId', editable: true, edittype: "select", editoptions: { dataUrl: '/Auth/CompanyProfile/GetAllCompanyListForGrid', cacheUrlData: true }, editrules: { edithidden: true, required: true }, label: "CompanyProfileId", searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'Name', index: 'Name', label: 'Name', editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                { key: false, name: 'BranchName', index: 'BranchName', label: 'BranchName', editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                { key: false, name: 'Address', index: 'Address', label: 'Address', editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                { key: false, name: 'Phone', index: 'Phone', label: 'Phone', editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                { key: false, name: 'Email', index: 'Email', label: 'Email', editable: true, editrules: { required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                { key: false, name: 'Fax', index: 'Fax', label: 'Fax', editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                { key: false, name: 'AccountNo', index: 'AccountNo', label: 'AccountNo', editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                { key: false, hidden: true, name: 'AccountType', index: 'AccountType', editable: true, edittype: "select", editoptions: { dataUrl: '/Bank/GetBankAccountTypesForGrid', cacheUrlData: true }, editrules: { edithidden: true, required: true }, label: "AccountType", searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'Signatories', index: 'Signatories', label: 'Signatories', editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] } }
            ],
            pager: jQuery('#jqControls'),
            rowNum: 10,
            rowList: [10, 20, 30, 40, 50],
            hoverrows: true,
            sortable: true,
            width: '70%',
            viewrecords: true,
            caption: 'Bank Records',
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
        { edit: true, add: true, search: true, refresh: true }, // del: true,
        {
            zIndex: 100,
            url: '/Accounts/Bank/SaveBank',
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterEdit: true,
            recreateForm: true,
            afterComplete: function (response) {
                Messager.ShowMessage(response.Message);
            }
        },
        {
            zIndex: 100,
            url: "/Accounts/Bank/SaveBank",
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterAdd: true,
            afterComplete: function (response) {
                Messager.ShowMessage(response.Message);
            }
        },
        //{
        //    zIndex: 100,
        //    url: "/Calendar/DeleteHolidayTypes",
        //    closeOnEscape: true,
        //    closeAfterDelete: true,
        //    recreateForm: true,
        //    msg: "Are you sure to delete this module? ",
        //    afterComplete: function (response) {
        //        Messager.ShowMessage(response.Message);
        //    }
        //},
        {
            closeOnEscape: true, multipleSearch: true,
            closeAfterSearch: true
        }
        );
    });
});