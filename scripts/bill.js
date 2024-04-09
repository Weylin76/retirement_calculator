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

document.getElementById('calculateOverTime').addEventListener('click', function() {
    let currentAge = parseInt(document.getElementById('currentAge').value, 10);
    let retirementAge = parseInt(document.getElementById('retirementAge').value, 10);
    let currentBalance = parseFloat(document.getElementById('currentBalance').value);
    let preRetirementYield = parseFloat(document.getElementById('preRetirementYield').value) / 100;
    let postRetirementYield = parseFloat(document.getElementById('postRetirementYield').value) / 100;
    let monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value);
    let payPeriodsPerYear = parseInt(document.getElementById('payPeriodsPerYear').value, 10);
    let inflationRate = parseFloat(document.querySelector('#inflationPercent').value) / 100;
    let tableBody = document.getElementById('retirementTable').getElementsByTagName('tbody')[0];
    let isMarried = document.getElementById('married').checked;

    tableBody.innerHTML = ''; // Clear previous entries

    let annualBills = parseFloat(document.getElementById('annualBillsTotal').textContent.replace(/[^0-9.]/g, ''));

    for (let age = currentAge; age < currentAge + 50; age++) {
        let row = tableBody.insertRow();
        let cellAge = row.insertCell(0);
        let cellSavings = row.insertCell(1);
        let cellBills = row.insertCell(2);
        let cellWithdraw = row.insertCell(3);
        let cellFee = row.insertCell(4);
        let cellTax = row.insertCell(5);
        let cellStateTax = row.insertCell(6);

        let annualFee = currentBalance * 0.003; // 0.3% fee
        let annualWithdrawal = 0; // Placeholder for withdrawal logic
        let annualTax = 0;

        if (age < retirementAge) {
            let annualContribution = monthlyContribution * payPeriodsPerYear;
            currentBalance += annualContribution;
            currentBalance *= (1 + preRetirementYield);
        } else {
            annualBills *= (1 + inflationRate);
            // Define your annual withdrawal logic here
            let taxableIncome = annualWithdrawal + annualBills;
            annualTax = calculateFederalTax(taxableIncome, isMarried);
            stateTax = calculateCaliforniaTax(taxableIncome, isMarried)
            currentBalance -= (annualTax + annualBills + annualFee + stateTax);
            currentBalance *= (1 + postRetirementYield);
        }

        currentBalance = Math.max(0, currentBalance);

        // Updating the table cells with the calculated values
        cellAge.textContent = age;
        cellSavings.textContent = currentBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        cellBills.textContent = (age >= retirementAge) ? annualBills.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '';
        cellWithdraw.textContent = (age >= retirementAge) ? annualWithdrawal.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '';
        cellFee.textContent = (age >= retirementAge) ? annualFee.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '';
        cellTax.textContent = (age >= retirementAge) ? annualTax.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '';
        cellStateTax.textContent = (age >= retirementAge) ? stateTax.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '';
    }
});

updateTotal();











  