import { defineStore } from "pinia";
import { LessonApi, LessonVo } from "../api/lesson.api";
import { CommonUtil } from "../utils/common.util";
import { Student } from "./student";

export interface Lesson {
    lessonId: number;
    studentId: number;
    studentName: string;
    studentFgColor?: string;
    studentBgColor?: string;
    startAt: string;
    endAt: string;
    fee: number;
    duration: number;
}

export const useLessonStore = defineStore("lesson", {
    state: () => ({
        lessons: new Map<string, Lesson[]>(),
        fetched: false,
        isFetching: [] as number[],
        isUpdating: false,
    }),
    actions: {
        clear() {
            this.$state.fetched = false;
            this.$state.lessons = new Map<string, Lesson[]>();
        },

        async fetchLessons(dateRange: [string, string]) {
            this.$state.isFetching.push(1);
            CommonUtil.log(
                `fetch lessons for ${dateRange}, isFetching ${this.isFetching.length}`,
            );

            const lessons = await LessonApi.summary(dateRange);
            const students = await getOrFetchStudents();
            const groupByDateLessons: Map<string, LessonVo[]> =
                groupByDate(lessons);

            for (const date of groupByDateLessons.keys()) {
                const lessonsAtDate = groupByDateLessons.get(date) ?? [];
                this.$state.lessons.set(
                    date,
                    lessonsAtDate.map((it) => convert(it, students)),
                );
            }

            this.$state.isFetching.pop();
            this.$state.fetched = true;
            CommonUtil.log(this.$state.lessons, this.$state.isFetching.length);
        },

        async createLesson(date: string, lesson: Lesson) {
            this.$state.isUpdating = true;
            const previousLessons = this.$state.lessons.get(date) ?? [];
            const created = await LessonApi.create(date, lesson);
            if (created) {
                const students = await getOrFetchStudents();
                previousLessons.push(convert(created, students));
                this.$state.lessons.set(date, [...previousLessons]);
            }
            this.$state.isUpdating = false;
        },

        async updateLesson(date: string, lesson: Lesson) {
            this.$state.isUpdating = true;
            const previousLessons = this.$state.lessons.get(date) ?? [];
            const updated = await LessonApi.update(date, lesson);
            if (updated) {
                const students = await getOrFetchStudents();
                for (let i = 0; i < previousLessons.length; i++) {
                    if (previousLessons[i].lessonId == lesson.lessonId) {
                        previousLessons.splice(
                            i,
                            1,
                            convert(updated, students),
                        );
                    }
                }
                this.$state.lessons.set(date, [...previousLessons]);
            }
            this.$state.isUpdating = false;
        },

        async deleteLesson(date: string, lessonId: number) {
            this.$state.isUpdating = true;
            const previousLessons = this.$state.lessons.get(date) ?? [];
            await LessonApi.delete(lessonId);
            this.$state.lessons.set(
                date,
                previousLessons.filter((it) => it.lessonId != lessonId),
            );
            this.$state.isUpdating = false;
        },
    },
});

function groupByDate(lessons: LessonVo[]) {
    const map = new Map();
    for (const lesson of lessons) {
        if (!map.has(lesson.taughtDate)) {
            map.set(lesson.taughtDate, []);
        }
        map.get(lesson.taughtDate).push(lesson);
    }
    return map;
}

async function getOrFetchStudents() {
    const { useStudentStore } = await import("./student");
    const studentStore = useStudentStore();
    if (!studentStore.fetched) {
        await studentStore.fetchStudents();
    }
    return studentStore.students;
}

function convert(lessonVo: LessonVo, students: Student[]) {
    const student = students.find((it) => it.id == lessonVo.studentId);

    return <Lesson>{
        lessonId: lessonVo.id,
        studentId: student?.id,
        studentName: student?.name,
        studentFgColor: student?.fgColor,
        studentBgColor: student?.bgColor,
        startAt: lessonVo.startTime,
        endAt: lessonVo.endTime,
        fee: lessonVo.fee,
        duration: student?.duration,
    };
}

