class ChartData {

    constructor(data) {

        this.data = this.set(data);
    }

    set(data) {

        return data.sort(function (x, y) {

            return Date.parse(x.Date) - Date.parse(y.Date);
        });
    }

    add(array){

        this.data = this.data.concat(array);
    }

    spaceUntil(date){

        var lastData = this.data[this.data.length -1];

        var fromDate = new Date(lastData.Date);

        var untilDate = new Date(date);

        var days = daysBetween(fromDate, untilDate);

        this.addSpace(days);
    }

    addSpace (days){

        var lastData = this.data[this.data.length -1];

        var date = new Date(lastData.Date);

        var spaces = [];

        for (var i = 0; i < days; i++) {

            date.setDate(date.getDate() + 1);

            var obj = {};

            var month = ("0" + (date.getMonth() + 1)).slice(-2);

            var day = ("0" + date.getDate()).slice(-2);

            obj.Date = date.getFullYear() + '-' + month + '-' + day;

            spaces.push(obj);
        }

        this.add(spaces);
    }

    count(){
        return this.all().length;
    }

    candles()  {
        return this.all().filter(function (d) {if (typeof d.Close !== "undefined") {return d;}});
    }

    all()  {
        return this.data;
    }

}
