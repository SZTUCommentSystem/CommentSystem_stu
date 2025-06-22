import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../store/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/classes'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/classes',
      name: 'classes',
      component: () => import('../views/ClassesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/assignments/:studentId',
      name: 'assignments',
      component: () => import('../views/AssignmentsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/assignment/:homeworkId',
      name: 'assignmentDetail',
      component: () => import('../views/AssignmentDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/submissions',
      name: 'submissions',
      component: () => import('../views/SubmissionCenterView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userStore = useUserStore()

  // 确保用户信息和token同步
  if (token && !userStore.userInfo.token) {
    const storedUserInfo = localStorage.getItem('userInfo')
    if (storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo)
        userStore.setUserInfo({ ...parsedUserInfo, token })
      } catch (error) {
        console.error('Failed to restore user info:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        next('/login')
        return
      }
    }
  }

  // 检查token是否过期
  if (token && userStore.isTokenExpired()) {
    console.log('Token已过期，清除登录状态')
    userStore.clearUserInfo()
    
    // 如果要访问需要认证的页面，重定向到登录页
    if (to.meta.requiresAuth) {
      // 延迟显示消息，确保在页面加载后显示
      setTimeout(() => {
        import('element-plus').then(({ ElMessage }) => {
          ElMessage.warning('登录已过期，请重新登录')
        })
      }, 100)
      next('/login')
      return
    }
  }


  // 需要游客权限的路由（登录、注册）
  if (to.meta.requiresGuest && token && !userStore.isTokenExpired()) {
    next('/classes')
    return
  }

  // 需要登录权限的路由
  if (to.meta.requiresAuth && (!token || userStore.isTokenExpired())) {
    next('/login')
    return
  }

  next()
})

export default router 