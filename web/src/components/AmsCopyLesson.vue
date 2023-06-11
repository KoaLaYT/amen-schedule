<template>
  <div class="ams-copy-lesson">
    <div class="ams-copy-lesson__title">复制课儿</div>
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="copyDates.fromStartDate"
          is-link
          readonly
          name="fromStartDate"
          label="从开始日期"
          @click="pickerShow.fromStartDate = true"
        />
        <van-popup
          v-model:show="pickerShow.fromStartDate"
          round
          position="bottom"
          :style="{ height: '45%' }"
        >
          <van-datetime-picker
            :model-value="copyDatesPicker.fromStartDate"
            type="date"
            title="从开始日期"
            @confirm="onFromStartDateConfirm"
            @cancel="pickerShow.fromStartDate = false"
          />
        </van-popup>
        <van-field
          v-model="copyDates.fromEndDate"
          readonly
          name="fromEndDate"
          label="从结束日期"
        />
      </van-cell-group>
      <van-cell-group inset>
        <van-field
          v-model="copyDates.toStartDate"
          is-link
          readonly
          name="toStartDate"
          label="到开始日期"
          @click="pickerShow.toStartDate = true" />
        <van-popup
          v-model:show="pickerShow.toStartDate"
          round
          position="bottom"
          :style="{ height: '45%' }"
        >
          <van-datetime-picker
            :model-value="copyDatesPicker.toStartDate"
            type="date"
            title="到开始日期"
            @confirm="onToStartDateConfirm"
            @cancel="pickerShow.toStartDate = false"
          />
        </van-popup>
        <van-field
          v-model="copyDates.toEndDate"
          readonly
          name="toEndDate"
          label="到结束日期"
      /></van-cell-group>
      <div class="ams-edit-student__btn">
        <van-button
          round
          block
          type="primary"
          @click="onSubmit"
          :loading="loading"
        >
          确认
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { FormatUtil } from "../utils/format.util";
import { LessonApi } from "../api/lesson.api";
import { Toast } from "vant";

const props = defineProps<{ visible: boolean }>();

const copyDates = reactive({
  fromStartDate: "",
  fromEndDate: "",
  toStartDate: "",
  toEndDate: "",
});

const copyDatesPicker = computed(() => ({
  fromStartDate: new Date(copyDates.fromStartDate),
  fromEndDate: new Date(copyDates.fromEndDate),
  toStartDate: new Date(copyDates.toStartDate),
  toEndDate: new Date(copyDates.toEndDate),
}));

const pickerShow = reactive({
  fromStartDate: false,
  toStartDate: false,
});

const onFromStartDateConfirm = (value: Date) => {
  copyDates.fromStartDate = FormatUtil.formatDate(value);
  copyDates.fromEndDate = FormatUtil.formatFromDate(value, 6);
  pickerShow.fromStartDate = false;
};
const onToStartDateConfirm = (value: Date) => {
  copyDates.toStartDate = FormatUtil.formatDate(value);
  copyDates.toEndDate = FormatUtil.formatFromDate(value, 6);
  pickerShow.toStartDate = false;
};

onMounted(() => {
  initCopyDates();
});

watch(
  () => props.visible,
  () => {
    if (props.visible) {
      initCopyDates();
    }
  }
);

function initCopyDates() {
  copyDates.fromStartDate = FormatUtil.formatFromNow(-6);
  copyDates.fromEndDate = FormatUtil.formatFromNow(0);
  copyDates.toStartDate = FormatUtil.formatFromNow(1);
  copyDates.toEndDate = FormatUtil.formatFromNow(7);
}

const loading = ref(false);
const emit = defineEmits(["submit"]);
const onSubmit = async () => {
  loading.value = true;
  await LessonApi.copy(copyDates.fromStartDate, copyDates.toStartDate).finally(
    () => {
      loading.value = false;
    }
  );
  Toast.success("Done!");
  emit("submit");
};
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
