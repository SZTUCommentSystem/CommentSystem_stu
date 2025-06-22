// Mock数据入口文件
import './mockInterceptor'
import { enableMock, disableMock } from './mockInterceptor'
import mockData from './testData'

const isDevelopment = import.meta.env.DEV
const isMockEnabled = import.meta.env.VITE_ENABLE_MOCK === 'true'

// 开发环境默认启用Mock，生产环境需要显式配置
if (isDevelopment || isMockEnabled) {
  console.log('🎭 Mock数据已启用')
  console.log('📊 可用的测试账号：')
  console.table(mockData.users.map(user => ({
    用户名: user.username,
    密码: user.password,
    姓名: user.name
  })))
  
  // Mock拦截器已经在导入时自动启用
} else {
  console.log('✅ 使用真实API')
}

// 导出控制函数供手动控制
export { enableMock, disableMock }
export { mockData }
export default mockData 