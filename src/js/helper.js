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