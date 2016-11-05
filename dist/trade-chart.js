'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Chart = function () {
    function Chart(element, data, options) {
        _classCallCheck(this, Chart);

        this.element = element;

        this.data = data;

        this.locale = options.hasOwnProperty('locale') ? options.locale : 'en_US';

        this.currency = options.hasOwnProperty('currency') ? options.currency : 'usd';

        this.width = options.hasOwnProperty('width') ? options.width : 1000;

        this.height = options.hasOwnProperty('height') ? options.height : 700;

        this.type = options.hasOwnProperty('type') ? options.type.toLowerCase() : 'line';

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

        this.chart = d3.select(this.element).append("svg:svg")
        // .attr("class", "chart")
        .attr("width", this.width).attr("height", this.height).attr("transform", "translate(" + [this.margin.left, this.margin.top] + ")");
    }

    _createClass(Chart, [{
        key: 'Data',
        value: function Data() {

            return this.data;
        }
    }, {
        key: 'getLayers',
        value: function getLayers() {

            return this.layers;
        }
    }, {
        key: 'newLayer',
        value: function newLayer() {

            var layer = this.chart.append('g');

            this.layers.push(layer);

            return layer;
        }
    }, {
        key: 'scale',
        value: function scale() {

            var scale = new Scale(this.data.all(), this.width, this.height, this.margin);

            this.y = scale.y();

            this.x = scale.x();
        }
    }, {
        key: 'redraw',
        value: function redraw() {

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

            svg.select(".xAxis").call(this.xAxis);

            svg.select(".yAxis").call(this.yAxis);

            var candles = this.chart.selectAll(".candles");

            var stems = this.chart.selectAll(".stem");

            candles.remove();

            stems.remove();

            this.chart.selectAll("rect").data(this.data.filter(function (d) {
                if (typeof d.Close !== "undefined") {
                    return d;
                }
            })).enter().append("svg:rect").attr("class", "candles").attr("x", function (d) {
                return that.x(Date.parse(d.Date)) - 0.25 * (that.width - that.margin.right) / that.data.length;
            }).attr("y", function (d) {
                return that.y(max(d.Open, d.Close));
            }).attr("height", function (d) {
                return that.y(min(d.Open, d.Close)) - that.y(max(d.Open, d.Close));
            }).attr("width", function (d) {
                return 0.5 * (that.width - that.margin.right) / that.data.length;
            }).attr("fill", function (d) {
                return d.Open > d.Close ? "red" : "green";
            });

            this.chart.selectAll("line.stem").data(this.data.filter(function (d) {
                if (typeof d.Close !== "undefined") {
                    return d;
                }
            })).enter().append("svg:line").attr("class", "stem").attr("x1", function (d) {
                return that.x(Date.parse(d.Date));
            }).attr("x2", function (d) {
                return that.x(Date.parse(d.Date));
            }).attr("y1", function (d) {
                return that.y(d.High);
            }).attr("y2", function (d) {
                return that.y(d.Low);
            }).attr("stroke", function (d) {
                return d.Open > d.Close ? "red" : "green";
            });
        }
    }, {
        key: 'draw',
        value: function draw() {

            var layer1 = this.newLayer();

            var layer2 = this.newLayer();

            this.drawAxis(layer1);

            this.drawChart(layer2);
        }
    }, {
        key: 'drawAxis',
        value: function drawAxis(layer) {

            var axis = new Axis(this.data, this.width, this.height, this.margin);

            this.xAxis = axis.x(this.x, this.locale);

            this.yAxis = axis.y(this.y, this.locale, this.currency);

            layer.append('g').attr("class", "Axis").attr("width", this.width - this.margin.right).attr("height", this.height).call(this.xAxis).attr("transform", "translate(0," + (this.height - this.margin.bottom) + ")");

            layer.append('g').attr("class", "Axis").attr("height", this.height).call(this.yAxis).attr("transform", "translate(" + [this.width - this.margin.right, 0] + " )");

            layer.append("line").attr("class", "xAxis").attr("x1", this.margin.left).attr("y1", this.height - this.margin.bottom).attr("x2", this.width - this.margin.right).attr("y2", this.height - this.margin.bottom).attr("fill", "black").attr("stroke", "black");
        }
    }, {
        key: 'drawChart',
        value: function drawChart(layer) {

            var chart = new ChartType(this.type);

            chart.draw(this.chart, this.data, this.x, this.y, this.width, this.height, this.margin);
        }
    }, {
        key: 'header',
        value: function header(text) {

            var that = this;

            this.chart.append("text").attr("x", 0 + that.margin.left).attr("y", 20).attr("font-family", "sans-serif").attr("font-weight", 400).attr("font-size", "16px").attr("fill", "black").text(text);
        }
    }]);

    return Chart;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Redraw = function () {
    function Redraw(x, y) {
        _classCallCheck(this, Redraw);

        this.x = x;
        this.y = y;
    }

    _createClass(Redraw, [{
        key: 'toString',
        value: function toString() {
            return '(' + this.x + ', ' + this.y + ')';
        }
    }]);

    return Redraw;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Trade = function () {
    function Trade(chart) {
        _classCallCheck(this, Trade);

        this.chart = chart;

        this.layers = chart.getLayers();
    }

    _createClass(Trade, [{
        key: "stoploss",
        value: function stoploss(stopLoss) {

            if (!this.findDay(stopLoss.End, this.chart.Data().all())) {

                this.chart.Data().spaceUntil(stopLoss.End);
            }

            var x1 = this.chart.x(Date.parse(stopLoss.Start));

            var x2 = this.chart.x(Date.parse(stopLoss.End));

            var y1 = this.chart.y(stopLoss.Price);

            var stopLoss = new Line(this.layers[1], x1, x2, y1, y1);

            stopLoss.setColor('red');

            stopLoss.setWidth(2);

            stopLoss.setStyle("stroke-dasharray", "5, 5");

            stopLoss.draw();
        }
    }, {
        key: "takeprofit",
        value: function takeprofit(takeProfit) {

            var x1 = this.chart.x(Date.parse(takeProfit.Start));

            var x2 = this.chart.x(Date.parse(takeProfit.End));

            var y1 = this.chart.y(takeProfit.Price);

            var takeProfit = new Line(this.layers[1], x1, x2, y1, y1);

            takeProfit.setColor('green');

            takeProfit.setWidth(2);

            takeProfit.setStyle("stroke-dasharray", "5, 5");

            takeProfit.draw();
        }
    }, {
        key: "createTriangle",
        value: function createTriangle(size) {

            return d3.symbol().type(d3.symbolTriangle).size(size);
        }
    }, {
        key: "findDay",
        value: function findDay(date, data) {

            var find = false;

            data.forEach(function (d, i) {

                if (date == d.Date) {

                    return find = d;
                }
            });

            return find ? find : false;
        }
    }, {
        key: "entry",
        value: function entry(_entry) {

            var chart = this.chart;

            var date = this.findDay(_entry.Date, this.chart.Data().candles());

            if (!date) {
                throw 'Date is not found';
            }

            var color = "#11490a";
            var triangleSize = 70;
            var triangle = this.createTriangle(triangleSize);

            var rectangleData = [{ "x": Date.parse(_entry.Date), "y": date.Low }];

            var rectangleAttributes = this.layers[1].selectAll(".point").data(rectangleData).enter().append("path").attr("d", triangle).attr('fill', color).attr('stroke', color).attr("transform", function (d) {
                return "translate(" + chart.x(d.x) + "," + (chart.y(d.y) + Math.sqrt(triangleSize + 15)) + ")";
            });
        }
    }, {
        key: "exit",
        value: function exit(_exit) {

            var chart = this.chart;

            var date = this.findDay(_exit.Date, this.chart.Data().candles());

            if (!date) {
                throw 'Date is not found';
            }

            var color = "red";
            var triangleSize = 70;
            var triangle = this.createTriangle(triangleSize);

            var rectangleData = [{ "x": Date.parse(_exit.Date), "y": date.High }];

            var rectangleAttributes = this.layers[1].selectAll(".point").data(rectangleData).enter().append("path").attr("d", triangle).attr('fill', color).attr('stroke', color).attr("transform", function (d) {

                return "translate(" + chart.x(d.x) + "," + (chart.y(d.y) - Math.sqrt(triangleSize + 15)) + ") rotate(180)";
            });
        }
    }]);

    return Trade;
}();
"use strict";

var de_DE = d3.formatLocale({
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
"use strict";

function getFormattedDate(date) {

    if (options.dateFormat == 'de') {

        return date.getDate() + "." + (date.getMonth() + 1);
    }

    return date.getMonth() + 1 + "/" + date.getDate();
}

function min(a, b) {
    return a < b ? a : b;
}

function max(a, b) {
    return a > b ? a : b;
}

function isFirstTradingDayofMonth(i, data) {

    if (i) {

        var currentDay = new Date(data[i].Date);

        var lastDay = new Date(data[i - 1].Date);

        return lastDay.getMonth() != currentDay.getMonth() ? true : false;
    }

    return false;
}

function daysBetween(date1, date2) {

    //Get 1 day in milliseconds
    var one_day = 1000 * 60 * 60 * 24;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;

    // Convert back to days and return
    return Math.ceil(difference_ms / one_day);
}
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CandlestickChart = function () {
    function CandlestickChart() {
        _classCallCheck(this, CandlestickChart);
    }

    _createClass(CandlestickChart, [{
        key: "draw",
        value: function draw(chart, data, xScale, yScale, width, height, margin) {

            chart.selectAll("rect").data(data.candles()).enter().append("svg:rect").attr("class", "candles").attr("x", function (d) {
                return xScale(Date.parse(d.Date)) - 0.25 * (width - margin.right) / data.count();
            }).attr("y", function (d) {
                return yScale(max(d.Open, d.Close));
            }).attr("height", function (d) {
                return yScale(min(d.Open, d.Close)) - yScale(max(d.Open, d.Close));
            }).attr("width", function (d) {
                return 0.5 * (width - margin.right) / data.count();
            }).attr("fill", function (d) {
                return d.Open > d.Close ? "red" : "green";
            });

            chart.selectAll("line.stem").data(data.candles()).enter().append("svg:line").attr("class", "stem").attr("x1", function (d) {
                return xScale(Date.parse(d.Date));
            }).attr("x2", function (d) {
                return xScale(Date.parse(d.Date));
            }).attr("y1", function (d) {
                return yScale(d.High);
            }).attr("y2", function (d) {
                return yScale(d.Low);
            }).attr("stroke", function (d) {
                return d.Open > d.Close ? "red" : "green";
            });
        }
    }]);

    return CandlestickChart;
}();
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChartType = function ChartType(type) {
    _classCallCheck(this, ChartType);

    switch (type) {
        case 'candlestick':
            return new CandlestickChart();
            break;
        case 'line':
            return new LineChart();
            break;
    }

    return null;
};
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LineChart = function () {
    function LineChart() {
        _classCallCheck(this, LineChart);
    }

    _createClass(LineChart, [{
        key: "draw",
        value: function draw(chart, data, xScale, yScale, width, height, margin) {

            var valueLine = d3.line().x(function (d) {
                return xScale(Date.parse(d.Date));
            }).y(function (d) {
                return yScale(d.Close);
            });

            chart.append("path").datum(data.candles()).attr("class", "line").attr("d", valueLine);
        }
    }]);

    return LineChart;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Axis = function () {
    function Axis(data, width, height, margin) {
        _classCallCheck(this, Axis);

        this.data = data;

        this.width = width;

        this.height = height;

        this.margin = margin;
    }

    _createClass(Axis, [{
        key: "y",
        value: function y(yScale, locale, currency) {

            var that = this;

            var format = d3.format(",.2f");

            if (locale == "de-DE") {

                format = de_DE.format(",.2f");
            }

            return d3.axisRight(yScale).tickSize(-(this.width - this.margin.right - this.margin.left)).tickFormat(function (d) {

                if (currency == 'eur') {

                    return format(d) + "€";
                }

                return "$" + format(d);
            });
        }
    }, {
        key: "x",
        value: function x(xScale, locale) {

            var that = this;

            var tickValues = this.data.all().map(function (d, i) {

                if (isFirstTradingDayofMonth(i, that.data.all())) {
                    return Date.parse(d.Date);
                }

                return null;
            }).filter(function (item) {

                if (typeof item !== null) {

                    return item;
                }
            });

            return d3.axisBottom(xScale).tickValues(tickValues).tickSize(-(this.height - this.margin.bottom - this.margin.top)).tickSizeOuter(0).tickPadding(10).tickFormat(function (d) {

                var date = new Date(d);

                var options = { month: 'short' };

                if (date.getMonth() == 0) {

                    options.year = 'numeric';

                    return date.toLocaleDateString(locale, options);
                }

                return date.toLocaleDateString(locale, options);
            });
        }
    }]);

    return Axis;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Scale = function () {
    function Scale(data, width, height, margin) {
        _classCallCheck(this, Scale);

        this.data = data;

        this.width = width;

        this.height = height;

        this.margin = margin;
    }

    _createClass(Scale, [{
        key: "y",
        value: function y() {

            return d3.scaleLinear().domain([d3.min(this.data, function (d) {
                return d.Low;
            }), d3.max(this.data, function (d) {
                return d.High;
            })]).range([this.height - this.margin.bottom, this.margin.top]).nice();
        }
    }, {
        key: "x",
        value: function x() {

            return d3.scalePoint().domain(this.data.map(function (d) {
                return Date.parse(d.Date);
            })).range([this.margin.left, this.width - this.margin.right - this.margin.left]).align(0.5);
        }
    }]);

    return Scale;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChartData = function () {
    function ChartData(data) {
        _classCallCheck(this, ChartData);

        this.data = this.set(data);
    }

    _createClass(ChartData, [{
        key: "set",
        value: function set(data) {

            return data.sort(function (x, y) {

                return Date.parse(x.Date) - Date.parse(y.Date);
            });
        }
    }, {
        key: "add",
        value: function add(array) {

            this.data = this.data.concat(array);
        }
    }, {
        key: "spaceUntil",
        value: function spaceUntil(date) {

            var lastData = this.data[this.data.length - 1];

            var fromDate = new Date(lastData.Date);

            var untilDate = new Date(date);

            var days = daysBetween(fromDate, untilDate);

            this.addSpace(days);
        }
    }, {
        key: "addSpace",
        value: function addSpace(days) {

            var lastData = this.data[this.data.length - 1];

            var date = new Date(lastData.Date);

            var spaces = [];

            for (var i = 0; i < days; i++) {

                date.setDate(date.getDate() + 1);

                var obj = {};

                var month = ("0" + (date.getMonth() + 1)).slice(-2);

                var day = ("0" + date.getDate()).slice(-2);

                obj.Date = date.getFullYear() + '-' + month + '-' + day;

                spaces.push(obj);
            }

            this.add(spaces);
        }
    }, {
        key: "count",
        value: function count() {
            return this.all().length;
        }
    }, {
        key: "candles",
        value: function candles() {
            return this.all().filter(function (d) {
                if (typeof d.Close !== "undefined") {
                    return d;
                }
            });
        }
    }, {
        key: "all",
        value: function all() {
            return this.data;
        }
    }]);

    return ChartData;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Line = function () {
    function Line(layer, x1, x2, y1, y2) {
        _classCallCheck(this, Line);

        this.layer = layer;
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
        this.color = "black";
        this.width = 1;
        this.style = null;
    }

    _createClass(Line, [{
        key: "setColor",
        value: function setColor(color) {

            this.color = color;
        }
    }, {
        key: "setWidth",
        value: function setWidth(width) {
            this.width = width;
        }
    }, {
        key: "setStyle",
        value: function setStyle(style, value) {
            this.style = [style, value];
        }
    }, {
        key: "draw",
        value: function draw() {
            return this.layer.append("line").attr("x1", this.x1).attr("x2", this.x2).attr("y1", this.y1).attr("y2", this.y2).attr("stroke", this.color).attr("stroke-width", this.width).style(this.style[0], this.style[1]);
        }
    }]);

    return Line;
}();