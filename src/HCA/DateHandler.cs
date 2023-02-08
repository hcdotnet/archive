using System;

namespace HCA;

public static class DateHandler {
    public static int GetMonthIndex(string month) {
        return month switch {
            "January" => 1,
            "February" => 2,
            "March" => 3,
            "April" => 4,
            "May" => 5,
            "June" => 6,
            "July" => 7,
            "August" => 8,
            "September" => 9,
            "October" => 10,
            "November" => 11,
            "December" => 12,
            _ => throw new ArgumentException("Invalid month", nameof(month))
        };
    }

    public static DateTime FromItchDate(string date) {
        // itch.io dates follow the format:
        //   DD Month YYYY @ HH:MM

        var dateParts = date.Split(' ');
        var timeParts = dateParts[4].Split(':');

        var day = int.Parse(dateParts[0]);
        var month = GetMonthIndex(dateParts[1]);
        var year = int.Parse(dateParts[2]);
        var hour = int.Parse(timeParts[0]);
        var minute = int.Parse(timeParts[1]);

        return new DateTime(
            year,
            month,
            day,
            hour,
            minute,
            0,
            DateTimeKind.Utc
        );
    }

    public static DateTimeOffset FromSeconds(long seconds) {
        return DateTimeOffset.FromUnixTimeSeconds(seconds);
    }
}
