$(document).ready(function () {
    $(function () {
        $("#tree").jqGrid({
            url: "/HRM/Organogram/GetOrganogramsTest",
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'OfficeLayerId', 'OfficeId', 'Office Name', 'UnitType', 'OfficeUnitId', 'Office Unit Name', 'PositionId', 'Position Name', 'ParentId', 'Parent Name', 'Name', 'DesignationId', 'Designation Name'
            ],
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                { key: false, hidden: true, name: 'OfficeLayerId', index: 'OfficeLayerId', editable: true, edittype: "select", editrules: { required: true, edithidden: true }, formoptions: { label: "Office Layer" }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, hidden: true, name: 'OfficeId', index: 'OfficeId', editable: true, edittype: "select", editrules: {required: true ,edithidden: true }, formoptions: { label: "Office" } },
                { key: false, name: 'OfficeName', index: 'OfficeName', label: "OfficeName", editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, hidden: true, name: 'UnitType', index: 'UnitType', editable: true, edittype: "select", editrules: { required: true, edithidden: true }, formoptions: { label: "Unit Type" }, classes: "grid-col" },
                { key: false, hidden: true, name: 'OfficeUnitId', index: 'OfficeUnitId', editable: true, edittype: "select", editrules: { required: true, edithidden: true }, formoptions: { label: "Office Unit" } },
                { key: false, name: 'OfficeUnitName', index: 'OfficeUnitName', label: "OfficeUnitName", editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, hidden: true, name: 'PositionId', index: 'PositionId', editable: true, edittype: "select", editrules: { required: true, edithidden: true }, formoptions: { label: "Office Position: " }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'PositionName', index: 'PositionName', label: "PositionName", editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, hidden: true, name: 'ParentId', index: 'ParentId', editable: true, edittype: "select", editrules: { required: true, edithidden: true }, formoptions: { label: "Parent" }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'ParentName', index: 'ParentName', label: "ParentName", editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'Name', index: 'Name', width: 300, editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                {
                    key: false, hidden: true, name: 'DesignationId', width: 100, index: 'DesignationId', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/Designation/GetDesignations', cacheUrlData: true }, editrules: { edithidden: true, required: true },
                    formoptions: { label: "Designation", required: true }
                },
            { key: false, name: 'DesignationName', index: 'DesignationName', label: "DesignationName", editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
            //{
            //    name: "parent_id",
            //    hidden: true
            //}
            ],
            ondblClickRow: function (rowid) {
                jQuery("#jqGrid").jqGrid('editGridRow', rowid);
            },
            loadonce:true,
            pager: jQuery('#pager'),
            rowNum: 10,
            rowList: [10, 20, 30, 40, 50],
            hoverrows: true,
            sortable: true,
            width: '70%',
            viewrecords: true,
            gridview: true,
            ExpandColumn: "Name",
            treeGrid: true,
            treedatatype: "json",
            treeGridModel: "adjacency",
            scrollrows: true,
            height:'100%',
            autowidth:true,
            //loadonce: true,
            caption: 'Organogram Records',
            emptyrecords: 'No Organogram Records are Available to Display',
            treeReader:{
                "parent_id_field":"parent_id",
                "level_field":"level",
                "leaf_field":"isLeaf",
                "expanded_field":"expanded",
                "loaded":"loaded",
                "icon_field":"icon"
            }
        });
        jQuery('#tree').jqGrid('navGrid', '#pager',
		{
		    "edit": true,
		    "add": true,
		    "del": true,
		    "search": false,
		    "refresh": true,
		    "view": false,
		    "excel": false,
		    "pdf": false,
		    "csv": false,
		    "columns": false
		},
		{ "drag": true, "resize": true, "closeOnEscape": true, "dataheight": 150 },
		{ "drag": true, "resize": true, "closeOnEscape": true, "dataheight": 150 }
		);
        jQuery('#tree').jqGrid('bindKeys');
    });
});