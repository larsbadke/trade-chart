class Axis {

    constructor(data, width, height, margin) {

        this.data = data;

        this.width = width;

        this.height = height;

        this.margin = margin;
    }

    y(yScale) {

        var that = this;

        return d3.axisRight(yScale)
            .tickSize(-(this.width - this.margin.right - this.margin.left))
            .tickFormat(d3.format("$,.2f"));
    }

    x(xScale) {

        var that = this;

        var tickValues = this.data.all().map(function (d, i) {

            if (isFirstTradingDayofMonth(i, that.data.all())) {
                return Date.parse(d.Date);
            }

            return null;
        }).filter(function (item) {

            if (typeof item !== null) {

                return item;
            }
        });

        return d3.axisBottom(xScale)
            .tickValues(tickValues)
            .tickSize(-(this.height - this.margin.bottom - this.margin.top))
            .tickSizeOuter(0)
            .tickPadding(10)
            .tickFormat(function (d) {

                var date = new Date(d);

                var options = {month: 'short'};

                if (date.getMonth() == 0) {

                    options.year = 'numeric';

                    return date.toLocaleDateString(options.locale, options);
                }

                return date.toLocaleDateString(options.locale, options);
            });

    }
}
