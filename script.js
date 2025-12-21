document.addEventListener("DOMContentLoaded", function() {
    // Constants
    const MAX_NUM = 999999999999999;
    const MIN_NUM = MAX_NUM / -1;
    const MAX_DIGITS = `${MAX_NUM}`.length;    
    const MAX_DECIMALS = 3;
    const BUTTON_TIMEOUT = 100;

    // Objects
    const operation = {
        num1: null,
        num2: null,
        num2Temp: null,
        operator: null,
        result: null,
        miniDisplayNum1: null,
        miniDisplayNum2: null,
        miniDisplayOperator: null,
    };

    const calculatorState = {
        operatorBtnClicked: false,
        equalsBtnClicked: false,
        clearBtnClicked: false,
        inverseBtnClicked: false,
        deleteLastNumberBtnClicked: false,
        dividedByZero: false,
        operatorChangedAfterEquals: false,
        justClearedAfterEquals: false,
    };

    // DOM References
    const clearBtn = document.getElementById("clear-btn");
    const allClearBtn = document.getElementById("allclear-btn");
    const inverseBtn = document.getElementById("inverse-btn");
    const backSpaceBtn = document.getElementById("backspace-btn");
    const numberBtns = document.querySelectorAll(".number-btn");
    const operatorBtns = document.querySelectorAll(".operator-btn");
    const calculatorBtns = document.querySelectorAll(".calculator-btn");
    const numpad = document.querySelectorAll(".numpad");
    const display = document.getElementById("display");
    const miniDisplayNum1 = document.getElementById("mini-display-number-one");
    const miniDisplayOperator = document.getElementById("mini-display-operator");
    const miniDisplayNum2 = document.getElementById("mini-display-number-two");
    const miniDisplayOperatorTemp = document.getElementById("mini-display-operator-temp");

    // Event Listeners
    document.body.addEventListener("keydown", handleKeyboardPress);

    clearBtn.addEventListener("click", clearDisplay);
    allClearBtn.addEventListener("click", clearAll);
    inverseBtn.addEventListener("click", inverseNumber);
    backSpaceBtn.addEventListener("click", deleteLastNumber);

    numberBtns.forEach(btn =>
        btn.addEventListener("click", handleNumberClick)
    );

    operatorBtns.forEach(btn => 
        btn.addEventListener("click", handleOperatorClick)
    );

    // Functions & Core Logic
    function clearDisplay() {    
        display.textContent = "0";
        calculatorState.clearBtnClicked = true;
    };

    function clearAll() {
        for (property in operation) {
            operation[property] = null;
        }

        for (property in calculatorState) {
            calculatorState[property] = false;
        }

        display.textContent = "0";
        miniDisplayNum1.textContent = "";
        miniDisplayOperator.textContent = "";
        miniDisplayNum2.textContent = "";
        miniDisplayOperatorTemp.textContent = "";
    };

    function inverseNumber() {
        let number = display.textContent;
        number = stripCommas(number);
        const decimalPlaces = getDecimalPlaces(number);
        number = parseFloat(number);

        if (number > 0) {
            number = number / -1;
        } else if (number < 0) {
            number = number * -1;
        }

        display.textContent = number.toLocaleString(undefined, { 
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: MAX_DECIMALS });

        calculatorState.inverseBtnClicked = true;
    };

    function deleteLastNumber() {
        let number = display.textContent;
        number = number.slice(0, number.length - 1);
        number = stripCommas(number);
        const decimalPlaces = getDecimalPlaces(number);
        number = parseFloat(number);

        if (number === "" || isNaN(number)) number = 0;

        display.textContent = number.toLocaleString(undefined, {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: MAX_DECIMALS });
            
        calculatorState.deleteLastNumberBtnClicked = true;
    };

    function handleNumberClick(e) {
        if (calculatorState.dividedByZero) {
            flipDisabledStatus();
            calculatorState.dividedByZero = false;
        }

        if (calculatorState.deleteLastNumberBtnClicked) calculatorState.deleteLastNumberBtnClicked = false;

        updateDisplay(e.target.textContent);
    };

    function updateDisplay(input) {        
        if (calculatorState.operatorBtnClicked) clearDisplayOnNewNum();
    
        if (calculatorState.equalsBtnClicked) clearDisplayOnEqualsBtnClicked();

        if (display.textContent.includes(".") && input === ".") return;

        const cleanedNumber = stripCommas(display.textContent);
        const decimalPlaces = getDecimalPlaces(cleanedNumber);

        if (cleanedNumber.length < MAX_DIGITS && decimalPlaces < MAX_DECIMALS) {
            let newNumber = parseFloat(cleanedNumber + input);

            if (input === "." && display.textContent != "") {
                display.textContent = display.textContent + input;
            } else if (input === "." && display.textContent === "") {
                display.textContent = 0 + input;
            } else if (cleanedNumber.includes(".") && input == 0) {
                display.textContent = newNumber.toLocaleString(undefined, { 
                    minimumFractionDigits: decimalPlaces + 1,
                    maximumFractionDigits: MAX_DECIMALS });
            } else {
                display.textContent = newNumber.toLocaleString(undefined, { 
                    maximumFractionDigits: MAX_DECIMALS });
            }
        }
    };

    function clearDisplayOnNewNum() {
        display.textContent = "";
        calculatorState.operatorBtnClicked = false;
    };

    function clearDisplayOnEqualsBtnClicked() {
        let currentDisplayValue = stripCommas(display.textContent);
        currentDisplayValue = parseFloat(currentDisplayValue);

        operation.num1 = null;
        operation.result = null;

        if (operation.num2Temp !== null && operation.operator !== null) {
            operation.num2 = operation.num2Temp;
        }
        
        display.textContent = "";
        miniDisplayNum1.textContent = "";
        miniDisplayNum2.textContent = "";
        miniDisplayOperator.textContent = "";
        miniDisplayOperatorTemp.textContent = "";
        operation.miniDisplayNum1 = null;
        operation.miniDisplayNum2 = null; 
        operation.miniDisplayOperator = null;
        calculatorState.equalsBtnClicked = false;
        calculatorState.justClearedAfterEquals = true;
    };

    function handleOperatorClick(e) {
        if (!calculatorState.operatorBtnClicked && !calculatorState.equalsBtnClicked) {
            storeNumber(display.textContent);
        }

        if (calculatorState.clearBtnClicked || 
            calculatorState.inverseBtnClicked || 
            calculatorState.deleteLastNumberBtnClicked) {            
            assignNumBasedOnState(display.textContent);
            
            if (calculatorState.inverseBtnClicked) calculatorState.inverseBtnClicked = false;
            if (calculatorState.deleteLastNumberBtnClicked) calculatorState.deleteLastNumberBtnClicked = false;
            if (calculatorState.clearBtnClicked) calculatorState.clearBtnClicked = false;
        }
        
        if ((calculatorState.justClearedAfterEquals || calculatorState.equalsBtnClicked) 
            && e.target.textContent != "=") {
            resetOperationWithCurrentDisplay(display.textContent);
            storeOperator(e.target.textContent);
            calculatorState.operatorBtnClicked = true;
            calculatorState.justClearedAfterEquals = false;
            calculatorState.equalsBtnClicked = false;
            updateMiniDisplay();
            return;
        }

        performOperationChecks(e);

        if (e.target.textContent != "=") {
            storeOperator(e.target.textContent);
            calculatorState.operatorBtnClicked = true;
        } else {
            calculatorState.equalsBtnClicked = true;
        }
        
        updateMiniDisplay();
    };

    function storeNumber(number) {
        number = stripCommas(number);
        number = parseFloat(number);

        if (operation.num1 === null) {
            operation.num1 = number;
        } else {
            operation.num2 = number;
        }
    };

    function assignNumBasedOnState(number) {
        number = stripCommas(number);
        number = parseFloat(number);
        
        if (operation.operator === null || calculatorState.equalsBtnClicked) {
            operation.num1 = number;

        } else if (operation.operator !== null && !calculatorState.operatorBtnClicked) {
            operation.num2 = number;

        }
    };

    function resetOperationWithCurrentDisplay(number) {
        number = stripCommas(number);
        number = parseFloat(number);
        operation.num1 = number;
        
        operation.num2 = null;
        operation.num2Temp = null;
        operation.result = null;
        operation.miniDisplayNum1 = null;
        operation.miniDisplayNum2 = null;
        operation.miniDisplayOperator = null;
    };

    function storeOperator(operator) {           
        if (!calculatorState.dividedByZero) {
            operation.operator = operator;
        }
    };

    function updateMiniDisplay() {  
        if (operation.miniDisplayNum1 === null) {
            miniDisplayNum1.textContent = operation.num1;
        } else {
            miniDisplayNum1.textContent = operation.miniDisplayNum1;
        }

        if (operation.miniDisplayOperator === null) {
            miniDisplayOperator.textContent = operation.operator;
        } else {
            miniDisplayOperator.textContent = operation.miniDisplayOperator;
        }

        if (operation.miniDisplayNum2 === null) {
            miniDisplayNum2.textContent = operation.num2;
        } else {
            miniDisplayNum2.textContent = operation.miniDisplayNum2;
        }

        if (calculatorState.equalsBtnClicked) {
            miniDisplayOperatorTemp.textContent = "";
        } else if (operation.result != null) {
            miniDisplayOperatorTemp.textContent = operation.operator;
        }
    };

    function handleKeyboardPress(e) {
        numpad.forEach(btn => {
            if (!btn.disabled) {
                if (e.key.toLowerCase() === btn.dataset.keyboard.toLowerCase()) {
                    btn.classList.add('active');
                    btn.click();
                    setTimeout(() => btn.classList.remove('active'), BUTTON_TIMEOUT);
                    console.log(e.key)
                }
            }
        });
    };

    function performOperationChecks(e) {
        if (operation.num1 === null || operation.operator === null) return;
        if (operation.num2 === null && e.target.textContent === "=") storeNumber(display.textContent);

        if (operation.num2 != null) {
                operate(operation.num1, operation.num2, operation.operator);
            if (e.target.textContent != "=") {
                calculatorState.equalsBtnClicked = false;
                operation.num2 = null;
            } else {
                calculatorState.equalsBtnClicked = true;
            }
        }
    };

    function operate(operand1, operand2, operator) {
        if (isDividedByZero(operand2, operator)) return null;

        switch(operator) {
            case "+":
                operation.result = add(operand1, operand2);
                break;
            case "-":
                operation.result = subtract(operand1, operand2);
                break;
            case "x":
                operation.result = multiply(operand1, operand2);
                break;
            case "÷":
                operation.result = divide(operand1, operand2);
                break;
        }

        operation.result = parseFloat(operation.result.toFixed(MAX_DECIMALS));
        operation.result = checkResultLength(operation.result);
        operation.miniDisplayNum1 = operation.num1;
        operation.miniDisplayNum2 = operation.num2;
        operation.miniDisplayOperator = operation.operator;
        operation.num1 = operation.result;
        operation.num2Temp = operation.num2;
    
        display.textContent = operation.result.toLocaleString(undefined, { 
            maximumFractionDigits: MAX_DECIMALS });
    };

    function isDividedByZero(number, operator) {
        if (number === 0 && operator === "÷") {
            clearAll();
            flipDisabledStatus();

            display.textContent = ">:[";
            calculatorState.dividedByZero = true;
            return true;
        };
        return false;
    };
    
    function add(num1, num2) {
        return num1 + num2;
    };

    function subtract(num1, num2) {
        return num1 - num2;
    };

    function multiply(num1, num2) {
        return num1 * num2;
    };

    function divide(num1, num2) {
        return num1 / num2;
    };

    function checkResultLength(number) {
        if (number > MAX_NUM) {
            return number = MAX_NUM;
        } else if (number < MIN_NUM) {
            return number = MIN_NUM;
        }
        return number;
    };

    // Helper Functions
    function stripCommas(number) {
        return number
            .toString()
            .split("")
            .filter(char => {return /[0-9\.\-]/
            .test(char)})
            .join("");
    };

    function getDecimalPlaces(number) {
        return number.split(".")[1] ? number.split(".")[1].length : 0;
    };

    function flipDisabledStatus() {
        operatorBtns.forEach(btn => {
            btn.disabled = !btn.disabled;
        });

        calculatorBtns.forEach(btn => {
            btn.disabled = !btn.disabled;
        });
    };
});