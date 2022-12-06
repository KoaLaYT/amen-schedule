import { Lesson } from "../stores/lesson";
import { RestApi } from "./api";

export interface LessonVo extends LessonDto {
    id: number;
}

export interface LessonDto {
    studentId: number;
    taughtDate: string;
    startTime: string;
    endTime: string;
    fee: number;
}

export class LessonApi {
    /**
     * 获取时间范围内的课程信息.
     */
    static async summary(dateRange: [string, string]): Promise<LessonVo[]> {
        return await RestApi.get(`/lesson/summary?startDate=${dateRange[0]}&endDate=${dateRange[1]}`) ?? []
    }
    /**
     * 创建课程.
     */
    static async create(date: string, lesson: Lesson) {
        return await RestApi.post<LessonVo>("/lesson", <LessonDto>{
            studentId: lesson.studentId,
            taughtDate: date,
            startTime: lesson.startAt,
            endTime: lesson.endAt,
            fee: Number(lesson.fee)
        })
    }
    /**
     * 更新课程.
     */
    static async update(date: string, lesson: Lesson) {
        return await RestApi.put<LessonVo>(`/lesson/${lesson.lessonId}`, <LessonDto>{
            studentId: lesson.studentId,
            taughtDate: date,
            startTime: lesson.startAt,
            endTime: lesson.endAt,
            fee: Number(lesson.fee)
        })
    }
    /**
     * 删除课程.
     */
    static async delete(lessonId: number) {
        await RestApi.delete(`/lesson/${lessonId}`)
    }
}