<template>
    <div class="view-student">
        <div class="view-student__header">
            <van-button v-if="userStore.isAdmin" type="primary" icon="plus" plain square @click="onCreateStudent" />
            <div>孩儿们</div>
            <van-button type="primary" icon="./paw-icon.png" @click="onChangeRole" />
        </div>
        <van-pull-refresh :model-value="loading" @refresh="onLoad">
            <van-collapse v-model="activeNames">
                <van-collapse-item v-for="student in students" :key="student.id" :name="student.id"
                    :title="student.name" :disabled="!userStore.isAdmin">
                    <ams-student :student="student" @edit="onEditStudent(student)" />
                </van-collapse-item>
            </van-collapse>
        </van-pull-refresh>
        <van-divider dashed />
        <a class="view-student__footer" href="https://www.flaticon.com/" title="icons">
            Icons are created by Freepik - Flaticon
        </a>
        <van-popup v-model:show="editorShow" round position="bottom" :style="{ height: '45%' }">
            <ams-edit-student :visible="editorShow" :student="editorStudent" @submit="editorShow = false" />
        </van-popup>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Student, useStudentStore } from '../stores/student';
import { useUserStore } from '../stores/user';

const studentStore = useStudentStore()
const userStore = useUserStore()
const router = useRouter()

const students = computed(() => studentStore.students)
const activeNames = ref([])

const loading = computed(() => studentStore.isFetching)
const onLoad = () => studentStore.fetchStudents()

onMounted(() => {
    if (!studentStore.fetched) {
        studentStore.fetchStudents()
    }
})

const editorShow = ref(false)
const editorStudent = reactive({} as Student)

const onCreateStudent = () => {
    editorStudent.id = 0
    editorStudent.name = ''
    editorStudent.fee = 0
    editorStudent.fgColor = ''
    editorStudent.bgColor = ''
    editorStudent.duration = 0

    editorShow.value = true
}

const onEditStudent = (student: Student) => {
    editorStudent.id = student.id
    editorStudent.name = student.name
    editorStudent.fee = student.fee
    editorStudent.fgColor = student.fgColor
    editorStudent.bgColor = student.bgColor
    editorStudent.duration = student.duration

    editorShow.value = true
}

const onChangeRole = () => {
    userStore.clear()
    router.push("/login")
}

</script>

<style lang="scss">
.view-student {
    &__header {
        --van-button-icon-size: 2rem;

        display: flex;
        height: 3rem;
        background-color: var(--van-primary-color);
        color: var(--van-gray-3);
        align-items: center;
        justify-content: space-between;

        &>div {
            flex: 1;
            text-align: center;
        }
    }

    &__footer {
        display: block;
        text-align: center;
        color: var(--van-primary-color);
    }
}
</style>