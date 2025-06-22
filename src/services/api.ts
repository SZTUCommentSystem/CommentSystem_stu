import axios from 'axios'

const request = axios.create({
  baseURL: 'http://47.103.49.29:9024/',
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    
    // 检查业务逻辑是否成功
    if (response.data.code === 200) {
      return response.data
    }
    
    // 如果业务逻辑失败，抛出错误
    console.error('业务逻辑失败:', response.data)
    return Promise.reject(response.data)
  },
  error => {
    console.error('请求错误:', error)
    
    // 处理token过期或无效的情况
    if (error.response?.status === 401) {
      // Token过期或无效，清除本地存储并跳转到登录页
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      
      // 如果当前不在登录页，则跳转到登录页
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
      
      // 可以显示友好的提示信息
      import('element-plus').then(({ ElMessage }) => {
        ElMessage.warning('登录已过期，请重新登录')
      }).catch(e => {
        console.warn('Failed to show message:', e)
      })
    }
    
    return Promise.reject(error)
  }
)

// 用户相关接口
export const userApi = {
  getInfo: () => request.get('/getInfo'),
  login: (data: { username: string; password: string }) => {
    return request.post('/login', data)
  },
  register: (data: { username: string;  password: string }) => {
    return request.post('/register', data)
  },
  updateProfile: (data: { name?: string; password?: string }) =>
    request.put('/profile', data)
}

// 学生相关接口
export const studentApi = {
  getStudentList: () => request.get('/function/student/list'),
  getStudentInfo: (studentId: string) => request.get(`/function/student/${studentId}`),
}
export interface getclass{
  pageNum?: string;
  pageSize?: string;
  studentId?: string;
  [property: string]: any;
}
// 班级相关接口
export const classApi = {
  joinClass: (data: { studentId: string;  classId: string }) =>
    request.post('/function/student', data),
  getClasses: (data: getclass) =>
    request.get(`/function/studentClass/list`, { params: data }),
  getClassInfo: (classId: string | number) =>
    request.get(`/function/bclass/${classId}`)
}

// 课程相关接口
export const courseApi = {
  getCourseInfo: (courseId: string | number) =>
    request.get(`/function/course/${courseId}`)
}

// 作业相关接口
export const assignmentApi = {
  getHomeworkList: () => request.get('function/homeworkstudent/list'),
  getHomeworkDetail: (homeworkId: string ) => request.get(`function/homework/${homeworkId}`),
  submitAnswer: ( data:{ id:string,answerInfo: string,homeworkStudentId: string,answerUrls:string,infoState:string,updateTime:string,infoCorrect:string} ) => 
    request.put('/function/topicstudent',data),
  uploadFile: (file: FormData) => 
    request.post('http://47.103.49.29:9024/common/upload', file, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
}

//题目相关接口
export const topicApi = {
  getTopic: (topicId: string ) => request.get(`function/topic/${topicId}`),
  getLabel: (topicLabelId: string ) => request.get(`function/topiclabel/${topicLabelId}`),
  getTopicList: () => request.get(`function/topicstudent/list`)
}
