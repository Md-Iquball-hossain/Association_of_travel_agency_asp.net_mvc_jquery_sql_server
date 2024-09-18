$(document).ready(function () {
    //when index.cshtml is loaded for employee controller it's modal and all tabs of that modal 
    //are also loaded,in that case global val will be undefined becoz no row is selected; which happened in our case.
    //And jqgrid will never get list values.So we have to load the jqgrid in modal show event so that global value 
    //will be found for selected row.I tried to call the event here but it did not execute.After I call it in viemodel 
    //it executed and worked properly.For same reason initial value won't be loaded when editing.
    $(function () {
        
    });
   
    
});

