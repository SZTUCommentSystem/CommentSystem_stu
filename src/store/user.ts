import { defineStore } from 'pinia'
import { ref } from 'vue'

interface UserInfo {
  id: string
  username: string
  name: string
  token: string
}

export const useUserStore = defineStore('user', () => {
  // 初始化时从 localStorage 获取用户信息
  const storedToken = localStorage.getItem('token')
  const storedUserInfo = localStorage.getItem('userInfo')
  
  const userInfo = ref<UserInfo>({
    id: '',
    username: '',
    name: '',
    token: storedToken || ''
  })

  // 如果有存储的用户信息，则恢复
  if (storedUserInfo) {
    try {
      const parsedUserInfo = JSON.parse(storedUserInfo)
      userInfo.value = {
        ...parsedUserInfo,
        token: storedToken || ''
      }
    } catch (error) {
      console.error('Failed to parse stored user info:', error)
    }
  }

  const setUserInfo = (info) => {
    userInfo.value = info
    // 存储完整的用户信息
    localStorage.setItem('token', info.token)
    localStorage.setItem('userInfo', JSON.stringify(info))
  }

  const clearUserInfo = () => {
    userInfo.value = {
      id: '',
      username: '',
      name: '',
      token: ''
    }
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  return {
    userInfo,
    setUserInfo,
    clearUserInfo
  }
}) 