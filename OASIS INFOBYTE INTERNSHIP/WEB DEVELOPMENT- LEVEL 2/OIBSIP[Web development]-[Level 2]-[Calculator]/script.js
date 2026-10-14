const display = document.querySelector('.display');
const buttons = document.querySelectorAll('.btn');

let currentValue = '0';
let previousValue = null;
let operator = null;
let waitingForNewValue = false;

function updateDisplay() {
  display.textContent = currentValue;
}

function inputNumber(num) {
  if (waitingForNewValue) {
    currentValue = num;
    waitingForNewValue = false;
  } else {
    currentValue = currentValue === '0' ? num : currentValue + num;
  }
}

function inputDecimal() {
  if (waitingForNewValue) {
    currentValue = '0.';
    waitingForNewValue = false;
    return;
  }
  if (!currentValue.includes('.')) {
    currentValue += '.';
  }
}

function clearAll() {
  currentValue = '0';
  previousValue = null;
  operator = null;
  waitingForNewValue = false;
}

function inputPercent() {
  currentValue = String(parseFloat(currentValue) / 100);
}

function calculate(a, b, op) {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case 'x': return a * b;
    case '÷': return b === 0 ? 0 : a / b;
    default: return b;
  }
}

function handleOperator(nextOperator) {
  const inputValue = parseFloat(currentValue);

  if (previousValue === null) {
    previousValue = inputValue;
  } else if (operator && !waitingForNewValue) {
    const result = calculate(previousValue, inputValue, operator);
    currentValue = String(result);
    previousValue = result;
    updateDisplay();
  }

  waitingForNewValue = true;
  operator = nextOperator;
}

function handleEquals() {
  const inputValue = parseFloat(currentValue);

  if (operator && previousValue !== null) {
    const result = calculate(previousValue, inputValue, operator);
    currentValue = String(result);
    previousValue = null;
    operator = null;
    waitingForNewValue = true;
  }
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const label = button.textContent.trim();

    if (button.classList.contains('btn-number') && label !== '.') {
      inputNumber(label);
    } else if (label === '.') {
      inputDecimal();
    } else if (label === 'AC') {
      clearAll();
    } else if (label === '%') {
      inputPercent();
    } else if (label === '=') {
      handleEquals();
    } else if (['÷', 'x', '+', '-'].includes(label)) {
      handleOperator(label);
    }

    updateDisplay();
  });
});

updateDisplay();