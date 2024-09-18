$(document).ready(function () {
    $(function () {
        $("#jqGrid").jqGrid({
            url: "/HRM/OfficeOutTime/GetAllOfficeOutTime",
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'EmployeeId', 'EmployeeName', 'ApprovedById', 'ApprovedByName', 'FromTime', 'ToTime', 'SubstituteId', 'SubstituteName'],
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                { key: false, hidden: true, name: 'EmployeeId', index: 'EmployeeId', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/OfficeOutTime/GetAllEmployees', cacheUrlData: true }, editrules: { edithidden: true, required: true }, label: "Employee", searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'EmployeeName', index: 'EmployeeName', label: 'EmployeeName', editable: false },
                { key: false, hidden: true, name: 'ApprovedById', index: 'ApprovedById', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/OfficeOutTime/GetAllEmployees', cacheUrlData: true }, editrules: { edithidden: true, required: true }, label: "ApprovedBy", searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'ApprovedByName', index: 'ApprovedByName', label: 'ApprovedByName', editable: false },
                {
                    key: false,
                    name: "FromTime", index: 'FromTime', label: "FromTime", editable: true, editrules: { time: true }, formatter: "date", //formatoptions: { srcformat: "ISO8601Long", newformat: "m/d/Y h:i A" },
                    editoptions: {
                        dataInit: function (element) {
                            $(element).datepicker({
                                id: 'FromTime_datePicker',
                                showOn: 'focus',

                                dateFormat: '',
                                timeFormat: 'hh:mm tt',
                                timeOnly: true
                                //dateFormat: '',
                                //timeFormat: 'hh:mm tt',
                                //datepicker: false,
                                //format: 'H:i'
                            });
                        }
                    }
                },
                {
                    key: false,
                    name: "ToTime", index: 'ToTime', label: "ToTime", editable: true, editrules: { time: true }, formatter: "date", //formatoptions: { srcformat: 'ISO8601Long', newformat: 'ShortTime' },
                    editoptions: {
                        dataInit: function (element) {
                            $(element).datepicker({
                                id: 'ToTime_datePicker',
                                showOn: 'focus',
                                dateFormat: '',
                                timeFormat: 'hh:mm tt',
                                timeOnly: true
                                //dateFormat: '',
                                //timeFormat: 'hh:mm tt',
                                //datepicker: false,
                                //format: 'H:i'

                            });
                        }
                    }
                },
                { key: false, hidden: true, name: 'SubstituteId', index: 'SubstituteId', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/OfficeOutTime/GetAllEmployees', cacheUrlData: true }, editrules: { edithidden: true, required: true }, label: "Substitute", searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'SubstituteName', index: 'SubstituteName', label: 'SubstituteName', editable: false }
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
            caption: 'OfficeOutTime Records',
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
        { edit: true, add: true, del: true, search: true, refresh: true },
        {

            zIndex: 100,
            url: '/HRM/OfficeOutTime/SaveOfficeOutTime',
            closeOnEscape: true,
            closeAfterEdit: true,
            recreateForm: true,
            width: 'auto',
            height: 'auto',

            //onInitializeForm: function (formId) { populateDesignations(true); },
            afterComplete: function (response) {
                if (response.responseText) {
                    toastr.success(response.responseText);
                }
            }
        },
        {
            zIndex: 100,
            url: "/HRM/OfficeOutTime/SaveOfficeOutTime",
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterAdd: true,
            afterComplete: function (response) {
                Messager.ShowMessage(response.Message);
            }
        },
        {
            zIndex: 100,
            url: "/HRM/OfficeOutTime/DeleteOfficeOutTime",
            closeOnEscape: true,
            closeAfterDelete: true,
            recreateForm: true,
            msg: "Are you sure to delete this module? ",
            afterComplete: function (response) {
                Messager.ShowMessage(response.Message);
            }
        },
        {
            closeOnEscape: true, multipleSearch: true,
            closeAfterSearch: true
        }
        );
    });
});