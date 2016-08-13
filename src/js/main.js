
function Chart(element, width, height) {

    chart = d3.select(element)
        .append("svg:svg")
        .attr("class", "chart")
        .attr("width", width)
        .attr("height", height);

    layer1 = chart.append('g');
    layer2 = chart.append('g');
    layer3 = chart.append('g');

    this.setData = function(data){
        buildChart(parseData(data), width, height);
    };

    this.stoploss = function (start, end , val) {
        drawStopLoss(start, end , val);
    };

    this.takeprofit = function (start, end , val) {
        drawTakeProfit(start, end , val);
    };

    this.drawHeader = function (text) {
        drawHeader(text);
    };

    function parseData(data) {

        for (var i = 0; i < data.length; i++) {

            data[i].timestamp = (new Date(data[i].Date).getTime() / 1000);
        }

        return data.sort(function (x, y) {

            return Date.parse(x.Date) - Date.parse(y.Date);
        });
    }

}







// layer3.append("svg:defs").selectAll("marker")
//     .data(["arrow"])
//     .enter().append("svg:marker")
//     .attr("id", String)
//     .attr("viewBox", "0 -5 10 10")
//     .attr("refX", 10)
//     .attr("refY", 0)
//     .attr("markerWidth", 10)
//     .attr("markerHeight", 10)
//     .attr("orient", "auto")
//     .append("svg:path")
//     .attr("d", "M100,50L10,0L0,0");


// var result = $.grep(data, function (e) {
//
//     // if(e.Date == trade.Entry.Date){
//     //
//     //     // console.log(e);
//     //
//     //     // entry point
//     //     layer3.append("circle")
//     //         .attr("cx", x((new Date(trade.Entry.Date).getTime())))
//     //         .attr("cy", y( (e.Low )))
//     //         .attr("r", 5)
//     //         .attr("fill", "green");
//     // }
//
//
//     // if(e.Date == trade.Exit.Date){
//     //
//     //     // entry point
//     //     layer3.append("circle")
//     //         .attr("cx", x((new Date(trade.Exit.Date).getTime())))
//     //         .attr("cy", y(e.High))
//     //         .attr("r", 5)
//     //         .attr("fill", "red");
//     // }
//
//
// });



