import { defineStore } from "pinia";

export interface Student {
    id: number;
    name: string;
    fee: number;
    bgColor?: string;
    fgColor?: string;
}

export const useStudentStore = defineStore('student', {
    state: () => ({
        students: [] as Student[],
        isFetching: false,
    }),
    actions: {
        async fetchStudents() {
            this.$state.isFetching = true;
            this.$state.students = await fakeStudentApi()
                .finally(() => this.$state.isFetching = false)
        }
    }
})

async function fakeStudentApi(): Promise<Student[]> {
    return new Promise(resolve => {
        const students = [
            { id: 1, name: 'Amen', fee: 200 },
            { id: 2, name: "Koalayt", fee: 150 },
            { id: 3, name: "年糕", fee: 100 }
        ]
        setTimeout(() => resolve(students), 500)
    })
}