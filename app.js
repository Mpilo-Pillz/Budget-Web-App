//BUDGET CONTROLLER
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    //inheritig from expense
    Expense.prototype.calcPercentage = function(totalIncome) {
        
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function (type) {
        var sum;

        sum = 0;

        data.allItems[type].forEach(function (current) {
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
        addItem: function (type, des, val) {
            var newItem, ID;
            // ID = last ID + 1;
            //create new ID

            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            //console.log(ID);

            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            data.allItems[type].push(newItem);
            return newItem;
        },

        deleteItem: function (type, id) {
            var ids, index;
            //id = 6
            //data.allItems[type][id];
            //ids = [1,2,3,4,6,8]
            //index = 3
            //map like forEach loops, but the difference is that it returns a brand new Array
            ids = data.allItems[type].map(function (current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                //first argument of splice is the index we want to delete, the second is the number of items
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function () {

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

        calculatePercentages: function() {

            /*
            a = 20
            b = 10
            c = 40
            income = 100
            divide by 100 to get the percentage
            */

            data.allItems.exp.forEach(function(current) {
                //calculate the percentage for every object in this array
                current.calcPercentage(data.totals.inc);
            });
        },

        getPercentage: function() {
            //using the map this time istead of forech because we are returning a new Array
            var allPerc = data.allItems.exp.map(function(current) {
                return current.getPercentage();
            });
            return allPerc;
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: function () {
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
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    var formatNumber = function(num, type) {
        var numSplit, int, dec;
        /*
        + or - before number
        exactly 2 decimal points
        comma separating the thousands

        2310.4567 -> + 2,310.46
        2000 -> + 2,000.00
        */

        num = Math.abs(num);
        num = num.toFixed(2); //FMI this toFixed() unlike abs() is not a mathod of Math but a method of Number it was inherited

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
            // int = int.substr(0, 1) + ',' + int.substr(1, 3); //input is 2310, output is 2,310
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input is 2310, output is 2,310
        }

        dec = numSplit[1];

        // type === 'exp' ? sign = '-' : sign = '+';
        // return type + ' ' + int + dec;
        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.addType).value, //will be either inc or exp
                description: document.querySelector(DOMstrings.addDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.addValue).value)
            };

        },

        addListItem: function (obj, type) {
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
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));


            //insert html into the DOM
            // document.querySelector(element).insertAdjacentHTML('beforeend', html);
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            // document.querySelector(element).insertAdjacentHTML('beforeend', '<div id="two">Mpilo</div>' );

        },

        deleteListItem: function (selectorID) {

            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);

        },

        clearFileds: function () {
            var fields, fieldsArray;

            fields = document.querySelectorAll(DOMstrings.addDescription + ', ' + DOMstrings.addValue);

            //convert the above into an array becuase it is currently a list
            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function (current, index, array) {
                //now we clear the fields as they are in the array
                current.value = "";
            });
            //return focus to the description field
            fieldsArray[0].focus();
        },

        displayBudget: function (obj) {
            //we dont know the budget beforehand so we set conditions
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');


            if (obj.percentage >= 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = `${obj.percentage}%`;
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        displayPercentages: function(percentages) {

            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            var nodeListForEach = function(list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            };

            nodeListForEach(fields, function(current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }

            });

        },

        displayMonth: function() {
            var now, months, month, year;

             now = new Date();
            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
             month = now.getMonth();
             year = now.getFullYear();
             document.querySelector(DOMstrings.dateLabel).textContent = `${months[month]} ${year}`;

        },

        getDOMstrings: function () {
            return DOMstrings;
        }
    };
})();

//GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {
        var getCtrlDOM = UICtrl.getDOMstrings();
        document.querySelector(getCtrlDOM.addBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            // console.log(event.key);
            if (event.key == "Enter") {
                ctrlAddItem();
            }
        });

        document.querySelector(getCtrlDOM.container).addEventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function () {
        //1. Calculate the budget
        budgetCtrl.calculateBudget();

        //2. Return Budget
        var budget = budgetCtrl.getBudget();
        //3. Display the budget on the UI
        UICtrl.displayBudget(budget);
        console.log(`budget object is ${budget}`);

    };

    var updatePercentages = function () {
        //1. Calculate percentages
        budgetCtrl.calculatePercentages();  

        //2. Read percentages from the budget controller
        var percentages = budgetCtrl.getPercentage();

        //3. Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
        console.log(percentages);

    };

    var ctrlAddItem = function () {
        var input, newItem;
        //1. Get field iput data
        input = UICtrl.getInput();
        console.log(input);

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            //3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            //4. Clear the fields and return focus to the Description input field
            UICtrl.clearFileds();

            //5. Calculate and update the budget
            updateBudget();

            //6. Calculate and update percentages
            updatePercentages();

        }

    };

    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        console.log(event.target.parentNode.parentNode.parentNode.parentNode.id);

        if (itemID) {
            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //1. delete the item from data structure
            budgetCtrl.deleteItem(type, ID);

            //2. Delete the item from the user interface
            UICtrl.deleteListItem(itemID);

            //3. Update and show the new budget
            updateBudget();

            //4. Calculate and update percentages
            updatePercentages();
        }
    };

    return {
        init: function () {
            console.log("mpi");
            UICtrl.displayMonth();
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