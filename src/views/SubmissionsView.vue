<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { QuestionFilled, ChatRound } from '@element-plus/icons-vue'
import { submissionApi } from '../services/api'

interface Question {
  content: string
  createTime: string
  reply?: {
    content: string
    createTime: string
  }
}

interface Submission {
  id: string
  assignmentId: string
  assignmentTitle: string
  questionId: string
  questionTitle: string
  questionType: string
  submitTime: string
  status: 'pending' | 'graded'
  score?: number
  feedback?: string
  question?: Question
}

const loading = ref(false)
const submissions = ref<Submission[]>([])
const dialogVisible = ref(false)
const currentSubmission = ref<Submission | null>(null)
const questionLoading = ref(false)

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadSubmissions = async () => {
  try {
    loading.value = true
    const res = await submissionApi.getList()
    submissions.value = res.data
  } catch (error) {
    console.error(error)
    ElMessage.error('获取提交记录失败')
  } finally {
    loading.value = false
  }
}

const showSubmissionDetail = async (row: Submission) => {
  try {
    const res = await submissionApi.getDetail(row.id)
    currentSubmission.value = res.data
    dialogVisible.value = true
  } catch (error) {
    console.error(error)
    ElMessage.error('获取详情失败')
  }
}

const handleAskQuestion = async () => {
  if (!currentSubmission.value) return

  try {
    questionLoading.value = true
    const { value: content } = await ElMessageBox.prompt('请输入您的问题', '添加提问', {
      confirmButtonText: '提交',
      cancelButtonText: '取消',
      inputType: 'textarea',
      inputPlaceholder: '请详细描述您的问题...'
    })
    
    if (content) {
      const res = await submissionApi.addQuestion(currentSubmission.value.id, {
        content
      })
      currentSubmission.value.question = res.data
      ElMessage.success('提问成功')
      await loadSubmissions()
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error(error)
      ElMessage.error('提问失败')
    }
  } finally {
    questionLoading.value = false
  }
}

onMounted(() => {
  loadSubmissions()
})
</script>

<template>
  <div class="submissions-container">
    <h2>提交记录</h2>
    <el-table :data="submissions" style="width: 100%" v-loading="loading">
      <el-table-column label="作业信息" min-width="200">
        <template #default="{ row }">
          <div class="assignment-info">
            <div class="title">{{ row.assignmentTitle }}</div>
            <div class="subtitle">
              <el-tag size="small" type="info">{{ row.questionType }}</el-tag>
              {{ row.questionTitle }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="submitTime" label="提交时间" min-width="180">
        <template #default="{ row }">
          {{ formatDate(row.submitTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="120">
        <template #default="{ row }">
          <el-tag :type="row.status === 'pending' ? 'warning' : 'success'">
            {{ row.status === 'pending' ? '待批改' : '已批改' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="score" label="分数" width="100">
        <template #default="{ row }">
          {{ row.status === 'graded' ? row.score : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="提问状态" width="120">
        <template #default="{ row }">
          <el-tag v-if="row.question" :type="row.question.reply ? 'success' : 'warning'">
            {{ row.question.reply ? '已回复' : '待回复' }}
          </el-tag>
          <el-tag v-else type="info">未提问</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="showSubmissionDetail(row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="提交详情"
      width="600px"
      destroy-on-close
    >
      <div v-if="currentSubmission" class="submission-detail">
        <div class="detail-item">
          <span class="label">作业标题：</span>
          <span>{{ currentSubmission.assignmentTitle }}</span>
        </div>
        <div class="detail-item">
          <span class="label">题目：</span>
          <div class="question-info">
            <el-tag size="small" type="info">{{ currentSubmission.questionType }}</el-tag>
            <span class="question-title">{{ currentSubmission.questionTitle }}</span>
          </div>
        </div>
        <div class="detail-item">
          <span class="label">提交时间：</span>
          <span>{{ formatDate(currentSubmission.submitTime) }}</span>
        </div>
        <div class="detail-item">
          <span class="label">状态：</span>
          <el-tag :type="currentSubmission.status === 'pending' ? 'warning' : 'success'">
            {{ currentSubmission.status === 'pending' ? '待批改' : '已批改' }}
          </el-tag>
        </div>
        <template v-if="currentSubmission.status === 'graded'">
          <div class="detail-item">
            <span class="label">分数：</span>
            <span>{{ currentSubmission.score }}</span>
          </div>
          <div class="detail-item">
            <span class="label">教师评语：</span>
            <div class="feedback">{{ currentSubmission.feedback }}</div>
          </div>
        </template>

        <!-- 提问和回复部分 -->
        <div class="question-section">
          <div class="section-title">提问与回复</div>
          <template v-if="currentSubmission.question">
            <div class="question-content">
              <div class="question-header">
                <el-icon><QuestionFilled /></el-icon>
                <span>我的提问</span>
                <span class="time">{{ formatDate(currentSubmission.question.createTime) }}</span>
              </div>
              <div class="content">{{ currentSubmission.question.content }}</div>
            </div>
            <div v-if="currentSubmission.question.reply" class="reply-content">
              <div class="reply-header">
                <el-icon><ChatRound /></el-icon>
                <span>教师回复</span>
                <span class="time">{{ formatDate(currentSubmission.question.reply.createTime) }}</span>
              </div>
              <div class="content">{{ currentSubmission.question.reply.content }}</div>
            </div>
            <div v-else class="no-reply">
              教师暂未回复，请耐心等待
            </div>
          </template>
          <div v-else class="no-question">
            <el-empty description="暂无提问" />
            <el-button type="primary" @click="handleAskQuestion" :loading="questionLoading">
              添加提问
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.submissions-container {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: var(--card-shadow);
}

h2 {
  margin-bottom: 20px;
  color: var(--text-primary);
}

.submission-detail {
  padding: 20px;
}

.detail-item {
  margin-bottom: 16px;
}

.label {
  color: var(--text-secondary);
  margin-right: 8px;
  display: inline-block;
  width: 80px;
}

.feedback {
  margin-top: 8px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
  color: var(--text-regular);
  line-height: 1.6;
}

.question-section {
  margin-top: 24px;
  border-top: 1px solid var(--border-color);
  padding-top: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.question-content,
.reply-content {
  margin-bottom: 16px;
  padding: 16px;
  border-radius: 8px;
  background: #f5f7fa;
}

.question-header,
.reply-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  color: var(--text-regular);
}

.question-header .el-icon,
.reply-header .el-icon {
  margin-right: 8px;
  font-size: 18px;
}

.time {
  margin-left: auto;
  font-size: 12px;
  color: var(--text-secondary);
}

.content {
  color: var(--text-primary);
  line-height: 1.6;
}

.no-reply {
  color: var(--text-secondary);
  text-align: center;
  padding: 16px;
  background: #fff9f9;
  border-radius: 4px;
}

.no-question {
  text-align: center;
  padding: 20px;
}

.no-question .el-button {
  margin-top: 16px;
}

.assignment-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.assignment-info .title {
  font-weight: 500;
  color: var(--text-primary);
}

.assignment-info .subtitle {
  color: var(--text-regular);
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.question-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.question-title {
  color: var(--text-regular);
}
</style> 