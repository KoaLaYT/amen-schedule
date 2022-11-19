<template>
    <div class="ams-timeline">
        <div class="ams-timeline__dates" ref="datesEle">
            <div v-for="date in dates" :key="date">
                {{ showWeekday(date) }}
            </div>
        </div>
        <div class="ams-timeline__wrapper">
            <div class="ams-timeline__wrapper__hours">
                <div v-for="hour, index in hours" :key="index">
                    <text>{{ hour }}</text>
                    <div class="ams-timeline__wrapper__hours__line"></div>
                </div>
            </div>
            <div class="ams-timeline__wrapper__days" @scroll="onScroll($event)">
                <ams-day-vue v-for="date in dates" :key="date" :date="date" :id="date" />
            </div>
        </div>
    </div>
    <ams-loading-vue v-if="isFetching" />
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { nextTick, onMounted, ref, computed } from 'vue';
import { useLessonStore } from '../stores/lesson';
import AmsDayVue from '../components/AmsDay.vue';
import AmsLoadingVue from "./AmsLoading.vue";

const hours = Array.from({ length: 15 }).map((_, index) => {
    const hour = index + 9
    if (hour < 10) {
        return `0${hour}:00`
    } else {
        return `${hour}:00`
    }
})

const store = useLessonStore()
const dates = ref([] as string[]);
const isUpdating = ref(false)
const datesEle = ref(null)
const isFetching = computed(() => store.isFetching.length > 0)

const onScroll = (params: any) => {
    const scrollLeft: number = params.target.scrollLeft;
    const scrollLeftMax: number = params.target.scrollWidth - params.target.clientWidth;
    // sync two divs
    (datesEle.value as any).scrollLeft = scrollLeft;

    // load more date
    if (scrollLeft <= 10) {
        if (isUpdating.value) return;
        isUpdating.value = true;
        addMoreDatesBefore();
        setTimeout(() => isUpdating.value = false, 200)
        nextTick(() => {
            const newMax = params.target.scrollWidth - params.target.clientWidth - scrollLeftMax;
            params.target.scrollLeft = newMax;
            (datesEle.value as any).scollLeft = newMax;
        })

    } else if (scrollLeftMax - scrollLeft <= 10) {
        if (isUpdating.value) return;
        isUpdating.value = true;
        addMoreDatesAfter();
        setTimeout(() => isUpdating.value = false, 200)
    }
}

// 初始化时获取当天前后5天的数据，并且显示当前日期
onMounted(() => {
    const today = dayjs()
    dates.value = Array.from({ length: 10 }).map((_, index) => today.add(index - 5, 'day').format('YYYY-MM-DD'));
    store.fetchLessons([dates.value[0], dates.value[dates.value.length - 1]])
    nextTick(() => {
        document.getElementById(today.format('YYYY-MM-DD'))?.scrollIntoView()
    })
})

function addMoreDatesBefore() {
    const firstDate = dates.value[0];
    const newDates = Array.from({ length: 7 }).map((_, index) => dayjs(firstDate).subtract(index + 1, 'day').format('YYYY-MM-DD')).reverse()
    store.fetchLessons([newDates[0], newDates[newDates.length - 1]])
    dates.value.unshift(...newDates)
}
function addMoreDatesAfter() {
    const firstDate = dates.value[dates.value.length - 1];
    const newDates = Array.from({ length: 7 }).map((_, index) => dayjs(firstDate).add(index + 1, 'day').format('YYYY-MM-DD'))
    store.fetchLessons([newDates[0], newDates[newDates.length - 1]])
    dates.value.push(...newDates)
}

const translate = ['日', '一', '二', '三', '四', '五', '六']
function showWeekday(date: string) {
    return `${date} 周${translate[dayjs(date).day()]}`
}
</script>

<style scoped lang="scss">
.ams-timeline {
    width: 100vw;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    position: relative;

    &__dates {
        display: flex;
        flex-flow: row nowrap;
        margin-left: 4rem;
        width: calc(100% - 4rem);
        flex: 0 0 3rem;
        overflow-x: hidden;

        >div {
            color: var(--weui-FG-0);
            padding-top: 0.5rem;
            padding-left: 1px;
            flex: 0 0 200px;
        }


    }

    &__wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        flex-flow: row nowrap;
        overflow-y: scroll;

        &__hours {
            height: calc(15 * 8rem);
            border-right: 1px solid var(--weui-BG-0);
            text-align: center;

            >div {
                height: 8rem;
                width: 4rem;
                position: relative;
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
            }

            &__line {
                position: absolute;
                left: 3.5rem;
                width: calc(100vw - 4rem);
                border-top: 1px solid var(--weui-BG-0);
                z-index: -1;
            }
        }

        &__days {
            width: 100%;
            height: calc(15 * 8rem);
            display: flex;
            flex-flow: row nowrap;
            overflow: scroll;
        }
    }

}
</style>