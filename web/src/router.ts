import * as VueRouter from "vue-router"
import { CommonUtil } from "./utils/common.util"

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes: [
        { path: "/", component: () => import("./views/Schedule.vue") },
        { path: "/student", component: () => import("./views/Student.vue") },
        { path: "/login", components: { login: () => import("./views/Login.vue") } },
        { path: "/:pathMatch(.*)*", redirect: "/" }
    ]
})


router.beforeEach(async (to, from, next) => {
    const userStore = await getUserStore()
    userStore.load()
    CommonUtil.log(userStore.token)

    if (!userStore.token && to.fullPath != '/login') {
        next({ path: '/login', replace: true })
    } else {
        next()
    }
})

const getUserStore = (() => {
    let userStore: any;
    return async () => {
        if (!userStore) {
            const { useUserStore } = await import("./stores/user")
            userStore = useUserStore()
        }
        return userStore
    }
})()

export { router }