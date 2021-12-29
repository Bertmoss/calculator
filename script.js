//functions

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

function operate(operator, a, b) {
  if (operator === " + ") {
    return add(a, b);
  } else if (operator === " - ") {
    return subtract(a, b);
  } else if (operator === " * ") {
    return multiply(a, b);
  } else if (operator === " / ") {
    return divide(a / b);
  } else {
    return "This operation is unsupported";
  }
}

const signs = document.querySelectorAll(".operator");
const numbers = document.querySelectorAll(".number");
const buttons = document.querySelectorAll("button");
const display = document.querySelector("#display");
let displayVariable = "";
let firstNumber;
let secondNumber;
let usedSign;

numbers.forEach((number) =>
  number.addEventListener("click", () => {
    if (firstNumber) {
      secondNumber; //clear display variable and if firstNumber already exists then add the numbers to the secondnumber variable otherwise add to first variable
    }
    displayVariable += number.value;
    display.textContent = displayVariable;
  })
);
signs.forEach(
  (sign) =>
    sign.querySelector("click", () => {
      if (firstNumber && secondNumber) {
        firstNumber = operate(usedSign, firstNumber, secondNumber);
        secondNumber = 0;
        usedSign = "";
        usedSign += sign.value;
      } else {
      }
    })
  // idk but this has to signal that the first number is complete so move from displayVariable to firstNumber clear display variable and add the sign to usedSign
);
