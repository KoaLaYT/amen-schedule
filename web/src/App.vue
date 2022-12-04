<template>
  <div class="ams-app">
    <transition name="van-fade">
      <router-view class="ams-app__view" />
    </transition>
    <van-tabbar class="ams-app__tab" v-model="active">
      <van-tabbar-item v-for="tabbar in tabbars" :key="tabbar.path" :name="tabbar.name" @click="onClick(tabbar)">
        <span>{{ tabbar.name }}</span>
        <template #icon>
          <img v-if="route.path == tabbar.path" :src="tabbar.iconActivate" class="weui-tabbar__icon">
          <img v-else :src="tabbar.iconDeactivate" class="weui-tabbar__icon">
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router"

interface Tabbar {
  path: string;
  name: string;
  iconDeactivate: string;
  iconActivate: string;
}
const router = useRouter()
const route = useRoute()
const active = ref('课儿')

const tabbars: Tabbar[] = [
  {
    path: "/",
    name: "课儿",
    iconDeactivate: "./schedule_deactivate.png",
    iconActivate: "./schedule_activate.png"
  },
  {
    path: "/student",
    name: "孩儿",
    iconDeactivate: "./student_deactivate.png",
    iconActivate: "./student_activate.png"
  }
]

onMounted(() => {
  router.push(route.path)
})

const onClick = (tabbar: Tabbar) => {
  if (tabbar.path == route.path) return
  router.push({ path: tabbar.path })
}

</script>

<style scoped lang="scss">
.ams-app {
  min-height: 100vh;
  max-height: 100vh;

  &__view {
    height: calc(100vh - 50px);
    overflow-y: scroll;
  }

  .van-tabbar {
    --van-tabbar-item-active-background-color: var(--van-primary-color);
    --van-tabbar-item-active-color: var(--van-gray-3);
    --van-tabbar-item-text-color: var(--van-primary-color);
    border: none;

    &::after {
      border: none;
    }
  }
}
</style>
