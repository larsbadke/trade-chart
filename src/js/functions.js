function getFormattedDate(date) {

    if (options.dateFormat == 'de') {

        return date.getDate() + "." + (date.getMonth() + 1);
    }

    return (date.getMonth() + 1) + "/" + date.getDate();
}


function min(a, b) {
    return a < b ? a : b;
}

function max(a, b) {
    return a > b ? a : b;
}



function isFirstTradingDayofMonth(i, data) {

    if(i){

        var currentDay = new Date(data[i].Date);

        var lastDay = new Date(data[i-1].Date);

        return (lastDay.getMonth() != currentDay.getMonth()) ? true : false;
    }

    return false;
}


function daysBetween( date1, date2 ) {

    //Get 1 day in milliseconds
    var one_day=1000*60*60*24;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;

    // Convert back to days and return
    return Math.ceil(difference_ms/one_day);
}