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

var calculateTotal = function(type) {
    var sum;

    sum = 0;

    data.allItems[type].forEach(function(current) {
        sum = sum + current.value;
    });
    data.totals[type] = sum;
};

    var data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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

        calculateBudget: function() {

            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            //calculate the percentage of income spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
            

        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
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
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage'
    };
    return {
        getInput: function () {
            return {
                 type: document.querySelector(DOMstrings.addType).value, //will be either inc or exp
                 description: document.querySelector(DOMstrings.addDescription).value,
                 value: parseFloat(document.querySelector(DOMstrings.addValue).value)
            };

        },

        addListItem: function(obj, type) {
            //create an html string with placeholder text
            var html, newHtml, element;

            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            

            
            //replace the placeholder text with data received from object
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            

            //insert html into the DOM
            // document.querySelector(element).insertAdjacentHTML('beforeend', html);
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            // document.querySelector(element).insertAdjacentHTML('beforeend', '<div id="two">Mpilo</div>' );

        },

        clearFileds: function() {
            var fields, fieldsArray;

            fields = document.querySelectorAll(DOMstrings.addDescription + ', ' + DOMstrings.addValue);

            //convert the above into an array becuase it is currently a list
            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function(current, index, array) {
                //now we clear the fields as they are in the array
                current.value = "";
            });
            //return focus to the description field
            fieldsArray[0].focus();
        },

        displayBudget: function(obj){
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
            

            if(obj.percentage >= 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = `${obj.percentage}%`;
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
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

    var updateBudget = function() {
        //1. Calculate the budget
        budgetCtrl.calculateBudget();

        //2. Return Budget
        var budget = budgetCtrl.getBudget();
        //3. Display the budget on the UI
        UICtrl.displayBudget(budget);
        console.log(`budget object is ${budget}`);


    };
    
    var ctrlAddItem = function () {
        var input, newItem;
        //1. Get field iput data
        input = UICtrl.getInput();
        console.log(input);
        
        if(input.description !== "" && !isNaN(input.value) && input.value > 0 ) {
            //2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        //3. Add the item to the UI
        UICtrl.addListItem(newItem, input.type);

        //4. Clear the fields and return focus to the Description input field
        UICtrl.clearFileds();
        //5. Calculate and update the budget
        updateBudget();
        //6. Display the budget on the UI
        }
        
    };

    return {
        init: function() {
            console.log("mpi");
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: '---'
            });
            setupEventListeners();
        }
    };
    

})(budgetController, UIController);

controller.init();