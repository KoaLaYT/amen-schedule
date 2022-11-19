import * as VueRouter from "vue-router"

export const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes: [
        { path: "/", component: () => import("./views/Schedule.vue") },
        { path: "/student", component: () => import("./views/Student.vue") },
        { path: "/:pathMatch(.*)*", redirect: "/" }
    ]
})