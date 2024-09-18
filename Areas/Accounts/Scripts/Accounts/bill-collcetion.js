/// <reference path="../knockout-3.4.0.debug.js" />
/// <reference path="../jquery-2.1.4.js" />
/// <reference path="../finix.util.js" />
/// <reference path="~/Scripts/knockout.validation.min.js" />


//start of auto complete

//jqAuto -- main binding (should contain additional options to pass to autocomplete)
//jqAutoSource -- the array of choices
//jqAutoValue -- where to write the selected value
//jqAutoSourceLabel -- the property that should be displayed in the possible choices
//jqAutoSourceInputValue -- the property that should be displayed in the input box
//jqAutoSourceValue -- the property to use for the value
ko.bindingHandlers.jqAuto = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var options = valueAccessor() || {},
            allBindings = allBindingsAccessor(),
            unwrap = ko.utils.unwrapObservable,
            modelValue = allBindings.jqAutoValue,
            source = allBindings.jqAutoSource,
            valueProp = allBindings.jqAutoSourceValue,
            inputValueProp = allBindings.jqAutoSourceInputValue || valueProp,
            labelProp = allBindings.jqAutoSourceLabel || valueProp;

        //function that is shared by both select and change event handlers
        function writeValueToModel(valueToWrite) {
            if (ko.isWriteableObservable(modelValue)) {
                modelValue(valueToWrite);
            } else {  //write to non-observable
                if (allBindings['_ko_property_writers'] && allBindings['_ko_property_writers']['jqAutoValue'])
                    allBindings['_ko_property_writers']['jqAutoValue'](valueToWrite);
            }
        }

        //on a selection write the proper value to the model
        options.select = function (event, ui) {
            writeValueToModel(ui.item ? ui.item.actualValue : null);
        };

        //on a change, make sure that it is a valid value or clear out the model value
        options.change = function (event, ui) {
            var currentValue = $(element).val();
            var matchingItem = ko.utils.arrayFirst(unwrap(source), function (item) {
                return unwrap(item[inputValueProp]) === currentValue;
            });

            if (!matchingItem) {
                writeValueToModel(null);
            }
        }


        //handle the choices being updated in a DO, to decouple value updates from source (options) updates
        var mappedSource = ko.dependentObservable(function () {
            mapped = ko.utils.arrayMap(unwrap(source), function (item) {
                var result = {};
                result.label = labelProp ? unwrap(item[labelProp]) : unwrap(item).toString();  //show in pop-up choices
                result.value = inputValueProp ? unwrap(item[inputValueProp]) : unwrap(item).toString();  //show in input box
                result.actualValue = valueProp ? unwrap(item[valueProp]) : item;  //store in model
                return result;
            });
            return mapped;
        });

        //whenever the items that make up the source are updated, make sure that autocomplete knows it
        mappedSource.subscribe(function (newValue) {
            $(element).autocomplete("option", "source", newValue);
        });

        options.source = mappedSource();

        //initialize autocomplete
        $(element).autocomplete(options);
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        //update value based on a model change
        var allBindings = allBindingsAccessor(),
            unwrap = ko.utils.unwrapObservable,
            modelValue = unwrap(allBindings.jqAutoValue) || '',
            valueProp = allBindings.jqAutoSourceValue,
            inputValueProp = allBindings.jqAutoSourceInputValue || valueProp;

        //if we are writing a different property to the input than we are writing to the model, then locate the object
        if (valueProp && inputValueProp !== valueProp) {
            var source = unwrap(allBindings.jqAutoSource) || [];
            var modelValue = ko.utils.arrayFirst(source, function (item) {
                return unwrap(item[valueProp]) === modelValue;
            }) || {};  //probably don't need the || {}, but just protect against a bad value          
        }

        //update the element with the value that should be shown in the input
        $(element).val(modelValue && inputValueProp !== valueProp ? unwrap(modelValue[inputValueProp]) : modelValue.toString());
    }
};

ko.bindingHandlers.jqAutoCombo = {
    init: function (element, valueAccessor) {
        var autoEl = $("#" + valueAccessor());

        $(element).click(function () {
            // close if already visible
            if (autoEl.autocomplete("widget").is(":visible")) {
                console.log("close");
                autoEl.autocomplete("close");
                return;
            }

            //autoEl.blur();
            console.log("search");
            autoEl.autocomplete("search", " ");
            autoEl.focus();

        });

    }
};
//end of auto complete

