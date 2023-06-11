import { DateUtil } from "./../src/util/date.util";

const FORMAT = "YYYY-MM-DD";

test("get first day of month and last day of month", async () => {
  const input = "2023-01";
  const firstDayOfMonth = DateUtil.firstDayOfMonth(input);
  const lastDayOfMonth = DateUtil.lastDayOfMonth(input);
  expect(firstDayOfMonth.includes("01-01")).toBeTruthy();
  expect(lastDayOfMonth.includes("01-31")).toBeTruthy();
});

test("diffDayBetween should work", async () => {
  {
    const diff = DateUtil.diffDayBetween("2023-06-10", "2023-06-17");
    expect(diff).toEqual(7);
  }
  {
    const diff = DateUtil.diffDayBetween("2023-06-17", "2023-06-10");
    expect(diff).toEqual(7);
  }
});
