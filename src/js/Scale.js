class Scale {

    constructor(data, width, height, margin) {

        this.data = data;

        this.width = width;

        this.height = height;

        this.margin = margin;
    }

    y() {

        return d3.scaleLinear()
            .domain([d3.min(this.data, function (d) {
                return d.Low;
            }), d3.max(this.data, function (d) {
                return d.High;
            })])
            .range([this.height - this.margin.bottom, this.margin.top])
            .nice();
    }

    x() {

        return  d3.scalePoint()
            .domain(this.data.map(function (d) {
                return Date.parse(d.Date);
            }))
            .range([this.margin.left, this.width - this.margin.right - this.margin.left])
            .align(0.5);
    }
}
