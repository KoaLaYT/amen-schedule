import dayjs from "dayjs";

export class FormatUtil {

    static padZero(num: number, length: number = 2) {
        let numStr = '' + num;
        while (numStr.length < length) {
            numStr = '0' + numStr;
        }
        return numStr;
    }

    static showWeekday(date: string) {
        return `${date} 周${translate[dayjs(date).day()]}`
    }

}

const translate = ['日', '一', '二', '三', '四', '五', '六']