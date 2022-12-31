<template>
    <div class="ams-copy-lesson">
        <div class="ams-copy-lesson__title">复制课儿</div>
        <van-form @submit="onSubmit">
            <van-cell-group inset>
                <van-field v-model="copyDates.fromStartDate" is-link readonly name="fromStartDate" label="从开始日期"
                    @click="pickerShow.fromStartDate = true" />
                <van-popup v-model:show="pickerShow.fromStartDate" round position="bottom" :style="{ height: '45%' }">
                    <van-datetime-picker :model-value="copyDatesPicker.fromStartDate" type="date" title="从开始日期"
                        @confirm="onFromStartDateConfirm" @cancel="pickerShow.fromStartDate = false" />
                </van-popup>
            </van-cell-group>
            <div class="ams-edit-student__btn">
                <van-button round block type="primary" native-type="submit">
                    确认
                </van-button>
            </div>
        </van-form>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, watch } from "vue"
import { FormatUtil } from "../utils/format.util";

const props = defineProps<{ visible: boolean }>()

const copyDates = reactive({
    fromStartDate: '',
    fromEndDate: '',
    toStartDate: '',
    toEndDate: ''
})
const copyDatesPicker = computed(() => ({
    fromStartDate: new Date(copyDates.fromStartDate),
    fromEndDate: new Date(copyDates.fromEndDate),
    toStartDate: new Date(copyDates.toStartDate),
    toEndDate: new Date(copyDates.toEndDate)
}))
const pickerShow = reactive({
    fromStartDate: false,
    fromEndDate: false,
    toStartDate: false
})

const onFromStartDateConfirm = (value: Date) => {
    copyDates.fromStartDate = FormatUtil.formatDate(value)
    pickerShow.fromStartDate = false
}

onMounted(() => {
    initCopyDates()
})

watch(() => props.visible, () => {
    if (props.visible) {
        initCopyDates()
    }
})

function initCopyDates() {
    copyDates.fromStartDate = FormatUtil.formatNow()
    copyDates.fromEndDate = FormatUtil.formatFromNow(7)
    copyDates.toStartDate = FormatUtil.formatFromNow(14)
    copyDates.toEndDate = FormatUtil.formatFromNow(21)
}

const onSubmit = () => {

}

</script>

<style scoped lang="scss">
.ams-copy-lesson {
    &__title {
        color: var(--van-primary-color);
        font-size: 1.2rem;
        margin: 1rem auto;
        text-align: center;
    }
}
</style>