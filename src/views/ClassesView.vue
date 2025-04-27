<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { classApi } from '../services/api'

interface ClassInfo {
  id: string
  name: string
  teacher: string
}

const router = useRouter()
const classes = ref<ClassInfo[]>([])
const classIdInput = ref('')
const loading = ref(false)
const joinDialogVisible = ref(false)

const getClasses = async () => {
  try {
    loading.value = true
    const res = await classApi.getJoinedClasses()
    classes.value = res.data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleJoinClass = async () => {
  if (!classIdInput.value) {
    ElMessage.warning('请输入班级ID')
    return
  }

  try {
    loading.value = true
    await classApi.joinClass(classIdInput.value)
    ElMessage.success('加入班级成功')
    joinDialogVisible.value = false
    await getClasses()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const goToAssignments = (classId: string) => {
  router.push(`/assignments/${classId}`)
}

onMounted(() => {
  getClasses()
})
</script>

<template>
  <div class="classes-container">
    <div class="header">
      <h2>我的班级</h2>
      <el-button type="primary" @click="joinDialogVisible = true">
        加入班级
      </el-button>
    </div>

    <el-row :gutter="20" class="class-list">
      <el-col
        v-for="item in classes"
        :key="item.id"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
      >
        <el-card
          class="class-card"
          shadow="hover"
          @click="goToAssignments(item.id)"
        >
          <h3>{{ item.name }}</h3>
          <p>班级ID：{{ item.id }}</p>
          <p>教师：{{ item.teacher }}</p>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      v-model="joinDialogVisible"
      title="加入班级"
      width="30%"
    >
      <el-form>
        <el-form-item label="班级ID">
          <el-input v-model="classIdInput" placeholder="请输入班级ID" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="joinDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            :loading="loading"
            @click="handleJoinClass"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.classes-container {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.class-list {
  margin-top: 20px;
}

.class-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.3s;
}

.class-card:hover {
  transform: translateY(-5px);
}

h3 {
  margin: 0 0 10px 0;
  color: #409eff;
}

p {
  margin: 5px 0;
  color: #666;
}
</style> 