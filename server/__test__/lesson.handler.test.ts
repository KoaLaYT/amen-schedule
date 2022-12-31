import { Lesson } from "@prisma/client"
import { CreateLessonDto, LessonHandler } from "../src/handler/lesson.handler"
import prisma from "../src/prisma"
import { prismaMock } from "../test.setup"

test('create lesson', async () => {
    const lesson = <CreateLessonDto>{
        studentId: 1,
        taughtDate: '2022-10-01',
        startTime: '10:00',
        endTime: '10:30',
        fee: 150
    }

    const ctx = {
        prisma: prisma,
        request: {
            body: lesson
        },
        body: {} as Lesson
    }

    prismaMock.lesson.create.mockResolvedValue({ id: 1, ...lesson } as any)

    await LessonHandler.create(ctx as any)
    expect(ctx.body.id).toEqual(1)
    expect(ctx.body.studentId).toEqual(lesson.studentId)
})