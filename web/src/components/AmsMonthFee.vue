<template>
  <div class="ams-month-fee">
    <div class="ams-month-fee__title">算账咯</div>
    <van-cell-group inset style="flex: 1">
      <van-field
        :model-value="monthStr"
        is-link
        readonly
        name="month"
        label="月份"
        @click="monthPickerShow = true"
      />
      <van-popup
        v-model:show="monthPickerShow"
        round
        position="bottom"
        :style="{ height: '40%' }"
      >
        <van-datetime-picker
          v-model="month"
          type="year-month"
          title="选择月份"
          @confirm="onMonthConfirm"
          @cancel="monthPickerShow = false"
        />
      </van-popup>
      <van-field :model-value="fee" readonly name="fee" label="课时费" />
    </van-cell-group>
    <div class="ams-month-fee__btn">
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import dayjs from "dayjs";
import { StatApi } from "../api/stat.api";

const loading = ref(false);
const monthPickerShow = ref(false);

const month = ref(new Date());
const monthStr = computed(() => dayjs(month.value).format("YYYY-MM"));
const fee = ref("");

const onMonthConfirm = (value: Date) => {
  month.value = value;
  monthPickerShow.value = false;
};

const onSubmit = async () => {
  loading.value = true;
  const feeNum = await StatApi.all(monthStr.value).finally(() => {
    loading.value = false;
  });
  fee.value = feeNum > 0 ? `¥${feeNum}` : "一分没有";
};
</script>

<style scoped lang="scss">
.ams-month-fee {
  display: flex;
  flex-flow: column;
  height: 100%;

  &__title {
    color: var(--van-primary-color);
    font-size: 1.2rem;
    margin: 1rem auto;
    text-align: center;
  }
  &__btn {
    margin: 1rem;
    justify-self: end;
  }
}
</style>
