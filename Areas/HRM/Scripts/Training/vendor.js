$(document).ready(function () {
    $(function () {
        $("#jqGrid").jqGrid({
            url: "/HRM/Training/GetVendors",
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'Vendor Name', 'Contact Person', 'Contact No', 'Email', 'PostOfficeId', 'Postal Code', 'Area Name', 'Thana Name', 'District Name', 'Division Name'],
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                { key: false, name: 'VendorName', label: 'VendorName', index: 'VendorName', width: 140, editable: true, editrules: { custom_func: validateText, custom: true, required: true }, formoptions: { colpos: 1, rowpos: 1, label: "Vendor Name" }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'ContactPerson', label: 'ContactPerson', index: 'ContactPerson', width: 140, editable: true, editrules: { custom_func: validateText, custom: true, required: true }, formoptions: { colpos: 2, rowpos:1 , label: "Contact Person" }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'ContactNo', label: 'ContactNo', index: 'ContactNo', width: 140, editable: true, editrules: { number: true, required: true }, formoptions: { colpos: 1, rowpos: 2, label: "Contact No" }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'Email', label: 'Email', index: 'Email', width: 140, editable: true, editrules: { email: true,  required: true }, formoptions: { colpos: 2, rowpos: 2 }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                //{ key: false, name: 'Gender', index: 'Gender', editable: true, edittype: 'select', editoptions: { value: { 'M': 'Male', 'F': 'Female', 'N': 'None' } } },
                //{ key: false, name: 'ClassName', index: 'ClassName', editable: true, edittype: 'select', editoptions: { value: { '1': '1st Class', '2': '2nd Class', '3': '3rd Class', '4': '4th Class', '5': '5th Class' } } },
                {
                    key: false, hidden: true, name: 'PostOfficeId', width: 140, index: 'PostOfficeId', editable: true, edittype: "select", editoptions: {
                        dataUrl: '/HRM/Employee/GetCorrespondingPostOffice', cacheUrlData: true,
                        dataEvents: [
                            {
                                type: 'change',
                                fn: function () {
                                    var url = '/HRM/Training/GetAddressFromPostCode/?postalid=' + $(this).val();
                                    $.ajax({
                                        url: url,
                                        type: "GET",
                                        success: function (addressJson) {
                                            var address = eval(addressJson);
                                            $('#AreaName').val(address.AreaName);
                                            $('#ThanaName').val(address.ThanaName);
                                            $('#DistrictName').val(address.DistrictName);
                                            $('#DivisionName').val(address.DivisionName);
                                        }
                                    });
                                }
                            }]
                                                
                    }, editrules: { edithidden: true, required: true },
                    formoptions: { colpos: 1, rowpos: 3, label: "Post Office"}
                },//edithidden can allowus to edit hidden col
                { key: false, name: 'PostalCode', label: 'PostalCode', index: 'PostalCode', editable: false, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'AreaName', label: 'AreaName', index: 'AreaName', width: 140, editable: true, editoptions: { readonly: "readonly" }, formoptions: {colpos: 2, rowpos: 3 , label: "Area Name" }, classes: "grid-col" },
                { key: false, name: 'ThanaName', label: 'ThanaName', index: 'ThanaName', width: 140, editable: true, editoptions: { readonly: "readonly" }, formoptions: { colpos: 1, rowpos: 4 , label: "Thana Name" }, classes: "grid-col" },
                { key: false, name: 'DistrictName', label: 'DistrictName', index: 'DistrictName', width: 140, editable: true, editoptions: { readonly: "readonly" }, formoptions: {colpos: 2, rowpos: 4, label: "District Name" }, classes: "grid-col" },
                { key: false, name: 'DivisionName', label: 'DivisionName', index: 'DivisionName', width: 140, editable: true, editoptions: { readonly: "readonly" }, formoptions: { colpos: 1, rowpos: 5, label: "Division Name" }, classes: "grid-col" },

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
            caption: 'Training Vendor Records',
            emptyrecords: 'No Vendor Records are Available to Display',
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
            url: '/HRM/Training/SaveVendors',
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
            url: "/HRM/Training/SaveVendors",
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
            url: "/HRM/Training/DeleteVendor",
            closeOnEscape: true,
            closeAfterDelete: true,
            recreateForm: true,
            msg: "Are you sure to delete this Vendor? ",
            afterComplete: function (response) {
                Messager.ShowMessage(response.responseText);
            }
        },
        {
            closeOnEscape: true, multipleSearch: true,
            closeAfterSearch: true
        }
        );

        $('#jqGrid').setGroupHeaders(
              {
                  useColSpanStyle: true,
                  groupHeaders: [
                      //{ "numberOfColumns": 4, "titleText": "General Info", "startColumnName": "Name" },
                      {
                          "numberOfColumns": 5
                          , "titleText": "Address Details", "startColumnName": "PostalCode"
                      }]

              });
    });
});

