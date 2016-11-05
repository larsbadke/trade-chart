class Chart {

    constructor(element, data, options) {

        this.element = element;

        this.data = data;

        this.locale = (options.hasOwnProperty('locale')) ? options.locale : 'en_US';

        this.currency = (options.hasOwnProperty('currency')) ? options.currency : 'usd';

        this.width = (options.hasOwnProperty('width')) ? options.width : 1000;

        this.height = (options.hasOwnProperty('height')) ? options.height : 700;

        this.type = (options.hasOwnProperty('type')) ? options.type.toLowerCase() : 'line';

        this.x = null;

        this.y = null;

        this.xAxis = null;

        this.yAxis = null;

        this.layers = [];

        this.margin = {
            top: 30,
            bottom: 30,
            left: 10,
            right: 70
        };

        this.scale();

        this.chart = d3.select(this.element)
            .append("svg:svg")
            // .attr("class", "chart")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("transform", "translate(" + [this.margin.left, this.margin.top] + ")");
    }

    Data() {

        return this.data;
    };

    getLayers() {

        return this.layers;
    };

    newLayer () {

        var layer = this.chart.append('g');

        this.layers.push(layer);

        return layer;
    };

    scale() {

        var scale = new Scale(this.data.all(), this.width, this.height, this.margin);

        this.y = scale.y();

        this.x = scale.x();
    };

    redraw () {


        // var Redraw = new Redraw(this.chart);

        var that = this;

        var duration = 1;

        this.x.domain(this.data.map(function (d) {
            return Date.parse(d.Date);
        }));

        this.y.domain([d3.min(this.data, function (d) {
            return d.Low;
        }), d3.max(this.data, function (d) {
            return d.High;
        })]).nice();

        var svg = d3.select(element);

        svg.select(".xAxis")
            .call(this.xAxis);

        svg.select(".yAxis")
            .call(this.yAxis);

        var candles = this.chart.selectAll(".candles");

        var stems = this.chart.selectAll(".stem");

        candles.remove();

        stems.remove();

        this.chart.selectAll("rect")
            .data(this.data.filter(function (d) {
                if (typeof d.Close !== "undefined") {
                    return d;
                }
            }))
            .enter()
            .append("svg:rect")
            .attr("class", "candles")
            .attr("x", function (d) {
                return that.x(Date.parse(d.Date)) - 0.25 * (that.width - that.margin.right) / that.data.length;
            })
            .attr("y", function (d) {
                return that.y(max(d.Open, d.Close));
            })
            .attr("height", function (d) {
                return that.y(min(d.Open, d.Close)) - that.y(max(d.Open, d.Close));
            })
            .attr("width", function (d) {
                return 0.5 * (that.width - that.margin.right) / that.data.length;
            })
            .attr("fill", function (d) {
                return d.Open > d.Close ? "red" : "green";
            });

        this.chart.selectAll("line.stem")
            .data(this.data.filter(function (d) {
                if (typeof d.Close !== "undefined") {
                    return d;
                }
            }))
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
    };


    draw () {

        var layer1 = this.newLayer();

        var layer2 = this.newLayer();

        this.drawAxis(layer1);

        this.drawChart(layer2);
    };

    drawAxis(layer) {

        var axis = new Axis(this.data, this.width, this.height, this.margin);

        this.xAxis = axis.x(this.x, this.locale);

        this.yAxis = axis.y(this.y, this.locale, this.currency);

        layer.append('g')
            .attr("class", "Axis")
            .attr("width", this.width - this.margin.right)
            .attr("height", this.height)
            .call(this.xAxis)
            .attr("transform", "translate(0," + (this.height - this.margin.bottom ) + ")");

        layer.append('g')
            .attr("class", "Axis")
            .attr("height", this.height)
            .call(this.yAxis)
            .attr("transform", "translate(" + [this.width - this.margin.right, 0] + " )");


        layer.append("line")
            .attr("class", "xAxis")
            .attr("x1", this.margin.left)
            .attr("y1", this.height - this.margin.bottom)
            .attr("x2", this.width - this.margin.right)
            .attr("y2", this.height - this.margin.bottom)
            .attr("fill", "black")
            .attr("stroke", "black");
    };

    drawChart(layer) {

        var chart = new ChartType(this.type);

        chart.draw(this.chart, this.data, this.x, this.y, this.width, this.height, this.margin);
    };

    header (text) {

        var that = this;

        this.chart.append("text")
            .attr("x", (0 + that.margin.left))
            .attr("y", 20)
            .attr("font-family", "sans-serif")
            .attr("font-weight", 400)
            .attr("font-size", "16px")
            .attr("fill", "black")
            .text(text);
    };



}

