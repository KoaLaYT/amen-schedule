<template>
    <div class="login">
        <img src="/paw.png" />
        <van-button plain @click="showPopup = true">我是阿菛宝宝</van-button>
        <van-button plain @click="onClick('DD')">我不是阿菛宝宝</van-button>
        <van-popup v-model:show="showPopup" round position="bottom" :style="{ height: '40%' }">
            <div class="login__passwd">
                <van-password-input :value="passwd" focused :length="5" :gutter="15" />
                <van-number-keyboard v-model="passwd" :maxlength="5" random-key-order :show="!loading" />
            </div>
        </van-popup>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { UserApi } from '../api/user.api';
import { useUserStore } from '../stores/user';
import CryptoJS from 'crypto-js';
import { Toast } from 'vant';

const userStore = useUserStore()
const router = useRouter()

const showPopup = ref(false)
const passwd = ref('')
const loading = ref(false)

watch(passwd, async (curValue) => {
    if (loading.value) return

    try {
        if (curValue.length == 5) {
            loading.value = true
            const success = await UserApi.login(CryptoJS.MD5(curValue).toString())
            if (success) {
                await onClick('XX')
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

</script>

<style lang="scss">
.login {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;

    background: linear-gradient(74deg, rgba(156, 111, 232, 0.6) 0%, rgba(156, 111, 232, 1) 20%, rgba(156, 111, 232, 1) 49%, rgba(156, 111, 232, 0.6) 79%, rgba(156, 111, 232, 1) 100%);

    >button {
        width: 12rem;
        margin-bottom: 2rem;
        border-radius: 1rem;
    }

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