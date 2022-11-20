<template>
    <div class="ams-day" @click="onDayClick($event)">
        <div class="ams-day__lesson" v-for="lesson in lessons" :key="lesson.lessonId" :style="{ ...calOffset(lesson) }"
            @click.stop.prevent="onLessonClick(lesson)">
            <div>{{ lesson.studentName }}</div>
            <div>{{ lesson.startAt }} - {{ lesson.endAt }}</div>
        </div>
        <van-popup v-model:show="editorShow">
            <ams-edit-lesson-vue />
        </van-popup>
    </div>
</template>

<script setup lang="ts">
import { Toast } from 'vant';
import { computed, ref } from 'vue';
import { Lesson, useLessonStore } from '../stores/lesson';
import AmsEditLessonVue from './AmsEditLesson.vue';

const props = defineProps<{
    date: string,
}>()

const store = useLessonStore();

const lessons = computed(() => store.$state.lessons.get(props.date) ?? [])
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

const onDayClick = (event: MouseEvent) => {
    console.log(props.date, event)
    Toast.success("click day")
}

const onLessonClick = (lesson: Lesson) => {
    console.log(props.date, lesson)
    Toast.success("click lesson")
}

function complementary(color: string) {
    const hex = Number.parseInt(color.slice(1), 16)
    return '#' + (0xFFFFFF - hex).toString(16)
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