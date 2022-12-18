<template>
    <div class="ams-edit-student">
        <div class="ams-edit-student__title"> {{ title }} </div>
        <van-form @submit="onSubmit">
            <van-cell-group inset>
                <van-field v-model="student.name" type="text" name="name" label="名字" />
                <van-field v-model="student.fee" type="number" name="fee" label="课时费" />
                <van-field v-model="student.fgColor" type="color" name="fgColor" label="字色" />
                <van-field v-model="student.bgColor" type="color" name="bgColor" label="底色" />
                <van-field v-model="student.duration" type="number" name="duration" label="时长" />
            </van-cell-group>
            <div class="ams-edit-student__btn">
                <van-button round block type="primary" native-type="submit" :loading="studentStore.isUpdating">
                    确认
                </van-button>
            </div>
        </van-form>
    </div>
</template>

<script setup lang="ts">
import { Notify } from 'vant';
import { computed, onMounted, reactive, watch } from 'vue';
import { Student, useStudentStore } from '../stores/student';
import { CommonUtil } from '../utils/common.util';

const props = defineProps<{ visible: boolean; student: Student }>()

const student = reactive({
    id: 0,
    name: '',
    fee: 0,
    fgColor: '',
    bgColor: '',
    duration: 45,
});

const initStudent = () => {
    CommonUtil.log(props.student)
    student.id = props.student.id ?? 0
    student.name = props.student.name ?? ''
    student.fee = props.student.fee ?? 0
    student.fgColor = props.student.fgColor || '#000000'
    student.bgColor = props.student.bgColor || '#DDDDDD'
    student.duration = props.student.duration || 45
}

const title = computed(() => {
    const action = student.id > 0 ? '改孩儿？' : '加孩儿！'
    return action
})

onMounted(() => {
    initStudent()
})

watch(() => props.visible, () => {
    if (props.visible) {
        initStudent()
    }
})

const studentStore = useStudentStore()
const emit = defineEmits(['submit'])

const onSubmit = () => {
    CommonUtil.log({ ...student })

    if (!checkFormValidity()) return

    if (student.id > 0) {
        studentStore.updateStudent({ ...student })
    } else {
        studentStore.createStudent({ ...student })
    }
    emit('submit')
}

function checkFormValidity() {
    if (student.name == '') {
        Notify({ type: 'warning', message: "名字呢" })
        return false;
    }

    if (student.fee <= 0) {
        Notify({ type: 'warning', message: "不要钱的嘛" })
        return false;
    }

    return true;
}

</script>

<style lang="scss">
.ams-edit-student {
    &__title {
        color: var(--van-primary-color);
        font-size: 1.2rem;
        margin: 1rem auto;
        text-align: center;
    }

    &__btn {
        margin: 1rem;
    }
}
</style>