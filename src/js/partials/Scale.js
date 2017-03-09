class Scale {

    constructor(data, width, height, margin) {

        this.data = data;

        this.width = width;

        this.height = height;

        this.margin = margin;
    }

    y() {

        var min = d3.min(this.data, function (d) {
            return parseFloat(d.Low);
        });

        min = min *0.98;

        var max =  d3.max(this.data, function (d) {
            return parseFloat(d.High);
        });

        max = max *1.02;

        return d3.scaleLinear()
            .domain([min, max])
            .range([this.height - this.margin.bottom, this.margin.top]);
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
