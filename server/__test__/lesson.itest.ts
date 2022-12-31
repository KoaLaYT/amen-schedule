import { CreateLessonDto, LessonHandler } from "../src/handler/lesson.handler"
import prisma from "../src/prisma"
import { AppContext } from "../src/type/common"

beforeAll(async () => {
    await prisma.lesson.deleteMany()
    await prisma.student.deleteMany()
})

afterAll(async () => {
    await prisma.$disconnect()
})

test('create lesson', async () => {
    const lesson = <CreateLessonDto>{
        studentId: 1,
        taughtDate: '2021-01-01',
        startTime: '10:00',
        endTime: '11:00',
        fee: 150
    }
    await LessonHandler.create(buildCtx({ request: { body: lesson } }))

    {
        const ctx = buildCtx({
            query: {
                startDate: '2021-01-01',
                endDate: '2021-01-01'
            },
        })
        await LessonHandler.summary(ctx)
        expect(((ctx.body) as any[]).length).toEqual(1)
    }

    {
        const ctx = buildCtx({
            query: {
                startDate: '2022-01-01',
                endDate: '2022-01-01'
            },
        })
        await LessonHandler.summary(ctx)
        expect(((ctx.body) as any[]).length).toEqual(0)
    }
})

function buildCtx(config: any) {
    return <AppContext>{
        prisma,
        body: {} as any,
        ...config,
    }
}