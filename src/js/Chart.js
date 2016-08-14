function Chart(element, width, height) {




    var chart = {

        data: null,

        width: width,

        height: height,

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

            y = d3.scaleLinear()
                .domain([minYValue(this.data), maxYValue(this.data)])
                .range([this.height - this.margin.bottom, this.margin.top]);

            x = d3.scaleTime()
                .domain([new Date(this.data[0].Date), new Date(2015, 9, 1)])
                .range([0, this.width - this.margin.right - this.margin.left]);

            // x = d3.scaleOrdinal().ordinal.domain([new Date(this.data[0].Date), new Date(2015, 9, 1)])
            //     .ordinal.range([0,width]);

            return {
                "x": x,
                "y": y
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

            var scales = this.scale();

            var x = scales['x'];
            var y = scales['y'];

            this.grid(layer1);
            this.axis(layer3);
            this.candle(layer3);
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
                })
                .attr("transform", "translate(" + this.margin.left + ", " + this.margin.top + ")");

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
                })
                .attr("transform", "translate(" + this.margin.left + ", " + this.margin.top + ")");
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


