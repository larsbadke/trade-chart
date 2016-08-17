function Chart(element, width, height) {




    var chart = {

        data: null,

        width: width,

        height: height,

        x: null,

        y: null,

        layers: [],

        margin: {
            top: 5,
            bottom: 30,
            left: 10,
            right: 70
        },

        chart: null,

        setData: function (data) {

            this.data = this.parseData(data);
        },

        getData: function () {

            return this.data;
        },

        getLayers: function () {

            return this.layers;
        },

        newLayer: function () {

            var layer = this.chart.append('g');

            this.layers.push(layer);

            return layer;
        },

        scale: function () {

            this.y = d3.scaleLinear()
                .domain([minYValue(this.data), maxYValue(this.data)])
                .range([this.height - this.margin.bottom, this.margin.top]);

            this.x = d3.scalePoint()
                .domain(this.data.map(function (d) {
                    return Date.parse(d.Date);
                }))
                .range([this.margin.left, this.width - this.margin.right - this.margin.left])
                .align(0.5);



            
            return {
                "x": this.x,
                "y": this.y
            };
        },

        
        build: function () {

            this.chart = d3.select(element)
                .append("svg:svg")
                .attr("class", "chart")
                .attr("width", width + this.margin.left + this.margin.right)
                .attr("height", height + this.margin.top + this.margin.bottom)
                .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

            layer1 = this.newLayer();
            layer2 = this.newLayer();
            layer3 = this.newLayer();

            this.scale();

            this.grid(layer1);
            this.axis(layer3);
            this.candle(layer3);
        },

        grid: function (layer) {

            var that = this;

            layer.selectAll("line.y")
                .data(this.y.ticks(10))
                .enter().append("svg:line")
                .attr("class", "y")
                .attr("x1", that.margin.left)
                .attr("x2", that.width - that.margin.right)
                .attr("y1", this.y)
                .attr("y2", this.y)
                .attr("stroke", "#ccc");

            layer.selectAll("line.x")
                .data(this.data)
                .enter()
                .append("svg:line")
                .attr("class", "x")
                .attr("x1", function (d, i) {
                    if(isFirstTradingDayofMonth(i, that.data)){
                        return that.x(Date.parse(d.Date));
                    }
                })
                .attr("x2",function (d, i) {
                    if(isFirstTradingDayofMonth(i, that.data)){
                        return that.x(Date.parse(d.Date));
                    }
                })
                .attr("y1", that.margin.top)
                .attr("y2", that.height - that.margin.bottom)
                .attr("stroke", "#ccc");
        },

        axis: function (layer) {

            var that = this;

            layer.selectAll("text.xrule")
                .data(this.data)
                .enter()
                .append("svg:text")
                .attr("class", "xrule")
                .attr("x", function (d, i) {
                    if(isFirstTradingDayofMonth(i, that.data)){

                        return that.x(Date.parse(d.Date));
                    }
                })
                .attr("y", that.height - that.margin.bottom)
                .attr("dy", 20)
                .attr("text-anchor", "middle")
                .text(function (d,i) {

                    if(isFirstTradingDayofMonth(i, that.data)){

                        var date = new Date(d.Date);

                        var options = { month: 'short' };

                        if (date.getMonth() == 0) {

                            options.year = 'numeric';

                            return date.toLocaleDateString(options.locale, options);
                        }

                        return date.toLocaleDateString(options.locale, options);
                    }
                });

            layer.selectAll("text.yrule")
                .data(this.y.ticks(10))
                .enter()
                .append("svg:text")
                .attr("class", "yrule")
                .attr("x", that.width - that.margin.right + 10)
                .attr("y", this.y)
                .attr("dy", 5)
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
                    return that.x(Date.parse(d.Date))-  0.25 * (that.width  - that.margin.right -that.margin.left) / that.data.length;
                })
                .attr("y", function (d) {
                    return that.y(max(d.Open, d.Close));
                })
                .attr("height", function (d) {
                    return that.y(min(d.Open, d.Close)) - that.y(max(d.Open, d.Close));
                })
                .attr("width", function (d) {
                    return 0.5 * (that.width - that.margin.right -that.margin.left) / that.data.length;
                })
                .attr("fill", function (d) {
                    return d.Open > d.Close ? "red" : "green";
                });

            layer.selectAll("line.stem")
                .data(that.data)
                .enter().append("svg:line")
                .attr("class", "stem")
                .attr("x1", function (d) {
                    return that.x(Date.parse(d.Date));
                })
                .attr("x2", function (d) {
                    return that.x(Date.parse(d.Date)) ;
                })
                .attr("y1", function (d) {
                    return that.y(d.High);
                })
                .attr("y2", function (d) {
                    return that.y(d.Low);
                })
                .attr("stroke", function (d) {
                    return d.Open > d.Close ? "red" : "green";
                });
        },


        header: function (text) {

            this.layers[2].append("text")
                .attr("x", 5 + this.margin.left)
                .attr("y", 10 + this.margin.top)
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

        layers: chart.getLayers(),

        stoploss: function (stopLoss) {

            var x1 = this.chart.x(Date.parse(stopLoss.Start));

            var x2 = this.chart.x(Date.parse(stopLoss.End));

            var y1 = this.chart.y(stopLoss.Price);

            var stopLoss = new Line(this.layers[1], x1, x2, y1, y1);

            stopLoss.setColor('red');

            stopLoss.setWidth(2);

            stopLoss.setStyle("stroke-dasharray", "5, 5");

            stopLoss.draw();
        },

        takeprofit: function (takeProfit) {

            var x1 = this.chart.x(Date.parse(takeProfit.Start));

            var x2 = this.chart.x(Date.parse(takeProfit.End));

            var y1 = this.chart.y(takeProfit.Price);



            var takeProfit = new Line(this.layers[1], x1, x2, y1, y1);

            takeProfit.setColor('green');

            takeProfit.setWidth(2);

            takeProfit.setStyle("stroke-dasharray", "5, 5");

            takeProfit.draw();
        },

        entry: function (entry) {

            var low;

            var chart = this.chart;

            this.chart.getData().forEach(function (d, i) {

                if (entry.Date == d.Date) {

                    low = d.Low;
                }
            });

            var color = "#11490a";
            var triangleSize = 70;

            var triangle = d3.symbol()
                .type(d3.symbolTriangle)
                .size(triangleSize);

            var rectangleData = [
                {"x": Date.parse(entry.Date), "y": low}
            ];

            var rectangleAttributes = this.layers[1].selectAll(".point")
                .data(rectangleData)
                .enter()
                .append("path")
                .attr("d", triangle)
                .attr('fill', color)
                .attr('stroke', color)
                .attr("transform", function (d) {

                    return "translate(" + chart.x(d.x) + "," + (chart.y(d.y) + Math.sqrt(triangleSize + 15)) + ")";
                })


        },
        exit: function (exit) {

            var high;

            var chart = this.chart;

            this.chart.getData().forEach(function (d, i) {

                if (exit.Date == d.Date) {

                    high = d.High;
                }
            });

            var color = "red";
            var triangleSize = 70;

            var triangle = d3.symbol()
                .type(d3.symbolTriangle)
                .size(triangleSize);

            var rectangleData = [
                {"x": Date.parse(exit.Date), "y": high}
            ];


            var rectangleAttributes = this.layers[1].selectAll(".point")
                .data(rectangleData)
                .enter()
                .append("path")
                .attr("d", triangle)
                .attr('fill', color)
                .attr('stroke', color)
                .attr("transform", function (d) {

                    return "translate(" + chart.x(d.x) + "," + (chart.y(d.y) - Math.sqrt(triangleSize + 15)) + ") rotate(180)";
                });



        },


    };

    return trade;

}

var de_DE = d3.formatLocale ({
    "decimal": ",",
    "thousands": ".",
    "grouping": [3],
    "currency": ["", "€"],
    "dateTime": "%a %b %e %X %Y",
    "date": "%m/%d/%Y",
    "time": "%H:%M:%S",
    "periods": ["AM", "PM"],
    "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    "shortDays": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    "shortMonths": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});

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



function isFirstTradingDayofMonth(i, data) {

    if(i){

        currentDay = new Date(data[i].Date);

        lastDay = new Date(data[i-1].Date);

        return (lastDay.getMonth() != currentDay.getMonth()) ? true : false;
    }

    return false;
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
