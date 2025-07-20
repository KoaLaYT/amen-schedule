import { ValidateUtil } from "../util/validate.util";
import { AppContext, AppError } from "../type/common";
import { DateUtil } from "../util/date.util";

const SELECT_LESSON_FIELDS = {
  id: true,
  taughtDate: true,
  startTime: true,
  endTime: true,
  fee: true,
};

export class StatHandler {
  /**
   * 计算某一月的课程收入.
   */
  static async all(ctx: AppContext) {
    const month = ctx.query["month"] as string; // 2022-01

    console.log(`calucate lesson fee for month: ${month}`);

    const {
      _sum: { fee },
    } = await ctx.prisma.lesson.aggregate({
      where: {
        teacherId: ctx.teacherId,
        AND: [
          {
            taughtDate: {
              gte: DateUtil.firstDayOfMonth(month),
            },
          },
          {
            taughtDate: {
              lte: DateUtil.lastDayOfMonth(month),
            },
          },
        ],
      },
      _sum: {
        fee: true,
      },
    });

    ctx.body = { fee: Number(fee) };
  }

  /**
   * Total fee for some student in specified date range.
   */
  static async summary(ctx: AppContext) {
    const studentId = +ctx.params.id || 0;
    const startDate = ctx.query["startDate"] as string;
    const endDate = ctx.query["endDate"] as string;

    ValidateUtil.checkDate(startDate, endDate);
    if (studentId < 0)
      AppError.throwBadParams(`Invalid studentId: ${ctx.params.id}`);

    console.log(
      `studentId: ${studentId}, startDate: ${startDate}, endDate: ${endDate}`,
    );

    ctx.body = await ctx.prisma.lesson.findMany({
      where: {
        studentId,
        AND: [
          {
            taughtDate: {
              gte: startDate,
            },
          },
          {
            taughtDate: {
              lte: endDate,
            },
          },
        ],
      },
      orderBy: [{ taughtDate: "desc" }],
      select: SELECT_LESSON_FIELDS,
    });
  }
}
