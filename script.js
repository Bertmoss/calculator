//QUERY SELECTORS

const operators = document.querySelectorAll(".operator");
const numbers = document.querySelectorAll(".number");
const buttons = document.querySelectorAll("button");
const display = document.querySelector("#display");
const equalSign = document.querySelector("#equalSign");
const clear = document.querySelector("#clear");
const decimalSign = document.querySelector("#decimalSign");
const backspace = document.querySelector("#backspace");
const positiveNegativeSign = document.querySelector("#positiveNegativeSign");
let notification = document.getElementById("notification");
let infoButton = document.getElementById("infoButton");

//EVENT LISTENERS FOR MOUSE FUNCTIONALITY (keyboard functionality is at the bottom)

numbers.forEach((number) => {
  number.addEventListener("click", () => {
    displayNumber(number);
  });
});

operators.forEach((sign) => {
  sign.addEventListener("click", () => useSign(sign));
});

equalSign.addEventListener("click", useEqualSign);

clear.addEventListener("click", useClear);

decimalSign.addEventListener("click", () => {
  decimalSign.disabled = true;
});

backspace.addEventListener("click", useBackspace);

positiveNegativeSign.addEventListener("click", usePositiveNegativeSign);

infoButton.addEventListener("click", showRoundingNotification);

//CALCULATION OBJECT

let calculation = {
  firstOperand: "",
  secondOperand: "",
  sign: null, //operator used
  ["Not Rounded"]: null, //shows the unrounded result
  // calculation.result is added when  "=" is used, to prevent deleting numbers from the result.
};

//MATH OPERATIONS

function operate(operator, a, b) {
  if (operator === "+") {
    return a + b;
  } else if (operator === "-") {
    return a - b;
  } else if (operator === "*") {
    return a * b;
  } else if (operator === "/") {
    return b === 0 ? "infinity" : a / b;
  } else {
    return "ERROR";
  }
}

///ROUNDING FUNCTIONALITY

//checks whether the number is a decimal
function checkForDecimal(num) {
  return num.toString().includes(".");
}

//checks if the number is too long to be fully displayed
function checkIfTooLong(displayLength, num) {
  return num.toString().length > displayLength ? true : false;
}

//rounds a number that has a decimal
function roundDecimalNum(displayLength, num) {
  let arr = Array.from(num.toString());
  let numAfterDecimal = displayLength - (arr.indexOf(".") + 1);
  console.log(numAfterDecimal);
  return numAfterDecimal > 0 //If decimal point is within the displayLength (a positive integer)
    ? parseFloat(num.toFixed(numAfterDecimal)) //Will show as many numbers after the decimal as possible.
    : Math.round(num); // Otherwise it will just do a basic round operation.
}

//rounds the number if it has a decimal and is over 15 characters
function roundNum(num) {
  if (num === "infinity" || num === "ERROR") {
    return num;
  } else if (checkForDecimal(num) && checkIfTooLong(15, num)) {
    //Since 30 characters is enough to display most numbers, the display number was lowered for decimals to showcase rounding.
    return roundDecimalNum(15, num);
  } else {
    return num;
  }
}

//DISPLAY CHANGES AND NOTIFICATIONS

//changes the margins on the display (makes another row if num > 15)
function adjustDisplaySize(num) {
  if (num.toString().length > 15) {
    display.classList.add("moveDisplayNumUp");
  } else {
    display.classList.remove("moveDisplayNumUp");
  }
}

//if character limit reached adds a notification
function showCharLimitNotification() {
  notification.classList.remove("hidden");
  notification.firstElementChild.textContent = `It seems that your input has exceeded the display size.`;
  notification.setAttribute("style", "height: 70px");
}

//shows info button if result was rounded
function showInfoBtn() {
  if (calculation.firstOperand !== calculation["Not Rounded"]) {
    infoButton.classList.remove("hidden");
  }
}

function hideInfoBtnAndNotification() {
  infoButton.classList.add("hidden");
  notification.classList.add("hidden");
}

//shows notification about rounded result
function showRoundingNotification() {
  notification.classList.remove("hidden");
  notification.setAttribute("style", "height: 130px");
  notification.firstElementChild.textContent = `It seems that your result was a fraction with more than 15 characters. In order to comply with the requirements of the assignement your result was rounded. 
  Your full result is: 
${calculation["Not Rounded"]}`;
}

//CALCULATOR FUNCTIONALITY

