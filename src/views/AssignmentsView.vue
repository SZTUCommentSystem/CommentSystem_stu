<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { assignmentApi,topicApi } from '../services/api'

const route = useRoute()
const router = useRouter()

const assignments = ref<any[]>([])
const loading = ref(true)

const labelCache = new Map<number, string>()
const topicCache = new Map<number, number[]>()

const studentId = String(route.params.studentId)

const goToAssignmentDetail = (homeworkId: number) => {
  router.push({ name: 'assignmentDetail', params: { homeworkId } })
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', { hour12: false })
}

onMounted(async () => {
  try {
    // const homeworklist = await assignmentApi.getHomeworkList()
    // const rows = homeworklist.rows?.filter(item => item.studentId === studentId) || []
    // const homeworkIds = [...new Set(rows.map(item => item.homeworkId))]
    // for (const homeworkId of homeworkIds) {
    //   const homeworkRes = await assignmentApi.getHomeworkDetail(homeworkId)
    //   const detail = homeworkRes.data
    //   const topicIds = detail.topicIds
    //   ? detail.topicIds.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id)): []
    //   for (const topicId of topicIds){
    //     const topicRes = await topicApi.getTopic(topicId)
    //     const topicData = topicRes.data
    //     const labelIds = topicData.labelIds
    //     ? topicData.labelIds.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id)): []
    //     for (const labelId of labelIds){
    //       const labelRes = await topicApi.getLabel(labelId)
    //       const labelData = labelRes.data
    //       labelCache.set(labelId, labelData.topicLabelName)
    //     }
    //   }
    //   const tags = Array.from(labelCache.values())

    //   assignments.value.push({
    //     homeworkId: detail.homeworkId,
    //     homeworkTitle: detail.homeworkTitle,
    //     limitTime: detail.limitTime,
    //     tags: tags
    //   })
    console.log('=== 开始获取作业数据 ===')
    console.log('当前学生ID:', studentId)
    
    // 获取增强的作业学生列表（已包含作业详情和标签信息）
    const homeworklist = await assignmentApi.getHomeworkList()
    console.log('获取到的作业学生列表:', homeworklist)
    
    // 筛选当前学生的作业记录
    const rows = homeworklist.rows?.filter(item => item.studentId === studentId) || []
    console.log('筛选后的作业记录:', rows)
    
    // 直接使用增强数据构建作业列表
    assignments.value = rows.map(item => ({
      homeworkId: item.homeworkId,
      homeworkTitle: item.homeworkTitle,
      limitTime: item.limitTime,
      tags: item.tags || []
    }))
    
    console.log('=== 最终作业列表 ===', assignments.value)
  } catch (err) {
    ElMessage.error('获取作业失败')
  } finally {
    loading.value = false
  }
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
      <el-table-column prop="homeworkId" label="作业ID" min-width="120" />

      <el-table-column prop="homeworkTitle" label="标题" min-width="150">
        <template #default="{ row }">
          <el-button type="text" @click="goToAssignmentDetail(row.homeworkId)">
            {{ row.homeworkTitle }}
          </el-button>
        </template>
      </el-table-column>

      <el-table-column label="标签" min-width="180">
        <template #default="{ row }">
          <el-tag
            v-for="tag in row.tags"
            :key="tag"
            size="small"
            type="info"
            class="tag"
          >
            {{ tag }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="截止时间" min-width="180">
        <template #default="{ row }">
          {{ formatDate(row.limitTime) }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.assignments-container {
  padding: 20px;
}
.header {
  margin-bottom: 20px;
}
.tag {
  margin-right: 5px;
  margin-bottom: 4px;
  display: inline-block;
}
</style>
