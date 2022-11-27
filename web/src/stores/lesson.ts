import dayjs from 'dayjs';
import { defineStore } from 'pinia'

export interface Lesson {
    lessonId: number;
    studentId: number;
    studentName: string;
    studentColor?: string;
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
                const [startDate, endDate] = dateRange;
                for (let currentDate = dayjs(startDate); !currentDate.isAfter(endDate); currentDate = currentDate.add(1, 'day')) {
                    this.$state.lessons.set(currentDate.format('YYYY-MM-DD'), [
                        {
                            lessonId: Date.now(),
                            studentId: 1,
                            studentName: "Amen",
                            studentColor: "#" + Math.floor((Math.random() * 0xFFFFFF)).toString(16),
                            startAt: "12:30",
                            endAt: "13:15",
                            fee: 200
                        },
                        Math.random() > 0.6 ? {
                            lessonId: Date.now() + 1,
                            studentId: 1,
                            studentName: "Amen",
                            studentColor: "#" + Math.floor((Math.random() * 0xFFFFFF)).toString(16),
                            startAt: "14:15",
                            endAt: "15:00",
                            fee: 250
                        } : null
                    ].filter(Boolean) as Lesson[])
                }
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
    return new Promise(resolve => {
        const createdLesson = {
            ...lesson,
            lessonId: Date.now(),
            studentColor: "#" + Math.floor((Math.random() * 0xFFFFFF)).toString(16),
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
            studentColor: oldLesson?.studentColor
        }
        lessons = lessons.filter(it => it.lessonId != lesson.lessonId)
        lessons.push(createdLesson)
        setTimeout(() => resolve(lessons), 500)
    })
}