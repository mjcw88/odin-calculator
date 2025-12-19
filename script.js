// TODO
// Remove all redundancies in logic and remove all console logs

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
        operator: null,
        result: null,
    };

    const calculatorState = {
        operatorBtnClicked: false,
        equalsBtnClicked: false,
        dividedByZero: false,
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
        const isInitialState = operation.num1 === null && operation.num2 === null && operation.operator === null;
        
        if (!isInitialState) {
            if (operation.operator === null || calculatorState.equalsBtnClicked) {
                operation.num1 = 0;
            } else if (operation.operator !== null && !calculatorState.operatorBtnClicked) {
                operation.num2 = 0;
            }
        }

        display.textContent = "0";
    };

    function clearAll() {
        display.textContent = "0";
        miniDisplayNum1.textContent = "";
        miniDisplayNum2.textContent = "";
        miniDisplayOperator.textContent = "";

        for (property in operation) {
            operation[property] = null;
        }

        for (property in calculatorState) {
            calculatorState[property] = false;
        }
    };

    function inverseNumber() {
        let number = display.textContent;
        number = stripCommas(number);
        number = parseFloat(number);

        if (number > 0) {
            number = number / -1;
        } else if (number < 0) {
            number = number * -1;
        }

        if (operation.operator === null || calculatorState.equalsBtnClicked) {
            operation.num1 = number;
        } else if (operation.operator !== null && !calculatorState.operatorBtnClicked) {
            operation.num2 = number;
        }

        display.textContent = number.toLocaleString(undefined, { 
            maximumFractionDigits: MAX_DECIMALS });
    }

    function deleteLastNumber() {
        let number = display.textContent;
        number = number.slice(0, number.length - 1);
        number = stripCommas(number);
        const decimalPlaces = getDecimalPlaces(number);
        number = parseFloat(number);

        if (number === "" || isNaN(number)) number = 0;

        const isInitialState = operation.num1 === null && operation.num2 === null && operation.operator === null;
        
        if (!isInitialState) {
            if (operation.operator === null || calculatorState.equalsBtnClicked) {
                operation.num1 = number;
            } else if (operation.operator !== null && !calculatorState.operatorBtnClicked) {
                operation.num2 = number;
            }
        }

        display.textContent = number.toLocaleString(undefined, {
            minimumFractionDigits: decimalPlaces,
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
        if (!calculatorState.operatorBtnClicked) storeNumber(display.textContent);
        if (calculatorState.equalsBtnClicked && e.target.textContent != "=") {
            operation.num2 = null;
            calculatorState.equalsBtnClicked = false;
        }
        
        updateMiniDisplay();
        
        performOperationType(e)

        if (e.target.textContent != "=") {
            storeOperator(e.target.textContent);
            updateMiniDisplay();
        }
        
        calculatorState.operatorBtnClicked = true;
    };

    function handleKeyboardPress(e) {
        numpad.forEach(btn => {
            if (!btn.disabled) {
                if (e.key.toLowerCase() === btn.dataset.keyboard.toLowerCase()) {
                    btn.classList.add('active');
                    btn.click();
                    setTimeout(() => btn.classList.remove('active'), BUTTON_TIMEOUT);
                }
            }
        });
    }

    function updateDisplay(input) {
        if (calculatorState.operatorBtnClicked) {
            display.textContent = "";
            calculatorState.operatorBtnClicked = false;
        }

        if (calculatorState.equalsBtnClicked) {
            operation.num1 = null;
            miniDisplayNum1.textContent = "";
            miniDisplayNum2.textContent = "";
            miniDisplayOperator.textContent = "";
            calculatorState.equalsBtnClicked = false;
            console.log("calculatorState.equalsBtnClicked condition found")
        }

        const cleanedNumber = stripCommas(display.textContent);
        const decimalPlaces = getDecimalPlaces(cleanedNumber);

        if ((!display.textContent.includes(".") || input != ".") && 
            (cleanedNumber.length < MAX_DIGITS) &&
            decimalPlaces < MAX_DECIMALS) {

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

    function storeNumber(number) {
        number = stripCommas(number)
        number = parseFloat(number);

        if (operation.num1 === null) {
            operation.num1 = number;

            console.log(`num1 stored: ${operation.num1}`)

        } else {
            operation.num2 = number;
            
            console.log(`num2 stored: ${operation.num2}`)
        }
    };

    function performOperationType(e) {
        if (operation.num1 === null || operation.operator === null) return;
        if (operation.num2 === null && e.target.textContent === "=") storeNumber(display.textContent);

        if (operation.num2 != null && e.target.textContent != "=") {
            operation.result = operate(operation.num1, operation.num2, operation.operator);
            operation.num1 = operation.result;
            operation.num2 = null;

            calculatorState.operatorBtnClicked = true;
            calculatorState.equalsBtnClicked = false,

            console.log(`operation 1 performed`)

        } else if (operation.num2 != null && e.target.textContent === "=") {
            
            operation.result = operate(operation.num1, operation.num2, operation.operator);
            operation.num1 = operation.result;

            calculatorState.operatorBtnClicked = true;
            calculatorState.equalsBtnClicked = true;

            console.log(`operation 2 performed`)
        } else {
            console.log(`no operation performed`)
        }
    };

    function storeOperator(operator) {        
        if (!calculatorState.dividedByZero) {
            operation.operator = operator;

            console.log(`operator stored: ${operation.operator}`)
        }
    };

    function updateMiniDisplay() {
        if (operation.num1 != null) miniDisplayNum1.textContent = operation.num1;
        if (operation.operator != null) miniDisplayOperator.textContent = operation.operator;

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

        console.log(`operation performed: ${operand1} ${operator} ${operand2} = ${operation.result}`)

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

    function getDecimalPlaces(number) {
        return number.split(".")[1] ? number.split(".")[1].length : 0;
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

    function checkResultLength(number) {
        if (number > MAX_NUM) {
            return number = MAX_NUM;
        } else if (number < MIN_NUM) {
            return number = MIN_NUM;
        }
        return number;
    };
});