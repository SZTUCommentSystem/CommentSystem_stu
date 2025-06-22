import Mock from 'mockjs'
import {
  mockData,
  getMockUserById,
  getMockStudentById,
  getMockStudentByUserId,
  getMockClassesByStudentId,
  getMockHomeworksByStudentId,
  getMockTopicsByHomeworkId,
  getMockSubmissionsByStudentId
} from './testData'

// 配置Mock
Mock.setup({
  timeout: '10-50'
})

// 登录接口
Mock.mock('http://47.103.49.29:9024/login', 'post', (options) => {
  const { username, password } = JSON.parse(options.body)
  
  const user = mockData.users.find(u => u.username === username && u.password === password)
  
  if (user) {
    const token = `mock-token-${user.userId}-${Date.now()}`
    return {
      code: 200,
      message: '登录成功',
      data: {
        token,
        userInfo: {
          userId: user.userId,
          username: user.username,
          name: user.name
        }
      }
    }
  }
  
  return {
    code: 401,
    message: '用户名或密码错误'
  }
})

// 注册接口
Mock.mock('http://47.103.49.29:9024/register', 'post', (options) => {
  const { username, password } = JSON.parse(options.body)
  
  // 检查用户名是否已存在
  const existingUser = mockData.users.find(u => u.username === username)
  if (existingUser) {
    return {
      code: 400,
      message: '用户名已存在'
    }
  }
  
  // 创建新用户
  const newUserId = String(Date.now())
  const newUser = {
    userId: newUserId,
    username,
    name: username,
    password
  }
  
  mockData.users.push(newUser)
  
  return {
    code: 200,
    message: '注册成功'
  }
})

// 获取用户信息
Mock.mock('http://47.103.49.29:9024/getInfo', 'get', () => {
  // 模拟从token中获取用户信息
  const currentUser = mockData.users[0] // 模拟当前登录用户
  
  return {
    code: 200,
    message: '成功',
    user: {
      userId: currentUser.userId,
      username: currentUser.username,
      name: currentUser.name
    }
  }
})

// 获取学生列表
Mock.mock('http://47.103.49.29:9024/function/student/list', 'get', () => {
  return {
    code: 200,
    message: '成功',
    rows: mockData.students
  }
})

// 获取学生详情
Mock.mock(/http:\/\/47\.103\.49\.29:9024\/function\/student\/(.+)/, 'get', (options) => {
  const studentId = options.url.split('/').pop()
  if (!studentId) {
    return {
      code: 400,
      message: '缺少学生ID参数'
    }
  }
  const student = getMockStudentById(studentId)
  
  if (student) {
    return {
      code: 200,
      message: '成功',
      data: student
    }
  }
  
  return {
    code: 404,
    message: '学生不存在'
  }
})

// 加入班级
Mock.mock('http://47.103.49.29:9024/function/student', 'post', (options) => {
  const { studentId, classId } = JSON.parse(options.body)
  
  const student = getMockStudentById(studentId)
  const classInfo = mockData.classes.find(c => c.classId === classId)
  
  if (!student) {
    return {
      code: 404,
      message: '学生不存在'
    }
  }
  
  if (!classInfo) {
    return {
      code: 404,
      message: '班级不存在'
    }
  }
  
  // 检查是否已经加入过
  if (student.classIds.includes(classId)) {
    return {
      code: 400,
      message: '已经加入过该班级'
    }
  }
  
  // 加入班级
  student.classIds.push(classId)
  
  return {
    code: 200,
    message: '加入班级成功'
  }
})

// 获取学生班级列表
Mock.mock(/http:\/\/47\.103\.49\.29:9024\/function\/studentClass\/list/, 'get', (options) => {
  const url = new URL(options.url)
  const studentId = url.searchParams.get('studentId')
  
  if (!studentId) {
    return {
      code: 400,
      message: '缺少学生ID参数'
    }
  }
  
  const student = getMockStudentById(studentId)
  if (!student) {
    return {
      code: 404,
      message: '学生不存在'
    }
  }
  
  const studentClasses = student.classIds.map(classId => ({ classId }))
  
  return {
    code: 200,
    message: '成功',
    rows: studentClasses
  }
})

// 获取班级详情
Mock.mock(/http:\/\/47\.103\.49\.29:9024\/function\/bclass\/(.+)/, 'get', (options) => {
  const classId = options.url.split('/').pop()
  const classInfo = mockData.classes.find(c => c.classId === classId)
  
  if (classInfo) {
    return {
      code: 200,
      message: '成功',
      data: classInfo
    }
  }
  
  return {
    code: 404,
    message: '班级不存在'
  }
})

// 获取课程详情
Mock.mock(/http:\/\/47\.103\.49\.29:9024\/function\/course\/(.+)/, 'get', (options) => {
  const courseId = options.url.split('/').pop()
  const course = mockData.courses.find(c => c.courseId === courseId)
  
  if (course) {
    return {
      code: 200,
      message: '成功',
      data: course
    }
  }
  
  return {
    code: 404,
    message: '课程不存在'
  }
})

