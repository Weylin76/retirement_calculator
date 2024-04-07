document.getElementById('newBillForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Get the values from the form
  let desc = document.getElementById('desc').value;
  let amount = parseFloat(document.getElementById('amount').value);
  let frequency = document.getElementById('frequency').value;

  // Insert the new row
  let table = document.getElementById('expenseTable').getElementsByTagName('tbody')[0];
  let newRow = table.insertRow(table.rows.length);

  let cell1 = newRow.insertCell(0);
  let cell2 = newRow.insertCell(1);
  let cell3 = newRow.insertCell(2);
  let cell4 = newRow.insertCell(3);

  cell1.textContent = desc;
  cell2.textContent = `$${amount.toFixed(2)}`;
  cell2.className = 'highlight'; // Add the highlight class to the total cell
  cell3.textContent = frequency;

  // Add delete button
  let deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.onclick = function() {
    // Remove the row
    this.closest('tr').remove();
    updateTotal(); // Update the total when a row is deleted
  };
  cell4.appendChild(deleteBtn);

  // Clear the form
  document.getElementById('desc').value = '';
  document.getElementById('amount').value = '';
  document.getElementById('frequency').value = 'Monthly';

  updateTotal(); // Update the total when a new row is added
});

function updateTotal() {
  let totalAnnual = 0;
  let table = document.getElementById('expenseTable').getElementsByTagName('tbody')[0];
  for (let i = 0; i < table.rows.length; i++) {
    let amount = parseFloat(table.rows[i].cells[1].textContent.replace('$', ''));
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
  document.getElementById('totalAmount').textContent = `$${totalAnnual.toFixed(2)}`;
  // Update the text content of the 'annualBillsTotal' element
  document.getElementById('annualBillsTotal').textContent = `${totalAnnual.toFixed(2)}`;
}

// Call updateTotal once at the start in case there are pre-filled rows
updateTotal();

document.getElementById('calculateOverTime').addEventListener('click', function() {
  let retirementAge = parseInt(document.getElementById('retirementAge').value, 10);
  let currentSavings = parseFloat(document.getElementById('projectedSavings').textContent.replace(/[^0-9.]/g, ''));
  let postRetirementYield = parseFloat(document.getElementById('postRetirementYield').value) / 100;
  let annualBills = parseFloat(document.getElementById('annualBillsTotal').textContent.replace('$', ''));
  let socialSecurityMonthly = parseFloat(document.getElementById('socialSecurityBenefit').value || '0');
  let socialSecurityAnnual = socialSecurityMonthly * 12;
  let inflationRate = 0.03; // 3% inflation rate for bills
  let yearsToProject = 30; // Project 30 years into the future
  let tableBody = document.getElementById('retirementTable').getElementsByTagName('tbody')[0];

  tableBody.innerHTML = ''; // Clear previous entries

  for (let age = retirementAge; age < retirementAge + yearsToProject; age++) {
      currentSavings *= (1 + postRetirementYield); // Compound the retirement savings

      if (age >= retirementAge) {
          // Subtract the Social Security benefit from annual bills
          let adjustedAnnualBills = Math.max(0, annualBills - socialSecurityAnnual);
          currentSavings -= adjustedAnnualBills; // Subtract adjusted annual bills from the savings

          let row = tableBody.insertRow();
          let cellAge = row.insertCell(0);
          let cellSavings = row.insertCell(1);
          let cellBills = row.insertCell(2);

          cellAge.textContent = age;
          cellSavings.textContent = `$${currentSavings.toFixed(2)}`;
          cellBills.textContent = `$${adjustedAnnualBills.toFixed(2)}`;

          // Increase the annual bills by the inflation rate for the next year
          annualBills *= (1 + inflationRate);
      } else {
          // Before retirement, just display the savings growth without deducting bills
          let row = tableBody.insertRow();
          let cellAge = row.insertCell(0);
          let cellSavings = row.insertCell(1);
          let cellBills = row.insertCell(2);

          cellAge.textContent = age;
          cellSavings.textContent = `$${currentSavings.toFixed(2)}`;
          cellBills.textContent = `$${annualBills.toFixed(2)}`;
      }
  }
});



  