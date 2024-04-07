document.getElementById('inflationForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    // Get the number of years from the user input
    let years = parseInt(document.getElementById('years').value);
    let currentTotal = parseFloat(document.getElementById('totalAmount').textContent.replace('$', ''));
    
    // Calculate the future cost with 3% inflation per year
    let futureCost = calculateFutureCost(currentTotal, years, 3);
  
    // Update the HTML with the estimated future cost
    document.getElementById('futureYears').textContent = years;
    document.getElementById('estimatedBills').textContent = futureCost.toFixed(2);
  });
  
  function calculateFutureCost(currentTotal, years, inflationRate) {
    let rate = 1 + (inflationRate / 100);
    return currentTotal * Math.pow(rate, years);
  }
  