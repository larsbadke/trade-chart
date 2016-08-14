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
