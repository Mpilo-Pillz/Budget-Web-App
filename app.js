//BUDGET CONTROLLER
var budgetController = (function () {

})();

//UI CONTROLLER
var UIController = (function () {

    var DOMstrings = {
        addType: '.add__type',
        addDescription: '.add__description',
        addValue: '.add__value',
        addBtn: '.add__btn',

    }
    return {
        getInput: function () {
            return {
                 type: document.querySelector(DOMstrings.addType).value, //will be either inc or exp
                 description: document.querySelector(DOMstrings.addDescription).value,
                 value: document.querySelector(DOMstrings.addValue).value
            };

        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    };
})();

//GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function() {
        var getCtrlDOM = UICtrl.getDOMstrings();
        document.querySelector(getCtrlDOM.addBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function (event) {
        // console.log(event.key);
        if (event.key == "Enter") {
            ctrlAddItem();
        }

    });
    };
    
    var ctrlAddItem = function () {
        //1. Get field iput data
        var input = UICtrl.getInput();
        console.log(input);
        //2. Add the item to the budget controller

        //3. Add the item to the UI

        //4. Calculate the budget

        //5. Display the budget on the UI

        
    };

    return {
        init: function() {
            console.log("mpi");
            setupEventListeners();
        }
    };
    

})(budgetController, UIController);

controller.init();