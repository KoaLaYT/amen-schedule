import { AppContext, AppError } from "../type/common";
import { ValidateUtil } from "../util/validate.util";

const SELECT_LESSON_FIELDS = {
    taughtDate: true,
    startTime: true,
    endTime: true,
    fee: true
}

export class StatHandler {
    /**
     * Total fee for some student in specified date range.
     */
    static async summary(ctx: AppContext) {
        const studentId = +(ctx.params.id) || 0
        const startDate = ctx.query['startDate'] as string
        const endDate = ctx.query['endDate'] as string

        ValidateUtil.checkDate(startDate, endDate)
        if (studentId < 0) AppError.throwBadParams(`Invalid studentId: ${ctx.params.id}`)

        console.log(`studentId: ${studentId}, startDate: ${startDate}, endDate: ${endDate}`)

        ctx.body = await ctx.prisma.lesson.findMany({
            where: {
                studentId,
                AND: [
                    {
                        taughtDate: {
                            gte: startDate
                        }
                    },
                    {
                        taughtDate: {
                            lte: endDate
                        }
                    }
                ]
            },
            orderBy: [{ taughtDate: 'desc' }],
            select: SELECT_LESSON_FIELDS
        })
    }
}