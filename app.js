//BUDGET CONTROLLER
var budgetController = (function(){
    
})();

//UI CONTROLLER
var UIController = (function() {

})();

//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

    var ctrlAddItem = function() {
        //1. Get field iput data

        //2. Add the item to the budget controller

        //3. Add the item to the UI

        //4. Calculate the budget

        //5. Display the budget on the UI

        console.log("mub");
    }
    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {
        // console.log(event.key);
        if (event.key == "Enter") {
            ctrlAddItem();
        }
        
    });

})(budgetController, UIController);
