$(document).ready(function () {
    $(function () {
        $("#jqGrid").jqGrid({
            url: "/HRM/Calendar/GetAllFiscalYears",
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'Year', 'Current Year', 'Quarter One', 'Quarter One Text', 'Quarter Two', 'Quarter Two Text', 'Quarter Three', 'Quarter Three Text', 'Quarter Four', 'Quarter Four Text'],
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                { key: false, name: 'Year', index: 'Year', label: 'Year', editable: true, editrules: { required: true } },
                { key: false, name: 'CurrentYear', index: 'CurrentYear', editable: true, edittype: "select", editoptions: { value: "true:true;false:false" }, editrules: { edithidden: true, required: true }, label: "CurrentYear", searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                {
                    key: false,
                    name: "QuarterOne", index: 'QuarterOne', label: "QuarterOne", formatter: "date", formatoptions: { srcformat: "ISO8601Long", newformat: "d/m/Y" }, editable: false, edittype: "text",
                    editoptions: {
                        dataInit: function (element) {
                            $(element).datepicker({
                                id: 'QuarterOne_datePicker',
                                dateFormat: 'dd/MM/yyyy',
                                changeYear: true,
                                showOn: 'focus'
                            });
                        }
                    }
                },
                {
                    key: false,
                    name: "QuarterOneTxt", hidden: true, index: 'QuarterOneTxt', label: "Quarter One text", formatter: "text", formatoptions: { srcformat: "ISO8601Long", newformat: "d/m/Y" }, editable: true, editrules: { edithidden: true, required: true }, edittype: "text", formoptions: { label: "Quarter One text" },
                    editoptions: {
                        dataInit: function (element) {
                            $(element).datepicker({
                                id: 'QuarterOne_datePicker',
                                dateFormat: 'dd/mm/yy',
                                changeYear: true,
                                showOn: 'focus'
                            });
                        }
                    }
                },
            //    {
            //        key: false,
            //        name: "QuarterTwo", index: 'QuarterTwo', label: "QuarterTwo", formatter: "date", editable: true, editrules: { required: true }, edittype: "text",
            //        editoptions: {
            //            dataInit: function (element) {
            //                $(element).datepicker({
            //                    id: 'QuarterTwo_datePicker',
            //                    dateFormat: 'M/d/yy',
            //                    changeYear: true,
            //                    showOn: 'focus'
            //                });
            //            }
            //        }
            //    },
            //    {
            //        key: false,
            //        name: "QuarterThree", index: 'QuarterThree', label: "QuarterThree", formatter: "date", editable: true, editrules: { required: true }, edittype: "text",
            //        editoptions: {
            //            dataInit: function (element) {
            //                $(element).datepicker({
            //                    id: 'QuarterThree_datePicker',
            //                    dateFormat: 'M/d/yy',

            //                    changeYear: true,
            //                    showOn: 'focus'
            //                });
            //            }
            //        }
            //    },
            //    {
            //        key: false,
            //        name: "QuarterFour", index: 'QuarterFour', label: "QuarterFour", formatter: "date", editable: true, editrules: { required: true }, edittype: "text",
            //        editoptions: {
            //            dataInit: function (element) {
            //                $(element).datepicker({
            //                    id: 'QuarterFour_datePicker',
            //                    dateFormat: 'M/d/yy',

            //                    changeYear: true,
            //                    showOn: 'focus'
            //                });
            //            }
            //        }
            //    }
             {
                 key: false,
                 name: "QuarterTwo", index: 'QuarterTwo', label: "QuarterTwo", formatter: "date", formatoptions: { srcformat: "ISO8601Long", newformat: "d/m/Y" }, editable: false, edittype: "text",
                 editoptions: {
                     dataInit: function (element) {
                         $(element).datepicker({
                             id: 'QuarterTwo_datePicker',
                             dateFormat: 'dd/MM/yyyy',
                             changeYear: true,
                             showOn: 'focus'
                         });
                     }
                 }
             },
                {
                    key: false,
                    name: "QuarterTwoTxt", hidden: true, index: 'QuarterTwoTxt', label: "Quarter Two text", formatter: "text", formatoptions: { srcformat: "ISO8601Long", newformat: "d/m/Y" }, editable: true, editrules: { edithidden: true, required: true }, edittype: "text", formoptions: { label: "Quarter Two text" },
                    editoptions: {
                        dataInit: function (element) {
                            $(element).datepicker({
                                id: 'QuarterTwo_datePicker',
                                dateFormat: 'dd/mm/yy',
                                changeYear: true,
                                showOn: 'focus'
                            });
                        }
                    }
                },



                 {
                     key: false,
                     name: "QuarterThree", index: 'QuarterThree', label: "QuarterThree", formatter: "date", formatoptions: { srcformat: "ISO8601Long", newformat: "d/m/Y" }, editable: false, edittype: "text",
                     editoptions: {
                         dataInit: function (element) {
                             $(element).datepicker({
                                 id: 'QuarterThree_datePicker',
                                 dateFormat: 'dd/MM/yyyy',
                                 changeYear: true,
                                 showOn: 'focus'
                             });
                         }
                     }
                 },
                {
                    key: false,
                    name: "QuarterThreeTxt", hidden: true, index: 'QuarterThreeTxt', label: "Quarter Three text", formatter: "text", formatoptions: { srcformat: "ISO8601Long", newformat: "d/m/Y" }, editable: true, editrules: { edithidden: true, required: true }, edittype: "text", formoptions: { label: "Quarter Three text" },
                    editoptions: {
                        dataInit: function (element) {
                            $(element).datepicker({
                                id: 'QuarterThree_datePicker',
                                dateFormat: 'dd/mm/yy',
                                changeYear: true,
                                showOn: 'focus'
                            });
                        }
                    }
                },




                 {
                     key: false,
                     name: "QuarterFour", index: 'QuarterFour', label: "QuarterFour", formatter: "date", formatoptions: { srcformat: "ISO8601Long", newformat: "d/m/Y" }, editable: false, edittype: "text",
                     editoptions: {
                         dataInit: function (element) {
                             $(element).datepicker({
                                 id: 'QuarterFour_datePicker',
                                 dateFormat: 'dd/MM/yyyy',
                                 changeYear: true,
                                 showOn: 'focus'
                             });
                         }
                     }
                 },
                {
                    key: false,
                    name: "QuarterFourTxt", hidden: true, index: 'QuarterFourTxt', label: "Quarter Four text", formatter: "text", formatoptions: { srcformat: "ISO8601Long", newformat: "d/m/Y" }, editable: true, editrules: { edithidden: true, required: true }, edittype: "text", formoptions: { label: "Quarter Four text" },
                    editoptions: {
                        dataInit: function (element) {
                            $(element).datepicker({
                                id: 'QuarterFour_datePicker',
                                dateFormat: 'dd/mm/yy',
                                changeYear: true,
                                showOn: 'focus'
                            });
                        }
                    }
                },
            ],
            ondblClickRow: function (rowid) {
                jQuery("#jqGrid").jqGrid('editGridRow', rowid);
            },
            pager: jQuery('#jqControls'),
            rowNum: 10,
            rowList: [10, 20, 30, 40, 50],
            hoverrows: true,
            sortable: true,
            width: '70%',
            viewrecords: true,
            caption: 'Fiscal Years Records',
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
        { edit: true, add: true, del: true, search: true, refresh: true },
        {

            zIndex: 100,
            url: '/HRM/Calendar/SaveFiscalYear',
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
            url: "/HRM/Calendar/SaveFiscalYear",
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterAdd: true,
            afterComplete: function (response) {
                if (response.responseText) {
                    toastr.success(response.responseText);
                }
            }
        },
        {
            zIndex: 100,
            url: "/HRM/Calendar/DeleteFiscalYear",
            closeOnEscape: true,
            closeAfterDelete: true,
            recreateForm: true,
            msg: "Are you sure to delete this module? ",
            afterComplete: function (response) {
                if (response.responseText) {
                    toastr.success(response.responseText);
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
//$(document).ready(function () {
//    $(function () {
//        $("#jqGrid").jqGrid({
//            url: "/HRM/Calendar/GetAllFiscalYears",
//            datatype: 'json',
//            mtype: 'Get',
//            colNames: ['Id', 'Year', 'CurrentYear', 'QuarterOne', 'QuarterTwo', 'QuarterThree', 'QuarterFour'],
//            colModel: [
//                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
//                { key: false, name: 'Year', index: 'Year', label: 'Year', editable: true },
//                { key: false, name: 'CurrentYear', index: 'CurrentYear', editable: true, edittype: "select", editoptions: { value: "true:true;false:false" }, editrules: { edithidden: true, required: true }, label: "CurrentYear", searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
//                {
//                    key: false,
//                    name: "QuarterOne", index: 'QuarterOne', label: "QuarterOne", formatter: "date", editable: true, editrules: { required: true }, edittype: "text",
//                    editoptions: {
//                        dataInit: function (element) {
//                            $(element).datepicker({
//                                id: 'QuarterOne_datePicker',
//                                dateFormat: 'M/d/yy',

//                                changeYear: true,
//                                showOn: 'focus'
//                            });
//                        }
//                    }
//                },
//                {
//                    key: false,
//                    name: "QuarterTwo", index: 'QuarterTwo', label: "QuarterTwo", formatter: "date", editable: true, editrules: { required: true }, edittype: "text",
//                    editoptions: {
//                        dataInit: function (element) {
//                            $(element).datepicker({
//                                id: 'QuarterTwo_datePicker',
//                                dateFormat: 'M/d/yy',

//                                changeYear: true,
//                                showOn: 'focus'
//                            });
//                        }
//                    }
//                },
//                {
//                    key: false,
//                    name: "QuarterThree", index: 'QuarterThree', label: "QuarterThree", formatter: "date", editable: true, editrules: { required: true }, edittype: "text",
//                    editoptions: {
//                        dataInit: function (element) {
//                            $(element).datepicker({
//                                id: 'QuarterThree_datePicker',
//                                dateFormat: 'M/d/yy',

//                                changeYear: true,
//                                showOn: 'focus'
//                            });
//                        }
//                    }
//                },
//                {
//                    key: false,
//                    name: "QuarterFour", index: 'QuarterFour', label: "QuarterFour", formatter: "date", editable: true, editrules: { required: true }, edittype: "text",
//                    editoptions: {
//                        dataInit: function (element) {
//                            $(element).datepicker({
//                                id: 'QuarterFour_datePicker',
//                                dateFormat: 'M/d/yy',

//                                changeYear: true,
//                                showOn: 'focus'
//                            });
//                        }
//                    }
//                }

//            ],
//            ondblClickRow: function (rowid) {
//                jQuery("#jqGrid").jqGrid('editGridRow', rowid);
//            },
//            pager: jQuery('#jqControls'),
//            rowNum: 10,
//            rowList: [10, 20, 30, 40, 50],
//            hoverrows: true,
//            sortable: true,
//            width: '70%',
//            viewrecords: true,
//            caption: 'Fiscal Years Records',
//            emptyrecords: 'No Module Records are Available to Display',
//            jsonReader: {
//                root: "rows",
//                page: "page",
//                total: "total",
//                records: "records",
//                repeatitems: false,
//                Id: "0"
//            },
//            autowidth: true,
//            height: 'auto',//set auto height
//            multiselect: false
//        }).navGrid('#jqControls',
//        { edit: true, add: true, del: true, search: true, refresh: true },
//        {

//            zIndex: 100,
//            url: '/HRM/Calendar/SaveFiscalYear',
//            closeOnEscape: true,
//            closeAfterEdit: true,
//            recreateForm: true,
//            width: 'auto',
//            height: 'auto',

//            //onInitializeForm: function (formId) { populateDesignations(true); },
//            afterComplete: function (response) {
//                if (response.responseText) {
//                    toastr.success(response.responseText);
//                }
//            }
//        },
//        {
//            zIndex: 100,
//            url: "/HRM/Calendar/SaveFiscalYear",
//            closeOnEscape: true,
//            width: 'auto',
//            height: 'auto',
//            closeAfterAdd: true,
//            afterComplete: function (response) {
//                Messager.ShowMessage(response.Message);
//            }
//        },
//        {
//            zIndex: 100,
//            url: "/HRM/Calendar/DeleteFiscalYear",
//            closeOnEscape: true,
//            closeAfterDelete: true,
//            recreateForm: true,
//            msg: "Are you sure to delete this module? ",
//            afterComplete: function (response) {
//                Messager.ShowMessage(response.Message);
//            }
//        },
//        {
//            closeOnEscape: true, multipleSearch: true,
//            closeAfterSearch: true
//        }
//        );
//    });
//});