$(document).ready(function () {
    ko.validation.init({
        errorElementClass: 'has-error',
        errorMessageClass: 'help-block',
        decorateInputElement: true
    });

    function MasterVM() {
        var self = this;

        var currentDate = (new Date()).toISOString().split('T')[0];
        //for auto complete
        self.minPrefixLength = 1;
        self.prefix = ko.observable('');
        self.Bills = ko.observableArray([]);
        self.selectedBillNoKey = ko.observable('');
        self.getData = function (prefix) {
            $.getJSON("/Sales/GetAllBills/?prefix=" + prefix, function (data) {
                self.Bills(data);
            });
        };
        self.loadData = function () {
            if (self.prefix().length > self.minPrefixLength) {
                self.getData(self.prefix());
            }
        };

        self.loadBillNo = ko.computed(function () {

            if (self.selectedBillNoKey() && self.selectedBillNoKey().length > 0) {
                self.BillNo(self.selectedBillNoKey());
                self.getSalesByBillNo();
            }
        });

        //end of auto complete
        self.CollectionDate = ko.observable(currentDate);
        self.BillNo = ko.observable('');

        self.HospitalId = ko.observable();
        self.HospitalName = ko.observable('');

        self.DoctorId = ko.observable();
        self.DoctorName = ko.observable('');

        self.PatientName = ko.observable('');

        self.TotalAmount = ko.observable(0.00);
        self.TotalDiscount = ko.observable(0.00);
        self.TotalReceived = ko.observable(0.00);
        self.TotalReceivable = ko.observable(0.00);

        self.DiscountAmount = ko.observable(0.00);
        self.CollectionAmount = ko.observable(0.00);
        self.RemainingAmount = ko.observable(0.00);

        self.Vat = ko.observable(0.00);
        self.Tds = ko.observable(0.00);
        self.HospitalCharge = ko.observable(0.00);
        self.ServiceCharge = ko.observable(0.00);
        self.SpecialDiscount = ko.observable(0.00);
        self.Promotion = ko.observable(0.00);
        self.Enterertainment = ko.observable(0.00);
        self.OtherCharges = ko.observable(0.00);

        self.Status = ko.observable(1);

        self.getAllBills = function () {
            var billNo = self.BillNo() ? self.BillNo() : '';
            if (billNo.length > 0) {
                $.ajax({
                    type: "GET",
                    url: '/Sales/GetAllBills',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        self.HospitalName(data.HospitalName);
                        self.DoctorName(data.DoctorName);
                        self.PatientName(data.PatientName);
                        self.TotalAmount(data.TotalAmount);
                    },
                    error: function (error) {
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            }
        }
        self.IsSaved = ko.observable(false);
        self.getSalesByBillNo = function () {
            var billNo = self.BillNo() ? self.BillNo() : '';
            if (billNo.length > 0) {
                $.ajax({
                    type: "GET",
                    url: '/Sales/GetSalesByBillNo?billNo=' + billNo,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        self.HospitalName(data.HospitalName);
                        self.DoctorName(data.DoctorName);
                        self.PatientName(data.PatientName);
                        self.TotalAmount(data.TotalAmount);
                        self.TotalDiscount(data.TotalDiscount);
                        self.TotalReceived(data.TotalReceived);
                        self.TotalReceivable(data.TotalReceivable);
                        self.DiscountAmount(data.DiscountAmount);
                        self.CollectionAmount(data.CollectionAmount);
                        self.RemainingAmount(data.RemainingAmount);

                        self.Vat(data.Vat);
                        self.Tds(data.Tds);
                        self.HospitalCharge(data.HospitalCharge);
                        self.ServiceCharge(data.ServiceCharge);
                        self.SpecialDiscount(data.SpecialDiscount);
                        self.Promotion(data.Promotion);
                        self.Enterertainment(data.Enterertainment);
                        self.OtherCharges(data.OtherCharges);

                        self.IsSaved(true);
                        self.setUrl();
                        var hospitalname = self.HospitalName() ? self.HospitalName() : '';
                        if (hospitalname.length < 1) {
                            alert("Bill number is not found.");
                        }
                    },
                    error: function (error) {
                        alert(error.status + "<--and--> " + error.statusText);
                    }
                });
            }
        }

        self.saveBillCollection = function () {

            $.ajax({
                type: "POST",
                url: '/Sales/SaveBillCollection',
                data: ko.toJSON(this),
                contentType: "application/json",
                success: function (data) {
                    alert(data.Message);
                    window.location.href = "/Accounts/BillCollection";
                },
                error: function () {
                    alert(error.status + "<--and--> " + error.statusText);
                }
            });
            //Ends Here
        };

        self.errors = ko.validation.group(self);
        self.IsValid = ko.computed(function () {
            var amount = parseInt(self.CollectionAmount()) + parseInt(self.DiscountAmount());
            var err = self.errors().length;
            if ( self.TotalReceivable() >= self.CollectionAmount() && self.TotalReceivable() >= self.DiscountAmount() && self.TotalReceivable() >= amount && amount > 0) {
                return true;
            }
            return false;
        });

        self.Link1 = ko.observable();
        self.Link2 = ko.observable();
        self.Link3 = ko.observable();
        self.Title1 = ko.observable('PDF');
        self.Title2 = ko.observable('Excel');
        self.Title3 = ko.observable('Word');

        self.setUrl = ko.computed(function () {
            var bill = self.BillNo() ? self.BillNo() : '';
            self.Link1('/Sales/GetBillCollectionReport?reportTypeId=PDF&billNo=' + bill);
            self.Link2('/Sales/GetBillCollectionReport?reportTypeId=Excel&billNo=' + bill);
            self.Link3('/Sales/GetBillCollectionReport?reportTypeId=Word&billNo=' + bill);
        });

    }

    var vm = new MasterVM();
    vm.getData('');
    ko.applyBindings(vm, $('#dvWorkArea')[0]);

});