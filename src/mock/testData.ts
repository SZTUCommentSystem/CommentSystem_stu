// 完整的Mock测试数据
export interface MockUser {
  userId: string
  username: string
  name: string
  password: string
}

export interface MockStudent {
  studentId: string
  userId: string
  name: string
  classIds: string[]
}

export interface MockClass {
  classId: string
  className: string
  courseId: string
  teacherId: string
  teacherName: string
  studentCount: number
}

export interface MockCourse {
  courseId: string
  courseName: string
  courseDescription: string
  credits: number
}

export interface MockHomework {
  homeworkId: string
  homeworkTitle: string
  homeworkDescription: string
  courseId: string
  topicIds: string
  limitTime: string
  createTime: string
  status: string
}

export interface MockTopic {
  topicId: string
  topicTitle: string
  topicInfo: string
  topicUrls: string
  labelIds: string
  type: string
  difficulty: string
}

export interface MockTopicLabel {
  topicLabelId: string
  topicLabelName: string
  color: string
}

export interface MockTopicStudent {
  id: string
  topicId: string
  studentId: string
  homeworkStudentId: string
  answerInfo: string
  answerUrls: string
  updateTime: string
  infoState: string
  infoNum: number | null
  infoCorrect: string
}

export interface MockHomeworkStudent {
  homeworkStudentId: string
  homeworkId: string
  studentId: string
  submitTime: string
  status: string
}

// 用户数据
export const mockUsers: MockUser[] = [
  {
    userId: '1001',
    username: '2022001',
    name: '张三',
    password: '123456'
  },
  {
    userId: '1002', 
    username: 'student002',
    name: '李四',
    password: '123456'
  },
  {
    userId: '1003',
    username: 'student003', 
    name: '王五',
    password: '123456'
  },
  {
    userId: '1004',
    username: 'student004',
    name: '赵六',
    password: '123456'
  },
  {
    userId: '1005',
    username: 'student005',
    name: '钱七',
    password: '123456'
  }
]

// 学生数据
export const mockStudents: MockStudent[] = [
  {
    studentId: '2021001',
    userId: '1001',
    name: '张三',
    classIds: ['C001', 'C002']
  },
  {
    studentId: '2021002',
    userId: '1002', 
    name: '李四',
    classIds: ['C001', 'C003']
  },
  {
    studentId: '2021003',
    userId: '1003',
    name: '王五',
    classIds: ['C002', 'C003']
  },
  {
    studentId: '2021004',
    userId: '1004',
    name: '赵六',
    classIds: ['C001']
  },
  {
    studentId: '2021005',
    userId: '1005',
    name: '钱七',
    classIds: ['C002']
  }
]

// 课程数据
export const mockCourses: MockCourse[] = [
  {
    courseId: 'COURSE001',
    courseName: '工程力学',
    courseDescription: '工程力学基础理论与应用',
    credits: 4
  },
  {
    courseId: 'COURSE002',
    courseName: '理论力学',
    courseDescription: '理论力学基础理论',
    credits: 6
  },
  {
    courseId: 'COURSE003',
    courseName: '线性代数',
    courseDescription: '线性代数基础理论',
    credits: 3
  },
  {
    courseId: 'COURSE004',
    courseName: '计算机程序设计',
    courseDescription: 'C++程序设计基础',
    credits: 4
  }
]

// 班级数据
export const mockClasses: MockClass[] = [
  {
    classId: 'C001',
    className: '2022级工程力学1班',
    courseId: 'COURSE001',
    teacherId: 'T001',
    teacherName: '李教授',
    studentCount: 45
  },
  {
    classId: 'C002',
    className: '2022级工程力学2班',
    courseId: 'COURSE002',
    teacherId: 'T002',
    teacherName: '王教授',
    studentCount: 42
  },
]

// 题目标签数据
export const mockTopicLabels: MockTopicLabel[] = [
  {
    topicLabelId: 'L001',
    topicLabelName: '力学基础',
    color: '#409eff'
  },
  {
    topicLabelId: 'L002', 
    topicLabelName: '静力学',
    color: '#67c23a'
  },
  {
    topicLabelId: 'L003',
    topicLabelName: '动力学',
    color: '#e6a23c'
  },
  {
    topicLabelId: 'L004',
    topicLabelName: '材料力学',
    color: '#f56c6c'
  }
]

