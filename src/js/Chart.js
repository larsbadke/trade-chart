function Chart(element, width, height) {


    var chart = {

        data: null,

        width: width,

        height: height,

        x: null,

        y: null,

        layers: [],

        margin: {
            top: 30,
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

            var that = this;

            this.y = d3.scaleLinear()
                .domain([d3.min(this.data, function(d) { return d.Low; }), d3.max(this.data, function(d) { return d.High; })])
                .range([this.height - this.margin.bottom, this.margin.top]).nice();

            var newData = JSON.parse(JSON.stringify(chart.data));

            this.data.push({Date: "2015-09-02"});
            this.data.push({Date: "2015-09-03"});
            this.data.push({Date: "2015-09-04"});
            this.data.push({Date: "2015-09-05"});
            this.data.push({Date: "2015-09-06"});

            this.x = d3.scalePoint()
                .domain(this.data.map(function (d) {
                    return Date.parse(d.Date);
                }))
                .range([this.margin.left, this.width - this.margin.right - this.margin.left ])
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
            this.axis(layer1);
            this.candle(layer2);
        },

        grid: function (layer) {

            var that = this;

            layer.selectAll("line.y")
                .data(this.y.ticks(10))
                .enter().append("svg:line")
                .attr("class", "y")
                .attr("x1", that.margin.left)
                .attr("x2", that.width - that.margin.right -that.margin.left)
                .attr("y1", this.y)
                .attr("y2", this.y)
                .attr("stroke", "#ccc");

            layer.selectAll("line.x")
                .data(this.data.map(function (d, i) {

                    if (isFirstTradingDayofMonth(i, that.data)) {
                        return d.Date;
                    }

                    return null;

                }).filter(function (item) {

                    if (typeof item !== null) {

                        return item;
                    }
                }))
                .enter()
                .append("svg:line")
                .attr("class", "x")
                .attr("x1", function (d, i) {
                    return that.x(Date.parse(d));

                })
                .attr("x2", function (d, i) {
                    return that.x(Date.parse(d));
                })
                .attr("y1", that.margin.top)
                .attr("y2", that.height - that.margin.bottom)
                .attr("stroke", "#ccc");
        },

        axis: function (layer) {

            var that = this;

            var tickValues = this.data.map(function (d, i) {

                if (isFirstTradingDayofMonth(i, that.data)) {
                    return Date.parse(d.Date);
                }

                return null;
            }).filter(function (item) {

                if (typeof item !== null) {

                    return item;
                }
            });


            xAxis = d3.axisBottom(this.x).tickValues(tickValues).tickFormat(function (d) {

                var date = new Date(d);

                var options = {month: 'short'};

                if (date.getMonth() == 0) {

                    options.year = 'numeric';

                    return date.toLocaleDateString(options.locale, options);
                }

                return date.toLocaleDateString(options.locale, options);
            });

            yAxis = d3.axisRight(this.y).tickFormat(d3.format("$,.2f"));


            layer.append("svg")
                .attr("class", "axis")
                .attr("width", that.width - that.margin.right - that.margin.left )
                .attr("height", that.height )
                .append("g")
                .call(xAxis)
                .attr("transform", "translate(0," + (that.height - that.margin.bottom ) + ")");

            layer.append('g').append("svg")
                .attr("class", "axis")
                .attr("y", 0)
                .attr("height", that.height )
                .append("g")
                .call(yAxis)
                .attr("transform", "translate("+(that.width - that.margin.left - that.margin.right )+",0)");

        },

        candle: function (layer) {

            var that = this;

            var candles = JSON.parse(JSON.stringify(chart.data));

            candles = this.data.filter(function (d) {

                if (typeof d.Close !== "undefined") {

                    return d;
                }
            });

            layer.selectAll("rect")
                .data(candles)
                .enter().append("svg:rect")
                .attr("x", function (d) {
                    return that.x(Date.parse(d.Date)) - 0.25 * (that.width - that.margin.right - that.margin.left) / candles.length;
                })
                .attr("y", function (d) {
                    return that.y(max(d.Open, d.Close));
                })
                .attr("height", function (d) {
                    return that.y(min(d.Open, d.Close)) - that.y(max(d.Open, d.Close));
                })
                .attr("width", function (d) {
                    return 0.5 * (that.width - that.margin.right - that.margin.left) / candles.length;
                })
                .attr("fill", function (d) {
                    return d.Open > d.Close ? "red" : "green";
                });

            layer.selectAll("line.stem")
                .data(candles)
                .enter().append("svg:line")
                .attr("class", "stem")
                .attr("x1", function (d) {
                    return that.x(Date.parse(d.Date));
                })
                .attr("x2", function (d) {
                    return that.x(Date.parse(d.Date));
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

            this.chart.append("text")
                .attr("x", 0 + this.margin.left)
                .attr("y", 20)
                .attr("font-family", "sans-serif")
                .attr("font-weight", 400)
                .attr("font-size", "16px")
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

