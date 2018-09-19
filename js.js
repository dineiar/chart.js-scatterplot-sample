var data;
function getData(date) {
    return data.filter(datePoint => {
        if (datePoint.date == date) {
            return datePoint;
        }
    })[0];
}
function selectDate(date) {
    document.getElementById("chartTitle").innerHTML = date;
    var datePoint = getData(date);

    var datasets = [];
    datePoint.devices.forEach(device => {
        datasets.push({
            label: device.name,
            data: [{
                x: device.x,
                y: device.y,
            }]
        });
    });

    var ctx = document.getElementById("chartCanvas").getContext('2d');
    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false,
            },
            tooltips: {
                elabled: true,
                callbacks: {
                    labelColor: function(tooltipItem, chart) {
                        return {
                            borderColor: 'rgb(255, 0, 0)',
                            backgroundColor: 'rgb(255, 0, 0)'
                        }
                    },
                    label: function(tooltipItem, data) {
                        var r = '';
                        if (data.datasets[tooltipItem.datasetIndex].label) {
                            r = data.datasets[tooltipItem.datasetIndex].label;
                        }
                        if (r) r += ' ';
                        r += '(' + tooltipItem.xLabel + ', ' + tooltipItem.yLabel + ')';
                        return r;
                    }
                }
            },
            scales: {
                xAxes: [{
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 6,
                        stepSize: 1,
                    },
                }],
                yAxes: [{
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 6,
                        stepSize: 1,
                    }
                }]
            }
        }
    });
}

fetch('data.json').then(function(response) {
    return response.json();
}).then(function(jsonData) {
    data = jsonData;
    console.log('wholeData', data);
    
    var chartData = [];
    var datePoints = [];
    data.forEach(datePoint => {
        datePoints.push(datePoint.date);
    });

    var dateSelector = document.getElementById("dateSelector");
    noUiSlider.create(dateSelector, {
        start: 0,
        range: {
            min: 0,
            max: datePoints.length-1
        },
        step: 1,
        // range: {
        //     min: timestamp('2010'),
        //     max: timestamp('2016')
        // },
        // step: 24 * 60 * 60 * 1000, //step of 1 day
        // format: wNumb({
        //     decimals: 0
        // })
    });
    dateSelector.noUiSlider.on('set', function(values, handle, unencoded, tap, positions) {
        selectDate(datePoints[unencoded[0]]);
    });

    selectDate(datePoints[0]);
});
