// Function to calculate and update graphs for the Value tab
function calculateValue() {
    // Retrieve input values
    var currentPortfolioValue = parseFloat(document.getElementById("currentPortfolio").value);
    var currentAge = parseInt(document.getElementById("currentAge").value);
    var retirementAge = parseInt(document.getElementById("retirementAge").value);
    var rateOfReturn = parseFloat(document.getElementById("rateOfReturn").value) / 100; // convert percentage to decimal
    var monthlyContributions = parseFloat(document.getElementById("monthlyContributions").value);

    // Perform calculations
    var values = [];
    var ageValues = [];

    for (var age = currentAge; age <= retirementAge; age++) {
      // Future value calculation using compound interest formula
      var futureValue = currentPortfolioValue * Math.pow(1 + rateOfReturn / 12, (age - currentAge) * 12);
      futureValue += monthlyContributions * ((Math.pow(1 + rateOfReturn / 12, (age - currentAge) * 12) - 1) / (rateOfReturn / 12));

      values.push(futureValue.toFixed(2));
      ageValues.push(age);
    }
    
    // Plotly graph update
    var trace = [{
        x: ageValues,
        y: values,
        type: 'scatter',
        mode: 'lines',
        line: {
            color: '#27ae60', // Dark Green
            width: 2
        },
        fill: 'tozeroy', // Fill area under the line
        fillcolor: 'rgba(39, 174, 96, 0.3)', // Light Green
    }];

    var layout = {
        xaxis: {
            title: 'Age',
            showgrid: false,
            range: [currentAge-5, age + 5]
        },
        yaxis: {
            title: 'Portfolio Value ($)',
            showgrid: false,
            range: [0, values[values.length - 1] * 1.2]
        },
        showlegend: false,
        margin: {t: 0, r: 0},
    };

    var finalValueAtRetirement = values[values.length - 1];
    layout.shapes = [
        {
            type: 'line',
            x0: currentAge,
            x1: retirementAge,
            y0: finalValueAtRetirement,
            y1: finalValueAtRetirement,
            line: {
                color: 'red',
                width: 2,
                dash: 'dash',
            },
            label: {
              text: `$${Number(finalValueAtRetirement).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
              yanchor: 'bottom',
              textposition: 'start'
            }
        }
    ];

    Plotly.newPlot('valueGraph', trace, layout, { staticPlot: true, responsive: true});

    // Display final value at retirement age with ticker animation
    function tickerAnimation(value, index, targetValue, tickerElement) {
    // Check if the animation is complete
    if (index <= value.length) {
        tickerElement.innerText = `$${value.substring(0, index)}`;
        setTimeout(function () {
        // Recursive call for the next character
        tickerAnimation(value, index + 1, targetValue, tickerElement);
        }, 100); // Adjust the timeout duration as needed for the desired speed
    } else {
        // Animation complete, remove 'ticker' class
        tickerElement.classList.remove('ticker');
    }
    }

    var tickerValue = document.getElementById('finalValue');
    tickerValue.innerText = "";
    tickerValue.classList.add('ticker');

    // Convert the final value to formatted string
    var formattedFinalValue = Number(values[values.length - 1]).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Start the ticker animation
    tickerAnimation(formattedFinalValue, 0, formattedFinalValue.length, tickerValue);
  }

  // Add event listeners to input fields for automatic updates
var inputFields = ['currentPortfolio', 'currentAge', 'retirementAge', 'rateOfReturn', 'monthlyContributions'];

inputFields.forEach(function (field) {
    document.getElementById(field).addEventListener('input', calculateValue);
});

calculateValue();