// 题目数据
export const mockTopics: MockTopic[] = [
  {
    topicId: '100001',
    topicTitle: '杆件受力分析',
    topicInfo: '分析图示杆件的受力情况，计算各个节点的受力大小和方向。要求：1. 画出受力分析图；2. 建立平衡方程；3. 求解未知力。',
    topicUrls: 'https://th.bing.com/th/id/OIP.PJTc4lVe0xxfyINx16u4UQHaFK?r=0&rs=1&pid=ImgDetMain',
    labelIds: 'L001,L002',
    type: '计算题',
    difficulty: '中等'
  },
  {
    topicId: '100002',
    topicTitle: '梁的弯曲变形计算',
    topicInfo: '计算简支梁在集中载荷作用下的最大挠度和转角。已知：梁长L=4m，集中力F=10kN作用在梁的中点，材料弹性模量E=200GPa，截面惯性矩I=8.33×10^-6 m^4。',
    topicUrls: 'https://picsum.photos/400/300?random=3',
    labelIds: 'L001,L004',
    type: '计算题',
    difficulty: '困难'
  },
  {
    topicId: '100003',
    topicTitle: '动力学运动方程建立',
    topicInfo: '建立质点在变力作用下的运动方程。质点质量m=2kg，受到时变力F(t)=5sin(2t)N的作用，初始位置x0=0，初始速度v0=1m/s。',
    topicUrls: '',
    labelIds: 'L001,L003',
    type: '推导题',
    difficulty: '中等'
  },
  {
    topicId: '100006',
    topicTitle: '桁架结构内力分析',
    topicInfo: '对图示桁架结构进行内力分析，求各杆件的内力。使用节点法和截面法验证结果的正确性。',
    topicUrls: 'https://picsum.photos/400/300?random=4,https://picsum.photos/400/300?random=5',
    labelIds: 'L001,L002',
    type: '计算题',
    difficulty: '困难'
  }
]

// 作业数据
export const mockHomeworks: MockHomework[] = [
  {
    homeworkId: 'HW001',
    homeworkTitle: '第一章 静力学基础',
    homeworkDescription: '完成静力学相关计算题，巩固基础理论知识',
    courseId: 'COURSE001',
    topicIds: '100001,100002',
    limitTime: '2024-06-24 23:59:59',
    createTime: '2024-03-20 10:00:00',
    status: '进行中'
  },
  {
    homeworkId: 'HW002',
    homeworkTitle: '第二章 动力学分析',
    homeworkDescription: '动力学运动方程建立与求解',
    courseId: 'COURSE001',
    topicIds: '100003',
    limitTime: '2024-06-24 23:59:59',
    createTime: '2024-03-25 14:30:00',
    status: '进行中'
  },
  {
    homeworkId: 'HW003',
    homeworkTitle: '第三章 桁架结构分析',
    homeworkDescription: '复杂桁架结构的内力分析方法',
    courseId: 'COURSE001',
    topicIds: '100006',
    limitTime: '2024-06-24 23:59:59',
    createTime: '2024-04-01 09:00:00',
    status: '进行中'
  },
]

// 作业-学生关联数据
export const mockHomeworkStudents: MockHomeworkStudent[] = [
  {
    homeworkStudentId: 'HS001',
    homeworkId: 'HW001',
    studentId: '2021001',
    submitTime: '2024-04-14 20:30:00',
    status: '已提交'
  },
  {
    homeworkStudentId: 'HS002',
    homeworkId: 'HW001',
    studentId: '2021002',
    submitTime: '2024-04-13 18:45:00',
    status: '已批改'
  },
  {
    homeworkStudentId: 'HS003',
    homeworkId: 'HW002',
    studentId: '2021001',
    submitTime: '2024-04-19 21:15:00',
    status: '已提交'
  },
  {
    homeworkStudentId: 'HS004',
    homeworkId: 'HW003',
    studentId: '2021001',
    submitTime: '',
    status: '未提交'
  }
]

