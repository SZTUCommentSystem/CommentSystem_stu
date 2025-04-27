<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { assignmentApi } from '../services/api'

interface Assignment {
  id: string
  title: string
  directory: string
  tags: string[]
  deadline: string
  teacher: string
}

const router = useRouter()
const route = useRoute()
const assignments = ref<Assignment[]>([])
const loading = ref(false)

const getAssignments = async () => {
  const classId = route.params.classId as string
  try {
    loading.value = true
    const res = await assignmentApi.getClassAssignments(classId)
    assignments.value = res.data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const goToAssignmentDetail = (assignmentId: string) => {
  router.push(`/assignment/${assignmentId}`)
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString()
}

onMounted(() => {
  getAssignments()
})
</script>

<template>
  <div class="assignments-container">
    <div class="header">
      <h2>作业列表</h2>
    </div>

    <el-table
      v-loading="loading"
      :data="assignments"
      style="width: 100%"
    >
      <el-table-column prop="title" label="标题" min-width="150">
        <template #default="{ row }">
          <el-button
            type="text"
            @click="goToAssignmentDetail(row.id)"
          >
            {{ row.title }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="directory" label="目录" min-width="120" />
      <el-table-column label="标签" min-width="150">
        <template #default="{ row }">
          <el-tag
            v-for="tag in row.tags"
            :key="tag"
            size="small"
            style="margin-right: 5px"
          >
            {{ tag }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="截止时间" min-width="180">
        <template #default="{ row }">
          {{ formatDate(row.deadline) }}
        </template>
      </el-table-column>
      <el-table-column prop="teacher" label="布置老师" min-width="120" />
    </el-table>
  </div>
</template>

<style scoped>
.assignments-container {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style> 