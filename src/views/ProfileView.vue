<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { userApi } from '../services/api'
import { useUserStore } from '../store/user'

const userStore = useUserStore()
const loading = ref(false)

const form = ref({
  name: userStore.userInfo.name,
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const handleUpdateProfile = async () => {
  if (form.value.newPassword && form.value.newPassword !== form.value.confirmPassword) {
    ElMessage.error('两次输入的新密码不一致')
    return
  }

  try {
    loading.value = true
    const data: { name?: string; password?: string } = {}
    
    if (form.value.name !== userStore.userInfo.name) {
      data.name = form.value.name
    }

    if (form.value.newPassword) {
      data.password = form.value.newPassword
    }

    if (Object.keys(data).length === 0) {
      ElMessage.warning('没有需要更新的信息')
      return
    }

    await userApi.updateProfile(data)
    if (data.name) {
      userStore.setUserInfo({
        ...userStore.userInfo,
        name: data.name
      })
    }
    ElMessage.success('更新成功')
    form.value.oldPassword = ''
    form.value.newPassword = ''
    form.value.confirmPassword = ''
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="profile-container">
    <el-card class="profile-card">
      <template #header>
        <h2>个人信息</h2>
      </template>

      <el-form
        :model="form"
        label-width="100px"
      >
        <el-form-item label="学号">
          <el-input
            v-model="userStore.userInfo.username"
            disabled
          />
        </el-form-item>

        <el-form-item label="姓名">
          <el-input
            v-model="form.name"
            placeholder="请输入姓名"
          />
        </el-form-item>

        <el-form-item label="原密码">
          <el-input
            v-model="form.oldPassword"
            type="password"
            placeholder="请输入原密码"
            show-password
          />
        </el-form-item>

        <el-form-item label="新密码">
          <el-input
            v-model="form.newPassword"
            type="password"
            placeholder="请输入新密码"
            show-password
          />
        </el-form-item>

        <el-form-item label="确认密码">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="handleUpdateProfile"
          >
            保存修改
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.profile-container {
  padding: 20px;
  display: flex;
  justify-content: center;
}

.profile-card {
  width: 500px;
}

h2 {
  margin: 0;
  color: #409eff;
}
</style> 