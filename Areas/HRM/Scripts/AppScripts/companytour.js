$(document).ready(function () {
    $(function () {
        $("#jqGrid").jqGrid({
            url: "/HRM/Tour/GetAllTours",
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'TourName', 'TourType', 'TourTypeName', 'FromDate', 'ToDate', 'Description', 'TourStatus', 'TourStatusName'],
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                { key: false, name: 'TourName', index: 'TourName', width: 140, editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                {
                    key: false, hidden: true, name: 'TourType', width: 140, index: 'TourType', editable: true, edittype: "select", editoptions: { dataUrl: '/Tour/GetTourTypes', cacheUrlData: true }, editrules: { edithidden: true, required: true },
                    formoptions: { label: "Tour Type"}
                },//edithidden can allowus to edit hidden col
                { key: false, name: 'TourTypeName', index: 'TourTypeName', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                
                { name: "FromDate", index:'FromDate',formatter: "date", editable: true,edittype:"text", 
                    editoptions: {
                        dataInit: function (element) {
                            $(element).datepicker({
                                id:'fromDate_datePicker',
                                //dateFormat: 'M/d/yy',
                                //minDate: new Date(2010, 0, 1),
                                maxDate: new Date(2020, 0, 1),
                                dateFormat: 'dd-M-yy',
                                changeYear: true,
                                showOn: 'focus'
                                
                            });
                        }, editrules: { required: true }, formoptions: { label: "From Date: " }
                    }
               },
                {name: "ToDate", index: 'ToDate',formatter: "date",editable: true,edittype:"text",
                    editoptions: {
                        dataInit: function (element) {
                            $(element).datepicker({
                                id: 'toDate_datePicker',
                                //dateFormat: 'M/d/yy',
                                //minDate: new Date(2010, 0, 1),
                                dateFormat: 'dd-M-yy',
                                maxDate: new Date(2020, 0, 1),
                                changeYear: true,
                                showOn: 'focus',
                                onClose: function () {
                                    var dt1 = $('#FromDate').datepicker('getDate');
                                    var dt2 = $('#ToDate').datepicker('getDate');
                                    //check to prevent a user from entering a date below date of dt1
                                    if (dt2 <= dt1) {
                                        var minDate = $('#ToDate').datepicker('option', 'minDate');
                                        $('#FromDate').datepicker('setDate', minDate);
                                    }
                                }
                            });
                        }, editrules: { required: true }, formoptions: { label: "To Date: " }
                    }
                },
                { key: false, name: 'Description', index: 'Description', width: 140, editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                {
                    key: false, hidden: true, name: 'TourStatus', width: 140, index: 'TourStatus', editable: true, edittype: "select", editoptions: { dataUrl: 'HRM/Tour/GetTourStatuses', cacheUrlData: true }, editrules: { edithidden: true, required: true },
                    formoptions: { label: "Tour Status" }
                },
                { key: false, name: 'TourStatusName', index: 'TourStatusName', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" }
            ],
            ondblClickRow: function (rowid) {
                jQuery("#jqGrid").jqGrid('editGridRow', rowid);
            },
            pager: jQuery('#jqControls'),
            rowNum: 10,
            rowList: [10, 20, 30, 40, 50],
            hoverrows: true,
            sortable: true,
            //width: '70%',
            viewrecords: true,
            caption: 'Tour Records',
            emptyrecords: 'No Tour Records are Available to Display',
            subGrid: true,
            subGridRowExpanded: function(subgrid_id, row_id) {
                // we pass two parameters
                // subgrid_id is a id of the div tag created within a table
                // the row_id is the id of the row
                // If we want to pass additional parameters to the url we can use
                // the method getRowData(row_id) - which returns associative array in type name-value
                // here we can easy construct the following
                var subgrid_table_id, pager_id;
                subgrid_table_id = subgrid_id + "_t";
                pager_id = "p_" + subgrid_table_id;
                jQuery("#" + subgrid_id).html("<table id='" + subgrid_table_id + "' class='scroll'></table><div id='" + pager_id + "' class='scroll'></div>");
                var dataFromCellByColumnName = jQuery('#jqGrid').jqGrid('getCell', row_id, 'Id');
                var innergrid=jQuery("#" + subgrid_table_id).jqGrid({
                    url: "/HRM/Tour/GetCorrespondingTourParticipants/" + dataFromCellByColumnName,
                    datatype: "json",
                    colNames: ['Id','Tour Name', 'EmployeeId', 'Employee Name', 'SubstitutorId', 'Substitutor Name', 'Remarks'],
                    colModel: [
                      { name: "Id", index: "Id",hidden:true, width: 80, key: true },
                      
                      { key: false, name: 'TourName', index: 'TourName', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                      {
                          key: false, hidden: true, name: 'EmployeeId', width: 140, index: 'EmployeeId', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/LeaveApplication/GetCorrespondingEmployees', cacheUrlData: true }, editrules: { edithidden: true, required: true },
                          formoptions: { label: "Employee" }
                      },
                      { key: false, name: 'EmployeeName', index: 'EmployeeName', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                      {
                          key: false, hidden: true, name: 'SubstitutorId', width: 140, index: 'SubstitutorId', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/Tour/GetCorrespondingEmployees' }, editrules: { edithidden: true, required: true },
                          formoptions: { label: "Substitute" }
                      },
                      { key: false, name: 'SubstitutorName', index: 'SubstitutorName', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                      { key: false, name: 'Remarks', index: 'Remarks', width: 140, editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" }
                    ],
                    height: '100%',
                    rowNum: 10,
                    pager: pager_id,
                    sortname: 'EmployeeName',
                    sortorder: "asc",
                    cmTemplate: { align: 'center', editable: true }

                });
                jQuery("#" + subgrid_table_id).jqGrid('navGrid', "#" + pager_id, { edit: true, add: true, del: true },
                    {
                        zIndex: 100,
                        url: '/HRM/Tour/SaveTourParticipant',
                        closeOnEscape: true,
                        width: 'auto',
                        height: 'auto',
                        closeAfterEdit: true,
                        recreateForm: true,
                        onclickSubmit: function (params, postdata) {
                            postdata = $.extend({}, postdata, { TourId: $("#jqGrid").jqGrid('getRowData', row_id).Id });
                            return postdata;
                        },
                        afterComplete: function (response) {
                            Messager.ShowMessage(response.responseText);
                        }

                    },
                    {
                        zIndex: 100,
                        url: '/HRM/Tour/SaveTourParticipant',
                        closeOnEscape: true,
                        width: 'auto',
                        height: 'auto',
                        closeAfterAdd: true,
                        onclickSubmit: function (params, postdata) {
                            postdata = $.extend({}, postdata, { TourId: $("#jqGrid").jqGrid('getRowData', row_id).Id });
                            return postdata;
                        },
                        afterComplete: function (response) {
                            Messager.ShowMessage(response.responseText);
                        }
                    },
                    {
                        zIndex: 100,
                        url: "/HRM/Tour/DeleteTourParticipant",
                        closeOnEscape: true,
                        closeAfterDelete: true,
                        recreateForm: true,
                        msg: "Are you sure to delete this Tour participant?",
                        afterComplete: function (response) {
                            Messager.ShowMessage(response.responseText);
                        }
                    }
                    );




            },
            subGridOptions: {
                // configure the icons from theme rolloer
                plusicon: "ui-icon-triangle-1-e",
                minusicon: "ui-icon-triangle-1-s",
                openicon: "ui-icon-arrowreturn-1-e"
            },
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
            url: '/HRM/Tour/SaveTour',
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterEdit: true,
            recreateForm: true,
            afterComplete: function (response) {
                Messager.ShowMessage(response.responseText);
            }
        },
        {
            zIndex: 100,
            url: '/HRM/Tour/SaveTour',
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterAdd: true,
            afterComplete: function (response) {
                Messager.ShowMessage(response.responseText);
            }
        },
        {
            zIndex: 100,
            url: "/HRM/Tour/DeleteTour",
            closeOnEscape: true,
            closeAfterDelete: true,
            recreateForm: true,
            msg: "Are you sure to delete this Tour?",
            afterComplete: function (response) {
                Messager.ShowMessage(response.responseText);
            }
        },
        {
            closeOnEscape: true, multipleSearch: true,
            closeAfterSearch: true
        }
        );
    });
});