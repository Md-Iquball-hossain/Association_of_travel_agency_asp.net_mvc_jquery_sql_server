$(document).ready(function () {
    $(function () {
        $("#jqGrid").jqGrid({
            url: "/HRM/Appraisal/GetAllAppraisals",
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'Name', 'FiscalYearId', 'StartDate', 'Start Date text', 'EndDate', 'End Date text', 'AppraisalType', 'AppraisalStatus', 'EffectiveDate', 'Effective Date text', 'LastSubmissionDate', 'Last Submission Date text', 'LastE1Date', 'Last E1 Date text', 'LastE2Date', 'Last E2 Date text', 'Description', 'Comments'],
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                { key: false, name: 'Name', index: 'Name', label: 'Name', editable: true },
                { key: false, hidden: true, name: 'FiscalYearId', index: 'FiscalYearId', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/Calendar/GetAllAppraisalFiscalYear', cacheUrlData: true }, editrules: { edithidden: true, required: true }, label: "FiscalYear", searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                {
                    key: false,
                    name: "StartDate", index: 'StartDate', label: "StartDate", formatter: "date", formatoptions: { srcformat: "ISO8601Long", newformat: "d/m/Y" }, editable: false, edittype: "text",
                    editoptions: {
                        dataInit: function (element) {
                            $(element).datepicker({
                                id: 'StartDate_datePicker',
                                dateFormat: 'dd/MM/yyyy',
                                changeYear: true,
                                showOn: 'focus'
                            });
                        }
                    }
                },
                {
                    key: false,
                    name: "StartDateTxt", hidden: true, index: 'StartDateTxt', label: "Start Date text", formatter: "text", formatoptions: { srcformat: "ISO8601Long", newformat: "d/m/Y" }, editable: true, editrules: { edithidden: true, required: true }, edittype: "text", formoptions: { label: "Start Date text" },
                    editoptions: {
                        dataInit: function (element) {
                            $(element).datepicker({
                                id: 'StartDate_datePicker',
                                dateFormat: 'dd/mm/yy',
                                changeYear: true,
                                showOn: 'focus'
                            });
                        }
                    }
                },
                 {
                     key: false,
                     name: "EndDate", index: 'EndDate', label: "EndDate", formatter: "date", formatoptions: { srcformat: "ISO8601Long", newformat: "d/m/Y" }, editable: false, edittype: "text",
                     editoptions: {
                         dataInit: function (element) {
                             $(element).datepicker({
                                 id: 'EndDate_datePicker',
                                 dateFormat: 'dd/MM/yyyy',
                                 changeYear: true,
                                 showOn: 'focus'
                             });
                         }
                     }
                 },
                {
                    key: false,
                    name: "EndDateTxt", hidden: true, index: 'EndDateTxt', label: "End Date text", formatter: "text", formatoptions: { srcformat: "ISO8601Long", newformat: "d/m/Y" }, editable: true, editrules: { edithidden: true, required: true }, edittype: "text", formoptions: { label: "End Date text" },
                    editoptions: {
                        dataInit: function (element) {
                            $(element).datepicker({
                                id: 'EndDate_datePicker',
                                dateFormat: 'dd/mm/yy',
                                changeYear: true,
                                showOn: 'focus'
                            });
                        }
                    }
                },
                //{
                //    key: false,
                //    name: "StartDate", index: 'StartDate', label: "StartDate", formatter: "date", editable: true, editrules: { required: true }, edittype: "text",
                //    editoptions: {
                //        dataInit: function (element) {
                //            $(element).datepicker({
                //                id: 'StartDate_datePicker',
                //                dateFormat: 'M/d/yy',
                //                changeYear: true,
                //                showOn: 'focus'
                //            });
                //        }
                //    }
                //},
                //{
                //    key: false,
                //    name: "EndDate", index: 'EndDate', label: "EndDate", formatter: "date", editable: true, editrules: { required: true }, edittype: "text",
                //    editoptions: {
                //        dataInit: function (element) {
                //            $(element).datepicker({
                //                id: 'EndDate_datePicker',
                //                dateFormat: 'M/d/yy',

                //                changeYear: true,
                //                showOn: 'focus'
                //            });
                //        }
                //    }
                //},
                { key: false, hidden: true, name: 'AppraisalType', index: 'AppraisalType', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/Appraisal/GetAllAppraisalTypes', cacheUrlData: true }, editrules: { edithidden: true, required: true }, label: "FiscalYearId", searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, hidden: true, name: 'AppraisalStatus', index: 'AppraisalStatus', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/Appraisal/GetAllAppraisalStatus', cacheUrlData: true }, editrules: { edithidden: true, required: true }, label: "AppraisalStatus", searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                //{
                //    key: false,
                //    name: "EffectiveDate", index: 'EffectiveDate', label: "EffectiveDate", formatter: "date", editable: true, editrules: { required: true }, edittype: "text",
                //    editoptions: {
                //        dataInit: function (element) {
                //            $(element).datepicker({
                //                id: 'EffectiveDate_datePicker',
                //                dateFormat: 'M/d/yy',

                //                changeYear: true,
                //                showOn: 'focus'
                //            });
                //        }
                //    }
                //},
                {
                    key: false,
                    name: "EffectiveDate", index: 'EffectiveDate', label: "EffectiveDate", formatter: "date", formatoptions: { srcformat: "ISO8601Long", newformat: "d/m/Y" }, editable: false, edittype: "text",
                    editoptions: {
                        dataInit: function (element) {
                            $(element).datepicker({
                                id: 'EffectiveDate_datePicker',
                                dateFormat: 'dd/MM/yyyy',
                                changeYear: true,
                                showOn: 'focus'
                            });
                        }
                    }
                },
                {
                    key: false,
                    name: "EffectiveDateTxt", hidden: true, index: 'EffectiveDateTxt', label: "Effective Date text", formatter: "text", formatoptions: { srcformat: "ISO8601Long", newformat: "d/m/Y" }, editable: true, editrules: { edithidden: true, required: true }, edittype: "text", formoptions: { label: "Effective Date text" },
                    editoptions: {
                        dataInit: function (element) {
                            $(element).datepicker({
                                id: 'EffectiveDate_datePicker',
                                dateFormat: 'dd/mm/yy',
                                changeYear: true,
                                showOn: 'focus'
                            });
                        }
                    }
                },
                {
                    key: false,
                    name: "LastSubmissionDate", index: 'LastSubmissionDate', label: "LastSubmissionDate", formatter: "date", formatoptions: { srcformat: "ISO8601Long", newformat: "d/m/Y" }, editable: false, edittype: "text",
                    editoptions: {
                        dataInit: function (element) {
                            $(element).datepicker({
                                id: 'LastSubmissionDate_datePicker',
                                dateFormat: 'dd/MM/yyyy',
                                changeYear: true,
                                showOn: 'focus'
                            });
                        }
                    }
                },
                {
                    key: false,
                    name: "LastSubmissionDateTxt", hidden: true, index: 'LastSubmissionDateTxt', label: "End Date text", formatter: "text", formatoptions: { srcformat: "ISO8601Long", newformat: "d/m/Y" }, editable: true, editrules: { edithidden: true, required: true }, edittype: "text", formoptions: { label: "Last Submission Date text" },
                    editoptions: {
                        dataInit: function (element) {
                            $(element).datepicker({
                                id: 'LastSubmissionDate_datePicker',
                                dateFormat: 'dd/mm/yy',
                                changeYear: true,
                                showOn: 'focus'
                            });
                        }
                    }
                },
                //{
                //    key: false,
                //    name: "LastSubmissionDate", index: 'LastSubmissionDate', label: "LastSubmissionDate", formatter: "date", editable: true, editrules: { required: true }, edittype: "text",
                //    editoptions: {
                //        dataInit: function (element) {
                //            $(element).datepicker({
                //                id: 'LastSubmissionDate_datePicker',
                //                dateFormat: 'M/d/yy',

                //                changeYear: true,
                //                showOn: 'focus'
                //            });
                //        }
                //    }
                //},

                //{
                //    key: false,
                //    name: "LastE1Date", index: 'LastE1Date', label: "LastE1Date", formatter: "date", editable: true, editrules: { required: true }, edittype: "text",
                //    editoptions: {
                //        dataInit: function (element) {
                //            $(element).datepicker({
                //                id: 'LastE1Date_datePicker',
                //                dateFormat: 'M/d/yy',

                //                changeYear: true,
                //                showOn: 'focus'
                //            });
                //        }
                //    }
                //},
                {
                    key: false,
                    name: "LastE1Date", index: 'LastE1Date', label: "LastE1Date", formatter: "date", formatoptions: { srcformat: "ISO8601Long", newformat: "d/m/Y" }, editable: false, edittype: "text",
                    editoptions: {
                        dataInit: function (element) {
                            $(element).datepicker({
                                id: 'LastE1Date_datePicker',
                                dateFormat: 'dd/MM/yyyy',
                                changeYear: true,
                                showOn: 'focus'
                            });
                        }
                    }
                },
                {
                    key: false,
                    name: "LastE1DateTxt", hidden: true, index: 'LastE1DateTxt', label: "End Date text", formatter: "text", formatoptions: { srcformat: "ISO8601Long", newformat: "d/m/Y" }, editable: true, editrules: { edithidden: true, required: true }, edittype: "text", formoptions: { label: "Last E1 Date text" },
                    editoptions: {
                        dataInit: function (element) {
                            $(element).datepicker({
                                id: 'LastE1Date_datePicker',
                                dateFormat: 'dd/mm/yy',
                                changeYear: true,
                                showOn: 'focus'
                            });
                        }
                    }
                },
                {
                    key: false,
                    name: "LastE2Date", index: 'LastE2Date', label: "LastE2Date", formatter: "date", formatoptions: { srcformat: "ISO8601Long", newformat: "d/m/Y" }, editable: false, edittype: "text",
                    editoptions: {
                        dataInit: function (element) {
                            $(element).datepicker({
                                id: 'LastE2Date_datePicker',
                                dateFormat: 'dd/MM/yyyy',
                                changeYear: true,
                                showOn: 'focus'
                            });
                        }
                    }
                },
                {
                    key: false,
                    name: "LastE2DateTxt", hidden: true, index: 'LastE2DateTxt', label: "End Date text", formatter: "text", formatoptions: { srcformat: "ISO8601Long", newformat: "d/m/Y" }, editable: true, editrules: { edithidden: true, required: true }, edittype: "text", formoptions: { label: "Last E2 Date text" },
                    editoptions: {
                        dataInit: function (element) {
                            $(element).datepicker({
                                id: 'LastE2Date_datePicker',
                                dateFormat: 'dd/mm/yy',
                                changeYear: true,
                                showOn: 'focus'
                            });
                        }
                    }
                },
                 //{
                 //    key: false,
                 //    name: "LastE2Date", index: 'LastE2Date', label: "LastE2Date", formatter: "date", editable: true, editrules: { required: true }, edittype: "text",
                 //    editoptions: {
                 //        dataInit: function (element) {
                 //            $(element).datepicker({
                 //                id: 'LastE2Date_datePicker',
                 //                dateFormat: 'M/d/yy',

                 //                changeYear: true,
                 //                showOn: 'focus'
                 //            });
                 //        }
                 //    }
                 //},
                 { key: false, name: 'Description', index: 'Description', label: 'Description', editable: true },
                 { key: false, name: 'Comments', index: 'Comments', label: 'Comments', editable: true }

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
            caption: 'Appraisal Records',
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
            url: '/HRM/Appraisal/SaveAppraisal',
            closeOnEscape: true,
            closeAfterEdit: true,
            recreateForm: true,
            width: 'auto',
            height: 'auto',

            //onInitializeForm: function (formId) { populateDesignations(true); },
            afterComplete: function (response) {
                if (response.responseText) {
                    toastr.success(response.responseText);
                    location.reload(true);
                }
            }
        },
        {
            zIndex: 100,
            url: "/HRM/Appraisal/SaveAppraisal",
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterAdd: true,
            afterComplete: function (response) {
                Messager.ShowMessage(response.Message);
                location.reload(true);
            }
        },
        {
            zIndex: 100,
            url: "/HRM/Appraisal/DeleteAppraisal",
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