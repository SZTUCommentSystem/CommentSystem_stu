<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from './store/user'
import {
  Notebook,
  List,
  User,
  SwitchButton
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const showNav = computed(() => {
  return userStore.userInfo.token && !['login', 'register'].includes(route.name as string)
})

const handleLogout = () => {
  userStore.clearUserInfo()
  router.push('/login')
}

let tokenCheckInterval: number | null = null

// 定时检查token状态
const startTokenCheck = () => {
  // 每5分钟检查一次token状态
  tokenCheckInterval = setInterval(() => {
    const token = localStorage.getItem('token')
    
    // 如果有token但已过期，清除登录状态并跳转到登录页
    if (token && userStore.isTokenExpired()) {
      console.log('检测到token已过期，自动登出')
      userStore.clearUserInfo()
      
      // 如果当前页面需要认证，跳转到登录页
      const currentRoute = router.currentRoute.value
      if (currentRoute.meta.requiresAuth) {
        import('element-plus').then(({ ElMessage }) => {
          ElMessage.warning('登录已过期，请重新登录')
        })
        router.push('/login')
      }
    }
    
  }, 5 * 60 * 1000) // 5分钟
}

const stopTokenCheck = () => {
  if (tokenCheckInterval) {
    clearInterval(tokenCheckInterval)
    tokenCheckInterval = null
  }
}

onMounted(() => {
  startTokenCheck()
})

onUnmounted(() => {
  stopTokenCheck()
})
</script>

<template>
  <el-container class="app-container">
    <el-header v-if="showNav" class="app-header">
      <div class="header-content">
      <div class="logo">
        <img src="/工程力学.svg" alt="Logo" class="logo-img" />
        <span class="logo-text">工程力学课程实践平台</span>
      </div>
      <el-menu
        :default-active="route.path"
        class="app-menu"
          mode="horizontal"
        router
      >
        <el-menu-item index="/classes">
          <el-icon><Notebook /></el-icon>
          <span>教学课堂</span>
        </el-menu-item>
        <el-menu-item index="/submissions">
          <el-icon><List /></el-icon>
          <span>提交中心</span>
        </el-menu-item>
        <el-menu-item index="/profile">
          <el-icon><User /></el-icon>
          <span>个人中心</span>
        </el-menu-item>
      </el-menu>
      <div class="logout-btn">
        <el-button
          type="danger"
          plain
          @click="handleLogout"
        >
          <el-icon><SwitchButton /></el-icon>
          <span>退出登录</span>
        </el-button>
      </div>
      </div>
    </el-header>

    <el-container>
      <el-main :class="['app-main', { 'with-header': showNav }]">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.app-container {
  height: 100vh;
}

.app-header {
  background-color: #fff;
  border-bottom: 1px solid var(--border-color);
  height: 60px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 0;
}

.header-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.logo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.logo-img {
  width: 32px;
  height: 32px;
  margin-right: 8px;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--primary-color);
  white-space: nowrap;
}

.app-menu {
  flex: 1;
  justify-content: center;
  margin: 0 40px;
  background-color: transparent;
  border-bottom: none;
}

.app-menu :deep(.el-menu-item) {
  height: 60px;
  line-height: 60px;
  margin: 0 20px;
  padding: 0 15px;
  border-bottom: none;
}

.app-menu :deep(.el-menu-item.is-active) {
  background: linear-gradient(45deg, rgba(64, 158, 255, 0.1), rgba(64, 179, 255, 0.1));
  color: var(--primary-color);
  font-weight: 500;
  border-radius: 6px;
}

.app-menu :deep(.el-menu-item:hover) {
  background-color: var(--page-background);
  border-radius: 6px;
}

.app-menu :deep(.el-icon) {
  font-size: 18px;
}

.logout-btn {
  flex-shrink: 0;
}

.app-main {
  padding: 32px;
  background-color: var(--page-background);
  min-height: 100vh;
}

.app-main.with-header {
  margin-top: 60px;
}

@media screen and (max-width: 768px) {
  .header-content {
    padding: 0 10px;
  }
  
  .app-menu {
    margin: 0 20px;
  }

  .app-menu :deep(.el-menu-item) {
    margin: 0 10px;
    padding: 0 10px;
  }
  
  .logo-text {
    display: none;
  }

  .app-main {
    padding: 20px;
  }
}

@media screen and (max-width: 480px) {
  .app-menu :deep(.el-menu-item span) {
    display: none;
  }
  
  .logout-btn span {
    display: none;
  }
}
</style>
