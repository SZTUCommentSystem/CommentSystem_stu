<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { assignmentApi } from '../services/api'

interface Question {
  id: string
  type: string
  title: string
  tags: string[]
  description: string
  images: string[]
}

interface Assignment {
  id: string
  title: string
  questions: Question[]
}

const route = useRoute()
const assignment = ref<Assignment | null>(null)
const currentQuestion = ref<Question | null>(null)
const loading = ref(false)
const uploadFiles = ref<File[]>([])
const questionContent = ref('')
const submitLoading = ref(false)
const askQuestionDialogVisible = ref(false)

const getAssignmentDetail = async () => {
  const assignmentId = route.params.assignmentId as string
  try {
    loading.value = true
    const res = await assignmentApi.getAssignmentDetail(assignmentId)
    assignment.value = res.data
    if (res.data.questions.length > 0) {
      currentQuestion.value = res.data.questions[0]
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleQuestionClick = (question: Question) => {
  currentQuestion.value = question
  uploadFiles.value = []
}

const handleFileChange = (files: File[]) => {
  uploadFiles.value = files
}

const handleSubmit = async () => {
  if (!currentQuestion.value) return
  if (uploadFiles.value.length === 0) {
    ElMessage.warning('请选择要提交的文件')
    return
  }

  try {
    submitLoading.value = true
    await assignmentApi.submitAnswer({
      questionId: currentQuestion.value.id,
      files: uploadFiles.value
    })
    ElMessage.success('提交成功')
    uploadFiles.value = []
  } catch (error) {
    console.error(error)
  } finally {
    submitLoading.value = false
  }
}

const handleAskQuestion = async () => {
  if (!currentQuestion.value || !questionContent.value) {
    ElMessage.warning('请输入问题内容')
    return
  }

  try {
    submitLoading.value = true
    await assignmentApi.askQuestion({
      questionId: currentQuestion.value.id,
      content: questionContent.value
    })
    ElMessage.success('提问成功')
    askQuestionDialogVisible.value = false
    questionContent.value = ''
  } catch (error) {
    console.error(error)
  } finally {
    submitLoading.value = false
  }
}

onMounted(() => {
  getAssignmentDetail()
})
</script>

<template>
  <div class="assignment-detail-container">
    <el-container v-loading="loading">
      <el-aside width="250px" class="question-list">
        <h3>{{ assignment?.title }}</h3>
        <el-menu
          :default-active="currentQuestion?.id"
          class="question-menu"
        >
          <el-menu-item
            v-for="question in assignment?.questions"
            :key="question.id"
            :index="question.id"
            @click="handleQuestionClick(question)"
          >
            {{ question.title }}
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-main v-if="currentQuestion">
        <div class="question-detail">
          <h2>{{ currentQuestion.title }}</h2>
          <div class="tags">
            <el-tag
              v-for="tag in currentQuestion.tags"
              :key="tag"
              size="small"
              style="margin-right: 5px"
            >
              {{ tag }}
            </el-tag>
          </div>
          <div class="description">
            {{ currentQuestion.description }}
          </div>
          <div class="images" v-if="currentQuestion.images.length > 0">
            <el-image
              v-for="(image, index) in currentQuestion.images"
              :key="index"
              :src="image"
              :preview-src-list="currentQuestion.images"
              fit="cover"
              class="question-image"
            />
          </div>
        </div>

        <div class="submit-section">
          <el-upload
            action=""
            :auto-upload="false"
            :on-change="(file: { raw: File }) => handleFileChange([...uploadFiles, file.raw])"
            :file-list="uploadFiles"
            multiple
            accept=".jpg,.jpeg,.png"
          >
            <el-button type="primary">选择文件</el-button>
          </el-upload>

          <div class="actions">
            <el-button
              type="primary"
              :loading="submitLoading"
              @click="handleSubmit"
            >
              提交答案
            </el-button>
            <el-button
              type="info"
              @click="askQuestionDialogVisible = true"
            >
              提问
            </el-button>
          </div>
        </div>
      </el-main>
    </el-container>

    <el-dialog
      v-model="askQuestionDialogVisible"
      title="提问"
      width="50%"
    >
      <el-form>
        <el-form-item>
          <el-input
            v-model="questionContent"
            type="textarea"
            rows="4"
            placeholder="请输入您的问题"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="askQuestionDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            :loading="submitLoading"
            @click="handleAskQuestion"
          >
            提交
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.assignment-detail-container {
  height: 100vh;
}

.question-list {
  border-right: 1px solid #e6e6e6;
  padding: 20px 0;
}

.question-list h3 {
  padding: 0 20px;
  margin-bottom: 20px;
}

.question-menu {
  border-right: none;
}

.question-detail {
  margin-bottom: 30px;
}

.tags {
  margin: 10px 0;
}

.description {
  margin: 20px 0;
  white-space: pre-wrap;
}

.images {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px 0;
}

.question-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
}

.submit-section {
  border-top: 1px solid #e6e6e6;
  padding-top: 20px;
}

.actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}
</style> 