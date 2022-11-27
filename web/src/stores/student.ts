import { defineStore } from "pinia";
import { useLessonStore } from "./lesson";

export interface Student {
    id: number;
    name: string;
    fee: number;
    bgColor: string;
    fgColor: string;
}

const lessonStore = useLessonStore()

export const useStudentStore = defineStore('student', {
    state: () => ({
        students: [] as Student[],
        isFetching: false,
        isUpdating: false,
        fetched: false
    }),
    actions: {
        async fetchStudents() {
            console.log("fetch students")
            this.$state.isFetching = true;
            this.$state.students = await fakeStudentApi()
                .finally(() => this.$state.isFetching = false)
            this.$state.fetched = true
        },

        async updateStudent(student: Student) {
            this.$state.isUpdating = true;
            const updated = await fakeUpdateStudent(student);

            for (let i = 0; i < this.students.length; i++) {
                if (this.students[i].id == updated.id) {
                    this.students.splice(i, 1, { ...updated })
                }
            }

            // 更新颜色
            for (const date of lessonStore.lessons.keys()) {
                const lessons = lessonStore.lessons.get(date) ?? []
                lessons.forEach(it => {
                    if (it.studentId == updated.id) {
                        it.studentFgColor = updated.fgColor
                        it.studentBgColor = updated.bgColor
                    }
                })
            }

            this.$state.isUpdating = false;
        },

        async createStudent(student: Student) {
            this.$state.isUpdating = true;
            const created = await fakeCreateStudent(student);
            this.$state.students.push(created)
            this.$state.isUpdating = false;
        }
    }
})

async function fakeStudentApi(): Promise<Student[]> {
    return new Promise(resolve => {
        const students = [
            { id: 1, name: 'Amen', fee: 200, bgColor: '#00FFFF', fgColor: '#000000' },
            { id: 2, name: "Koalayt", fee: 150, bgColor: '#EEEEEE', fgColor: '#111111' },
            { id: 3, name: "年糕", fee: 100, bgColor: '#DD00DD', fgColor: '#22DD22' },
        ]
        setTimeout(() => resolve(students), 500)
    })
}

async function fakeUpdateStudent(student: Student): Promise<Student> {
    return new Promise(resolve => {
        setTimeout(() => resolve(student), 500)
    })
}

async function fakeCreateStudent(student: Student): Promise<Student> {
    return new Promise(resolve => {
        setTimeout(() => resolve({
            ...student,
            id: Date.now()
        }), 500)
    })
}