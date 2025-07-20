<template>
    <div class="login">
        <img src="/paw.png" />
        <div>
            <van-cell-group inset>
                <van-field :label="switchLabel">
                    <template #input>
                        <van-switch v-model="login.isTeacher" size="24" />
                    </template>
                </van-field>
                <van-field
                  :modelValue="teacherShowName"
                  is-link
                  readonly
                  :label="teacherLabel"
                  @click="teacherPopup = true"
                />
                <van-popup v-model:show="teacherPopup" round position="bottom" :style="{ height: '55%' }">
                    <van-picker
                        title="叫啥子"
                        :columns="UserUtil.teachers.map(it => it.showName)"
                        @confirm="onTeacherConfirm"
                        @cancel="teacherPopup = false"
                    />
                </van-popup>
                <van-popup v-model:show="keyboardPopup" round position="bottom" :style="{ height: '55%' }">
                    <div class="login__passwd">
                        <van-password-input :value="passwd" focused :length="5" :gutter="15" />
                        <van-number-keyboard v-model="passwd" :maxlength="5" random-key-order :show="!loading" />
                    </div>
                </van-popup>
            </van-cell-group>
            <div style="margin: 16px">
                <van-button plain round block @click="onLogin">嗯</van-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { UserApi } from '../api/user.api';
import { useUserStore } from '../stores/user';
import CryptoJS from 'crypto-js';
import { Toast } from 'vant';
import { UserUtil } from "../utils/user.util";


const userStore = useUserStore()
const router = useRouter()

const login = reactive({
    isTeacher: false,
    teacherName: 'amen',
})

const switchLabel = computed(() => {
    if (login.isTeacher) {
        return "我要排课"
    } else {
        return "我就看看"
    }
})
const teacherLabel = computed(() => {
    if (login.isTeacher) {
        return "我是"
    } else {
        return "想看"
    }
})
const teacherShowName = computed(() => {
    return UserUtil.teachers.find(it => it.name === login.teacherName)?.showName || '谁啊？'
})

const passwd = ref('')
const keyboardPopup = ref(false)
const teacherPopup = ref(false)
const loading = ref(false)

watch(passwd, async (curValue) => {
    if (loading.value) return

    try {
        if (curValue.length == 5) {
            loading.value = true
            const success = await UserApi.login(login.teacherName, CryptoJS.MD5(curValue).toString())
            if (success) {
                await onClick(login.teacherName)
            } else {
                Toast.fail({ message: '你是骗子宝宝' })
                passwd.value = ''
            }
        }
    } finally {
        loading.value = false
    }
})

const onClick = async (token: string) => {
    await userStore.login(token)
    router.push("/")
}

const onLogin = async () => {
    if (login.isTeacher) {
        keyboardPopup.value = true
    } else {
        onClick(`view:${login.teacherName}`)
    }
}

const onTeacherConfirm = (v: any, idx: number) => {
    login.teacherName = UserUtil.teachers[idx]?.name || 'amen'
    teacherPopup.value = false
}

</script>

<style lang="scss">
.login {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;

    background: linear-gradient(74deg, rgba(156, 111, 232, 0.6) 0%, rgba(156, 111, 232, 1) 20%, rgba(156, 111, 232, 1) 49%, rgba(156, 111, 232, 0.6) 79%, rgba(156, 111, 232, 1) 100%);

    &__passwd {
        margin-top: 1rem;
    }

    .van-password-input__security {
        >li {
            border: 1px solid var(--van-primary-color);
            border-radius: 0.5rem;
        }
    }
}
</style>
