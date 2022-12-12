<template>
    <div class="login">
        <img src="/paw.png" />
        <van-button plain @click="onClick('XX')">我是阿菛宝宝</van-button>
        <van-button plain @click="onClick('DD')">我不是阿菛宝宝</van-button>
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';


const userStore = useUserStore()
const router = useRouter()

const onClick = async (token: string) => {
    await userStore.login(token)
    router.push("/")
}

</script>

<style scoped lang="scss">
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
}
</style>