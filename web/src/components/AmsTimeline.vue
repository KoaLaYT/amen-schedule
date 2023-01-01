<template>
    <div class="ams-timeline">
        <div class="ams-timeline__dates" ref="datesEle">
            <div v-for="date in dates" :key="date">
                {{ FormatUtil.showWeekday(date) }}
            </div>
        </div>
        <div class="ams-timeline__wrapper">
            <div class="ams-timeline__wrapper__hours">
                <div v-for="hour, index in hours" :key="index">
                    <text>{{ hour }}</text>
                    <div class="ams-timeline__wrapper__hours__line"></div>
                </div>
            </div>
            <div class="ams-timeline__wrapper__days" @scroll="onScroll($event)" ref="daysEle">
                <ams-day-vue v-for="date in dates" :key="date" :date="date" :id="date" />
            </div>
            <div class="ams-timeline__wrapper__arrow-left  ams-timeline__wrapper__arrow" @click="onLeftArrow">
                <van-icon name="arrow-left" />
            </div>
            <div class="ams-timeline__wrapper__arrow-right  ams-timeline__wrapper__arrow" @click="onRightArrow">
                <van-icon name="arrow" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { nextTick, onMounted, ref, watch } from 'vue';
import { useLessonStore } from '../stores/lesson';
import AmsDayVue from '../components/AmsDay.vue';
import { Toast } from 'vant';
import 'vant/es/toast/style';
import { FormatUtil } from "../utils/format.util";

const hours = Array.from({ length: 13 }).map((_, index) => {
    return `${FormatUtil.padZero(index + 10)}:00`
})

const store = useLessonStore()
const dates = ref(Array.from({ length: 14 }).map((_, index) => dayjs().add(index - 7, 'day').format('YYYY-MM-DD')));
const isUpdating = ref(false)
const datesEle = ref(null)
const daysEle = ref(null)

watch(() => store.isFetching.length, (length) => {
    if (length > 0) {
        Toast.loading({
            message: "Loading...",
            forbidClick: true,
            duration: 0
        })
    } else {
        Toast.clear()
    }
})

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
            (datesEle.value as any).scrollLeft = newMax;
        })

    } else if (scrollLeftMax - scrollLeft <= 10) {
        if (isUpdating.value) return;
        isUpdating.value = true;
        addMoreDatesAfter();
        setTimeout(() => isUpdating.value = false, 200)
    }
}

const onLeftArrow = () => {
    (daysEle.value as any).scrollBy({
        left: -400,
        behavior: 'smooth'
    })
}

const onRightArrow = () => {
    (daysEle.value as any).scrollBy({
        left: +400,
        behavior: 'smooth'
    })
}

// 初始化时获取当天前后5天的数据，并且显示当前日期
onMounted(() => {
    if (!store.$state.fetched) {
        store.fetchLessons([dates.value[0], dates.value[dates.value.length - 1]])
    }
    nextTick(() => {
        document.getElementById(dayjs().format('YYYY-MM-DD'))?.scrollIntoView()
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
</script>

<style scoped lang="scss">
.ams-timeline {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    position: relative;

    &__dates {
        display: flex;
        flex-flow: row nowrap;
        padding-left: 4rem;
        width: calc(100% - 4rem);
        flex: 0 0 3rem;
        overflow-x: hidden;
        background-color: var(--van-primary-color);

        &::before {
            content: ' ';
            height: 3rem;
            width: 4rem;
        }

        >div {
            color: var(--van-gray-3);
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
        position: relative;

        &__arrow {
            position: fixed;
            top: 3rem;
            width: 4rem;
            height: calc(100vh - 3rem - 64px);
            display: flex;
            justify-content: center;
            align-items: center;

            >i {
                display: none;
            }

            &:hover {
                background: rgba(240, 240, 240, 0.6);
                backdrop-filter: blur(2px);
                cursor: pointer;

                >i {
                    display: block;
                }
            }

        }

        &__arrow-left {
            left: 4rem
        }

        &__arrow-right {
            right: 0;
        }

        &__hours {
            height: calc(13 * 8rem);
            border-right: 1px solid var(--van-border-color);
            text-align: center;

            >div {
                color: var(--van-gray-7);
                height: 8rem;
                width: 4rem;
                position: relative;
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                justify-content: center;
            }

            &__line {
                position: absolute;
                left: 3.6rem;
                width: calc(100vw - 4rem);
                border-top: 1px solid var(--van-border-color);
                z-index: -1;
            }
        }

        &__days {
            width: 100%;
            height: calc(13 * 8rem);
            display: flex;
            flex-flow: row nowrap;
            overflow: scroll;
        }
    }

}

@media (max-width: 480px) {
    .ams-timeline {
        &__wrapper {
            &__arrow {
                display: none;
            }
        }
    }
}
</style>