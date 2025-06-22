<template>
  <div class="submission-center">
    <div class="page-header">
      <p>查看您的作业提交记录和评分情况</p>
    </div>

    <div class="submission-table">
      <el-table 
        :data="displayedRecords" 
        v-loading="loading"
        stripe
        style="width: 100%"
        empty-text="暂无提交记录"
      >
        <el-table-column prop="topicId" label="题目ID" width="120" />
        <el-table-column prop="topicTitle" label="题目标题" min-width="200" />
        <el-table-column prop="updateTime" label="最后提交时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.updateTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="infoState" label="状态" width="120">
          <template #default="{ row }">
            <el-tag 
              :type="getStatusType(row.infoState)"
              size="small"
            >
              {{ row.infoState }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="infoNum" label="分数" width="100">
          <template #default="{ row }">
            <span v-if="row.infoState === '已批改'">{{ row.infoNum || '--' }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="批语" width="150">
          <template #default="{ row }">
            <el-button 
              v-if="row.infoState === '已批改' && row.infoCorrect"
              type="primary" 
              size="small"
              @click="showCommentDetail(row)"
            >
              查看详情
            </el-button>
            <span v-else>--</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20]"
          :total="totalRecords"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :disabled="loading"
        />
      </div>
    </div>

    <!-- 批语详情对话框 -->
    <el-dialog
      v-model="commentDialogVisible"
      title="批语详情"
      width="600px"
      :before-close="handleCloseDialog"
    >
      <div class="comment-detail">
        <div class="comment-header">
          <h4>{{ currentComment.topicTitle }}</h4>
          <p class="score">得分：{{ currentComment.infoNum }}</p>
        </div>
        <div class="comment-content">
          <div v-html="currentComment.infoCorrect"></div>
        </div>
      </div>
      <template #footer>
        <el-button @click="commentDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { topicApi } from '../services/api'
import { useUserStore } from '../store/user'

interface SubmissionRecord {
  topicId: string
  topicTitle: string
  updateTime: string
  infoState: string
  infoNum: number | null
  infoCorrect: string
}

const userStore = useUserStore()
const loading = ref(false)
const submissionRecords = ref<SubmissionRecord[]>([])
const commentDialogVisible = ref(false)
const currentComment = ref<SubmissionRecord>({
  topicId: '',
  topicTitle: '',
  updateTime: '',
  infoState: '',
  infoNum: null,
  infoCorrect: ''
})

// 分页相关状态
const currentPage = ref(1)
const pageSize = ref(10) // 默认每页10条
const totalRecords = computed(() => submissionRecords.value.length)

// 计算当前页要显示的记录
const displayedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return submissionRecords.value.slice(start, end)
})

// 获取提交记录
const fetchSubmissionRecords = async () => {
  loading.value = true
  try {
    const response = await topicApi.getTopicList()
    const topicList = response.rows || []
    // 筛选当前学生的提交记录，只显示已提交和已批改的
    const filteredRecords = topicList.filter((topic: any) => 
      topic.studentId === userStore.userInfo.studentId && 
      (topic.infoState === '已提交' || topic.infoState === '已批改')
    )
    
    // 获取每个题目的详细信息
    const recordsWithDetails = await Promise.all(
      filteredRecords.map(async (record: any) => {
        try {
          const topicResponse = await topicApi.getTopic(record.topicId)
          return {
            topicId: record.topicId,
            topicTitle: topicResponse.data?.topicTitle || '未知题目',
            updateTime: record.updateTime,
            infoState: record.infoState,
            infoNum: record.infoNum,
            infoCorrect: record.infoCorrect
          }
        } catch (error) {
          console.error(`获取题目 ${record.topicId} 详情失败:`, error)
          return {
            topicId: record.topicId,
            topicTitle: '未知题目',
            updateTime: record.updateTime,
            infoState: record.infoState,
            infoNum: record.infoNum,
            infoCorrect: record.infoCorrect
          }
        }
      })
    )
    
    // 按时间倒序排列
    submissionRecords.value = recordsWithDetails.sort((a, b) => 
      new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime()
    )
    
    // 重置到第一页
    currentPage.value = 1
    
  } catch (error) {
    console.error('获取提交记录失败:', error)
    ElMessage.error('获取提交记录失败')
  } finally {
    loading.value = false
  }
}

// 分页大小改变处理
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1 // 改变每页条数时回到第一页
}

// 当前页改变处理
const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

// 监听数据变化，确保当前页有效
watch(() => totalRecords.value, (newTotal) => {
  if (newTotal > 0) {
    const maxPage = Math.ceil(newTotal / pageSize.value)
    if (currentPage.value > maxPage) {
      currentPage.value = maxPage
    }
  }
})

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '--'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取状态标签类型
const getStatusType = (status: string) => {
  switch (status) {
    case '已提交':
      return 'warning'
    case '已批改':
      return 'success'
    default:
      return 'info'
  }
}

// 显示批语详情
const showCommentDetail = (record: SubmissionRecord) => {
  currentComment.value = { ...record }
  commentDialogVisible.value = true
}

// 关闭对话框
const handleCloseDialog = (done: () => void) => {
  done()
}

onMounted(() => {
  fetchSubmissionRecords()
})
</script>

<style scoped>
.submission-center {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  margin-bottom: 32px;
  text-align: center;
}

.page-header h2 {
  font-size: 28px;
  color: #303133;
  margin-bottom: 8px;
}

.page-header p {
  color: #909399;
  font-size: 16px;
}

.submission-table {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.comment-detail {
  padding: 16px 0;
}

.comment-header {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.comment-header h4 {
  font-size: 18px;
  color: #303133;
  margin-bottom: 8px;
}

.score {
  font-size: 16px;
  color: #409eff;
  font-weight: 600;
  margin: 0;
}

.comment-content {
  line-height: 1.6;
  color: #303133;
  font-size: 14px;
}

.comment-content :deep(p) {
  margin-bottom: 12px;
}

.comment-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  margin: 8px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .submission-center {
    padding: 10px;
  }
  
  .submission-table {
    padding: 16px;
  }
  
  .pagination-container {
    overflow-x: auto;
  }
}
</style> 