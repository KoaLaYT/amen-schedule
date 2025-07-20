import { defineStore } from "pinia";
import { UserUtil } from "../utils/user.util";

export const useUserStore = defineStore("user", {
    state: () => ({
        token: "",
    }),
    getters: {
        hasToken: (state) => {
            return Boolean(state.token);
        },
        isAdmin: (state) => {
            if (state.token.startsWith(UserUtil.VIEWER_PREFIX)) {
                return false;
            }
            return true;
        },
        teacherName: (state) => {
            let name = state.token;
            if (state.token.startsWith(UserUtil.VIEWER_PREFIX)) {
                name = state.token.slice(UserUtil.VIEWER_PREFIX.length);
            }
            return (
                UserUtil.teachers.find((it) => it.name === name)?.showName ||
                "谁啊?"
            );
        },
    },
    actions: {
        async login(token: string) {
            localStorage.setItem(UserUtil.LOGIN_TOKEN, token);
            this.load();
        },
        async load() {
            this.token = localStorage.getItem(UserUtil.LOGIN_TOKEN) ?? "";
        },
        async clear() {
            localStorage.removeItem(UserUtil.LOGIN_TOKEN);
            this.load();
        },
    },
});

