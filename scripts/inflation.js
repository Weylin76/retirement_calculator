document.getElementById('inflationForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    // Get the number of years from the user input
    let years = parseInt(document.getElementById('years').value);
    let currentTotal = parseFloat(document.getElementById('totalAmount').textContent.replace('$', ''));
    let retirementAge = document.querySelector('#retirementAge');
    
    // Calculate the future cost with 3% inflation per year
    let futureCost = calculateFutureCost(retirementAge, currentTotal, years, 3);
  
    // Update the HTML with the estimated future cost
    document.getElementById('futureYears').textContent = years;
    document.getElementById('estimatedBills').textContent = futureCost.toFixed(2);
  });
  
  function calculateFutureCost( retirementAge, currentTotal, years, inflationRate) {
    if (years < retirementAge){
     return ""
    } else{
    let rate = 1 + (inflationRate / 100);
    return currentTotal * Math.pow(rate, years);
  }}
  