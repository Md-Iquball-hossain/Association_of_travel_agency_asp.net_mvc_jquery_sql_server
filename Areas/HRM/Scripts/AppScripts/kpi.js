$(document).ready(function () {
    $(function () {
        $("#jqGrid").jqGrid({
            url: "/HRM/KPI/GetKPIList",
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'Name', 'KPITypeId', 'KPI type Name', 'KPIGroupId', 'KPIGroupName'],
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                { key: false, name: 'Name', label: 'Name', index: 'Name', width: 140, editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                
                {
                    key: false, hidden: true, name: 'KPITypeId', width: 140, index: 'KPITypeId', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/KPI/GetCorrespondingKPIType', cacheUrlData: true }, editrules: { edithidden: true, required: true},
                    formoptions: { label: "KPI Type", required: true }
                },//edithidden can allowus to edit hidden col
                { key: false, name: 'KPITypeName', index: 'KPITypeName', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                {
                    key: false, hidden: true, name: 'KPIGroupId', width: 140, index: 'KPIGroupId', editable: true, edittype: "select", editoptions: { dataUrl: '/HRM/KPI/GetCorrespondingKPIGroups', cacheUrlData: true }, editrules: { edithidden: true, required: true },
                    formoptions: { label: "KPI Group", required: true }
                },//edithidden can allowus to edit hidden col
                { key: false, name: 'KPIGroupName', index: 'KPIGroupName', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" }

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
            caption: 'KPI Records',
            emptyrecords: 'No KPI Records are Available to Display',
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
            url: '/HRM/KPI/SaveKPI',
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterEdit: true,
            recreateForm: true,
            afterComplete: function (response) {
                Messager.ShowMessage(response.responseText);
                location.reload(true);
            }
        },
        {
            zIndex: 100,
            url: "/HRM/KPI/SaveKPI",
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterAdd: true,
            afterComplete: function (response) {
                Messager.ShowMessage(response.responseText);
                location.reload(true);
            }
        },
        {
            zIndex: 100,
            url: "/HRM/KPI/DeleteKPI",
            closeOnEscape: true,
            closeAfterDelete: true,
            recreateForm: true,
            msg: "Are you sure to delete this KPI?",
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

    //test 
    var mockData = [];
    mockData.push({
        item: {
            id: 'id0',
            label: 'No Child',
            checked: false
        }
    });

    mockData.push({
        item: {
            id: 'id1',
            label: 'Lorem ipsum dolor 1',
            checked: false
        },
        children: [{
            item: {
                id: 'id11',
                label: 'Lorem ipsum dolor 11',
                checked: false
            }
        }, {
            item: {
                id: 'id12',
                label: 'Lorem ipsum dolor 12',
                checked: false
            }
        }, {
            item: {
                id: 'id13',
                label: 'Lorem ipsum dolor 13',
                checked: false
            }
        }]
    });

    mockData.push({
        item: {
            id: 'id2',
            label: 'Lorem ipsum dolor 2',
            checked: false
        },
        children: [{
            item: {
                id: 'id21',
                label: 'Lorem ipsum dolor 21',
                checked: false
            }
        }, {
            item: {
                id: 'id22',
                label: 'Lorem ipsum dolor 22',
                checked: true
            }
        }, {
            item: {
                id: 'id23',
                label: 'Lorem ipsum dolor 23',
                checked: false
            }
        }]
    });

    mockData.push({
        item: {
            id: 'id3',
            label: 'Lorem ipsum dolor 3',
            checked: false
        },
        children: [{
            item: {
                id: 'id31',
                label: 'Lorem ipsum dolor 31',
                checked: true
            }
        }, {
            item: {
                id: 'id32',
                label: 'Lorem ipsum dolor 32',
                checked: false
            },
            children: [{
                item: {
                    id: 'id321',
                    label: 'Lorem ipsum dolor 321',
                    checked: false
                }
            }, {
                item: {
                    id: 'id322',
                    label: 'Lorem ipsum dolor 322',
                    checked: false
                }
            }]
        }]
    });

    mockData.push({
        item: {
            id: 'id4',
            label: 'Lorem ipsum dolor 4',
            checked: false
        },
        children: [{
            item: {
                id: 'id41',
                label: 'Lorem ipsum dolor 41',
                checked: true
            }
        }, {
            item: {
                id: 'id42',
                label: 'Lorem ipsum dolor 42',
                checked: false
            },
            children: [{
                item: {
                    id: 'id421',
                    label: 'Lorem ipsum dolor 421',
                    checked: false
                }
            }
               , {
                   item: {
                       id: 'id422',
                       label: 'Lorem ipsum dolor 422',
                       checked: false
                   }
               }, {
                   item: {
                       id: 'id423',
                       label: 'Lorem ipsum dolor 423',
                       checked: false
                   }
               }, {
                   item: {
                       id: 'id424',
                       label: 'Lorem ipsum dolor 424',
                       checked: false
                   }
               }, {
                   item: {
                       id: 'id425',
                       label: 'Lorem ipsum dolor 425',
                       checked: false
                   }
               }, {
                   item: {
                       id: 'id426',
                       label: 'Lorem ipsum dolor 426',
                       checked: false
                   }
               }]
        }]
    });

    $('#tree-container').highCheckTree({
        data: mockData
    });

});

