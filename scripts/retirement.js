document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('retirementForm').addEventListener('submit', function(e) {
        e.preventDefault();

        // Get the values from the form elements
        let currentBalance = parseFloat(document.getElementById('currentBalance').value);
        const currentAge = parseInt(document.getElementById('currentAge').value, 10);
        const retirementAge = parseInt(document.getElementById('retirementAge').value, 10);
        const preRetirementYield = parseFloat(document.getElementById('preRetirementYield').value) / 100;
        const contributionAmount = parseFloat(document.getElementById('monthlyContribution').value);
        const payPeriodsPerYear = parseInt(document.getElementById('payPeriodsPerYear').value, 10);
        const inflationRate = 0.03; // 3% inflation rate

        // Calculate savings growth before retirement, including contributions
        for (let age = currentAge; age < retirementAge; age++) {
            let yearlyContribution = contributionAmount * payPeriodsPerYear;
            currentBalance += yearlyContribution; // Add the contributions for the year
            currentBalance *= (1 + preRetirementYield); // Apply growth
            // Adjust the bills for inflation each year
            let annualBills = parseFloat(document.getElementById('annualBillsTotal').textContent.replace(/[^0-9.-]+/g,""));
            annualBills *= (1 + inflationRate);
            document.getElementById('annualBillsTotal').textContent = annualBills.toFixed(2);
        }

        // Update the UI with the calculated savings
        document.getElementById('projectedSavings').textContent = currentBalance.toFixed(2);
    });
});

