class Line {

    constructor(layer, x1, x2, y1, y2) {

        this.layer = layer;
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
        this.color = "black";
        this.width = 1;
        this.style = null;

    }

    setColor(color) {

        this.color = color;
    };

    setWidth(width) {
        this.width = width;
    };

    setStyle(style, value) {
        this.style = [style, value];
    };

    draw() {
        return this.layer.append("line")
            .attr("x1", this.x1)
            .attr("x2", this.x2)
            .attr("y1", this.y1)
            .attr("y2", this.y2)
            .attr("stroke", this.color)
            .attr("stroke-width", this.width)
            .style(this.style[0], this.style[1]);
    };

}
