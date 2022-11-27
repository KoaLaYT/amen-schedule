import { defineStore } from 'pinia'

export interface Lesson {
    lessonId: number;
    studentId: number;
    studentName: string;
    studentFgColor?: string;
    studentBgColor?: string;
    startAt: string;
    endAt: string;
    fee: number;
}


export const useLessonStore = defineStore('lesson', {
    state: () => ({
        lessons: new Map<string, Lesson[]>(),
        fetched: false,
        isFetching: [] as number[],
        isUpdating: false,
    }),
    actions: {
        async fetchLessons(dateRange: [string, string]) {
            this.$state.isFetching.push(1)
            console.log(`fetch lessons for ${dateRange}, isFetching ${this.isFetching.length}`)
            // TODO use real API
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve('')
                }, 499);
            });
            this.$state.isFetching.pop()
            this.$state.fetched = true;
            console.log(this.$state.lessons, this.$state.isFetching.length)
        },

        async createLesson(date: string, lesson: Lesson) {
            this.$state.isUpdating = true
            const previousLessons = this.$state.lessons.get(date) ?? [];
            const newLessons = await fakeCreateLesson(date, lesson, previousLessons);
            this.$state.lessons.set(date, newLessons);
            this.$state.isUpdating = false;
        },

        async updateLesson(date: string, lesson: Lesson) {
            this.$state.isUpdating = true
            const previousLessons = this.$state.lessons.get(date) ?? [];
            const newLessons = await fakeUpdateLesson(date, lesson, previousLessons);
            this.$state.lessons.set(date, newLessons);
            this.$state.isUpdating = false;
        }
    }
})


async function fakeCreateLesson(date: string, lesson: Lesson, lessons: Lesson[]): Promise<Lesson[]> {
    const { useStudentStore } = await import("./student")
    return new Promise(resolve => {
        // TODO for test
        const studentStore = useStudentStore()
        const student = studentStore.students.find(it => it.id == lesson.studentId)
        const createdLesson = {
            ...lesson,
            lessonId: Date.now(),
            studentFgColor: student?.fgColor,
            studentBgColor: student?.bgColor
        }
        lessons.push(createdLesson)
        setTimeout(() => resolve(lessons), 500)
    })
}

async function fakeUpdateLesson(date: string, lesson: Lesson, lessons: Lesson[]): Promise<Lesson[]> {
    return new Promise(resolve => {
        const oldLesson = lessons.filter(it => it.lessonId == lesson.lessonId)[0]
        const createdLesson = {
            ...lesson,
            studentFgColor: oldLesson?.studentFgColor,
            studentBgColor: oldLesson?.studentBgColor
        }
        lessons = lessons.filter(it => it.lessonId != lesson.lessonId)
        lessons.push(createdLesson)
        setTimeout(() => resolve(lessons), 500)
    })
}