let display = document.getElementById('result');
let currentInput = '';
let operator = '';
let previousInput = '';
let shouldResetDisplay = false;

// Initialize calculator
function init() {
    display.value = '0';
    currentInput = '';
    operator = '';
    previousInput = '';
    shouldResetDisplay = false;
}

// Append number or operator to display
function appendToDisplay(value) {
    if (shouldResetDisplay) {
        display.value = '';
        shouldResetDisplay = false;
    }

    // Handle decimal point
    if (value === '.' && display.value.includes('.')) {
        return;
    }

    // Handle operators
    if (['+', '-', '*', '/'].includes(value)) {
        // If there's already an operator and we have a previous input, calculate first
        if (operator && previousInput && display.value !== '') {
            calculate();
        }
        
        // Only set operator if we have a valid number in display
        if (display.value !== '' && !isNaN(parseFloat(display.value))) {
            operator = value;
            previousInput = display.value;
            shouldResetDisplay = true;
        }
        return;
    }

    // Handle numbers
    if (display.value === '0' && value !== '.') {
        display.value = value;
    } else {
        display.value += value;
    }
    
    currentInput = display.value;
    addDisplayAnimation();
}

// Calculate result
function calculate() {
    if (!operator || !previousInput || display.value === '') {
        return;
    }

    const prev = parseFloat(previousInput);
    const current = parseFloat(display.value);
    
    // Check for valid numbers
    if (isNaN(prev) || isNaN(current)) {
        display.value = 'Error';
        currentInput = '';
        operator = '';
        previousInput = '';
        shouldResetDisplay = true;
        return;
    }

    let result;

    try {
        switch (operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    throw new Error('Division by zero');
                }
                result = prev / current;
                break;
            default:
                return;
        }

        // Round to avoid floating point precision issues
        result = Math.round(result * 100000000) / 100000000;
        
        display.value = result.toString();
        currentInput = display.value;
        operator = '';
        previousInput = '';
        shouldResetDisplay = true;
        addDisplayAnimation();
    } catch (error) {
        display.value = 'Error';
        currentInput = '';
        operator = '';
        previousInput = '';
        shouldResetDisplay = true;
    }
}

// Clear display
function clearDisplay() {
    display.value = '0';
    currentInput = '';
    operator = '';
    previousInput = '';
    shouldResetDisplay = false;
    addDisplayAnimation();
}

// Delete last character
function deleteLast() {
    if (display.value.length > 1) {
        display.value = display.value.slice(0, -1);
        currentInput = display.value;
    } else {
        display.value = '0';
        currentInput = '';
    }
    addDisplayAnimation();
}

// Add animation to display
function addDisplayAnimation() {
    display.classList.add('display-update');
    setTimeout(() => {
        display.classList.remove('display-update');
    }, 200);
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Numbers and decimal
    if (key >= '0' && key <= '9' || key === '.') {
        appendToDisplay(key);
    }
    // Operators
    else if (['+', '-', '*', '/'].includes(key)) {
        appendToDisplay(key);
    }
    // Enter or equals
    else if (key === 'Enter' || key === '=') {
        calculate();
    }
    // Escape or clear
    else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearDisplay();
    }
    // Backspace
    else if (key === 'Backspace') {
        deleteLast();
    }
});

// Initialize calculator on page load
document.addEventListener('DOMContentLoaded', function() {
    init();
});

// Prevent form submission on Enter key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
    }
});