// 获取作业学生列表
Mock.mock('http://47.103.49.29:9024/function/homeworkstudent/list', 'get', () => {
  // 增强作业学生数据，包含作业详情和标签信息
  const enhancedHomeworkStudents = mockData.homeworkStudents.map(hs => {
    // 获取作业详情
    const homework = mockData.homeworks.find(h => h.homeworkId === hs.homeworkId)
    if (!homework) return hs
    
    // 获取作业相关的题目
    const topicIds = homework.topicIds 
      ? homework.topicIds.split(',').map(id => id.trim()).filter(id => id)
      : []
    
    // 收集所有标签
    const allLabels = []
    for (const topicId of topicIds) {
      const topic = mockData.topics.find(t => t.topicId === topicId)
      if (topic && topic.labelIds) {
        const labelIds = topic.labelIds.split(',').map(id => id.trim()).filter(id => id)
        for (const labelId of labelIds) {
          const label = mockData.topicLabels.find(l => l.topicLabelId === labelId)
          if (label) {
            allLabels.push(label)
          }
        }
      }
    }
    
    // 去重标签
    const uniqueLabels = Array.from(
      new Map(allLabels.map(label => [label.topicLabelId, label])).values()
    )
    
    return {
      ...hs,
      homeworkTitle: homework.homeworkTitle,
      homeworkDescription: homework.homeworkDescription,
      limitTime: homework.limitTime,
      createTime: homework.createTime,
      courseId: homework.courseId,
      tags: uniqueLabels.map(label => label.topicLabelName)
    }
  })
  
  return {
    code: 200,
    message: '成功',
    rows: enhancedHomeworkStudents
  }
})

// 获取作业详情
Mock.mock(/http:\/\/47\.103\.49\.29:9024\/function\/homework\/(.+)/, 'get', (options) => {
  const homeworkId = options.url.split('/').pop()
  const homework = mockData.homeworks.find(h => h.homeworkId === homeworkId)
  
  if (homework) {
    return {
      code: 200,
      message: '成功',
      data: homework
    }
  }
  
  return {
    code: 404,
    message: '作业不存在'
  }
})

// 获取题目详情
Mock.mock(/http:\/\/47\.103\.49\.29:9024\/function\/topic\/(.+)/, 'get', (options) => {
  const topicId = options.url.split('/').pop()
  const topic = mockData.topics.find(t => t.topicId === topicId)
  
  if (topic) {
    return {
      code: 200,
      message: '成功',
      data: topic
    }
  }
  
  return {
    code: 404,
    message: '题目不存在'
  }
})

// 获取题目标签详情
Mock.mock(/http:\/\/47\.103\.49\.29:9024\/function\/topiclabel\/(.+)/, 'get', (options) => {
  const labelId = options.url.split('/').pop()
  const label = mockData.topicLabels.find(l => l.topicLabelId === labelId)
  
  if (label) {
    return {
      code: 200,
      message: '成功',
      data: label
    }
  }
  
  return {
    code: 404,
    message: '标签不存在'
  }
})

// 获取题目学生列表（提交记录）
Mock.mock('http://47.103.49.29:9024/function/topicstudent/list', 'get', () => {
  return {
    code: 200,
    message: '成功',
    rows: mockData.topicStudents
  }
})

// 提交答案
Mock.mock('http://47.103.49.29:9024/function/topicstudent', 'put', (options) => {
  const submissionData = JSON.parse(options.body)
  
  // 查找现有记录
  const existingIndex = mockData.topicStudents.findIndex(ts => ts.id === submissionData.id)
  
  if (existingIndex !== -1) {
    // 更新现有记录
    mockData.topicStudents[existingIndex] = {
      ...mockData.topicStudents[existingIndex],
      ...submissionData
    }
  } else {
    // 创建新记录
    mockData.topicStudents.push({
      id: submissionData.id || `TS${Date.now()}`,
      ...submissionData
    })
  }
  
  return {
    code: 200,
    message: '提交成功'
  }
})

// 文件上传
Mock.mock('http://47.103.49.29:9024/common/upload', 'post', () => {
  // 模拟文件上传成功
  const randomId = Math.random().toString(36).substring(7)
  const fileName = `/uploads/images/${randomId}.jpg`
  
  return {
    code: 200,
    message: '上传成功',
    fileName,
    url: `http://47.103.49.29:9024${fileName}`
  }
})

// 导出Mock配置，在需要时可以关闭
export const enableMock = () => {
  console.log('Mock数据已启用 🎭')
}

export const disableMock = () => {
  // @ts-ignore - Mock.restore() exists but not in type definitions
  Mock.restore()
  console.log('Mock数据已关闭 ✅')
}

// 默认启用Mock
enableMock()

export default Mock 