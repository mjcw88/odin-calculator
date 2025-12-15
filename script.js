// TODO
// fix how results are displayed
// fix how negative numbers work going back
// fix how operate buttons perform, especially the equals button and the operator buttons after a result has been generated
// the result needs to be stored in num1 after an operation is performed
// make sure clear buttons execute correctly

document.addEventListener("DOMContentLoaded", function() {
    const clearBtn = document.getElementById("clear-btn");
    const allClearBtn = document.getElementById("allclear-btn");
    const plusMinusBtn = document.getElementById("plusminus-btn");
    const backSpaceBtn = document.getElementById("backspace-btn");

    const display = document.getElementById("display");
    const numberBtns = document.querySelectorAll(".number-btn");
    const operatorBtns = document.querySelectorAll(".operator-btn");

    const MAX_DIGITS = 15;
    const MAX_DECIMALS = 3;

    let num1 = null;
    let num2 = null;
    let operator = null;
    let operatorFlag = false;

    function operate(num1, num2, operator) {
        let result = 0;

        switch(operator) {
            case "÷":
                result = num1 / num2;
                break;
            case "x":
                result = num1 * num2;
                break;
            case "-":
                result = num1 - num2;
                break;
            case "+":
                result = num1 + num2;
                break;
        }

        console.log(`operation performed: ${num1} ${operator} ${num2} = ${result}`)

        display.textContent = result;
    };

    function storeNumbers(operatorBtn) {
        operatorFlag = true;
        const number = cleanNumber(display.textContent)
        
        if (num1 === null) {
            num1 = parseFloat(number);
            operator = operatorBtn;
        } else {
            num2 = parseFloat(number);
            operate(num1, num2, operator)
        }
    };

    function cleanNumber(number) {
        return number
            .split("")
            .filter(char => {return /[0-9\.\-]/
            .test(char)})
            .join("");
    };

    function reverseNumber(number) {
        number = cleanNumber(number);
        number = parseFloat(number);

        if (number > 0) {
            number = number / -1;
        } else if (number < 0) {
            number = number * -1;
        }

        display.textContent = number.toLocaleString(undefined, { 
            maximumFractionDigits: MAX_DECIMALS });
    };

    function updateDisplay(number) {
        if (operatorFlag) {
            display.textContent = "";
            operatorFlag = false;
        }

        const cleanedNumber = cleanNumber(display.textContent);
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

    clearBtn.addEventListener("click", () => {
        display.textContent = "0";
    });

    allClearBtn.addEventListener("click", () => {
        num1 = null;
        num2 = null;
        operator = null;
        display.textContent = "0";
    });

    plusMinusBtn.addEventListener("click", () => {
        reverseNumber(display.textContent);
    });

    backSpaceBtn.addEventListener("click", () => {
        let number = display.textContent.slice(0, display.textContent.length - 1);
        number = cleanNumber(number);
        number = parseFloat(number);

        if (number === "" || isNaN(number)) {
            number = 0;
        }

        display.textContent = number.toLocaleString(undefined, { 
            maximumFractionDigits: MAX_DECIMALS });
    });

    numberBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            updateDisplay(btn.textContent);
        });
    });

    operatorBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            storeNumbers(btn.textContent);
        });
    });
});