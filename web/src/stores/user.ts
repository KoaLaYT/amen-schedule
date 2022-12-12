import { defineStore } from "pinia";

const LOGIN_TOKEN = "login-token"
const ADMIN_TOKEN = "XX"

export const useUserStore = defineStore('user', {
    state: () => ({
        token: '',
    }),
    getters: {
        hasToken: (state) => {
            return Boolean(state.token)
        },
        isAdmin: (state) => {
            return state.token == ADMIN_TOKEN
        }
    },
    actions: {
        async login(token: string) {
            localStorage.setItem(LOGIN_TOKEN, token);
            this.load()
        },
        async load() {
            this.token = localStorage.getItem(LOGIN_TOKEN) ?? ""
        },
        async clear() {
            localStorage.removeItem(LOGIN_TOKEN)
            this.load()
        }
    }
})