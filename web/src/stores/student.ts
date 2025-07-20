import { defineStore } from "pinia";
import { StudentApi } from "../api/student.api";
import { CommonUtil } from "../utils/common.util";
import { useLessonStore } from "./lesson";

export interface Student {
    id: number;
    name: string;
    fee: number;
    bgColor: string;
    fgColor: string;
    duration: number;
}

const lessonStore = useLessonStore();

export const useStudentStore = defineStore("student", {
    state: () => ({
        students: [] as Student[],
        isFetching: false,
        isUpdating: false,
        fetched: false,
    }),
    actions: {
        clear() {
            this.$state.fetched = false;
            this.$state.students = [];
        },

        async fetchStudents() {
            CommonUtil.log("fetch students");
            this.$state.isFetching = true;
            this.$state.students = await StudentApi.summary().finally(
                () => (this.$state.isFetching = false),
            );
            this.$state.fetched = true;
        },

        async updateStudent(student: Student) {
            this.$state.isUpdating = true;
            const updated = await StudentApi.update(student);

            if (updated) {
                for (let i = 0; i < this.students.length; i++) {
                    if (this.students[i].id == updated.id) {
                        this.students.splice(i, 1, { ...updated });
                    }
                }

                // 更新颜色
                for (const date of lessonStore.lessons.keys()) {
                    const lessons = lessonStore.lessons.get(date) ?? [];
                    lessons.forEach((it) => {
                        if (it.studentId == updated.id) {
                            it.studentFgColor = updated.fgColor;
                            it.studentBgColor = updated.bgColor;
                        }
                    });
                }
            }

            this.$state.isUpdating = false;
        },

        async createStudent(student: Student) {
            this.$state.isUpdating = true;
            const created = await StudentApi.create(student);
            if (created) {
                this.$state.students.push(created);
            }
            this.$state.isUpdating = false;
        },
    },
});

