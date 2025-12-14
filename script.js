document.addEventListener("DOMContentLoaded", function() {
    const maxDigits = 15;

    let num1 = 0;
    let num2 = 0;
    let operator = "";

    function operate(num1, num2, operator){

    }

    function updateDisplay(number) {
        const display = document.getElementById("display");

        const cleanedNumber = display.textContent
            .split("")
            .filter(char => {return /[0-9\.]/
            .test(char)})
            .join("");

        if ((!display.textContent.includes(".") || number != ".") && cleanedNumber.length < maxDigits) {

            let newNumber = parseFloat(cleanedNumber + number);

            display.textContent = newNumber.toLocaleString(undefined, { 
                maximumFractionDigits: maxDigits });

            if (number === ".") {
                display.textContent = display.textContent + number;
            }
        }
    };

    const numberBtns = document.querySelectorAll(".number-btn");
    numberBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            updateDisplay(btn.textContent);
        });
    });
});