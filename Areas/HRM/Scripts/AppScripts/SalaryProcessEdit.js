$(document).ready(function () {

    function SalaryProcessInfo() {
        var self = this;
        self.YearMonthId = ko.observable().extend({ required: true });
        self.YearMonthList = ko.observableArray([]);
        self.EmployeeId = ko.observable().extend({ required: true });
        self.EmployeeList = ko.observableArray([]);
        self.TotalSal = ko.observable(0);
        self.EditedSal = ko.observable(0);
        self.LoadInitial = function () {
            $.getJSON("/HRM/SalaryProcess/GetYearMonthCombo/", null, function (data) {
                self.YearMonthList(data);
            });
            $.getJSON("/HRM/Employee/GetAllActiveEmployees/", null, function (data) {
                self.EmployeeList(data);
            });
        };
        self.EmployeeId.subscribe(function () { //DesignationList is populated with change of selectedGradeId 
           
            jQuery("#jqGrid").jqGrid('setGridParam', { url: "/HRM/SalaryProcess/GetSalaryProcessesForPeriod/?YearMonth=" + self.YearMonthId() + "&empid=" + self.EmployeeId(), datatype: 'json' }); // the last setting is for demo only
            jQuery("#jqGrid").jqGrid('setCaption', 'Salary Process Records');
            jQuery("#jqGrid").trigger("reloadGrid");
            $.getJSON("/HRM/SalaryProcess/GetTotalSalaryByTimePeriod/?YearMonth=" + self.YearMonthId() + "&empid=" + self.EmployeeId(), null, function (data) {
                self.TotalSal(data.CalculatedTotal);
                self.EditedSal(data.EditedTotal);
                console.log(self.TotalSal());
                console.log(self.EditedSal());
            });
        });
    };
    $(function () {
        $("#jqGrid").jqGrid({
            url: '/HRM/Grade/EmptyJson',
            mtype: "GET",
            datatype: "json",
            colNames: ['Edit','Id', 'OfficeName', 'Unit Name', 'Salary Item Name', 'Month', 'Year', 'EmpName', 'CalculatedValue', 'EditedValue', 'Comments'],
            colModel: [
                {
                    label: "Edit Actions",
                    name: "actions",
                    width: 100,
                    formatter: "actions",
                    formatoptions: {
                        keys: true,
                        editOptions: {},
                        addOptions: {},
                        delOptions: {}
                    }
                },
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                { key: false, name: 'OfficeName', index: 'OfficeName', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                { key: false, name: 'UnitName', index: 'UnitName', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                { key: false, name: 'SalaryItemName', index: 'SalaryItemName', editable: true,editoptions: { readonly: "readonly" }, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                { key: false, name: 'Month', index: 'Month', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                { key: false, name: 'Year', index: 'Year', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                { key: false, name: 'EmpName', index: 'EmpName', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                { key: false, name: 'CalculatedValue', index: 'CalculatedValue', editable: true,editoptions: { readonly: "readonly" }, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                { key: false, name: 'EditedValue', index: 'EditedValue', editable: true,searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                { key: false, name: 'Comments', index: 'Comments', editable: true,edittype: "textarea",editoptions: { cols: 20,rows:2 },searchoptions: { sopt: ['eq', 'ne', 'cn'] } }
            ],
            //onSelectRow: function(id){
            //    //alert('Selected row ID ' + id);
            //    if ($("#jqGrid").jqGrid('getCell', id, 'SalaryItemName') == 'Basic') {
            //        console.log("bass");
            //        $('#' + id, '#jqGrid').addClass('not-editable-row');
            //        //$('#' + $.jgrid.jqID(id)).addClass('ui-state-error');
            //    }
            //},
            loadComplete: function () {
                //console.log("entered---");
                var ids = $("#jqGrid").jqGrid('getDataIDs');
                
                for (var i = 0; i < ids.length; i++) {
                    var id = ids[i];
                    console.log(id);
                    if ($("#jqGrid").jqGrid('getCell', id, 'SalaryItemName') == 'Basic') {
                        $('#'+id, '#jqGrid').addClass('not-editable-row');
                        //$('#' + $.jgrid.jqID(id)).addClass('ui-state-error');
                    }
                }
            },
            loadonce: true,
            pager: jQuery('#jqGridPager'),
            rowNum: 10,
            rowList: [10, 20, 30, 40, 50],
            hoverrows: true,
            sortable: true,
            width: '70%',
            viewrecords: true,
            caption: 'Salary Process Records',
            editurl: "/HRM/SalaryProcess/SaveSalaryProcessDetail",
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
        { edit: false, add: false, del: true, search: false, refresh: true },
        {
            zIndex: 100,
            url: '/HRM/SalaryProcess/SaveSalaryProcessDetail',
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
            url: "/HRM/SalaryProcess/SaveSalaryProcessDetail",
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
            url: "/HRM/Module/DeleteModule",
            closeOnEscape: true,
            closeAfterDelete: true,
            recreateForm: true,
            msg: "Are you sure to delete this process? ",
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
    var vm = new SalaryProcessInfo();
    vm.LoadInitial();
    ko.applyBindings(vm, document.getElementById("salaryprocess"));
});