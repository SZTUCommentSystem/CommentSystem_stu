<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { userApi } from '../services/api'
import { useUserStore } from '../store/user'
import { User, Lock } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

const loginForm = reactive({
  username: '',
  password: ''
})

const loading = ref(false)

const handleLogin = async () => {
  try {
    loading.value = true
    const res = await userApi.login(loginForm)
    console.log(res.token)
    userStore.setUserInfo({username:loginForm.username,name:'',token:res.token})
    ElMessage.success('登录成功')
    router.push('/classes')
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-header">
        <img src="/工程力学.svg" alt="Logo" class="logo" />
        <h2>课程实践平台</h2>
        <p class="subtitle">欢迎回来！请登录您的账号</p>
      </div>
      
      <el-form :model="loginForm" class="login-form">
        <el-form-item>
          <el-input
            v-model="loginForm.username"
            placeholder="请输入学号"
            :prefix-icon="User"
            size="large"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            show-password
            size="large"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="handleLogin"
            class="submit-btn"
            size="large"
          >
            登录
          </el-button>
        </el-form-item>
        <div class="form-footer">
          <el-button
            link
            type="primary"
            @click="goToRegister"
          >
            没有账号？立即注册
          </el-button>
        </div>
      </el-form>
    </div>

    <div class="login-background">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
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

.login-content {
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

.login-header {
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

.login-form {
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
.login-background {
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
  right: -100px;
  animation-delay: 0s;
}

.shape-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(45deg, #67c23a, #95d475);
  bottom: -150px;
  left: -150px;
  animation-delay: -2s;
}

.shape-3 {
  width: 200px;
  height: 200px;
  background: linear-gradient(45deg, #e6a23c, #f5c480);
  top: 50%;
  right: 15%;
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
  .login-container {
    padding: 16px;
  }
  
  .login-content {
    padding: 30px 20px;
  }

  .shape {
    filter: blur(40px);
  }
}
</style> 