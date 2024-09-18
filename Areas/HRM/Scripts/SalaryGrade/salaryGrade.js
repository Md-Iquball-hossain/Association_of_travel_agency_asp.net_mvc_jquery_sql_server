$(document).ready(function () {
    $(function () {
        $("#jqGrid").jqGrid({
            url: "/HRM/SalaryItem/GetAllSalaryGrade",
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'Name'],
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                { key: false, name: 'Name', index: 'Name', label: 'Name', editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] } }
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
            caption: 'Holiday Types Records',
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
            url: '/HRM/SalaryItem/SaveSalaryGrade',
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterEdit: true,
            recreateForm: true,
            afterComplete: function (response) {
                Messager.ShowMessage(response.Message);
                location.reload(true);
            }
        },
        {
            zIndex: 100,
            url: "/HRM/SalaryItem/SaveSalaryGrade",
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