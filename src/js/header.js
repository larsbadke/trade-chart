function drawHeader( text) {

    layer3.append("text")
        .attr("x", 5)
        .attr("y", 20)
        .attr("font-family", "sans-serif")
        .attr("font-weight", 600)
        .attr("font-size", "14px")
        .attr("fill", "black")
        .text(text);

}