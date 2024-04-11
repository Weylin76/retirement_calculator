function calculateProjectedRetirementSavings() {
    let currentBalance = parseFloat(document.getElementById('currentBalance').value);
    const currentAge = parseInt(document.getElementById('currentAge').value, 10);
    const retirementAge = parseInt(document.getElementById('retirementAge').value, 10);
    const preRetirementYield = parseFloat(document.getElementById('preRetirementYield').value) / 100;
    const contributionAmount = parseFloat(document.getElementById('monthlyContribution').value);
    const payPeriodsPerYear = parseInt(document.getElementById('payPeriodsPerYear').value, 10);

    for (let age = currentAge; age < retirementAge; age++) {
        let yearlyContribution = contributionAmount * payPeriodsPerYear;
        currentBalance += yearlyContribution;
        currentBalance *= (1 + preRetirementYield);
    }

    return currentBalance;
}

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('retirementForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const currentBalance = calculateProjectedRetirementSavings();

        // Update the UI with the calculated savings
        document.getElementById('projectedRetirementSavings').textContent = currentBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    });
});



