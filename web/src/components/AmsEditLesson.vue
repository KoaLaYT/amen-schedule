<template>
    <div class="ams-edit-lesson">
        <div class="ams-edit-lesson__title">{{ title }}</div>
        <van-form @submit="onSubmit">
            <van-cell-group inset>
                <van-field v-model="lesson.studentName" is-link readonly name="studentName" label="孩儿"
                    @click="pickerShow.studentName = true" />
                <van-popup v-model:show="pickerShow.studentName" round position="bottom" :style="{ height: '40%' }">
                    <van-picker title="孩儿" :columns="students" :columns-field-names="{ text: 'name' }"
                        @confirm="onStudentIdConfirm" @cancel="pickerShow.studentName = false" />
                </van-popup>
                <van-field v-model="lesson.startAt" is-link readonly name="startAt" label="开始时间"
                    @click="pickerShow.startAt = true" />
                <van-popup v-model:show="pickerShow.startAt" round position="bottom" :style="{ height: '40%' }">
                    <van-datetime-picker :model-value="lesson.startAt" type="time" title="开始时间"
                        :filter="filterStartTime" @confirm="onStartAtConfirm" @cancel="pickerShow.startAt = false" />
                </van-popup>
                <van-field v-model="lesson.endAt" is-link readonly name="endAt" label="结束时间"
                    @click="pickerShow.endAt = true" />
                <van-popup v-model:show="pickerShow.endAt" round position="bottom" :style="{ height: '40%' }">
                    <van-datetime-picker :model-value="lesson.endAt" type="time" title="结束时间" :filter="filterEndTime"
                        @confirm="onEndAtConfirm" @cancel="pickerShow.endAt = false" />
                </van-popup>
                <van-field v-model="lesson.fee" type="number" name="fee" label="课时费" />
            </van-cell-group>
            <div class="ams-edit-lesson__btn">
                <van-button round block type="primary" native-type="submit" :loading="lessonStore.isUpdating">
                    确认
                </van-button>
            </div>
        </van-form>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, watch } from 'vue';
import { Notify } from 'vant';
import 'vant/es/notify/style';
import { Student, useStudentStore } from "../stores/student";
import { Lesson, useLessonStore } from '../stores/lesson';
import { FormatUtil } from "../utils/format.util";
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)

const props = defineProps<{ visible: boolean; lesson: Lesson; date: string }>()

const studentStore = useStudentStore();
const lessonStore = useLessonStore();

const lesson = reactive({
    lessonId: 0,
    studentId: 0,
    studentName: '',
    startAt: '',
    endAt: '',
    fee: 0,
})

const pickerShow = reactive({
    studentName: false,
    startAt: false,
    endAt: false
})

const title = computed(() => {
    const action = lesson.lessonId > 0 ? '改课？' : '加课！'
    const weekday = FormatUtil.showWeekday(props.date)
    return `${weekday} ${action}`
})

const students = computed(() => studentStore.$state.students)

onMounted(() => {
    if (!studentStore.fetched) {
        studentStore.fetchStudents()
    }
    initLesson()
})

watch(() => props.visible, () => {
    if (props.visible) {
        initLesson()
    }
})

function initLesson() {
    lesson.lessonId = props.lesson.lessonId ?? 0
    lesson.studentId = props.lesson.studentId ?? 0
    lesson.studentName = props.lesson.studentName ?? ''
    lesson.startAt = props.lesson.startAt ?? ''
    lesson.endAt = props.lesson.endAt || (defaultDuration(props.lesson.startAt, 45))
    lesson.fee = props.lesson.fee ?? 0
}

const filterStartTime = (type: string, options: string[]) => {
    const limit = lesson.endAt?.split(":")?.filter(Boolean)?.map(Number) ?? [];
    if (type == 'minute') {
        return options.filter(option => Number(option) % 15 == 0)
    }
    if (type == 'hour') {
        return options.filter(option => Number(option) >= 9 && Number(option) <= (limit[0] ?? 22))
    }
    return options
}

const filterEndTime = (type: string, options: string[]) => {
    const limit = lesson.startAt?.split(":")?.filter(Boolean)?.map(Number) ?? [];
    if (type == 'minute') {
        return options.filter(option => Number(option) % 15 == 0)
    }
    if (type == 'hour') {
        return options.filter(option => Number(option) >= (limit[0] ?? 9) && Number(option) <= 22)
    }
    return options
}

const onStudentIdConfirm = (student: Student) => {
    lesson.studentId = student.id;
    lesson.studentName = student.name;
    lesson.fee = student.fee;
    pickerShow.studentName = false
};

const onStartAtConfirm = (value: string) => {
    lesson.startAt = value;
    lesson.endAt = lesson.endAt || defaultDuration(value, 45);
    pickerShow.startAt = false
}

const onEndAtConfirm = (value: string) => {
    lesson.endAt = value;
    lesson.startAt = lesson.startAt || defaultDuration(value, -45);
    pickerShow.endAt = false
}

function defaultDuration(time: string, duration: number) {
    if (!time) {
        return '';
    }

    let [hour, min] = time.split(":").map(Number)
    min += duration
    if (min < 0) {
        min += 60;
        hour -= 1;
    }

    if (min >= 60) {
        min -= 60;
        hour += 1;
    }

    return `${FormatUtil.padZero(hour)}:${FormatUtil.padZero(min)}`
}

const emit = defineEmits(['submit'])

const onSubmit = () => {
    console.log(props.date, { ...lesson })

    if (!checkFormValidity()) return
    if (!checkLessonConflict()) return

    if (lesson.lessonId <= 0) {
        lessonStore.createLesson(props.date, { ...lesson })
    } else {
        lessonStore.updateLesson(props.date, { ...lesson })
    }
    emit('submit')
};

function checkFormValidity() {
    if (lesson.studentId == 0) {
        Notify({ type: 'warning', message: '选个孩儿啊' })
        return false;
    }

    if (lesson.fee <= 0) {
        Notify({ type: 'warning', message: '不要钱的嘛' })
        return false;
    }

    return true;
}

function checkLessonConflict() {
    const lessons = lessonStore.$state.lessons.get(props.date) ?? []

    for (const oldLesson of lessons) {
        if (oldLesson.lessonId == lesson.lessonId) continue

        if (hasConflict(oldLesson)) {
            Notify({ type: 'warning', message: `和${oldLesson.startAt} - ${oldLesson.endAt} ${oldLesson.studentName}的课冲突了啊` })
            return false;
        }
    }

    return true;
}

function hasConflict(oldLesson: Lesson) {
    const start = dayjs(`${props.date} ${oldLesson.startAt}`)
    const end = dayjs(`${props.date} ${oldLesson.endAt}`)

    const toCreateStart = dayjs(`${props.date} ${lesson.startAt}`)
    const toCreateEnd = dayjs(`${props.date} ${lesson.endAt}`)

    return toCreateStart.isBetween(start, end) || toCreateEnd.isBetween(start, end)
}

</script>

<style scoped lang="scss">
.ams-edit-lesson {
    &__title {
        color: var(--van-primary-color);
        font-size: 1.2rem;
        margin: 1rem auto;
        text-align: center;
    }

    &__btn {
        margin: 1rem;
    }
}
</style>