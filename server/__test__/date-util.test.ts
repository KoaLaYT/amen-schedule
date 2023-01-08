import { DateUtil } from "./../src/util/date.util";

const FORMAT = "YYYY-MM-DD";

test("get first day of month and last day of month", async () => {
    const input = "2023-01";
    const firstDayOfMonth = DateUtil.firstDayOfMonth(input);
    const lastDayOfMonth = DateUtil.lastDayOfMonth(input);
    expect(firstDayOfMonth.includes("01-01")).toBeTruthy();
    expect(lastDayOfMonth.includes("01-31")).toBeTruthy();
});
