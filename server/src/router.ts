import Router from "@koa/router"
import { LessonHandler } from "./handler/lesson.handler"
import { StatHandler } from "./handler/stat.handler"
import { StudentHandler } from "./handler/student.handler"
import { AppError } from "./type/common"

const router = new Router()
    // students
    .get("/student/summary", StudentHandler.summary)
    .post("/student", StudentHandler.create)
    .put("/student/:id", StudentHandler.update)
    // lessons
    .get("/lesson/summary", LessonHandler.summary)
    .post("/lesson", LessonHandler.create)
    .put("/lesson/:id", LessonHandler.update)
    .delete("/lesson/:id", LessonHandler.delete)
    // stats
    .get("/stat/:id", StatHandler.summary)
    .all(/.*/, () => { throw new AppError(5001, "no such methods") })

export default router
