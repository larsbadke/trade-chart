class CandlestickChart {

    draw(chart, data, xScale, yScale, width, height, margin){

        chart.selectAll("rect")
            .data(data.candles())
            .enter()
            .append("svg:rect")
            .attr("class", "candles")
            .attr("x", function (d) {
                return xScale(Date.parse(d.Date)) - 0.25 * (width - margin.right) / data.count()
            })
            .attr("y", function (d) {
                return yScale(max(d.Open, d.Close));
            })
            .attr("height", function (d) {
                return yScale(min(d.Open, d.Close)) - yScale(max(d.Open, d.Close));
            })
            .attr("width", function (d) {
                return 0.5 * (width - margin.right) / data.count();
            })
            .attr("fill", function (d) {
                return d.Open > d.Close ? "red" : "green";
            });

        chart.selectAll("line.stem")
            .data(data.candles())
            .enter().append("svg:line")
            .attr("class", "stem")
            .attr("x1", function (d) {
                return xScale(Date.parse(d.Date));
            })
            .attr("x2", function (d) {
                return xScale(Date.parse(d.Date));
            })
            .attr("y1", function (d) {
                return yScale(d.High);
            })
            .attr("y2", function (d) {
                return yScale(d.Low);
            })
            .attr("stroke", function (d) {
                return d.Open > d.Close ? "red" : "green";
            });
    };
}
