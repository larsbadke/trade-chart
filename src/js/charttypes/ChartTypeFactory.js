class ChartType {

    constructor(type) {

        switch(type) {
            case 'candlestick':
                return new CandlestickChart();
                break;
            case 'line':
                return new LineChart();
                break;
        }

        return null;
    }
}
