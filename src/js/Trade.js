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
