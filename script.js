// TODO
// fix decimal point (e.g. 5.05 not working but 5.5 does)
// fix NaN issues (clicking on decimal point after cycling through equals button e.g.)
// add keyboard support

document.addEventListener("DOMContentLoaded", function() {
    // Constants
    const MAX_NUM = 999999999999999;
    const MIN_NUM = MAX_NUM / -1;
    const MAX_DIGITS = `${MAX_NUM}`.length;    
    const MAX_DECIMALS = 3;

    // Objects
    const operation = {
        num1: null,
        num2: null,
        num2Temp: null,
        operator: null,
        result: null,
    };

    const calculatorState = {
        operatorBtnClicked: false,
        dividedByZero: false,
    };

    // DOM References
    const clearBtn = document.getElementById("clear-btn");
    const allClearBtn = document.getElementById("allclear-btn");
    const plusMinusBtn = document.getElementById("plusminus-btn");
    const backSpaceBtn = document.getElementById("backspace-btn");
    const numberBtns = document.querySelectorAll(".number-btn");
    const operatorBtns = document.querySelectorAll(".operator-btn");
    const calculatorBtns = document.querySelectorAll(".calculator-btn");
    const display = document.getElementById("display");
    const miniDisplayNum1 = document.getElementById("mini-display-number-one");
    const miniDisplayOperator = document.getElementById("mini-display-operator");
    const miniDisplayNum2 = document.getElementById("mini-display-number-two");

    // Event Listeners
    clearBtn.addEventListener("click", clearDisplay);
    allClearBtn.addEventListener("click", clearAll);
    plusMinusBtn.addEventListener("click", reverseNumber);
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
        miniDisplayNum2.textContent = "";
        operation.num2Temp = null;
    };

    function clearAll() {
        display.textContent = "0";
        miniDisplayNum2.textContent = "";
        miniDisplayNum1.textContent = "";
        miniDisplayOperator.textContent = "";

        for (property in operation) {
            operation[property] = null;
        }

        for (property in calculatorState) {
            calculatorState[property] = false;
        }
    };

    function reverseNumber() {
        let number = display.textContent;
        number = stripCommas(number);
        number = parseFloat(number);

        if (number > 0) {
            number = number / -1;
        } else if (number < 0) {
            number = number * -1;
        }

        display.textContent = number.toLocaleString(undefined, { 
            maximumFractionDigits: MAX_DECIMALS });
    };

    function deleteLastNumber() {
        let number = display.textContent;
        number = number.slice(0, number.length - 1);
        number = stripCommas(number);
        number = parseFloat(number);

        if (number === "" || isNaN(number)) {
            number = 0;
        }

        display.textContent = number.toLocaleString(undefined, { 
            maximumFractionDigits: MAX_DECIMALS });
    };

    function handleNumberClick(e) {
        if (calculatorState.dividedByZero) {
            flipCalculatorButtons();
            calculatorState.dividedByZero = false;
        }

        updateDisplay(e.target.textContent);
    };

    function handleOperatorClick(e) {
        if (!calculatorState.operatorBtnClicked) {
            storeNumber(display.textContent);
        }
        
        performOperationType(e);

        if (e.target.textContent != "=") {
            updateNum2Temp();
            miniDisplayNum1.textContent = operation.num1;
            storeOperator(e);
            updateMiniDisplay();
        }
    };

    function updateDisplay(number) {
        if (calculatorState.operatorBtnClicked) {
            display.textContent = "";
            calculatorState.operatorBtnClicked = false;
        }

        if (operation.result != null) {
            miniDisplayNum1.textContent = operation.result;
            miniDisplayNum2.textContent = "";
        }

        const cleanedNumber = stripCommas(display.textContent);
        const decimalPlaces = cleanedNumber.split(".")[1] ? cleanedNumber.split(".")[1].length : 0;

        if ((!display.textContent.includes(".") || number != ".") && 
            (cleanedNumber.length < MAX_DIGITS) &&
            decimalPlaces < MAX_DECIMALS) {

            let newNumber = parseFloat(cleanedNumber + number);

            display.textContent = newNumber.toLocaleString(undefined, { 
                maximumFractionDigits: MAX_DECIMALS });

            if (number === ".") {
                display.textContent = display.textContent + number;
            }
        }
    };

    function storeNumber(number) {
        number = stripCommas(number)
        number = parseFloat(number);

        if (operation.num1 === null) {
            operation.num1 = number;
            miniDisplayNum1.textContent = operation.num1;
            calculatorState.operatorBtnClicked = true;
        } else {
            operation.num2 = number;
        }
    };

    function performOperationType(e) {
        if (operation.num1 != null && operation.num2 != null && operation.operator != "=") {
            operation.result = operate(operation.num1, operation.num2, operation.operator);
            operation.num1 = operation.result;
            operation.num2Temp = operation.num2;
            operation.num2 = null;
        } else if (operation.num1 != null && operation.num2Temp != null && e.target.textContent === "=") {
            operation.result = operate(operation.num1, operation.num2Temp, operation.operator);
            operation.num1 = operation.result;
        }
        calculatorState.operatorBtnClicked = true;
    };

    function updateNum2Temp() {
        if (operation.num2Temp != null) {
            operation.num2Temp = stripCommas(display.textContent);
            operation.num2Temp = parseFloat(operation.num2Temp);
        }
    };

    function storeOperator(e) {        
        if (!calculatorState.dividedByZero) {
            operation.operator = e.target.textContent;
            miniDisplayOperator.textContent = operation.operator;
        }
    };

    function updateMiniDisplay() {
        if (operation.result != null) {
            miniDisplayNum1.textContent = operation.result;
            miniDisplayNum2.textContent = "";
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

        operation.result = parseFloat(operation.result.toFixed(MAX_DECIMALS))
        operation.result = checkResultLength(operation.result);

        miniDisplayNum1.textContent = operand1;
        miniDisplayOperator.textContent = operator;
        miniDisplayNum2.textContent = operand2;

        display.textContent = operation.result.toLocaleString(undefined, { 
            maximumFractionDigits: MAX_DECIMALS });

        return operation.result;
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

    function flipCalculatorButtons() {
        operatorBtns.forEach(btn => {
            btn.disabled = !btn.disabled;
        });

        calculatorBtns.forEach(btn => {
            btn.disabled = !btn.disabled;
        });
    };

    function isDividedByZero(number, operator) {
        if (number === 0 && operator === "÷") {
            clearAll();
            flipCalculatorButtons();

            display.textContent = ">:[";
            calculatorState.dividedByZero = true;
            return true;
        }
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

    function checkResultLength(result) {
        if (result > MAX_NUM) {
            return result = MAX_NUM;
        } else if (result < MIN_NUM) {
            return result = MIN_NUM;
        }
        return result;
    };
});