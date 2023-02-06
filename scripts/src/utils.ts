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

function getMonth(month: string): number {
  return months.indexOf(month);
}

export function timeFromItchDate(itchDate: string): number {
  // <day> <month name> <year> @ <hour>:<minute>
  const split = itchDate.split(" ");
  const day = Number(split[0]);
  const month = getMonth(split[1]);
  const year = Number(split[2]);
  const time = split[4];
  const hour = Number(time.split(":")[0]);
  const minute = Number(time.split(":")[1]);

  return Date.UTC(year, month, day, hour, minute);
}

export function isDateCloseEnough(
  build: number,
  itch: number,
  threshold: number = 1 * 60 * 60 // 1 hour
) {
  return build - itch < threshold;
}
