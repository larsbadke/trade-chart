function drawStopLoss(start, end, val) {

    var x1 = x(Date.parse(start));

    var x2 = x(Date.parse(end));

    var y1 = y(val);

    var stopLoss = new Line(x1, x2, y1, y1);

    stopLoss.setColor('red');

    stopLoss.setStyle("stroke-dasharray", "3, 3");

    stopLoss.draw();
}

function drawTakeProfit(start, end, val) {

    var x1 = x(Date.parse(start));

    var x2 = x(Date.parse(end));

    var y1 = y(val);

    var takeProfit = new Line(x1, x2, y1, y1);

    takeProfit.setColor('green');

    takeProfit.setStyle("stroke-dasharray", "3, 3");

    takeProfit.draw();
}