// 题目提交数据
export const mockTopicStudents: MockTopicStudent[] = [
  {
    id: 'TS001',
    topicId: '100001',
    studentId: '2021001',
    homeworkStudentId: 'HS001',
    answerInfo: '## 受力分析\n\n通过分析杆件的受力情况，可以得出以下结论：\n\n1. 节点A处受到向上的支反力 FA = 150N\n2. 节点B处受到水平向右的力 FB = 100N\n3. 杆件AB承受拉力 T = 180N\n\n![受力分析图](https://picsum.photos/300/200?random=10)\n\n具体计算过程如下...',
    answerUrls: 'https://picsum.photos/300/200?random=10,https://picsum.photos/300/200?random=11',
    updateTime: '2024-06-19 20:30:00',
    infoState: '已提交',
    infoNum: null,
    infoCorrect: ''
  },
  {
    id: 'TS002',
    topicId: '100002',
    studentId: '2021001',
    homeworkStudentId: 'HS001',
    answerInfo: '## 梁的弯曲变形计算\n\n### 已知条件\n- 梁长 L = 4m\n- 集中力 F = 10kN\n- 弹性模量 E = 200GPa\n- 截面惯性矩 I = 8.33×10^-6 m^4\n\n### 计算过程\n最大挠度计算公式：\n$$\\delta_{max} = \\frac{FL^3}{48EI}$$\n\n代入数值：\n$$\\delta_{max} = \\frac{10 \\times 10^3 \\times 4^3}{48 \\times 200 \\times 10^9 \\times 8.33 \\times 10^{-6}} = 8.0mm$$',
    answerUrls: 'https://picsum.photos/300/200?random=12',
    updateTime: '2024-06-20 20:45:00',
    infoState: '已批改',
    infoNum: 92,
    infoCorrect: '计算过程正确，公式应用恰当。结果准确。建议加强对弯曲理论的理解，注意单位换算的准确性。总体完成质量很好！'
  },
  {
    id: 'TS003',
    topicId: '100003',
    studentId: '2021001',
    homeworkStudentId: 'HS003',
    answerInfo: '## 动力学运动方程\n\n根据牛顿第二定律建立运动方程：\n\n$$m\\frac{d^2x}{dt^2} = F(t) = 5\\sin(2t)$$\n\n即：\n$$2\\frac{d^2x}{dt^2} = 5\\sin(2t)$$\n\n$$\\frac{d^2x}{dt^2} = 2.5\\sin(2t)$$\n\n### 求解过程\n对运动方程进行两次积分...',
    answerUrls: '',
    updateTime: '2024-06-21 21:15:00',
    infoState: '已提交',
    infoNum: null,
    infoCorrect: ''
  },
  // 为其他学生添加更多测试数据
  {
    id: 'TS006',
    topicId: '100001',
    studentId: '2021002',
    homeworkStudentId: 'HS002',
    answerInfo: '## 杆件受力分析解答\n\n根据静力平衡原理进行分析：\n\n### 步骤一：确定研究对象\n选择整个杆件系统作为研究对象\n\n### 步骤二：受力分析\n1. 重力：G = mg = 500N（向下）\n2. 支座反力：RA = 300N（向上）\n3. 约束反力：RB = 200N（水平向右）\n\n### 步骤三：建立平衡方程\n∑Fx = 0: RB - F = 0\n∑Fy = 0: RA - G = 0\n∑M = 0: ...',
    answerUrls: 'https://picsum.photos/300/200?random=13,https://picsum.photos/300/200?random=14',
    updateTime: '2024-04-13 18:45:00',
    infoState: '已批改',
    infoNum: 85,
    infoCorrect: '分析思路正确，但在力的计算上有小错误。建议重新检查数值计算，特别注意力的方向和大小。整体理解不错。'
  }
]

// 导出所有测试数据
export const mockData = {
  users: mockUsers,
  students: mockStudents,
  courses: mockCourses,
  classes: mockClasses,
  topics: mockTopics,
  topicLabels: mockTopicLabels,
  homeworks: mockHomeworks,
  homeworkStudents: mockHomeworkStudents,
  topicStudents: mockTopicStudents
}

// 辅助函数
export const getMockUserById = (userId: string) => 
  mockUsers.find(user => user.userId === userId)

export const getMockStudentById = (studentId: string) => 
  mockStudents.find(student => student.studentId === studentId)

export const getMockStudentByUserId = (userId: string) => 
  mockStudents.find(student => student.userId === userId)

export const getMockClassesByStudentId = (studentId: string) => {
  const student = getMockStudentById(studentId)
  if (!student) return []
  return mockClasses.filter(cls => student.classIds.includes(cls.classId))
}

export const getMockHomeworksByStudentId = (studentId: string) => {
  const classes = getMockClassesByStudentId(studentId)
  const courseIds = classes.map(cls => cls.courseId)
  return mockHomeworks.filter(hw => courseIds.includes(hw.courseId))
}

export const getMockTopicsByHomeworkId = (homeworkId: string) => {
  const homework = mockHomeworks.find(hw => hw.homeworkId === homeworkId)
  if (!homework) return []
  const topicIds = homework.topicIds.split(',')
  return mockTopics.filter(topic => topicIds.includes(topic.topicId))
}

export const getMockSubmissionsByStudentId = (studentId: string) => 
  mockTopicStudents.filter(ts => ts.studentId === studentId)

export default mockData 