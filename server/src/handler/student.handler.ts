import { AppContext, AppError } from "../type/common";

interface CreateStudentDto {
    name: string;
    lessonDuration: number;
    lessonFee: number;
    fontColor: string;
    backgroundColor: string;
}

const SELECT_STUDENT_FIELDS = {
    id: true,
    name: true,
    lessonDuration: true,
    lessonFee: true,
    fontColor: true,
    backgroundColor: true
}

export class StudentHandler {
    /**
     * a list of all students.
     */
    static async summary(ctx: AppContext) {
        ctx.body = await ctx.prisma.student.findMany({
            where: {
                deleteAt: { equals: null }
            },
            orderBy: [{ id: 'asc' }],
            select: SELECT_STUDENT_FIELDS
        })
    }

    /**
     * create a student.
     */
    static async create(ctx: AppContext) {
        const dto = <CreateStudentDto>ctx.request.body
        console.log(`receive dto: `, dto)
        ctx.body = await ctx.prisma.student.create({ data: dto, select: SELECT_STUDENT_FIELDS })
    }

    /**
     * update a student.
     */
    static async update(ctx: AppContext) {
        const dto = <CreateStudentDto>ctx.request.body
        const studentId = +(ctx.params.id) || 0
        if (studentId <= 0) AppError.throwBadParams("invalid studentId")

        console.log(`studentId: ${studentId}, dto: `, dto)

        ctx.body = await ctx.prisma.student.update({
            where: {
                id: studentId
            },
            data: dto,
            select: SELECT_STUDENT_FIELDS
        })
    }
}