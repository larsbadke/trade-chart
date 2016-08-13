

function Line(x1, x2, y1, y2) {

    var Line = {

        x1: x1,
        x2: x2,
        y1: y1,
        y2: y2,
        color: "black",
        width: 1,
        style: null,

        setColor: function (color) {

            this.color = color;
        },

        setWidth: function (width) {
            this.width = width;
        },

        setStyle: function (style, value) {
            this.style = [style, value];
        },

        draw: function () {

            return chart.append("line")
                .attr("x1", this.x1)
                .attr("x2", this.x2)
                .attr("y1", this.y1)
                .attr("y2", this.y2)
                .attr("stroke", this.color)
                .attr("stroke-width", this.width)
                .style(this.style[0], this.style[1]);
        }

    };

    return Line;
}
