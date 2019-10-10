//BUDGET CONTROLLER
var budgetController = (function () {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };


    var data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    //creating a method to allow other modules to add new items into out data structure
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
           // ID = last ID + 1;
            //create new ID

            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
           
           //console.log(ID);
            
            if(type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            data.allItems[type].push(newItem);
            return newItem;
        },

        testing: function(){
            console.log(data);
        }
    };
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
        var input, newItem;
        //1. Get field iput data
        input = UICtrl.getInput();
        console.log(input);

        //2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

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