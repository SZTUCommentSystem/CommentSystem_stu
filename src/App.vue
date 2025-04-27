<script setup lang="ts">
import { computed } from 'vue'
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
</script>

<template>
  <el-container class="app-container">
    <el-aside v-if="showNav" width="240px" class="app-aside">
      <div class="logo">
        <img src="/工程力学.svg" alt="Logo" class="logo-img" />
        <span class="logo-text">作业提交系统</span>
      </div>
      <el-menu
        :default-active="route.path"
        class="app-menu"
        router
      >
        <el-menu-item index="/classes">
          <el-icon><Notebook /></el-icon>
          <span>班级作业</span>
        </el-menu-item>
        <el-menu-item index="/submissions">
          <el-icon><List /></el-icon>
          <span>全局提交</span>
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
          class="full-width"
        >
          <el-icon><SwitchButton /></el-icon>
          <span>退出登录</span>
        </el-button>
      </div>
    </el-aside>

    <el-container>
      <el-main :class="['app-main', { 'with-sidebar': showNav }]">
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

.app-aside {
  background-color: #fff;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid var(--border-color);
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
  padding: 12px;
}

.app-menu :deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
  margin: 8px 0;
}

.app-menu :deep(.el-menu-item.is-active) {
  background: linear-gradient(45deg, rgba(64, 158, 255, 0.1), rgba(64, 179, 255, 0.1));
  color: var(--primary-color);
  font-weight: 500;
}

.app-menu :deep(.el-menu-item:hover) {
  background-color: var(--page-background);
}

.app-menu :deep(.el-icon) {
  font-size: 18px;
}

.logout-btn {
  padding: 20px;
  border-top: 1px solid var(--border-color);
}

.full-width {
  width: 100%;
}

.app-main {
  padding: 32px;
  background-color: var(--page-background);
  min-height: 100vh;
}

.app-main.with-sidebar {
  margin-left: 240px;
}

@media screen and (max-width: 768px) {
  .app-aside {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .app-main.with-sidebar {
    margin-left: 0;
  }

  .app-main {
    padding: 20px;
  }
}
</style>
