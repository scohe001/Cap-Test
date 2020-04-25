using System;
using System.Globalization;

namespace CreditCache.Dates
{
  public class DateHelper
  {
    public DateHelper() { }

    // Gets the Calendar instance associated with a CultureInfo.
    private static CultureInfo cultureInfo = new CultureInfo("en-US");
    private static Calendar calendar = cultureInfo.Calendar;
    // Gets the DTFI properties required by GetWeekOfYear.
    private static CalendarWeekRule calendarWeekRule = cultureInfo.DateTimeFormat.CalendarWeekRule;
    private static DayOfWeek firstDayOfWeek = cultureInfo.DateTimeFormat.FirstDayOfWeek;

    public static int GetWeekNum(DateTime dateTime) { 
        return calendar.GetWeekOfYear(dateTime, calendarWeekRule, firstDayOfWeek);
    }

    public static DateTime StartOfWeek(DateTime dateTime)
    {
        int diff = (7 + (dateTime.DayOfWeek - firstDayOfWeek)) % 7;
        return dateTime.AddDays(-1 * diff).Date;
    }
  }
}
