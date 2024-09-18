$(document).ready(function () {
    $(function () {
        $("#jqGrid").jqGrid({
            url: "/HRM/SalaryItem/GetAllPayScales",
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'Name', 'Grade', 'Grade Name', 'Basic Percentage', 'Rent Percentage', 'Medical Percentage', 'Telephone Percentage', 'Communication Percentage', 'Trainning Allowance Percentage', 'IncrementField', 'IncrementField Name', 'DecreamentField', 'DecreamentField Name'], //validatePositive
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                { key: false, name: 'Name', index: 'Name', label: 'Name', editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },

                { key: false, hidden: true, name: 'GradeId', index: 'GradeId', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/SalaryItem/GetAllSalaryGradeForPayScale', cacheUrlData: true }, editrules: { edithidden: true, required: true }, label: "GradeId", searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, hidden: true, name: 'GradeName', index: 'GradeName', label: 'GradeName', editable: false },

                { key: false, name: 'BasicPercentage', index: 'BasicPercentage', label: 'BasicPercentage', editable: true, editrules: { custom_func: validatePositive, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                { key: false, name: 'RentPercentage', index: 'RentPercentage', label: 'RentPercentage', editable: true, editrules: { custom_func: validatePositive, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                { key: false, name: 'MedicalPercentage', index: 'MedicalPercentage', label: 'MedicalPercentage', editable: true, editrules: { custom_func: validatePositive, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                { key: false, name: 'TelephonePercentage', index: 'TelephonePercentage', label: 'TelephonePercentage', editable: true, editrules: { custom_func: validatePositive, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                { key: false, name: 'CommunicationPercentage', index: 'CommunicationPercentage', label: 'CommunicationPercentage', editable: true, editrules: { custom_func: validatePositive, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                { key: false, name: 'TrainningAllowancePercentage', index: 'TrainningAllowancePercentage', label: 'TrainningAllowancePercentage', editable: true, editrules: { custom_func: validatePositive, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },

                { key: false, hidden: true, name: 'IncrementFieldId', index: 'IncrementFieldId', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/SalaryItem/GetAllFieldsForPayScale', cacheUrlData: true }, editrules: { edithidden: true, required: true }, label: "IncrementFieldId", searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'IncrementFieldName', index: 'IncrementFieldName', label: 'IncrementFieldName', editable: false },

                { key: false, hidden: true, name: 'DecreamentFieldId', index: 'DecreamentFieldId', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/SalaryItem/GetAllFieldsForPayScale', cacheUrlData: true }, editrules: { edithidden: true, required: true }, label: "DecreamentFieldId", searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, hidden: true, name: 'DecreamentFieldName', index: 'DecreamentFieldName', label: 'DecreamentFieldName', editable: false }
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
            url: '/HRM/SalaryItem/SaveGetAllPayScale',
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
            url: "/HRM/SalaryItem/SaveGetAllPayScale",
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