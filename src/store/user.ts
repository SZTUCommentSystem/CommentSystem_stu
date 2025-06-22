import { defineStore } from 'pinia'
import { ref } from 'vue'

interface UserInfo {
  id: string
  username: string
  name: string
  token: string
  studentId?: string // 添加学生ID字段
  tokenExpireTime?: number // 添加token过期时间字段（时间戳）
}

export const useUserStore = defineStore('user', () => {
  // 初始化时从 localStorage 获取用户信息
  const storedToken = localStorage.getItem('token')
  const storedUserInfo = localStorage.getItem('userInfo')
  
  const userInfo = ref<UserInfo>({
    id: '',
    username: '',
    name: '',
    token: storedToken || '',
    studentId: '',
    tokenExpireTime: 0
  })

  // 如果有存储的用户信息，则恢复
  if (storedUserInfo) {
    try {
      const parsedUserInfo = JSON.parse(storedUserInfo)
      userInfo.value = {
        ...parsedUserInfo,
        token: storedToken || '',
        studentId: parsedUserInfo.studentId || '',
        tokenExpireTime: parsedUserInfo.tokenExpireTime || 0
      }
    } catch (error) {
      console.error('Failed to parse stored user info:', error)
    }
  }

  const setUserInfo = (info: Partial<UserInfo>) => {
    // 如果设置了新的token，自动设置过期时间（默认1天）
    if (info.token && info.token !== userInfo.value.token) {
      info.tokenExpireTime = Date.now() + (24 * 60 * 60 * 1000) // 1天后过期
    }
    
    userInfo.value = { ...userInfo.value, ...info }
    // 存储完整的用户信息
    localStorage.setItem('token', userInfo.value.token)
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
  }

  const setStudentId = (studentId: string) => {
    userInfo.value.studentId = studentId
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
  }

  // 检查token是否过期
  const isTokenExpired = (): boolean => {
    if (!userInfo.value.token) return true
    if (!userInfo.value.tokenExpireTime) return false // 如果没有过期时间，假设未过期
    return Date.now() > userInfo.value.tokenExpireTime
  }

  const clearUserInfo = () => {
    userInfo.value = {
      id: '',
      username: '',
      name: '',
      token: '',
      studentId: '',
      tokenExpireTime: 0
    }
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  return {
    userInfo,
    setUserInfo,
    setStudentId,
    clearUserInfo,
    isTokenExpired,
  }
}) 