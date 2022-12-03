<template>
    <div class="ams-student">
        <div class="ams-student__header">
            <div class="ams-student__header__label" :style="labelStyle">{{ props.student.name }}</div>
            <van-button type="primary" icon="edit" square size="small" @click="$emit('edit')" />
            <van-button type="success" icon="balance-o" square size="small" @click="editorShow = true" />
            <van-button type="danger" icon="delete-o" square size="small" />
        </div>
        <van-cell-group v-if="stats.length > 0" :title="title" inset :border="false">
            <van-cell v-for="stat in stats" :key="stat.lessonId" :value="stat.fee">
                <template #title>
                    <div class="ams-student__stat__title">
                        <span>{{ stat.weekday }}</span>
                        <span>{{ stat.time }}</span>
                    </div>
                </template>
            </van-cell>
        </van-cell-group>
        <van-popup v-model:show="editorShow" round position="bottom" :style="{ height: '30%' }">
            <ams-edit-stat-date :visible="editorShow" :studentName="props.student.name" @submit="onStatSubmit" />
        </van-popup>
    </div>
</template>

<script setup lang="ts">
import { Toast } from 'vant';
import { computed, defineProps, ref } from 'vue';
import { StatApi, StatVo } from '../api/stat.api';
import { Student } from '../stores/student';
import { CommonUtil } from '../utils/common.util';
import { FormatUtil } from '../utils/format.util';

interface Stat {
    lessonId: number;
    weekday: string;
    time: string;
    fee: number;
}

const props = defineProps<{ student: Student }>();

const labelStyle = computed(() => ({
    color: props.student.fgColor,
    "background-color": props.student.bgColor
}))

const editorShow = ref(false)

const stats = ref([] as Stat[])
const title = ref('')

const onStatSubmit = async (range: { start: string; end: string }) => {
    editorShow.value = false
    title.value = `${range.start} ~ ${range.end}`


    const statVos = await fetchStat([range.start, range.end])
    const result = []
    let totalFee = 0

    for (const statVo of statVos) {
        result.push(convert(statVo))
        totalFee += statVo.fee
    }

    result.push(<Stat>{
        lessonId: 0,
        weekday: '总计',
        time: '',
        fee: totalFee
    })

    stats.value = result
}

function convert(vo: StatVo) {
    return <Stat>{
        lessonId: vo.id,
        weekday: FormatUtil.showWeekday(vo.taughtDate),
        time: `${vo.startTime}-${vo.endTime}`,
        fee: vo.fee
    }
}

async function fetchStat(dateRange: [string, string]) {
    Toast.loading({ message: 'Loading...', forbidClick: true, duration: 0 })
    const result = await StatApi.summary(props.student.id, dateRange)
    CommonUtil.log(result)
    Toast.clear()
    return result
}


</script>

<style lang="scss">
.ams-student {
    &__header {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;

        &__label {
            margin-right: auto;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0.3rem 1rem;
            border-radius: 0.5rem;
        }
    }

    &__stat__title {
        display: flex;
        flex-flow: column nowrap;
    }
}
</style>