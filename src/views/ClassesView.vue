<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { classApi,userApi,studentApi,courseApi } from '../services/api'
import { useUserStore } from '../store/user'

interface ClassInfo {
  classId: string
  courseId: string
  className: string
  courseName: string
  studentId: string
}

const router = useRouter()
const userStore = useUserStore()
const classes = ref<ClassInfo[]>([])
const classIdInput = ref('')
const loading = ref(false)
const joinDialogVisible = ref(false)

const getClasses = async () => {
  try {
    loading.value = true
    
    // 1. 获取当前用户信息
    const userRes = await userApi.getInfo()
    const userId = userRes.user.userId

    // 2. 获取学生列表并匹配班级ID
    const studentRes = await studentApi.getStudentList();
    const studentList = studentRes.rows || []; 
    const studentInfo = studentList.find((s: any) => s.userId === userId); 
    if (!studentInfo) {
      ElMessage.error('未找到学生信息')
      return
          }
      
      // 保存studentId到user store
      userStore.setStudentId(studentInfo.studentId)
    // 3. 获取班级详细信息
    const classIdlist = await classApi.getClasses({pageNum:'1',pageSize:'999',studentId: studentInfo?.studentId}) 
    
    
    // 4. 遍历每个班级ID，获取班级信息和课程信息
    const classInfoPromises = classIdlist.rows.map(async (classItem: any) => {
      try {
        // 获取班级详细信息
        const classInfo = await classApi.getClassInfo(classItem.classId)
        // 获取课程信息
        const courseInfo = await courseApi.getCourseInfo(classInfo.data.courseId)
        
        return {
          classId: classItem.classId,
          courseId: classInfo.data.courseId,
          className: classInfo.data.className,
          courseName: courseInfo.data.courseName,
          studentId: studentInfo.studentId,
        }
      } catch (error) {
        console.error(`获取班级 ${classItem.classId} 信息失败:`, error)
        return null
      }
    })
    
    const classResults = await Promise.all(classInfoPromises)
    classes.value = classResults.filter(item => item !== null) as ClassInfo[]

  } catch (error) {
    console.error(error)
    ElMessage.error('获取班级信息失败')
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
    // 1. 获取当前用户信息
    const userRes = await userApi.getInfo()
    const userId = userRes.user.userId
    // 2. 获取学生id
    const studentRes = await studentApi.getStudentList();
    const studentList = studentRes.rows || []; 
    const studentInfo = studentList.find((s: any) => s.userId === userId); 
    
    // 保存studentId到user store（如果还没有保存的话）
    if (!userStore.userInfo.studentId) {
      userStore.setStudentId(studentInfo.studentId)
      console.log('已保存studentId到store:', studentInfo.studentId)
    }
    
    await classApi.joinClass({studentId:studentInfo.studentId,classId:classIdInput.value})
    ElMessage.success('加入班级成功')
    joinDialogVisible.value = false
    await getClasses()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const goToAssignments = (studentId:string) => {
  console.log('从班级页面跳转到作业列表，studentId:', studentId)
  try {
    router.push({
      name: 'assignments',
      params: { studentId: String(studentId) }
    })
  } catch (error) {
    console.error('跳转到作业列表失败:', error)
    ElMessage.error('页面跳转失败')
  }
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
        :key="item.courseId"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
      >
        <el-card
          class="class-card"
          shadow="hover"
          @click="goToAssignments(item.studentId)"
        >
          <h3>{{ item.className }}</h3>
          <p>课程：{{ item.courseName }}</p>
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