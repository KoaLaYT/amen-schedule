import { AppContext, AppError } from "../type/common";
import { ValidateUtil } from "../util/validate.util";

interface CreateLessonDto {
    studentId: number;
    taughtDate: string;
    startTime: string;
    endTime: string;
    fee: number;
}

const SELECT_LESSON_FIELDS = {
    id: true,
    studentId: true,
    taughtDate: true,
    startTime: true,
    endTime: true,
    fee: true
}

export class LessonHandler {
    /**
     * a list of lessons, range from start date to end date.
     */
    static async summary(ctx: AppContext) {
        const startDate = ctx.query['startDate'] as string
        const endDate = ctx.query['endDate'] as string
        ValidateUtil.checkDate(startDate, endDate)

        console.log(`startDate: ${startDate}, endDate: ${endDate}`)

        ctx.body = await ctx.prisma.lesson.findMany({
            where: {
                "AND": [
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
            orderBy: [{ id: 'asc' }],
            select: SELECT_LESSON_FIELDS
        })
    }

    /**
     * create a lesson.
     */
    static async create(ctx: AppContext) {
        const dto = <CreateLessonDto>ctx.request.body
        console.log(`receive dto: `, dto)

        ctx.body = await ctx.prisma.lesson.create({
            data: dto,
            select: SELECT_LESSON_FIELDS
        })
    }

    /**
     * update a lesson.
     */
    static async update(ctx: AppContext) {
        const dto = <CreateLessonDto>ctx.request.body
        const lessonId = +(ctx.params.id) || 0
        if (lessonId <= 0) AppError.throwBadParams(`Invalid lessonId ${ctx.params.id}`)

        console.log(`lessonId: ${lessonId}, dto: `, dto)

        ctx.body = await ctx.prisma.lesson.update({
            where: { id: lessonId },
            data: dto,
            select: SELECT_LESSON_FIELDS
        })
    }

    /**
     * delete a lesson.
     */
    static async delete(ctx: AppContext) {
        const lessonId = +(ctx.params.id) || 0
        if (lessonId <= 0) AppError.throwBadParams(`Invalid lessonId ${ctx.params.id}`)

        console.log(`lessonId: ${lessonId}`)

        await ctx.prisma.lesson.delete({ where: { id: lessonId } })
    }

}
