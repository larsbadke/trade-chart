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

        currentDay = new Date(data[i].Date);

        lastDay = new Date(data[i-1].Date);

        return (lastDay.getMonth() != currentDay.getMonth()) ? true : false;
    }

    return false;
}