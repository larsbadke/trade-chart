function Chart(element, width, height) {

    var chart = {

        data: null,

        width: width,

        height: height,

        margin: {
            top: 5,
            bottom: 30,
            left: 5,
            right: 80
        },

        chart: d3.select(element)
            .append("svg:svg")
            .attr("class", "chart")
            .attr("width", width)
            .attr("height", height),

        setData: function (data) {

            this.data = this.parseData(data);
        },

        getData: function () {

            return this.data;
        },

        layer: function () {

            return this.chart.append('g');
        },

        scale: function () {

            y = d3.scaleLinear()
                .domain([minYValue(this.data), maxYValue(this.data)])
                .range([this.height - this.margin.bottom, this.margin.top]);

            x = d3.scaleTime()
                .domain([new Date(this.data[0].Date), new Date(2015, 8, 10)])
                .range([0, this.width - this.margin.right]);

            return {
                "x": x,
                "y": y
            };
        },

        grid: function (layer) {

            var that = this;

            layer.selectAll("line.y")
                .data(y.ticks(10))
                .enter().append("svg:line")
                .attr("class", "y")
                .attr("x1", that.margin.left)
                .attr("x2", that.width - that.margin.right)
                .attr("y1", y)
                .attr("y2", y)
                .attr("stroke", "#ccc");

            layer.selectAll("line.x")
                .data(x.ticks(d3.timeMonth))
                .enter()
                .append("svg:line")
                .attr("class", "x")
                .attr("x1", x)
                .attr("x2", x)
                .attr("y1", that.margin.top)
                .attr("y2", that.height - that.margin.bottom)
                .attr("stroke", "#ccc");
        },

        axis: function (layer) {

            var that = this;

            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];

            layer.selectAll("text.xrule")
                .data(x.ticks(d3.timeMonth))
                .enter().append("svg:text")
                .attr("class", "xrule")
                .attr("x", x)
                .attr("y", that.height - that.margin.bottom)
                .attr("dy", 20)
                .attr("text-anchor", "middle")
                .text(function (d) {
                    if (d.getMonth() == 0) {
                        return (monthNames[d.getMonth()]) + " " + d.getFullYear();
                    }
                    return (monthNames[d.getMonth()]);
                });

            layer.selectAll("text.yrule")
                .data(y.ticks(10))
                .enter()
                .append("svg:text")
                .attr("class", "yrule")
                .attr("x", that.width - that.margin.right + 10)
                .attr("y", y)
                .attr("dy", 0)
                .attr("dx", 20)
                .attr("text-anchor", "middle")
                .text(function (d) {
                    return d3.format("$,.2f")(d);
                });
        },

        candle: function (layer) {

            var that = this;

            layer.selectAll("rect")
                .data(that.data)
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
                    return 0.5 * (that.width - 2 * that.margin.right) / that.data.length;
                })
                .attr("fill", function (d) {
                    return d.Open > d.Close ? "red" : "green";
                });

            layer.selectAll("line.stem")
                .data(that.data)
                .enter().append("svg:line")
                .attr("class", "stem")
                .attr("x1", function (d) {
                    return x(Date.parse(d.Date)) + 0.25 * (that.width - 2 * that.margin.right) / that.data.length;
                })
                .attr("x2", function (d) {
                    return x(Date.parse(d.Date)) + 0.25 * (that.width - 2 * that.margin.right) / that.data.length;
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
        },

        build: function () {

            layer1 = this.layer();
            layer2 = this.layer();

            var scales = this.scale();

            var x = scales['x'];
            var y = scales['y'];

            this.grid(layer1);
            this.axis(layer2);
            this.candle(layer2);
        },


        header: function (text) {

            this.layer().append("text")
                .attr("x", 5)
                .attr("y", 20)
                .attr("font-family", "sans-serif")
                .attr("font-weight", 600)
                .attr("font-size", "14px")
                .attr("fill", "black")
                .text(text);

        },

        parseData: function (data) {

            for (var i = 0; i < data.length; i++) {

                data[i].timestamp = (new Date(data[i].Date).getTime() / 1000);
            }

            return data.sort(function (x, y) {

                return Date.parse(x.Date) - Date.parse(y.Date);
            });
        }
    };

    return chart;
}

//TODO REFACTOR
function maxXValue(data) {

    var stockMin = d3.max(data.map(function (d) {
        return Date.parse(d.Date);
    }));

    var array = [
        stockMin,
        Date.parse(Stock.StopLoss.End),
        Date.parse(Stock.TakeProfit.End)
    ];

    return Math.max.apply(Math, array);
}

function minXValue(data) {

    var stockMin = d3.min(data.map(function (d) {
        return Date.parse(d.Date);
    }));

    var array = [
        stockMin,
        Date.parse(Stock.StopLoss.Start),
        Date.parse(Stock.TakeProfit.Start)
    ];

    return Math.min.apply(Math, array);
}

