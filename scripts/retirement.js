// Event listener for form submission using arrow function
document.getElementById('retirementForm').addEventListener('submit', event => {
    event.preventDefault();
  
    // Get the values from the form using const for values that do not change
    const currentBalance = parseFloat(document.getElementById('currentBalance').value);
    const currentAge = parseInt(document.getElementById('currentAge').value);
    const retirementAge = parseInt(document.getElementById('retirementAge').value);
    const preRetirementYield = parseFloat(document.getElementById('preRetirementYield').value) / 100;
    const postRetirementYield = parseFloat(document.getElementById('postRetirementYield').value) / 100;
    const projectionAge = parseInt(document.getElementById('projectionAge').value); // Input for projection age
  
    // Determine which yield to use based on projection age
    const yieldToUse = projectionAge <= retirementAge ? preRetirementYield : postRetirementYield;
    const yearsToProjection = projectionAge - currentAge;
    const yearsToRetirement = retirementAge - currentAge;
    const yearsAfterRetirement = projectionAge - retirementAge;
  
    // Calculate the future value
    let futureValue = currentBalance;
    if (yearsToProjection > 0) {
        futureValue = calculateFutureValue(currentBalance, preRetirementYield, Math.min(yearsToProjection, yearsToRetirement));
    }
    if (projectionAge > retirementAge) {
        futureValue = calculateFutureValue(futureValue, postRetirementYield, yearsAfterRetirement);
    }
  
    // Update the HTML with the projected savings at the desired age
    document.getElementById('displayRetirementAge').textContent = projectionAge;
    document.getElementById('projectedSavings').textContent = futureValue.toFixed(2);
});

// Function to calculate future value using arrow function
const calculateFutureValue = (balance, annualYield, numberOfYears) => balance * Math.pow(1 + annualYield, numberOfYears);

// ... your existing code ...

document.getElementById('retirementForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get the values from the form
    let currentBalance = parseFloat(document.getElementById('currentBalance').value);
    let currentAge = parseInt(document.getElementById('currentAge').value, 10);
    let retirementAge = parseInt(document.getElementById('retirementAge').value, 10);
    let projectionAge = parseInt(document.getElementById('projectionAge').value, 10);
    let ageToEndCalculation = parseInt(document.getElementById('ageToEndCalculation').value, 10);
    let annualBillsAfterRetirement = parseFloat(document.getElementById('annualBillsAfterRetirement').value);
    let preRetirementYield = parseFloat(document.getElementById('preRetirementYield').value) / 100;
    let postRetirementYield = parseFloat(document.getElementById('postRetirementYield').value) / 100;
    let includeBills = document.getElementById('includeBills').checked;

    let savings = currentBalance;
    let age = currentAge;

    // Compound savings until retirement
    while (age < retirementAge) {
        savings *= (1 + preRetirementYield);
        age++;
    }

    // Subtract annual bills and compound after retirement until projection age
    while (age <= ageToEndCalculation) {
        if (age >= retirementAge && includeBills) {
            savings -= annualBillsAfterRetirement; // Subtract the annual bills if checkbox is checked
        }
        savings *= (age < projectionAge) ? (1 + postRetirementYield) : 1; // Only apply post-retirement yield until the projection age
        age++;
    }

    // Update the display
    document.getElementById('displayRetirementAge').textContent = ageToEndCalculation.toString();
    document.getElementById('projectedSavings').textContent = savings.toFixed(2);
});


  