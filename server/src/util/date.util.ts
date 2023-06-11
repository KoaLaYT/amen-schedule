import dayjs from "dayjs";

export class DateUtil {
  private static FORMAT = "YYYY-MM-DD";

  /**
   * day diff.
   */
  static diffDayBetween(from: string, to: string) {
    const diff = dayjs(to).diff(from, "day");
    return Math.abs(diff);
  }

  /**
   * day after.
   */
  static dayAfter(date: string, day: number) {
    return dayjs(date).add(day, "day").format(this.FORMAT);
  }

  /**
   * one week after @date
   */
  static oneWeekAfter(date: string) {
    return this.dayAfter(date, 7);
  }

  /**
   * first day of month.
   */
  static firstDayOfMonth(month: string) {
    return dayjs(month).startOf("month").format(this.FORMAT);
  }
  /**
   * last day of month.
   */
  static lastDayOfMonth(month: string) {
    return dayjs(month).endOf("month").format(this.FORMAT);
  }
}
