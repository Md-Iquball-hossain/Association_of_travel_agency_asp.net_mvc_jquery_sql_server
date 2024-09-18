var offin,offout;
function parseJsonDate(jsonDateString) {                                        //this function parses jsonDate to DateTime format and returns 
    return new Date(parseInt(jsonDateString.replace('/Date(', '')));            //Date value
}
$(document).ready(function () {
    $.getJSON("/HRM/OfficeOutTime/GetInAndOutTime/", null, function (data) {
        offin = parseJsonDate(data.OfficeInTime);
        offout = parseJsonDate(data.OfficeOutTime);
        
    });

    $(function () {
        $("#jqGrid").jqGrid({
            url: "/HRM/OfficeOutTime/GetEmployeeAttendances",
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'EmpId', 'EmpName', 'Date','InTime', 'OutTime', 'Late(In minutes)', 'OverTime(In minutes)'],
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                {
                    key: false, hidden: true, name: 'EmpId', width: 140, index: 'EmpId', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/LeaveApplication/GetCorrespondingEmployees'}, editrules: { edithidden: true, required: true },
                    formoptions: {label: "Employee" }
                },{ key: false, name: 'EmpName', index: 'EmpName', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                {
                    name: "Date", index: 'Date',formatter: "date", editable: true, edittype: "text",
                    editoptions: {
                        dataInit: function (element) {
                            $(element).datepicker({
                                id: 'Date_datePicker',
                                //dateFormat: 'M/d/yy',
                                //minDate: new Date(2010, 0, 1),
                                maxDate: new Date(2020, 0, 1),
                                dateFormat: 'dd-M-yy',
                                changeYear: true,
                                showOn: 'focus'
                                
                            });
                        }, editrules: { required: true }, formoptions: { label: "Date " }
                    }
                },
                
                {
                    key:false,
                    name: 'InTime',
                    index: 'InTime',
                    formatter: "date",
                    //formatoptions: { srcformat: "ISO8601Long", newformat: "m/d/Y h:i A" },
                    formatoptions: { srcformat: "ISO8601Long", newformat: "h:i A" },
                    edittype: "text",
                    editoptions: {
                        dataInit: function (el) {
                            $(el).datetimepicker({
                                controlType: 'select',
                                dateFormat: "m/d/yy",
                                timeFormat: "HH:mm",
                                onClose: function () {
                                    var dt1 = $('#InTime').datetimepicker('getDate');
                                    var dt2 = offin;
                                    if (dt1 > dt2) {
                                        var late = parseInt((dt1 - dt2) / (1000 * 60));
                                        $("#Late").val(late);
                                    }
                                }
                            })
                        }
                    },
                    width: 45,
                    editable: true,
                    editrules: {
                        required: true
                    }
                },
                {
                    key: false,
                    name: 'OutTime',
                    index: 'OutTime',
                    formatter: "date",
                    //formatoptions: { srcformat: "ISO8601Long", newformat: "m/d/Y h:i A" },
                    formatoptions: { srcformat: "ISO8601Long", newformat: "h:i A" },
                    edittype: "text",
                    editoptions: {
                        dataInit: function (el) {
                            $(el).datetimepicker({
                                controlType: 'select',
                                dateFormat: "m/d/yy",
                                timeFormat: "HH:mm",
                                onClose: function () {
                                    var dt1 = $('#OutTime').datetimepicker('getDate');
                                    var dt2 = offout;
                                    var dt3=$('#InTime').datetimepicker('getDate');
                                    var lategone = (dt1 - dt2) > 0 ? (dt1 - dt2) / (1000 * 60) : 0;
                                    
                                    var latecome = (dt3 - offin) > 0 ? (dt3 - offin) / (1000 * 60) : 0;
                                    
                                    if (lategone>latecome) {
                                        
                                        $("#OverTime").val(lategone-latecome);
                                    } else {
                                        $("#OverTime").val(0);
                                    }
                                        
                                    //check to prevent a user from entering a date below date of dt1
                                    
                                }
                            });
                        }
                    },
                    width: 45,
                    editable: true,
                    editrules: {
                        required: true
                    }
                },
                //{ key: false, name: 'Late', index: 'TotalDays', width: 140, editable: true, label: "Total Days", editrules: { custom_func: validatePositive, custom: true, required: true }, align: 'right', formoptions: { label: "Total Days" }, searchoptions: { sopt: ['eq', 'ne'] }, classes: "grid-col" },
                {
                    key: false,
                    name: 'Late',
                    index: 'Late',
                    width: 45,
                    editable: true,
                    editrules: {
                        required: true
                    }
                },
                {
                    key: false,
                    name: 'OverTime',
                    index: 'OverTime',
                    width: 45,
                    editable: true,
                    editrules: {
                        required: true
                    }
                }
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
            //width: '70%',
            viewrecords: true,
            caption: 'Attendance Records',
            emptyrecords: 'No Records are Available to Display',
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
            url: '/HRM/OfficeOutTime/SaveEmployeeAttendances',
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
            url: "/HRM/OfficeOutTime/SaveEmployeeAttendances",
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
            url: "/HRM/OfficeOutTime/DeleteEmployeeAttendance",
            closeOnEscape: true,
            closeAfterDelete: true,
            recreateForm: true,
            msg: "Are you sure to delete this Record? ",
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

