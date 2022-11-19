import dayjs from 'dayjs';
import { defineStore } from 'pinia'

export interface Lesson {
    lessonId: number;
    studentId: number;
    studentName: string;
    studentColor: string;
    startAt: string;
    endAt: string;
}

export const useLessonStore = defineStore('lesson', {
    state: () => ({
        lessons: new Map<string, Lesson[]>(),
        isFetching: [] as number[]
    }),
    actions: {
        async fetchLessons(dateRange: [string, string]) {
            this.$state.isFetching.push(1)
            console.log(`fetch lessons for ${dateRange}, isFetching ${this.isFetching.length}`)
            await new Promise((resolve, reject) => {
                const [startDate, endDate] = dateRange;
                // const oldMap = new Map(this.$state.lessons);
                for (let currentDate = dayjs(startDate); !currentDate.isAfter(endDate); currentDate = currentDate.add(1, 'day')) {
                    this.$state.lessons.set(currentDate.format('YYYY-MM-DD'), [
                        {
                            lessonId: 0,
                            studentId: 0,
                            studentName: "Amen",
                            studentColor: "#" + Math.floor((Math.random() * 0xFFFFFF)).toString(16),
                            startAt: "12:30",
                            endAt: "13:15"
                        },
                        Math.random() > 0.6 ? {
                            lessonId: 0,
                            studentId: 0,
                            studentName: "Amen",
                            studentColor: "#" + Math.floor((Math.random() * 0xFFFFFF)).toString(16),
                            startAt: "14:15",
                            endAt: "15:00"
                        } : null
                    ].filter(Boolean) as Lesson[])
                }
                setTimeout(() => {
                    resolve('')
                }, 499);
            });
            this.$state.isFetching.pop()
            console.log(this.$state.lessons, this.$state.isFetching.length)
        }
    }
})