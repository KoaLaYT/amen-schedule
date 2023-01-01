<template>
    <div class="ams-edit-stat-date">
        <div class="ams-edit-stat-date__title">{{ title }}</div>
        <van-form @submit="onSubmit">
            <van-cell-group inset>
                <van-field v-model="range.start" is-link readonly name="startDate" label="开始日期"
                    @click="pickerShow.startDate = true" />
                <van-popup v-model:show="pickerShow.startDate" round position="bottom" :style="{ height: '35%' }">
                    <van-datetime-picker :model-value="rangeDate.start" type="date" title="开始日期"
                        @confirm="onStartDateConfirm" @cancel="pickerShow.startDate = false" />
                </van-popup>
                <van-field v-model="range.end" is-link readonly name="endDate" label="结束日期"
                    @click="pickerShow.endDate = true" />
                <van-popup v-model:show="pickerShow.endDate" round position="bottom" :style="{ height: '35%' }">
                    <van-datetime-picker :model-value="rangeDate.end" type="date" title="结束日期"
                        @confirm="onEndDateConfirm" @cancel="pickerShow.endDate = false" />
                </van-popup>
            </van-cell-group>
            <div class="ams-edit-stat-date__btn">
                <van-button round block type="primary" native-type="submit">
                    确认
                </van-button>
            </div>
        </van-form>
    </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { computed, defineProps, onMounted, reactive, watch } from 'vue';

const props = defineProps<{ visible: boolean; studentName: string }>();

const range = reactive({
    start: '',
    end: '',
})

const rangeDate = computed(() => ({
    start: new Date(range.start),
    end: new Date(range.end)
}))

const pickerShow = reactive({
    startDate: false,
    endDate: false
})

const initRange = () => {
    const today = dayjs()
    range.start = today.startOf('month').format('YYYY-MM-DD')
    range.end = today.format('YYYY-MM-DD')
}

const title = computed(() => {
    return `想看看${props.studentName}的课时费`
})

onMounted(() => initRange())
watch(() => props.visible, () => {
    if (props.visible) {
        initRange()
    }
})

const onStartDateConfirm = (date: any) => {
    range.start = dayjs(date).format('YYYY-MM-DD')
    pickerShow.startDate = false
}
const onEndDateConfirm = (date: any) => {
    range.end = dayjs(date).format('YYYY-MM-DD')
    pickerShow.endDate = false
}


const emit = defineEmits<{
    (e: 'submit', range: { start: string; end: string }): void
}>()
const onSubmit = () => {
    emit('submit', { ...range })
}

</script>

<style lang="scss">
.ams-edit-stat-date {
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