import dayjs from "dayjs";

export class FormatUtil {
  static padZero(num: number, length: number = 2) {
    let numStr = "" + num;
    while (numStr.length < length) {
      numStr = "0" + numStr;
    }
    return numStr;
  }

  static showWeekday(date: string) {
    return `${date} 周${translate[dayjs(date).day()]}`;
  }

  static formatDate(date: Date) {
    return dayjs(date).format(format);
  }

  static formatFromDate(date: Date, day: number) {
    return dayjs(date).add(day, "day").format(format);
  }

  static formatNow() {
    return dayjs().format(format);
  }

  static formatFromNow(day: number) {
    return dayjs().add(day, "day").format(format);
  }
}

const translate = ["日", "一", "二", "三", "四", "五", "六"];
const format = "YYYY-MM-DD";
