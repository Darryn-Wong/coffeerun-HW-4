(function (window) {
    'use strict';
    var CHECKLIST_SELECTOR = '[data-coffee-order="checklist"]';
    var FORM_SELECTOR = '[data-coffee-order="form"]';
    var App = window.App;
    var Validation = App.Validation;
    var Truck = App.Truck;
    var DataStore = App.DataStore;
    var FormHandler = App.FormHandler;
    var CheckList = App.CheckList;
    var myTruck = new Truck('ncc-1701', new DataStore());
    window.myTruck = myTruck;
    var checkList = new CheckList(CHECKLIST_SELECTOR);
    checkList.addClickHandler(myTruck.deliverOrder.bind(myTruck));
    var formHandler = new FormHandler(FORM_SELECTOR);
    formHandler.addSubmitHandler(function (data) {
        var user = firebase.auth().currentUser;
        if (!user) {
            alert("please sign in")
            return
        }
        saveOrder(data)
        myTruck.createOrder.call(myTruck, data);
        checkList.addRow.call(checkList, data);
    });
    formHandler.addInputHandler(Validation.isCompanyEmail);
})(window);
