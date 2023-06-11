import dayjs from "dayjs";

export class DateUtil {
  private static FORMAT = "YYYY-MM-DD";

  /**
   * one week after @date
   */
  static oneWeekAfter(date: string) {
    return dayjs(date).add(1, "week").format(this.FORMAT);
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
