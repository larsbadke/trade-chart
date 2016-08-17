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