//displays numbers and adds them to either the firstOperand or the secondOperand if they fit in the display
function displayNumber(number) {
  if (
    calculation.firstOperand &&
    calculation.result &&
    !checkIfTooLong(30, firstOperand)
  ) {
    calculation.firstOperand = number.value;
    delete calculation.result;
    display.textContent = calculation.firstOperand;
    adjustDisplaySize(calculation.firstOperand);
  } else if (
    (calculation.firstOperand || calculation.firstOperand === 0) &&
    //makes sure it works in case the result was a zero
    calculation.sign !== null &&
    !checkIfTooLong(30, calculation.secondOperand)
  ) {
    calculation.secondOperand += number.value;
    display.textContent = calculation.secondOperand;
    adjustDisplaySize(calculation.secondOperand);
  } else if (
    !checkIfTooLong(30, calculation.firstOperand) &&
    !calculation.secondOperand
  ) {
    calculation.firstOperand += number.value;
    display.textContent = calculation.firstOperand;
    adjustDisplaySize(calculation.firstOperand);
  } else {
    showCharLimitNotification();
  }
}

//uses /, *, -, +,
function useSign(sign) {
  hideInfoBtnAndNotification();
  calculation.sign = sign.value;
  decimalSign.disabled = false;
  if (
    (calculation.firstOperand || calculation.firstOperand === 0) &&
    calculation.secondOperand
  ) {
    calculation["Not Rounded"] = operate(
      calculation.sign,
      +calculation.firstOperand,
      +calculation.secondOperand
    );
    calculation.firstOperand = roundNum(
      operate(
        calculation.sign,
        +calculation.firstOperand,
        +calculation.secondOperand
      )
    );
    calculation.secondOperand = "";
    showInfoBtn();
    adjustDisplaySize(calculation.firstOperand);
    display.textContent = calculation.firstOperand;
  } else {
    delete calculation.result;
  }
}

// uses +/- sign
function usePositiveNegativeSign() {
  if (calculation.secondOperand == display.textContent) {
    calculation.secondOperand *= -1;
    display.textContent = calculation.secondOperand;
  } else {
    calculation.firstOperand *= -1;
    display.textContent = calculation.firstOperand;
  }
}

function useEqualSign() {
  calculation["Not Rounded"] = operate(
    calculation.sign,
    +calculation.firstOperand,
    +calculation.secondOperand
  );
  calculation.firstOperand = roundNum(
    operate(
      calculation.sign,
      +calculation.firstOperand,
      +calculation.secondOperand
    )
  );
  adjustDisplaySize(calculation.firstOperand);
  showInfoBtn();
  calculation.secondOperand = "";
  calculation.sign = null;
  calculation.result = "yes";
  display.textContent = calculation.firstOperand;
  decimalSign.disabled = false;
}

function useClear() {
  hideInfoBtnAndNotification();
  display.classList.remove("moveDisplayNumUp");
  calculation.firstOperand = "";
  calculation.secondOperand = "";
  calculation.sign = null;
  delete calculation.result;
  display.textContent = "";
  decimalSign.disabled = false;
}

function useBackspace() {
  if (calculation.firstOperand && calculation.result) {
    display.textContent = calculation.firstOperand; // cannot delete results
  } else if (calculation.secondOperand == display.textContent) {
    calculation.secondOperand = calculation.secondOperand
      .toString()
      .slice(0, -1);
    display.textContent = calculation.secondOperand;
    if (calculation.firstOperand.toString().length < 15) {
      //makes the  numbers go back down in case the length goes under 15.
      display.classList.remove("moveDisplayNumUp");
    }
  } else {
    calculation.firstOperand = calculation.firstOperand.toString().slice(0, -1);
    display.textContent = calculation.firstOperand;
    if (calculation.firstOperand.toString().length < 15) {
      display.classList.remove("moveDisplayNumUp");
    }
  }
}

//KEYBOARD FUNCTIONALITY

function addButtonActive(key) {
  return key.classList.add("buttonActive");
}
function removeButtonActive(key) {
  return key.classList.remove("buttonActive");
}

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "=":
    case "Enter":
      addButtonActive(equalSign);
      useEqualSign();
      break;
    case "Backspace":
      addButtonActive(backspace);
      useBackspace();
      break;
    case "Delete":
      addButtonActive(clear);
      useClear();
      break;
  }
  numbers.forEach((number) => {
    if (event.key === "." && decimalSign.disabled) {
      //prevents multiple decimal signs
    } else if (event.key === number["value"]) {
      addButtonActive(number);
      displayNumber(number);
    }
  });
  operators.forEach((sign) => {
    if (event.key === sign["value"]) {
      addButtonActive(sign);
      useSign(sign);
    }
  });
});

window.addEventListener("keyup", (event) => {
  buttons.forEach((button) => {
    if (event.key === ".") {
      decimalSign.disabled = true;
      removeButtonActive(button);
    } else {
      removeButtonActive(button);
    }
  });
});
