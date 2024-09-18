$(document).ready(function () {
    function populateParentOffice(isEdit) {
        var officelayerCombo = $("#tr_CompanyProfileId select");
        var parentidCombo = $("#tr_BankId select");
        $(officelayerCombo).attr("id", "CompanyProfileId").attr("name", "CompanyProfileId");
        $(parentidCombo).attr("id", "BankId").attr("name", "BankId");
        var selectedOfficeLayerId = $("#jqGrid").jqGrid('getRowData', $("#jqGrid")[0].p.selrow).CompanyProfileId | 0;
        $(officelayerCombo)
                     .html("<option value=''>Loading Company...</option>")
                     .attr("disabled", "disabled");
        $.ajax({
            url: '/Auth/CompanyProfile/GetAllCompanyListForGrid',
            type: "GET",
            success: function (officelevelHtml) {
                $(officelayerCombo).removeAttr("disabled").html(officelevelHtml);

                if (isEdit) {
                    $(officelayerCombo).val(selectedOfficeLayerId);
                } else {
                    $(officelayerCombo).selectedIndex = 0;
                }
                updateParentOfficeCallBack(isEdit, $(officelayerCombo).val(), parentidCombo);
            }
        });
        $(officelayerCombo).bind("change", function (e) {
            updateParentOfficeCallBack(false, $(officelayerCombo).val(), parentidCombo);
        });
    }
    function updateParentOfficeCallBack(isEdit, selectedOfficeLayerId, parentidCombo) {
        var url = '/Accounts/Bank/GetBankList?CompanyProfileId=' + selectedOfficeLayerId;
        //console.log("I Am Checking");
        $(parentidCombo)
             .html("<option value=''>Loading Banks...</option>")
             .attr("disabled", "disabled");
        $.ajax({
            url: url,
            type: "GET",
            success: function (parentJson) {
                var parents = eval(parentJson);
                var parentHtml = "";
                $(parents).each(function (i, option) {
                    parentHtml += '<option value="' + option.Id + '">' + option.Name + '</option>';
                });
                $(parentidCombo).removeAttr("disabled").html(parentHtml);
                if (isEdit) {
                    var selectedParentId = $("#jqGrid").jqGrid('getRowData', $("#jqGrid")[0].p.selrow).BankId | 0;
                    $(parentidCombo).val(selectedParentId);
                } else {
                    $(parentidCombo).selectedIndex = 0;
                }
                $(parentidCombo).focus();
            }
        });
    }

$(document).ready(function () {
    $(function () {
        $("#jqGrid").jqGrid({
            url: "/Accounts/Bank/GetChequeRegisterList",
            datatype: 'json',
            mtype: 'Get',
            colNames: ['Id', 'Account Name', 'Account Number', 'Company Profile', 'Company Profile Name', 'Bank', 'BankName', 'Cheque Prefix', 'Starting Number', 'Total Cheques', 'Book Issue Date'], //validatePositive
            colModel: [
                { key: true, hidden: true, name: 'Id', index: 'Id', editable: false },
                { key: false, name: 'AccountName', index: 'AccountName', label: 'AccountName', editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                { key: false, name: 'AccountNumber', index: 'AccountNumber', label: 'AccountNumber', editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                //{ key: false, hidden: true, name: 'CompanyProfileId', index: 'CompanyProfileId', editable: true, edittype: "select", editoptions: { dataUrl: '/CompanyProfile/GetAllCompanyListForGrid', cacheUrlData: true }, editrules: { edithidden: true, required: true }, label: "CompanyProfileId", searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                //{ key: false, hidden: true, name: 'BankId', index: 'BankId', editable: true, edittype: "select", editoptions: { dataUrl: '/CompanyProfile/GetAllCompanyListForGrid', cacheUrlData: true }, editrules: { edithidden: true, required: true }, label: "AccountNumber", searchoptions: { sopt: ['eq', 'ne', 'cn'] }, classes: "grid-col" },
                { key: false, name: 'CompanyProfileName', index: 'CompanyProfileName', label: 'CompanyProfileName', editable: false, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                { key: false, hidden: true, name: 'CompanyProfileId', index: 'CompanyProfileId', editable: true, edittype: "select", editrules: { required: true, edithidden: true }, formoptions: { label: "Company Profile: " }, editoptions: { cacheUrlData: true }, classes: "grid-col" },
                { key: false, name: 'BankName' , index: 'BankName', label: 'BankName', editable: false, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                { key: false, hidden: true, name: 'BankId', index: 'BankId', editable: true, edittype: "select", editrules: { required: true, edithidden: true }, formoptions: { label: "BankId: " } },

                { key: false, name: 'ChequePrefix', index: 'ChequePrefix', label: 'ChequePrefix', editable: true, editrules: { custom_func: validateText, custom: true, required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                { key: false, name: 'StartingNumber', index: 'StartingNumber', label: 'StartingNumber', editable: true, editrules: { required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                { key: false, name: 'TotalCheques', index: 'TotalCheques', label: 'TotalCheques', editable: true, editrules: { required: true }, searchoptions: { sopt: ['eq', 'ne', 'cn'] } },
                {
                    key: false,
                    name: "BookIssueDate", index: 'BookIssueDate', label: "BookIssueDate", formatter: "date", editable: true, editrules: { required: true }, edittype: "text",
                    editoptions: {
                        dataInit: function (element) {
                            $(element).datepicker({
                                id: 'BookIssueDate_datePicker',
                                dateFormat: 'M/d/yy',

                                changeYear: true,
                                showOn: 'focus'
                            });
                        }
                    }
                },
            ],
            pager: jQuery('#jqControls'),
            rowNum: 10,
            rowList: [10, 20, 30, 40, 50],
            hoverrows: true,
            sortable: true,
            width: '70%',
            viewrecords: true,
            caption: 'Cheque Register Records',
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
        { edit: true, add: true, search: true, refresh: true }, // del: true,
        {
            zIndex: 100,
            url: '/Accounts/Bank/SaveChequeRegister',
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterEdit: true,
            recreateForm: true,
            onInitializeForm: function (formId) { populateParentOffice(true); },
            afterComplete: function (response) {
                if (response.responseText) {
                    Messager.ShowMessage(response.responseText);
                }
            }
            //afterComplete: function (response) {
            //    Messager.ShowMessage(response.Message);
            //}

        },
        {
            zIndex: 100,
            url: "/Accounts/Bank/SaveChequeRegister",
            closeOnEscape: true,
            width: 'auto',
            height: 'auto',
            closeAfterAdd: true,
            onInitializeForm: function (formId) { populateParentOffice(false); },
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
    });
});
});