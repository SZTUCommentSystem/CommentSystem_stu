<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { userApi } from '../services/api'
import { User, Lock, UserFilled } from '@element-plus/icons-vue'

const router = useRouter()

const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)

const handleRegister = async () => {
  if (registerForm.password !== registerForm.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }

  try {
    loading.value = true
    await userApi.register({
      username: registerForm.username,
      password: registerForm.password
    })
    ElMessage.success('注册成功')
    router.push('/login')
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="register-container">
    <div class="register-content">
      <div class="register-header">
        <img src="/工程力学.svg" alt="Logo" class="logo" />
        <h2>注册账号</h2>
        <p class="subtitle">创建您的学生账号</p>
      </div>
      
      <el-form :model="registerForm" class="register-form">
        <el-form-item>
          <el-input
            v-model="registerForm.username"
            placeholder="请输入学号"
            :prefix-icon="User"
            size="large"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            show-password
            size="large"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            :prefix-icon="Lock"
            show-password
            size="large"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="handleRegister"
            class="submit-btn"
            size="large"
          >
            注册
          </el-button>
        </el-form-item>
        <div class="form-footer">
          <el-button
            link
            type="primary"
            @click="goToLogin"
          >
            已有账号？立即登录
          </el-button>
        </div>
      </el-form>
    </div>

    <div class="register-background">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  background-color: #f0f2f5;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 16px;
}

.register-content {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  z-index: 1;
  margin: auto;
}

.register-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
}

h2 {
  font-size: 28px;
  color: var(--text-primary);
  margin-bottom: 8px;
  font-weight: 600;
}

.subtitle {
  color: var(--text-regular);
  font-size: 16px;
}

.register-form {
  margin-top: 24px;
}

.submit-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  margin-top: 12px;
}

.form-footer {
  margin-top: 16px;
  text-align: center;
}

/* 背景动画 */
.register-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.4;
  animation: float 8s infinite;
}

.shape-1 {
  width: 300px;
  height: 300px;
  background: linear-gradient(45deg, #409eff, #40b3ff);
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.shape-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(45deg, #67c23a, #95d475);
  bottom: -150px;
  right: -150px;
  animation-delay: -2s;
}

.shape-3 {
  width: 200px;
  height: 200px;
  background: linear-gradient(45deg, #e6a23c, #f5c480);
  top: 50%;
  left: 15%;
  animation-delay: -4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.05);
  }
}

/* 响应式设计 */
@media screen and (max-width: 576px) {
  .register-container {
    padding: 16px;
  }
  
  .register-content {
    padding: 30px 20px;
  }

  .shape {
    filter: blur(40px);
  }
}
</style> 