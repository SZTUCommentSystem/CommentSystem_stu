import Mock from 'mockjs'

// 模拟延迟
Mock.setup({
  timeout: '300-600'
})

// 用户相关接口
Mock.mock('/api/user/login', 'post', (options) => {
  const { studentId, password } = JSON.parse(options.body)
  if (studentId === '2021001' && password === '123456') {
    return {
      code: 200,
      message: '登录成功',
      data: {
        id: '1',
        studentId: '2021001',
        name: '张三',
        token: 'mock-token'
      }
    }
  }
  return {
    code: 401,
    message: '学号或密码错误'
  }
})

Mock.mock('/api/user/register', 'post', () => {
  return {
    code: 200,
    message: '注册成功'
  }
})

Mock.mock('/api/user/profile', 'put', () => {
  return {
    code: 200,
    message: '更新成功'
  }
})

// 班级相关接口
Mock.mock('/api/class/joined', 'get', () => {
  return {
    code: 200,
    data: [
      {
        id: '1',
        name: '2021级工程力学1班',
        teacher: '李老师'
      },
      {
        id: '2',
        name: '2021级工程力学2班',
        teacher: '王老师'
      }
    ]
  }
})

Mock.mock('/api/class/join', 'post', () => {
  return {
    code: 200,
    message: '加入成功'
  }
})

// 作业相关接口
Mock.mock(/\/api\/assignments\/\d+/, 'get', () => {
  return {
    code: 200,
    data: [
      {
        id: '1',
        title: '实验一：力学基础',
        directory: '/experiments/力学基础',
        tags: ['力学', '基础'],
        deadline: '2024-04-01T23:59:59',
        teacher: '李老师'
      },
      {
        id: '2',
        title: '实验二：力学基础',
        directory: '/experiments/力学基础',
        tags: ['力学', '基础'],
        deadline: '2024-04-15T23:59:59',
        teacher: '李老师'
      }
    ]
  }
})

Mock.mock(/\/api\/assignment\/\d+/, 'get', () => {
  return {
    code: 200,
    data: {
      id: '1',
      title: '实验一：力学基础',
      questions: [
        {
          id: '1',
          type: '编程题',
          title: '力学基础',
          tags: ['力学', '基础'],
          description: '力学基础',
          images: [
            'https://picsum.photos/300/200',
            'https://picsum.photos/300/201'
          ]
        },
        {
          id: '2',
          type: '编程题',
          title: '力学基础',
          tags: ['力学', '基础'],
          description: '力学基础',
          images: [
            'https://picsum.photos/300/202'
          ]
        },
        {
          id: '3',
          type: '编程题',
          title: '力学基础',
          tags: ['力学', '基础'],
          description: '力学基础',
        }
      ]
    }
  }
})

Mock.mock('/api/assignment/submit', 'post', () => {
  return {
    code: 200,
    message: '提交成功'
  }
})

Mock.mock('/api/assignment/question', 'post', () => {
  return {
    code: 200,
    message: '提问成功'
  }
})

// 提交记录数据
Mock.mock(/\/api\/submissions/, 'get', {
  code: 200,
  message: 'success',
  'data|5-10': [{
    'id|+1': 1,
    'assignmentId|1-100': 1,
    'assignmentTitle': '@ctitle(5, 10)',
    'questionId|1-100': 1,
    'questionTitle': '@ctitle(3, 8)',
    'questionType': '编程题',
    'submitTime': '@datetime',
    'status|1': ['pending', 'graded'],
    'score|0-100': 0,
    'feedback': '@cparagraph(1, 3)',
    'question': function() {
      // 50%的概率有提问
      return Math.random() > 0.5 ? {
        content: '@cparagraph(1, 2)',
        createTime: '@datetime',
        reply: Math.random() > 0.3 ? {
          content: '@cparagraph(1, 3)',
          createTime: '@datetime'
        } : null
      } : null
    }
  }]
})

// 提交详情数据
Mock.mock(/\/api\/submission\/\d+/, 'get', {
  code: 200,
  message: 'success',
  data: {
    'id|1-100': 1,
    'assignmentId|1-100': 1,
    'assignmentTitle': '@ctitle(5, 10)',
    'questionId|1-100': 1,
    'questionTitle': '@ctitle(3, 8)',
    'questionType': '编程题',
    'submitTime': '@datetime',
    'status|1': ['pending', 'graded'],
    'score|0-100': 0,
    'feedback': '@cparagraph(1, 3)',
    'files|1-3': [{
      'id|+1': 1,
      'name': '@word(5,10).jpg',
      'url': '@image("200x100")'
    }],
    question: function() {
      // 50%的概率有提问
      return Math.random() > 0.5 ? {
        content: '@cparagraph(1, 2)',
        createTime: '@datetime',
        reply: Math.random() > 0.3 ? {
          content: '@cparagraph(1, 3)',
          createTime: '@datetime'
        } : null
      } : null
    }
  }
})

// 添加提问
Mock.mock(/\/api\/submission\/\d+\/question/, 'post', {
  code: 200,
  message: 'success',
  data: {
    content: '@cparagraph(1, 2)',
    createTime: '@datetime',
    reply: null
  }
}) 