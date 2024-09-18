$(document).ready(function () {
    $(function () {
        $("#jqGrid").jqGrid({
            url: "/HRM/SalaryItem/GetAllSalaryItems",
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'Name', 'Description', 'Taxable', 'TaxPercent', 'SalaryItemType', 'SalaryItemTypeName', 'DisplayOrder', 'IspercentOfBasic', 'Ceiling', 'Status', 'StatusName', 'ContributionType', 'ContributionTypeName'], //validatePositive
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                { key: false, name: 'Name', index: 'Name', label: 'Name', editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                { key: false, name: 'Description', index: 'Description', label: 'Description', editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                { key: false, name: 'IsTaxable', index: 'IsTaxable', editable: true, edittype: "select", editoptions: { value: "true:true;false:false" }, editrules: { edithidden: true, required: true }, label: "IsTaxable", searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'TaxPercent', index: 'TaxPercent', label: 'TaxPercent', editable: true, editrules: { custom_func: validatePositive, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },

                { key: false, hidden: true, name: 'SalaryItemType', index: 'SalaryItemType', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/SalaryItem/GetAllSalaryType', cacheUrlData: true }, editrules: { edithidden: true, required: true }, label: "SalaryItemType", searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'SalaryItemTypeName', index: 'SalaryItemTypeName', label: 'SalaryItemTypeName', editable: false },
                { key: false, name: 'DisplayOrder', index: 'DisplayOrder', label: 'DisplayOrder', editable: true, editrules: {number: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                { key: false, name: 'IspercentOfBasic', index: 'IspercentOfBasic', editable: true, edittype: "select", editoptions: { value: "true:true;false:false" }, editrules: { required: true }, label: "IspercentOfBasic", searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'Ceiling', index: 'Ceiling', label: 'Ceiling', editable: true, editrules: { number: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                { key: false, hidden: true, name: 'Status', index: 'Status', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/SalaryItem/GetAllSalaryStatus', cacheUrlData: true }, editrules: { edithidden: true, required: true }, label: "Status", searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'StatusName', index: 'StatusName', label: 'StatusName', editable: false },
                { key: false, hidden: true, name: 'ContributionType', index: 'ContributionType', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/SalaryItem/GetAllContributionTypes', cacheUrlData: true }, editrules: { edithidden: true, required: true }, label: "ContributionType", searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'ContributionTypeName', index: 'ContributionTypeName', label: 'ContributionTypeName', editable: false }

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
            caption: 'Salary Item Information',
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
        }).navGrid('#jqGridPager',
        { edit: true, add: true, search: true, refresh: true }, // del: true,
        {
            zIndex: 100,
            url: '/HRM/SalaryItem/SaveSalaryItem',
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterEdit: true,
            recreateForm: true,
            afterComplete: function (response) {
                Messager.ShowMessage(response.Message);
                //location.reload(true);
            }
        },
        {
            zIndex: 100,
            url: "/HRM/SalaryItem/SaveSalaryItem",
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterAdd: true,
            afterComplete: function (response) {
                Messager.ShowMessage(response.Message);
                location.reload(true);
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