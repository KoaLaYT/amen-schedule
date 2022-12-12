<template>
  <div class="ams-app">
    <template v-if="!userStore.hasToken">
      <router-view name="login" class="ams-app__login" />
    </template>
    <template v-else>
      <transition name="van-fade">
        <router-view class="ams-app__view" />
      </transition>
      <van-tabbar class="ams-app__tab" :model-value="active">
        <van-tabbar-item v-for="tabbar in tabbars" :key="tabbar.path" :name="tabbar.name" :to="tabbar.path">
          <span>{{ tabbar.name }}</span>
          <template #icon>
            <img v-if="route.path == tabbar.path" :src="tabbar.iconActivate">
            <img v-else :src="tabbar.iconDeactivate">
          </template>
        </van-tabbar-item>
      </van-tabbar>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router"
import { useUserStore } from "./stores/user";

interface Tabbar {
  path: string;
  name: string;
  iconDeactivate: string;
  iconActivate: string;
}

const route = useRoute()
const active = computed(() => tabbars.find(tab => tab.path == route.fullPath)?.name)
const userStore = useUserStore()

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

</script>

<style scoped lang="scss">
.ams-app {
  width: 100%;
  height: 100vh;

  &__login {
    width: 100%;
    height: 100%;
  }

  &__view {
    height: calc(100vh - 64px);
    overflow-y: scroll;
  }

  img {
    height: 32px;
  }

  .van-tabbar {
    --van-tabbar-height: 64px;
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
