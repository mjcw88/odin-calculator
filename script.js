// TODO
// fix decimal point (e.g. 5.05 not working but 5.5 does)

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

    const maxNum = 999999999999999;
    const minNum = -999999999999999;
    const maxDigits = `${maxNum}`.length;    
    const maxDecimals = 3;

    let num1 = null;
    let num2 = null;
    let result = null;
    let operator = null;
    let operatorFlag = false;

    function operate(num1, num2, operator) {
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

        result = parseFloat(result.toFixed(maxDecimals))

        console.log(`operation performed: ${num1} ${operator} ${num2} = ${result}`)

        if (result > maxNum) {
            result = maxNum;
        } else if (result < minNum) {
            result = minNum;
        }

        miniDisplayNum1.textContent = num1;
        miniDisplayOperator.textContent = operator;
        miniDisplayNum2.textContent = num2;

        display.textContent = result.toLocaleString(undefined, { 
            maximumFractionDigits: maxDecimals });

        return result;
    };

    function storeNumbers(number) {
        number = cleanNumber(number)
        
        if (num1 === null) {
            num1 = parseFloat(number);
            miniDisplayNum1.textContent = num1;
            operatorFlag = true;
            console.log(`num1 stored: ${num1}`)
        } else {
            num2 = parseFloat(number);
            console.log(`num2 stored: ${num2}`)
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

    clearBtn.addEventListener("click", () => {
        display.textContent = "0";
    });

    allClearBtn.addEventListener("click", () => {
        num1 = null;
        num2 = null;
        result = null;
        operator = null;
        miniDisplayNum1.textContent = "";
        miniDisplayOperator.textContent = "";
        miniDisplayNum2.textContent = "";
        display.textContent = "0";
    });

    plusMinusBtn.addEventListener("click", () => {
        reverseNumber(display.textContent);
    });

    backSpaceBtn.addEventListener("click", () => {
        deleteLastNumber(display.textContent);
    });

    numberBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            updateDisplay(btn.textContent);
        });
    });

    operatorBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            storeNumbers(display.textContent);

            if (btn.textContent != "=") {
                operator = btn.textContent;
                miniDisplayOperator.textContent = operator;
                console.log(`operator stored: ${operator}`)

                if (result != null) {
                    miniDisplayNum1.textContent = result;
                    miniDisplayOperator.textContent = operator;
                    miniDisplayNum2.textContent = "";
                }
            }

            if (num1 != null && num2 != null && operator != null && btn.textContent === "=") {
                result = operate(num1, num2, operator);
                num1 = result;
                num2 = null;
                operatorFlag = true;
            }
        });
    });
});