import dayjs from "dayjs";

export class DateUtil {
    private static FORMAT = "YYYY-MM-DD";

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
