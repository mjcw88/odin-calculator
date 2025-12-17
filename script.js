// TODO
// fix decimal point (e.g. 5.05 not working but 5.5 does)
// add keyboard support

document.addEventListener("DOMContentLoaded", function() {
    const clearBtn = document.getElementById("clear-btn");
    const allClearBtn = document.getElementById("allclear-btn");
    const plusMinusBtn = document.getElementById("plusminus-btn");
    const backSpaceBtn = document.getElementById("backspace-btn");

    const miniDisplayNum1 = document.getElementById("mini-display-number-one");
    const miniDisplayOperator = document.getElementById("mini-display-operator");
    const miniDisplayNum2 = document.getElementById("mini-display-number-two");
    const display = document.getElementById("display");
    const numberBtns = document.querySelectorAll(".number-btn");
    const operatorBtns = document.querySelectorAll(".operator-btn");
    const calculatorBtns = document.querySelectorAll(".calculator-btn");

    const maxNum = 999999999999999;
    const minNum = maxNum / -1;
    const maxDigits = `${maxNum}`.length;    
    const maxDecimals = 3;

    let num1 = null;
    let num2 = null;
    let num2Temp = null;
    let result = null;
    let operator = null;
    let operatorFlag = false;
    let zeroDivideFlag = false;

    function operate(operand1, operand2, operator) {
        switch(operator) {
            case "÷":
                result = operand1 / operand2;
                break;
            case "x":
                result = operand1 * operand2;
                break;
            case "-":
                result = operand1 - operand2;
                break;
            case "+":
                result = operand1 + operand2;
                break;
        }

        result = parseFloat(result.toFixed(maxDecimals))

        console.log(`operation performed: ${operand1} ${operator} ${operand2} = ${result}`)

        if (result > maxNum) {
            result = maxNum;
        } else if (result < minNum) {
            result = minNum;
        }

        miniDisplayNum1.textContent = operand1;
        miniDisplayOperator.textContent = operator;
        miniDisplayNum2.textContent = operand2;

        if (operator === "÷" && operand2 === 0) {
            clearAll();
            flipCalculatorButtons();

            display.textContent = ">:[";
            zeroDivideFlag = true;
        } else {
            display.textContent = result.toLocaleString(undefined, { 
                maximumFractionDigits: maxDecimals });
        }

        return result;
    };

    function flipCalculatorButtons() {
        operatorBtns.forEach(btn => {
            btn.disabled = !btn.disabled;
        });

        calculatorBtns.forEach(btn => {
            btn.disabled = !btn.disabled;
        });
    };

    function storeNumber(number) {
        number = cleanNumber(number)
        number = parseFloat(number);

        if (num1 === null) {
            num1 = number;
            miniDisplayNum1.textContent = num1;
            operatorFlag = true;
        } else {
            num2 = number;
        }
    };

    function cleanNumber(number) {
        return number
            .toString()
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
            maximumFractionDigits: maxDecimals });
    };

    function deleteLastNumber(number) {
        number = number.slice(0, number.length - 1);
        number = cleanNumber(number);
        number = parseFloat(number);

        if (number === "" || isNaN(number)) {
            number = 0;
        }

        display.textContent = number.toLocaleString(undefined, { 
            maximumFractionDigits: maxDecimals });
    };

    function updateDisplay(number) {
        if (operatorFlag) {
            display.textContent = "";
            operatorFlag = false;
        }

        if (result != null) {
            miniDisplayNum1.textContent = result;
            miniDisplayNum2.textContent = "";
        }

        const cleanedNumber = cleanNumber(display.textContent);
        const decimalPlaces = cleanedNumber.split(".")[1] ? cleanedNumber.split(".")[1].length : 0;

        if ((!display.textContent.includes(".") || number != ".") && 
            (cleanedNumber.length < maxDigits) &&
            decimalPlaces < maxDecimals) {

            let newNumber = parseFloat(cleanedNumber + number);

            display.textContent = newNumber.toLocaleString(undefined, { 
                maximumFractionDigits: maxDecimals });

            if (number === ".") {
                display.textContent = display.textContent + number;
            }
        }
    };

    function clearAll() {
        num1 = null;
        num2 = null;
        num2Temp = null;
        result = null;
        operator = null;
        miniDisplayNum1.textContent = "";
        miniDisplayOperator.textContent = "";
        miniDisplayNum2.textContent = "";
        display.textContent = "0";
    };

    clearBtn.addEventListener("click", () => {
        display.textContent = "0";
        miniDisplayNum2.textContent = "";
        num2Temp = null;
    });

    allClearBtn.addEventListener("click", () => {
        clearAll();
    });

    plusMinusBtn.addEventListener("click", () => {
        reverseNumber(display.textContent);
    });

    backSpaceBtn.addEventListener("click", () => {
        deleteLastNumber(display.textContent);
    });

    numberBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            if (zeroDivideFlag) {
                flipCalculatorButtons();
                zeroDivideFlag = false;
            }

            updateDisplay(btn.textContent);
        });
    });

    operatorBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            if (!operatorFlag) {
                storeNumber(display.textContent);
            }
            
            if (num1 != null && num2 != null && operator != "=") {
                result = operate(num1, num2, operator);
                num1 = result;
                num2Temp = num2;
                num2 = null;
                operatorFlag = true;
            } else if (num2Temp != null && btn.textContent === "=") {
                result = operate(num1, num2Temp, operator);
                num1 = result;
                operatorFlag = true;
            }

            if (btn.textContent != "=") {
                if (num2Temp != null) {
                    num2Temp = cleanNumber(display.textContent);
                    num2Temp = parseFloat(num2Temp);
                }

                miniDisplayNum1.textContent = num1;
                
                operator = btn.textContent;
                miniDisplayOperator.textContent = operator;

                if (result != null) {
                    miniDisplayNum1.textContent = result;
                    miniDisplayOperator.textContent = operator;
                    miniDisplayNum2.textContent = "";
                }
            }
        });
    });
});