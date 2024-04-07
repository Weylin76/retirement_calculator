document.getElementById('retirementForm').addEventListener('submit', event => {
    event.preventDefault();
  
    // Get the values from the form
    const currentBalance = parseFloat(document.getElementById('currentBalance').value);
    const currentAge = parseInt(document.getElementById('currentAge').value);
    const retirementAge = parseInt(document.getElementById('retirementAge').value);
    const preRetirementYield = parseFloat(document.getElementById('preRetirementYield').value) / 100;
    const postRetirementYield = parseFloat(document.getElementById('postRetirementYield').value) / 100;
    const projectionAge = parseInt(document.getElementById('projectionAge').value); // Input for projection age
    const includeBills = document.getElementById('includeBills').checked;
    const annualBills = includeBills ? parseFloat(document.getElementById('annualBillsTotal').textContent.replace('$', '')) : 0;
  
    // Calculate the future value with or without bills
    let futureValue = currentBalance;
    if (projectionAge <= retirementAge) {
        // Before retirement
        futureValue = calculateFutureValue(currentBalance, preRetirementYield, projectionAge - currentAge);
    } else {
        // After retirement
        futureValue = calculateFutureValue(currentBalance, preRetirementYield, retirementAge - currentAge);
        for (let year = retirementAge; year < projectionAge; year++) {
            futureValue = (futureValue - annualBills) * (1 + postRetirementYield);
        }
    }
  
    // Update the HTML with the projected savings at the desired age
    document.getElementById('displayRetirementAge').textContent = projectionAge;
    document.getElementById('projectedSavings').textContent = futureValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
});

// Function to calculate future value
const calculateFutureValue = (balance, annualYield, numberOfYears) => {
    for (let year = 1; year <= numberOfYears; year++) {
        balance *= (1 + annualYield);
    }
    return balance;
}
