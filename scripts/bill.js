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

function calculateFederalTax(taxableIncome) {
    const brackets = [
        { threshold: 0, rate: 0.10 },
        { threshold: 22000, rate: 0.12 },
        { threshold: 89450, rate: 0.22 },
        { threshold: 190750, rate: 0.24 },
        { threshold: 364200, rate: 0.32 },
        { threshold: 462500, rate: 0.35 },
        { threshold: 693750, rate: 0.37 }
    ];

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

        let annualFee = currentBalance * 0.003; // 0.3% fee
        let annualTax = 0; // Initialize annualTax at the top of the loop
        let annualWithdrawal = 0;

        if (age < retirementAge) {
            let annualContribution = monthlyContribution * payPeriodsPerYear;
            currentBalance += annualContribution;
            currentBalance *= (1 + preRetirementYield);
        } else {
            if (age >= retirementAge) {
                annualBills *= (1 + inflationRate);
                let taxableIncome = annualWithdrawal + annualBills; // Define annualWithdrawal as needed
                annualTax = calculateFederalTax(taxableIncome);
                currentBalance -= annualTax; // Subtract the tax
            }
            currentBalance *= (1 + postRetirementYield);
            currentBalance -= (annualBills + annualFee);
            currentBalance = Math.max(0, currentBalance);
        }

        // Update the table cells with formatted values
        cellAge.textContent = age;
        cellSavings.textContent = currentBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        cellBills.textContent = (age >= retirementAge) ? annualBills.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '';
        cellWithdraw.textContent = (age >= retirementAge) ? annualWithdrawal.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '';
        cellFee.textContent = (age >= retirementAge) ? annualFee.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '';
        cellTax.textContent = (age >= retirementAge) ? annualTax.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '';
    }
});

updateTotal();










  