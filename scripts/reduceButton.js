// First, ensure that the DOM is fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', function () {
    // Select all button elements on the page
    const buttons = document.querySelectorAll('button');
  
    // Iterate over each button and add an 'click' event listener
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        // When a button is clicked, reduce its size to 90%
        this.style.transform = 'scale(0.95)';
  
        // Set a timeout to reset the button size back to normal after 1.5 seconds
        setTimeout(() => {
          this.style.transform = 'scale(1)';
        }, 50);
      });
    });
  });
  