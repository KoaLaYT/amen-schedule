<template>
    <div class="ams-day" @click.self="onDayClick($event)">
        <div class="ams-day__lesson" v-for="lesson in lessons" :key="lesson.lessonId" :style="{ ...calOffset(lesson) }"
            @click.stop.prevent="onLessonClick(lesson)">
            <div>{{ lesson.studentName }}</div>
            <div>{{ lesson.startAt }} - {{ lesson.endAt }}</div>
        </div>
        <van-popup v-model:show="editorShow" round position="bottom" :style="{ height: '40%' }">
            <ams-edit-lesson-vue :visible="editorShow" :lesson="editLesson" :date="editLessonDate"
                @submit="editorShow = false" />
        </van-popup>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { Lesson, useLessonStore } from '../stores/lesson';
import { FormatUtil } from '../utils/format.util';
import AmsEditLessonVue from './AmsEditLesson.vue';

const props = defineProps<{
    date: string,
}>()

const store = useLessonStore();

const lessons = computed(() => store.$state.lessons.get(props.date) ?? [])

const editLesson = reactive({
    lessonId: 0,
    studentId: 0,
    studentName: '',
    startAt: '',
    endAt: '',
    fee: 0,
})
const editLessonDate = ref('')
const editorShow = ref(false)

const calOffset = (lesson: Lesson) => {
    const [startHour, startMin] = lesson.startAt.split(":").map(Number);
    const startOffset = (startHour + startMin / 60 - 9) * 8 + 4

    const [endHour, endMin] = lesson.endAt.split(":").map(Number);
    const durationMin = ((endHour - startHour) * 60 + (endMin - startMin)) / 60 * 8;

    return {
        top: `${startOffset}rem`,
        height: `${durationMin}rem`,
        left: 0,
        right: '1rem',
        "background-color": lesson.studentColor,
        color: complementary(lesson.studentColor)
    }
}

const onDayClick = (event: MouseEvent & { layerY?: number }) => {
    editLessonDate.value = props.date
    editLesson.lessonId = 0
    editLesson.studentId = 0
    editLesson.studentName = ''
    editLesson.startAt = calStartAtBaseOnClick(event.layerY)
    editLesson.endAt = ''
    editLesson.fee = 0
    editorShow.value = true;
}

const onLessonClick = (lesson: Lesson) => {
    editLessonDate.value = props.date
    editLesson.lessonId = lesson.lessonId
    editLesson.studentId = lesson.studentId
    editLesson.studentName = lesson.studentName
    editLesson.startAt = lesson.startAt
    editLesson.endAt = lesson.endAt
    editLesson.fee = lesson.fee
    editorShow.value = true;
}

function complementary(color: string = '#FFFFFF') {
    const hex = Number.parseInt(color.slice(1), 16)
    return '#' + (0xFFFFFF - hex).toString(16)
}

function calStartAtBaseOnClick(layerY: number = 0) {
    const totalHours = 15;
    const rem = 8;
    const remToPixel = 16;
    const startHour = 8;
    const startMin = 30;

    const offsetY = layerY / (totalHours * rem * remToPixel)
    const offsetMin = Math.floor(offsetY * totalHours * 60)

    let calHour = startHour + Math.floor((startMin + offsetMin) / 60);
    let calMin = (startMin + offsetMin) % 60

    calMin = calMinToQuarter(calMin);
    if (calMin < 0) {
        calHour += 1;
        calMin = 0;
    }

    return `${FormatUtil.padZero(calHour)}:${FormatUtil.padZero(calMin)}`
}

function calMinToQuarter(min: number) {
    if (min < 8) {
        return 0;
    }
    if (min < 23) {
        return 15;
    }
    if (min < 38) {
        return 30;
    }
    if (min < 53) {
        return 45;
    }
    return -1;
}

</script>

<style scoped lang="scss">
.ams-day {
    flex: 0 0 200px;
    border-right: 1px solid var(--van-border-color);
    position: relative;

    &__lesson {
        position: absolute;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        justify-content: center;
        border-radius: 1rem;
        font-weight: bold;
        cursor: pointer;

        &:active::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.1);
            border-radius: 1rem
        }
    }
}
</style>