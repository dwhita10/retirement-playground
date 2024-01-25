// Function to calculate and update graphs for the Value tab
function calculateContribution() {
    // Retrieve input values
    var currentPortfolioValue = parseFloat(document.getElementById("currentPortfolioContribution").value);
    var currentAge = parseInt(document.getElementById("currentAgeContribution").value);
    var retirementAge = parseInt(document.getElementById("retirementAgeContribution").value);
    var rateOfReturn = parseFloat(document.getElementById("rateOfReturnContribution").value) / 100; // convert percentage to decimal
    var currentMonthlyContributions = parseFloat(document.getElementById("monthlyContributionsContribution").value);
    var desiredNestEgg = parseFloat(document.getElementById("desiredNestEggContribution").value);

    // Perform calculations
    var neededMonthlyContributions = (desiredNestEgg - currentPortfolioValue*Math.pow(1+rateOfReturn/12, (retirementAge-currentAge)*12))*(rateOfReturn/12)/(Math.pow(1+rateOfReturn/12, (retirementAge-currentAge)*12)-1);
    
    var valuesCurrent = [];
    var valuesNeeded = [];
    var ageValues = [];

    for (var age = currentAge; age <= retirementAge; age++) {
      // Future value calculation using compound interest formula
      var futureValueCurrent = currentPortfolioValue * Math.pow(1 + rateOfReturn / 12, (age - currentAge) * 12);
      futureValueCurrent += currentMonthlyContributions * ((Math.pow(1 + rateOfReturn / 12, (age - currentAge) * 12) - 1) / (rateOfReturn / 12));
      var futureValueNeeded = currentPortfolioValue * Math.pow(1 + rateOfReturn / 12, (age - currentAge) * 12);
      futureValueNeeded += neededMonthlyContributions * ((Math.pow(1 + rateOfReturn / 12, (age - currentAge) * 12) - 1) / (rateOfReturn / 12));
      valuesCurrent.push(futureValueCurrent.toFixed(2));
      valuesNeeded.push(futureValueNeeded.toFixed(2));
      ageValues.push(age);
    }

    var meetingGoal = (valuesCurrent[valuesCurrent.length - 1] >= valuesNeeded[valuesNeeded.length - 1])
    var finalValueAtRetirement = Math.max(valuesCurrent[valuesCurrent.length - 1], valuesNeeded[valuesNeeded.length - 1]);
    // Plotly graph update
    var data = [
        {
            x: ageValues,
            y: valuesNeeded,
            xaxis: 'x',
            yaxis: 'y',
            type: 'scatter',
            mode: 'lines',
            line: {
                color: '#3498db', // Dark Green
                width: 2

            },
            name: 'Target Contribution Rate'
        },
        {
            x: ageValues,
            y: valuesCurrent,
            xaxis: 'x',
            yaxis: 'y',
            type: 'scatter',
            mode: 'lines',
            line: {
                color: meetingGoal ? '#27ae60' : "#FF0000", // Dark Green
                width: 2
            },
            fill: 'tonexty', // Fill area between the lines and the next trace
            fillcolor: meetingGoal ? 'rgba(39, 174, 96, 0.3)' : 'rgba(80, 5, 5, 0.3)', // Light Red
            name: 'Current Contribution Rate'
        }
    ];

    var layout = {
        xaxis: {
            title: 'Age',
            showgrid: false,
            range: [currentAge - 5, age + 5]
        },
        yaxis: {
            title: 'Portfolio Value ($)',
            showgrid: false,
            range: [0, finalValueAtRetirement * 1.2]
        },
        xaxis2: {
            domain: ['Target', '']
        },
        yaxis2: {
            range: [0, Math.max(neededMonthlyContributions, currentMonthlyContributions) * 1.2],
            visible: false
        },
        showlegend: true,
        legend: {
            xanchor: 'auto',
            x: 0,
            yanchor: 'top',
            y: 1.1
        },
        margin: {t: 0, r: 0, b: 60},
        autosize: true,
        height: 500
    };

    layout.shapes = [
        {
            type: 'line',
            x0: currentAge,
            x1: retirementAge,
            y0: valuesCurrent[valuesCurrent.length - 1],
            y1: valuesCurrent[valuesCurrent.length - 1],
            line: {
                color: meetingGoal ? 'green' : 'red',
                width: 2,
                dash: 'dash',
            },
            label: {
                text: `$${Number(valuesCurrent[valuesCurrent.length - 1]).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
                font: {
                    color: meetingGoal ? 'green' : 'red'
                },
                yanchor: 'bottom',
                textposition: 'start'
            }
        }
    ];

    layout.grid = {
        rows: 2,
        columns: 1,
        subplots: [['xy'],['x2y2']]
    };

    layout.barmode = 'stack';

    var barData = [
        {
          x: ['Target'],
          y: [neededMonthlyContributions],
          type: 'bar',
          name: 'Number 1',
          xaxis: 'x2',
          yaxis: 'y2',
          showlegend: false,
          text: `$${Number(neededMonthlyContributions).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
          marker: {
            color: 'rgb(173, 216, 230)'
          }
        },
        {
          x: ['Current'],
          y: [currentMonthlyContributions],
          type: 'bar',
          name: 'Number 2',
          xaxis: 'x2',
          yaxis: 'y2',
          showlegend: false,
          text: `$${Number(currentMonthlyContributions).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
          marker: {
            color: meetingGoal ? 'rgba(39, 174, 96, 0.8)' : 'rgba(255, 99, 71, 0.8)'
          }
        },
      ];
    


    function tickerAnimation(value, index, targetValue, tickerElement) {
    // Check if the animation is complete
    if (index <= value.length) {
        tickerElement.innerText = `Needed Contribution: $${value.substring(0, index)}`;
        setTimeout(function () {
        // Recursive call for the next character
        tickerAnimation(value, index + 1, targetValue, tickerElement);
        }, 100); // Adjust the timeout duration as needed for the desired speed
    } else {
        // Animation complete, remove 'ticker' class
        tickerElement.classList.remove('ticker');
    }
    }

    var tickerValue = document.getElementById('finalContribution');
    tickerValue.innerText = "";
    tickerValue.classList.add('ticker');

    // Convert the final value to formatted string
    var formattedFinalValue = Number(neededMonthlyContributions).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Start the ticker animation
    tickerAnimation(formattedFinalValue, 0, formattedFinalValue.length, tickerValue);
    Plotly.newPlot('contributionGraph', [...data, ...barData], layout, { staticPlot: true, responsive: true });
}

  // Add event listeners to input fields for automatic updates
var inputFields = ['currentPortfolioContribution', 'currentAgeContribution', 'retirementAgeContribution', 'rateOfReturnContribution', 'monthlyContributionsContribution', 'desiredNestEggContribution'];

inputFields.forEach(function (field) {
    document.getElementById(field).addEventListener('input', calculateContribution);
});

calculateContribution();
