class Trade {

    constructor(chart) {

        this.chart = chart;

        this.layers = chart.getLayers();

    };

    stoploss(stopLoss) {

        if(!this.findDay(stopLoss.End, this.chart.Data().all())){

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
    };

    takeprofit(takeProfit) {

        var x1 = this.chart.x(Date.parse(takeProfit.Start));

        var x2 = this.chart.x(Date.parse(takeProfit.End));

        var y1 = this.chart.y(takeProfit.Price);

        var takeProfit = new Line(this.layers[1], x1, x2, y1, y1);

        takeProfit.setColor('green');

        takeProfit.setWidth(2);

        takeProfit.setStyle("stroke-dasharray", "5, 5");

        takeProfit.draw();
    };

    createTriangle(size){

        return d3.symbol()
            .type(d3.symbolTriangle)
            .size(size);
    };

    findDay(date, data){

        var find = false;

        data.forEach(function (d, i) {

            if (date == d.Date) {

                return find = d;
            }
        });

        return (find) ? find : false;

    }

    entry(entry) {

        var chart = this.chart;

        var date = this.findDay(entry.Date, this.chart.Data().candles());

        if(!date){ throw 'Date is not found'; }

        var color = "#11490a";
        var triangleSize = 70;
        var triangle = this.createTriangle(triangleSize);

        var rectangleData = [
            {"x": Date.parse(entry.Date), "y": date.Low}
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
            });
    };

    exit(exit) {

        var chart = this.chart;

        var date = this.findDay(exit.Date, this.chart.Data().candles());

        if(!date){ throw 'Date is not found'; }

        var color = "red";
        var triangleSize = 70;
        var triangle = this.createTriangle(triangleSize);

        var rectangleData = [
            {"x": Date.parse(exit.Date), "y": date.High}
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
    };


}
