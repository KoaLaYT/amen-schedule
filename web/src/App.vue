<template>
  <div class="ams-app weui-tab">
    <router-view class="ams-app__view" />
    <div class="ams-app__tab weui-tabbar">
      <div class="ams-app__tab__item weui-tabbar__item" v-for="tabbar in tabbars" :key="tabbar.path"
        @click="onClick(tabbar)">
        <img v-if="route.path == tabbar.path" :src="tabbar.iconActivate" class="weui-tabbar__icon">
        <img v-else :src="tabbar.iconDeactivate" class="weui-tabbar__icon">
        <p class="weui-tabbar__label">{{ tabbar.name }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import HelloWorld from './components/HelloWorld.vue'
import { useRouter, useRoute } from "vue-router"

interface Tabbar {
  path: string;
  name: string;
  iconDeactivate: string;
  iconActivate: string;
}
const router = useRouter()
const route = useRoute()

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
    iconActivate: "/student_activate.png"
  }
]

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
    flex: 0 0 calc(100vh - 60px);
    overflow-y: scroll;
  }

  &__tab {
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>