function maxYValue(data) {

    var stockMax = d3.max(data.map(function (x) {
        return x["High"];
    }));

    var array = [
        stockMax,
        Stock.TakeProfit.Price,
        Stock.StopLoss.Price
    ];

    return Math.max.apply(Math, array) * 1.01;
}

function minYValue(data) {

    var stockMin = d3.min(data.map(function (x) {
        return x["Low"];
    }));

    var array = [
        stockMin,
        Stock.TakeProfit.Price,
        Stock.StopLoss.Price
    ];

    return Math.min.apply(Math, array) * 0.99;
}



function Trade(chart) {

    var trade = {

        chart: chart,

        layer: chart.layer(),

        stoploss: function (stoppLoss) {


            var x1 = x(Date.parse(stoppLoss.Start));

            var x2 = x(Date.parse(stoppLoss.End));

            var y1 = y(stoppLoss.Price);

            var stopLoss = new Line(this.layer, x1, x2, y1, y1);

            stopLoss.setColor('red');

            stopLoss.setWidth(2);

            stopLoss.setStyle("stroke-dasharray", "5, 5");

            stopLoss.draw();
        },

        takeprofit: function (takeProfit) {

            var x1 = x(Date.parse(takeProfit.Start));

            var x2 = x(Date.parse(takeProfit.End));

            var y1 = y(takeProfit.Price);

            var takeProfit = new Line(this.layer, x1, x2, y1, y1);

            takeProfit.setColor('green');

            takeProfit.setWidth(2);

            takeProfit.setStyle("stroke-dasharray", "5, 5");

            takeProfit.draw();
        },

        entry: function (entry) {

            var low;

            this.chart.getData().forEach(function (d, i) {

                if (entry.Date == d.Date) {

                    low = d.Low;
                }
            });

            var color = "#11490a";
            var triangleSize = 60;

            var triangle = d3.symbol()
                .type(d3.symbolTriangle)
                .size(triangleSize);

            var rectangleData = [
                {"x": Date.parse(entry.Date), "y": low}
            ];


            var rectangleAttributes = this.layer.selectAll(".point")
                .data(rectangleData)
                .enter()
                .append("path")
                .attr("d", triangle)
                .attr('fill', color)
                .attr('stroke', color)
                .attr("transform", function (d) {

                    return "translate(" + (x(d.x) + 2.5) + "," + (y(d.y) + Math.sqrt(triangleSize)) + ")";
                })


        },
        exit: function (exit) {

            var high;

            this.chart.getData().forEach(function (d, i) {

                if (exit.Date == d.Date) {

                    high = d.High;
                }
            });

            var color = "red";
            var triangleSize = 60;

            var triangle = d3.symbol()
                .type(d3.symbolTriangle)
                .size(triangleSize);

            var rectangleData = [
                {"x": Date.parse(exit.Date), "y": high}
            ];


            var rectangleAttributes = this.layer.selectAll(".point")
                .data(rectangleData)
                .enter()
                .append("path")
                .attr("d", triangle)
                .attr('fill', color)
                .attr('stroke', color)
                .attr("transform", function (d) {

                    return "translate(" + (x(d.x) + 2.5) + "," + (y(d.y) - Math.sqrt(triangleSize)) + ") rotate(180)";
                });



        },


    };

    return trade;

}

function getFormattedDate(date) {

    if (options.dateFormat == 'de') {

        return date.getDate() + "." + (date.getMonth() + 1);
    }

    return (date.getMonth() + 1) + "/" + date.getDate();
}


function min(a, b) {
    return a < b ? a : b;
}

function max(a, b) {
    return a > b ? a : b;
}


function Line(layer, x1, x2, y1, y2) {

    var Line = {

        x1: x1,
        x2: x2,
        y1: y1,
        y2: y2,
        color: "black",
        width: 1,
        style: null,

        setColor: function (color) {

            this.color = color;
        },

        setWidth: function (width) {
            this.width = width;
        },

        setStyle: function (style, value) {
            this.style = [style, value];
        },

        draw: function () {

            return layer.append("line")
                .attr("x1", this.x1)
                .attr("x2", this.x2)
                .attr("y1", this.y1)
                .attr("y2", this.y2)
                .attr("stroke", this.color)
                .attr("stroke-width", this.width)
                .style(this.style[0], this.style[1]);
        }

    };

    return Line;
}



// function Trade(x1, x2, y1, y2) {
//
//     var Trade = {
//
//         entryDate: null,
//         entryPrice: null,
//         exitDate: null,
//         exitPrice: null,
//
//         setEntry: function (date, price) {
//
//             this.entryDate = date;
//             this.entryPrice = price;
//         },
//
//         setExit: function (date, price) {
//
//             this.exitDate = date;
//             this.exitPrice = price;
//         },
//
//         draw: function () {
//
//             return chart.append("line")
//                 .attr("x1", this.x1)
//                 .attr("x2", this.x2)
//                 .attr("y1", this.y1)
//                 .attr("y2", this.y2)
//                 .attr("stroke", this.color)
//                 .attr("stroke-width", this.width)
//                 .style(this.style[0], this.style[1]);
//         }
//
//     };
//
//     return Trade;
// }
