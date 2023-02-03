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

function getMonth(month: string): string {
  const num = months.indexOf(month) + 1;
  return (num < 10 ? "0" : "") + num;
}

export function dateFromItchDate(itchDate: string): Date {
  // <day> <month name> <year> @ <hour>:<minute>
  const split = itchDate.split(" ");
  const day = split[0];
  const month = split[1];
  const year = split[2];
  const time = split[4];
  const hour = time.split(":")[0];
  const minute = time.split(":")[1];
  const date = new Date(
    `${year}-${getMonth(month)}-${day}T${hour}:${minute}:00`
  );

  date.setHours(date.getHours() - 7); // stupid correction needs checking

  return date;
}

export function timeFromItchDate(itchDate: string): number {
  return dateFromItchDate(itchDate).getTime();
}

export function isDateCloseEnough(
  build: number,
  itch: number,
  threshold: number = 1 * 60 * 60 // 1 hour
) {
  return build - itch < threshold;
}
