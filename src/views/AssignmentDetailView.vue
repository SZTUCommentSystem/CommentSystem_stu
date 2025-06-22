<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import RichTextEditor from '../components/RichTextEditor.vue'
import { assignmentApi, topicApi } from '../services/api'
import { useUserStore } from '../store/user'

interface Question {
  id: string
}

const route = useRoute()
const userStore = useUserStore()
const assignment = ref<any>(null)
const currentQuestion = ref<any>(null)
const loading = ref(false)
const answerContent = ref('')
const answerUrls = ref<string[]>([])
const submitLoading = ref(false)
const editorRef = ref()
const homeworkId = route.params.homeworkId as string


// 获取题目详情
const getAssignmentDetail = async () => {
  try {
    loading.value = true
    const homeworkRes = await assignmentApi.getHomeworkDetail(homeworkId)
    const topicIds = homeworkRes.data.topicIds
      ? homeworkRes.data.topicIds.split(',').
        map((id: string) => Number(id.trim())).filter((id: number) => !isNaN(id)) : []  
    const questionDetails = await Promise.all(
      topicIds.map((id: number) => topicApi.getTopic(String(id)))
    )
    assignment.value = {
      title: homeworkRes.data.homeworkTitle,
      questions: questionDetails.map(res => res.data)
    }
    if (assignment.value.questions.length > 0) {
      currentQuestion.value = assignment.value.questions[0]
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 选择题目
const handleQuestionClick = (question: Question) => {
  currentQuestion.value = question
  answerContent.value = ''
  answerUrls.value = []
}

// 移除上传的图片
const removeImage = (index: number) => {
  answerUrls.value.splice(index, 1)
}



// 提交答案
const handleSubmit = async () => {
  if (!currentQuestion.value) return
  
  if (!answerContent.value.trim()) {
    ElMessage.warning('请填写答案内容')
    return
  }

  try {
    submitLoading.value = true
    const topiclist = await topicApi.getTopicList()
    const homeworkStudentinfo = topiclist.rows.find((item: any)=>item.topicId===currentQuestion.value.topicId && item.studentId===userStore.userInfo.studentId)
  
    // 格式化当前时间为 YYYY-MM-DD HH:mm:ss 格式
    const now = new Date()
    const currentTime = now.getFullYear() + '-' + 
      String(now.getMonth() + 1).padStart(2, '0') + '-' + 
      String(now.getDate()).padStart(2, '0') + ' ' +
      String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0') + ':' +
      String(now.getSeconds()).padStart(2, '0')
    console.log(currentTime)
    // 提交数据对象
    const response = await assignmentApi.submitAnswer({
      id: homeworkStudentinfo.id,
      answerInfo: answerContent.value,
      homeworkStudentId: homeworkStudentinfo.homeworkStudentId,
      answerUrls: answerUrls.value.join(','),
      infoState:"已提交",
      updateTime: currentTime,
      infoCorrect:"批语test"
    })
    console.log(homeworkStudentinfo)
    ElMessage.success('答案提交成功！')
    answerContent.value = ''
    answerUrls.value = []
  } catch (error: any) {
    ElMessage.error(error.response.data.message)
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
      <el-aside width="280px" class="question-list">
        <div class="assignment-header">
          <h3>{{ assignment?.title }}</h3>
          <el-divider />
        </div>
        <el-menu
          :default-active="String(currentQuestion?.topicId)"
          class="question-menu"
        >
          <el-menu-item
            v-for="question in assignment?.questions"
            :key="question.topicId"
            :index="String(question.topicId)"
            @click="handleQuestionClick(question)"
            class="question-menu-item"
          >
            <span class="question-title">{{ question.topicTitle }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-main v-if="currentQuestion" class="main-content">
        <!-- 题目详情区域 -->
        <el-card class="question-card" shadow="never">
          <template #header>
            <div class="question-header">
              <h2>{{ currentQuestion.topicTitle }}</h2>
            </div>
          </template>
          
          <div class="question-content">
            <div class="description">
              {{ currentQuestion.topicInfo }}
            </div>
            
            <div class="images" v-if="currentQuestion?.topicUrls?.length > 0">
              <el-image
                v-for="(image, index) in currentQuestion.topicUrls.split(',')"
                :key="index"
                :src="image"
                :preview-src-list="currentQuestion.topicUrls.split(',')"
                fit="cover"
                class="question-image"
              />
            </div>
          </div>
        </el-card>

        <!-- 答题区域 -->
        <el-card class="answer-card" shadow="never">
          <template #header>
            <div class="answer-header">
              <h3>编写答案</h3>
            </div>
          </template>

          <!-- Markdown编辑器 -->
          <div class="editor-section">
            <h4>答案内容</h4>
            <RichTextEditor
              ref="editorRef"
              v-model="answerContent"
              v-model:upload-urls="answerUrls"
              placeholder="请输入您的答案..."
              height="400px"
            />
            
            <!-- 已上传的图片预览 -->
            <div v-if="answerUrls.length > 0" class="uploaded-images">
              <h5>已上传的图片 ({{ answerUrls.length }}张)</h5>
              <div class="image-grid">
                <div v-for="(url, index) in answerUrls" :key="index" class="image-item">
                  <el-image
                    :src="url"
                    fit="cover"
                    class="uploaded-image"
                    :preview-src-list="answerUrls"
                  />
                  <el-button
                    size="small"
                    type="danger"
                    text
                    @click="removeImage(index)"
                    class="remove-btn"
                  >
                    ✕
                  </el-button>
                </div>
              </div>
            </div>
          </div>



          <!-- 提交按钮 -->
          <div class="submit-section">
            <el-button
              type="primary"
              size="large"
              :loading="submitLoading"
              @click="handleSubmit"
            >
              📤 提交答案
            </el-button>
            <span class="submit-tip">
              提交前请仔细检查答案内容
            </span>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.assignment-detail-container {
  height: 100vh;
  background-color: #f5f7fa;
}

.question-list {
  background: white;
  border-right: 1px solid #e6e6e6;
  padding: 0;
  height: 100vh;
  overflow-y: auto;
}

.assignment-header {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.assignment-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.question-menu {
  border-right: none;
  background: transparent;
}

.question-menu-item {
  margin: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s;
}

.question-menu-item:hover {
  background-color: #cde0fc;
}

.question-menu-item.is-active {
  background: linear-gradient(45deg, #409eff, #40b3ff);
  color: rgb(24, 23, 23);
}

.question-title {
  font-weight: 500;
  line-height: 1.5;
}

.main-content {
  padding: 20px;
  background-color: #f5f7fa;
  overflow-y: auto;
}

.question-card {
  margin-bottom: 20px;
}

.question-header h2 {
  margin: 0;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.question-content {
  font-size: 16px;
  line-height: 1.6;
}

.description {
  margin: 20px 0;
  white-space: pre-wrap;
  color: #606266;
}

.images {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin: 20px 0;
}

.question-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.answer-card {
  border: none;
}

.answer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.answer-header h3 {
  margin: 0;
  color: #303133;
  font-size: 20px;
  font-weight: 600;
}

.answer-tips {
  color: #909399;
  font-size: 14px;
}

.editor-section {
  margin-bottom: 30px;
}

.editor-section h4 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.editor-tips {
  margin-bottom: 12px;
  padding: 8px 12px;
  background-color: #f0f9ff;
  border: 1px solid #e1f5fe;
  border-radius: 4px;
  color: #0277bd;
  font-size: 13px;
}

.editor-tips span {
  line-height: 1.4;
}

.uploaded-images {
  margin-top: 20px;
  padding: 16px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  background-color: #fafbfc;
}

.uploaded-images h5 {
  margin: 0 0 12px 0;
  color: #606266;
  font-size: 14px;
  font-weight: 600;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.image-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.uploaded-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #dcdfe6;
  font-size: 12px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: #f56c6c;
  color: white;
  border-color: #f56c6c;
}



.submit-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding-top: 20px;
  border-top: 1px solid #e6e6e6;
}

.submit-tip {
  color: #909399;
  font-size: 14px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .question-list {
    width: 100% !important;
    position: fixed;
    top: 60px;
    left: -280px;
    z-index: 1000;
    transition: left 0.3s;
  }

  .main-content {
    margin-left: 0;
  }

  .images {
    grid-template-columns: 1fr;
  }

  .answer-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .submit-section .el-button {
    width: 100%;
  }
}
</style>