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

document.getElementById('calculateOverTime').addEventListener('click', function() {
    let currentAge = parseInt(document.getElementById('currentAge').value, 10);
    let retirementAge = parseInt(document.getElementById('retirementAge').value, 10);
    let currentBalance = parseFloat(document.getElementById('currentBalance').value);
    let preRetirementYield = parseFloat(document.getElementById('preRetirementYield').value) / 100;
    let postRetirementYield = parseFloat(document.getElementById('postRetirementYield').value) / 100;
    let monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value);
    let payPeriodsPerYear = parseInt(document.getElementById('payPeriodsPerYear').value, 10);
    let inflationRate = 0.03; // 3% inflation rate

    let tableBody = document.getElementById('retirementTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear previous entries

    let annualBills = parseFloat(document.getElementById('annualBillsTotal').textContent.replace(/[^0-9.]/g, ''));

    for (let age = currentAge; age < currentAge + 50; age++) {
        let row = tableBody.insertRow();
        let cellAge = row.insertCell(0);
        let cellSavings = row.insertCell(1);
        let cellBills = row.insertCell(2);

        if (age < retirementAge) {
            // Include the contributions only until retirement
            let annualContribution = monthlyContribution * payPeriodsPerYear;
            currentBalance += annualContribution;
            currentBalance *= (1 + preRetirementYield);
        } else {
            // Apply post-retirement yield and subtract annual bills
            currentBalance *= (1 + postRetirementYield);
            currentBalance -= annualBills;
            annualBills *= (1 + inflationRate); // Inflate the bills
        }

        // Prevent the balance from going negative
        currentBalance = Math.max(0, currentBalance);

        // Update the cells with formatted values
        cellAge.textContent = age;
        cellSavings.textContent = currentBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        cellBills.textContent = annualBills.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }
});

updateTotal();





  