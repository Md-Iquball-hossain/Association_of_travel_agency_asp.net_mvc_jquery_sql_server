$(document).ready(function () {
    //function addressformatter(cellvalue, options, rowObject) {
    //    return rowObject.AddressLine1 + ', ' + rowObject.AddressLine2;
    //}
      $(function () {
        $("#jqGrid").jqGrid({
            url: "/HRM/Institute/GetInstitutes",
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'Name', 'Contact Person', 'Contact No', 'Email', 'PostalCode', 'Area Name', 'Thana Name', 'District Name', 'Division Name'],
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                { key: false, name: 'Name', index: 'Name', editable: true, editrules: { custom_func: validateText, custom: true, required: true }, formoptions: { label: "Name" }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'ContactPerson', index: 'ContactPerson', editable: true, editrules: { custom_func: validateText, custom: true, required: true }, formoptions: { label: "Contact Person" }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'ContactNo', index: 'ContactNo', editable: true, editrules: { number: true, required: true }, formoptions: { label: "Contact No" }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'Email', index: 'Email', editable: true, editrules: { email: true, required: true }, formoptions: { label: "Email" }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                //{ key: false, hidden: true, name: 'AddressLine1', index: 'AddressLine1', editable: true, editrules: { edithidden: true, required: true }, formoptions: { label: "Address Line1: " } },
                //{ key: false, hidden: true, name: 'AddressLine2', index: 'AddressLine2', editable: true, editrules: { edithidden: true, required: true }, formoptions: { label: "Address Line2: " } },
                //{ key: false, name: 'Address', index: 'Address', editable: false, formatter: addressformatter, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                {
                    key: false, name: 'PostalCode', index: 'PostalCode', editable: true, editrules: {required: true}, edittype: "select", editoptions: {
                        dataUrl: '/HRM/Employee/GetCorrespondingPostOffice', cacheUrlData: true, dataEvents: [
                                    {
                                        type:'change',
                                        fn: function () {
                                            var url = '/HRM/Vendor/GetAddressFromPostCode/?postalid=' + $(this).val();
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
                    }, formoptions: { label: "Postal Code: " }
                },
                { key: false, name: 'AreaName', index: 'AreaName', editable: true, editoptions: { readonly: "readonly" }, formoptions: { label: "Area Name" }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'ThanaName', index: 'ThanaName', editable: true, editoptions: { readonly: "readonly" }, formoptions: { label: "Thana Name" }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'DistrictName', index: 'DistrictName', editable: true, editoptions: { readonly: "readonly" }, formoptions: { label: "District Name" }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'DivisionName', index: 'DivisionName', editable: true, editoptions: { readonly: "readonly" }, formoptions: { label: "Division name" }, searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" }
                
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
            caption: 'Institute Records',
            emptyrecords: 'No Institute Records are Available to Display',
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
            url: '/HRM/Institute/SaveInstitute',
            closeOnEscape: true,
            closeAfterEdit: true,
            width: 'auto',
            height: 'auto',
            recreateForm: true,
            afterComplete: function (response) {
                if (response.responseText) {
                    Messager.ShowMessage(response.responseText);
                }
            }
        },
        {
            zIndex: 100,
            url: '/HRM/Institute/SaveInstitute',
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterAdd: true,
            afterComplete: function (response) {
                if (response.responseText) {
                    Messager.ShowMessage(response.responseText);
                }
            }
        },
        {
            zIndex: 100,
            url: "/HRM/Institute/DeleteInstitute",
            closeOnEscape: true,
            closeAfterDelete: true,
            recreateForm: true,
            msg: "Are you sure to delete this Location? ",
            afterComplete: function (response) {
                if (response.responseText) {
                    Messager.ShowMessage(response.responseText);
                }
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
                       { "numberOfColumns": 5, "titleText": "Address Details", "startColumnName": "PostalCode" }]
                   
               });

    });

   

});
