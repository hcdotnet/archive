"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDateCloseEnough = exports.timeFromItchDate = exports.dateFromItchDate = void 0;
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
function getMonth(month) {
    const num = months.indexOf(month) + 1;
    return (num < 10 ? "0" : "") + num;
}
function dateFromItchDate(itchDate) {
    // <day> <month name> <year> @ <hour>:<minute>
    const split = itchDate.split(" ");
    const day = split[0];
    const month = split[1];
    const year = split[2];
    const time = split[4];
    const hour = time.split(":")[0];
    const minute = time.split(":")[1];
    const date = new Date(`${year}-${getMonth(month)}-${day}T${hour}:${minute}:00`);
    date.setHours(date.getHours() - 7); // stupid correction needs checking
    return date;
}
exports.dateFromItchDate = dateFromItchDate;
function timeFromItchDate(itchDate) {
    return dateFromItchDate(itchDate).getTime();
}
exports.timeFromItchDate = timeFromItchDate;
function isDateCloseEnough(left, right, threshold = 10 * 60 * 1000) {
    return Math.abs(left - right) < threshold;
}
exports.isDateCloseEnough = isDateCloseEnough;
