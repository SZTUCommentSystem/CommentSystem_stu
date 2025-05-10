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
    if (response.data.code === 200) {
      return response.data
    }
    return Promise.reject(response.data)
  },
  error => {
    return Promise.reject(error)
  }
)

// 用户相关接口
export const userApi = {
  login: (data: { username: string; password: string }) => {
    return request.post('/login', data)
  },
  register: (data: { username: string;  password: string }) => {
    return request.post('/register', data)
  },
  updateProfile: (data: { name?: string; password?: string }) =>
    request.put('/profile', data)
}

// 班级相关接口
export const classApi = {
  joinClass: (classId: string) =>
    request.put('/function/student', { classId }),
  getJoinedClasses: () =>
    request.get('/function/bclass/1')
}

// 作业相关接口
export const assignmentApi = {
  getClassAssignments: (classId: string) =>
    request.get(`/assignments/${classId}`),
  getAssignmentDetail: (assignmentId: string) =>
    request.get(`/assignment/${assignmentId}`),
  submitAnswer: (data: { questionId: string; files: File[] }) => {
    const formData = new FormData()
    formData.append('questionId', data.questionId)
    data.files.forEach(file => {
      formData.append('files', file)
    })
    return request.post('/assignment/submit', formData)
  },
  askQuestion: (data: { questionId: string; content: string }) =>
    request.post('/assignment/question', data)
}

// 提交记录相关接口
export const submissionApi = {
  getList: () => {
    return request.get('/submissions')
  },
  getDetail: (submissionId: string) => {
    return request.get(`/submission/${submissionId}`)
  },
  addQuestion: (submissionId: string, data: { content: string }) => {
    return request.post(`/submission/${submissionId}/question`, data)
  }
} 