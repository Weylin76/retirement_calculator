document.getElementById('newBillForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let desc = document.getElementById('desc').value;
    let amount = parseFloat(document.getElementById('amount').value);
    let frequency = document.getElementById('frequency').value;

    let table = document.getElementById('expenseTable').getElementsByTagName('tbody')[0];
    let newRow = table.insertRow(table.rows.length);

    let cell1 = newRow.insertCell(0);
    let cell2 = newRow.insertCell(1);
    let cell3 = newRow.insertCell(2);
    let cell4 = newRow.insertCell(3);

    cell1.textContent = desc;
    cell2.textContent = amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    cell3.textContent = frequency;

    let deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = function() {
        this.closest('tr').remove();
        updateTotal();
    };
    cell4.appendChild(deleteBtn);

    document.getElementById('desc').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('frequency').value = 'Monthly';

    updateTotal();
});


function updateTotal() {
    let totalAnnual = 0;
    let table = document.getElementById('expenseTable').getElementsByTagName('tbody')[0];
    for (let i = 0; i < table.rows.length; i++) {
        let amount = parseFloat(table.rows[i].cells[1].textContent.replace(/[^0-9.]/g, ''));
        let frequency = table.rows[i].cells[2].textContent;
        switch (frequency) {
            case 'Monthly':
                totalAnnual += amount * 12;
                break;
            case 'Yearly':
            case 'One-Time':
                totalAnnual += amount;
                break;
            default:
                console.error('Unknown frequency: ' + frequency);
        }
    }
    document.getElementById('totalAmount').textContent = totalAnnual.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    document.getElementById('annualBillsTotal').textContent = totalAnnual.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function calculateFederalTax(taxableIncome, isMarried) {
    let brackets;

    if (isMarried) {
        // Married filing jointly
        brackets = [
            { threshold: 0, rate: 0.10 },
            { threshold: 22000, rate: 0.12 },
            { threshold: 89450, rate: 0.22 },
            { threshold: 190750, rate: 0.24 },
            { threshold: 364200, rate: 0.32 },
            { threshold: 462500, rate: 0.35 },
            { threshold: 693750, rate: 0.37 }
        ];
    } else {
        // Single filer
        brackets = [
            { threshold: 0, rate: 0.10 },
            { threshold: 11200, rate: 0.12 },
            { threshold: 44725, rate: 0.22 },
            { threshold: 95375, rate: 0.24 },
            { threshold: 182100, rate: 0.32 },
            { threshold: 231250, rate: 0.35 },
            { threshold: 578125, rate: 0.37 }
        ];
    }

    let tax = 0;
    let remainingIncome = taxableIncome;

    for (let i = brackets.length - 1; i >= 0; i--) {
        if (remainingIncome > brackets[i].threshold) {
            tax += (remainingIncome - brackets[i].threshold) * brackets[i].rate;
            remainingIncome = brackets[i].threshold;
        }
    }

    return tax;
}

function calculateCaliforniaTax(taxableIncome, isMarried) {
    let brackets;

    if (isMarried) {
        // Sample brackets for married filing jointly in California
        brackets = [
            { threshold: 0, rate: 0.01 },
            { threshold: 18650, rate: 0.02 },
            { threshold: 44378, rate: 0.04 },
            { threshold: 56084, rate: 0.06 },
            { threshold: 286492, rate: 0.08 },
            { threshold: 359407, rate: 0.093 },
            { threshold: 599012, rate: 0.103 },
            { threshold: 1000000, rate: 0.113 },
            { threshold: 1250000, rate: 0.123 },
            { threshold: 2500000, rate: 0.133 },
        ];
    } else {
        // Sample brackets for single filers in California
        brackets = [
            { threshold: 0, rate: 0.01 },
            { threshold: 9325, rate: 0.02 },
            { threshold: 22184, rate: 0.04 },
            { threshold: 34893, rate: 0.06 },
            { threshold: 48435, rate: 0.08 },
            { threshold: 61214, rate: 0.093 },
            { threshold: 312686, rate: 0.103 },
            { threshold: 375221, rate: 0.113 },
            { threshold: 625369, rate: 0.123 },
            { threshold: 1000000, rate: 0.133 },
        ];
    }

    let tax = 0;
    let remainingIncome = taxableIncome;

    // Calculate tax by applying each bracket's rate to the income in that bracket
    for (let i = brackets.length - 1; i >= 0; i--) {
        if (remainingIncome > brackets[i].threshold) {
            tax += (remainingIncome - brackets[i].threshold) * brackets[i].rate;
            remainingIncome = brackets[i].threshold;
        }
    }

    return tax;
}

function calculateMichiganTax(taxableIncome) {
    const taxRate = 0.0425; // Replace this with the current tax rate if it has changed

    let tax = taxableIncome * taxRate;
    return tax;
}

function calculateBillsAtRetirement(initialBills, inflationRate, yearsToRetirement) {
    return initialBills * Math.pow(1 + inflationRate, yearsToRetirement);
}

// This function updates the display without changing any values
function updateTotalDisplay() {
    let totalAnnual = 0;

    // Your existing logic for calculating total annual expenses...
    document.getElementById('totalAmount').textContent = totalAnnual.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

// Function to apply inflation and social security benefits
function applyAdjustments(initialBills, inflationRate, years, SSAmount, age, SSAge) {
    let adjustedBills = initialBills * Math.pow(1 + inflationRate, years);
    if (age >= SSAge) {
        adjustedBills -= SSAmount;
    }
    return adjustedBills;
}

   // Function to update the retirement table
   function updateRetirementTable() {
    let retirementAge = parseInt(document.getElementById('retirementAge').value, 10);
    let SSAge = parseInt(document.getElementById('SSAge').value, 10);
    let SSAmount = parseFloat(document.getElementById('SSAmount').value) * 12;
    let postRetirementYield = parseFloat(document.getElementById('postRetirementYield').value) / 100;
    let inflationRate = parseFloat(document.querySelector('#inflationPercent').value) / 100;
    let isMarried = document.getElementById('married').checked;
    let tableBody = document.getElementById('retirementTable').getElementsByTagName('tbody')[0];
    // Make sure you have defined currentAge above this function or retrieve it again here
    let currentAge = parseInt(document.getElementById('currentAge').value, 10);

    // Make sure to retrieve the initial bills before calculating the bills at retirement
    let initialBills = parseFloat(document.getElementById('annualBillsTotal').textContent.replace(/[^0-9.]/g, ''));

    // Calculate the bills at retirement after getting the initial bills
    let yearsToRetirement = retirementAge - currentAge;
    let billsAtRetirement = calculateBillsAtRetirement(initialBills, inflationRate, yearsToRetirement);
 
    // Assume calculateProjectedRetirementSavings is a function that calculates the current balance at retirement
    let currentBalanceAtRetirement = calculateProjectedRetirementSavings();

    tableBody.innerHTML = ''; // Clear previous entries

    // Process each year of retirement starting from the retirement age
    for (let age = retirementAge; age <= retirementAge + 40; age++) {
        let years = age - retirementAge;
        let adjustedAnnualBills = applyAdjustments(billsAtRetirement, inflationRate, years, SSAmount, age, SSAge);
    
        // No need to subtract SSAmount again because it's already accounted for in applyAdjustments function.
        let taxableIncome = adjustedAnnualBills + (age >= SSAge ? SSAmount : 0);
    
        let annualTax = calculateFederalTax(taxableIncome, isMarried);
        let stateTax = calculateCaliforniaTax(taxableIncome, isMarried);
    
        // Subtract the bills and taxes only after retirement
        if (age >= retirementAge) {
            currentBalanceAtRetirement -= (annualTax + stateTax + adjustedAnnualBills);
            currentBalanceAtRetirement *= (1 + postRetirementYield);
        }
        // Ensure balance doesn't go negative
        currentBalanceAtRetirement = Math.max(0, currentBalanceAtRetirement);

        // Add the data to the table
        let row = tableBody.insertRow();
        row.insertCell(0).textContent = age;
        row.insertCell(1).textContent = currentBalanceAtRetirement.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        row.insertCell(2).textContent = adjustedAnnualBills.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        row.insertCell(3).textContent = annualTax.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        row.insertCell(4).textContent = stateTax.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }
}

// Ensure this listener is called after the DOM has fully loaded, and retirement.js is available
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('calculateOverTime').addEventListener('click', updateRetirementTable);
});