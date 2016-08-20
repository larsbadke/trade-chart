class LineChart {

    draw(chart, data, xScale, yScale, width, height, margin){

        var valueLine = d3.line()
            .x(function(d) {return xScale(Date.parse(d.Date)); })
            .y(function(d) { return yScale(d.Close); });

        chart.append("path")
            .datum(data.candles())
            .attr("class", "line")
            .attr("d", valueLine);

    };
}
