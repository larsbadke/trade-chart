function buildChart(data, width, height) {

    margin = {
        top: 5,
        bottom: 30,
        left: 5,
        right: 50
    };

    y = d3.scaleLinear()
        .domain([minYValue(data), maxYValue(data)])
        .range([height - margin.bottom, margin.top]);


    x = d3.scaleTime()
        .domain([new Date(data[0].Date), new Date(2016, 1, 31)])
        .range([0, width]);

    // chart grid
    layer1.selectAll("line.y")
        .data(y.ticks(10))
        .enter().append("svg:line")
        .attr("class", "y")
        .attr("x1", margin.left)
        .attr("x2", width - margin.right)
        .attr("y1", y)
        .attr("y2", y)
        .attr("stroke", "#ccc");


    // chart grid
    layer1.selectAll("line.x")
        .data(x.ticks(d3.timeMonth))
        .enter()
        .append("svg:line")
        .attr("class", "x")
        .attr("x1", x)
        .attr("x2", x)
        .attr("y1", margin.top)
        .attr("y2", height - margin.bottom)
        .attr("stroke", "#ccc");


    var xAxis = d3.axisBottom()
        .scale(x)
        .ticks(d3.timeMonth)
        .tickSize(16, 0)
        .tickFormat(d3.timeFormat("%b"));


    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // x scalar
    layer2.selectAll("text.xrule")
        .data(x.ticks(d3.timeMonth))
        .enter().append("svg:text")
        .attr("class", "xrule")
        .attr("x", x)
        .attr("y", height - margin.bottom)
        .attr("dy", 20)
        .attr("text-anchor", "middle")
        .text(function (d) {

            if(d.getMonth() == 0){

                return (monthNames[d.getMonth()]) + " " + d.getFullYear();
            }

            return (monthNames[d.getMonth()]);
        });

    // y scalar
    layer2.selectAll("text.yrule")
        .data(y.ticks(10))
        .enter()
        .append("svg:text")
        .attr("class", "yrule")
        .attr("x", width - margin.right + 10)
        .attr("y", y)
        .attr("dy", 0)
        .attr("dx", 20)
        .attr("text-anchor", "middle")
        .text(String);

    // bodies of candles
    layer2.selectAll("rect")
        .data(data)
        .enter().append("svg:rect")
        .attr("x", function (d) {
            return x(Date.parse(d.Date));
        })
        .attr("y", function (d) {
            return y(max(d.Open, d.Close));
        })
        .attr("height", function (d) {
            return y(min(d.Open, d.Close)) - y(max(d.Open, d.Close));
        })
        .attr("width", function (d) {
            return 0.5 * (width - 2 * margin.right) / data.length;
        })
        .attr("fill", function (d) {
            return d.Open > d.Close ? "red" : "green";
        });


    // sticks of candles
    layer2.selectAll("line.stem")
        .data(data)
        .enter().append("svg:line")
        .attr("class", "stem")
        .attr("x1", function (d) {
            return x(Date.parse(d.Date)) + 0.25 * (width - 2 * margin.right) / data.length;
        })
        .attr("x2", function (d) {
            return x(Date.parse(d.Date)) + 0.25 * (width - 2 * margin.right) / data.length;
        })
        .attr("y1", function (d) {
            return y(d.High);
        })
        .attr("y2", function (d) {
            return y(d.Low);
        })
        .attr("stroke", function (d) {
            return d.Open > d.Close ? "red" : "green";
        });
}



//TODO REFACTOR
function maxXValue(data) {

    var stockMin = d3.max(data.map(function (d) {
        return Date.parse(d.Date);
    }));

    var array = [
        stockMin,
        Date.parse(trade.StopLoss.End),
        Date.parse(trade.TakeProfit.End)
    ];

    return Math.max.apply(Math, array);
}

function minXValue(data) {

    var stockMin = d3.min(data.map(function (d) {
        return Date.parse(d.Date);
    }));

    var array = [
        stockMin,
        Date.parse(trade.StopLoss.Start),
        Date.parse(trade.TakeProfit.Start)
    ];

    return Math.min.apply(Math, array);
}

function maxYValue(data) {

    var stockMax = d3.max(data.map(function (x) {
        return x["High"];
    }));

    var array = [
        stockMax,
        trade.TakeProfit.Value,
        trade.StopLoss.Value
    ];

    return Math.max.apply(Math, array) * 1.01;
}

function minYValue(data) {

    var stockMin = d3.min(data.map(function (x) {
        return x["Low"];
    }));

    var array = [
        stockMin,
        trade.TakeProfit.Value,
        trade.StopLoss.Value
    ];

    return Math.min.apply(Math, array) * 0.99;
}






