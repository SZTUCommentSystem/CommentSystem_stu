<template>
  <div class="markdown-editor">
    <div class="editor-toolbar">
      <span class="toolbar-tip">文本编辑器</span>
      <div class="toolbar-actions">
        <el-upload
          ref="uploadRef"
          :show-file-list="false"
          :before-upload="beforeUpload"
          :http-request="handleUpload"
          accept="image/*"
          style="display: inline-block;"
        >
          <el-button size="small" text :loading="uploading">
            {{ uploading ? '上传中...' : '上传图片' }}
          </el-button>
        </el-upload>
      </div>
    </div>
    <textarea
      :id="editorId"
      v-model="localValue"
      :placeholder="placeholder"
      :style="{ height: height }"
      class="markdown-textarea"
      @input="handleInput"
    />
    <div class="editor-preview" v-if="showPreview">
      <div class="preview-header">预览</div>
      <div class="preview-content" v-html="renderedContent"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadRequestOptions } from 'element-plus'
import { assignmentApi } from '../services/api'

interface Props {
  modelValue: string
  placeholder?: string
  height?: string
  uploadUrls?: string[] // 新增：用于接收上传的图片URLs
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'update:uploadUrls', urls: string[]): void // 新增：上传图片后更新URLs
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请在此编写您的内容...',
  height: '300px',
  uploadUrls: () => []
})

const emit = defineEmits<Emits>()

// 本地值
const localValue = ref(props.modelValue)
const showPreview = ref(false)
const uploadedUrls = ref<string[]>(props.uploadUrls || [])
const uploading = ref(false)

// 生成唯一ID
const editorId = `textarea-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// 监听props变化
watch(() => props.modelValue, (newValue) => {
  if (newValue !== localValue.value) {
    localValue.value = newValue
  }
})

// 监听uploadUrls props变化
watch(() => props.uploadUrls, (newUrls) => {
  if (newUrls && JSON.stringify(newUrls) !== JSON.stringify(uploadedUrls.value)) {
    uploadedUrls.value = [...newUrls]
  }
}, { deep: true })

// 处理输入
const handleInput = () => {
  emit('update:modelValue', localValue.value)
}

// 简单的markdown渲染（基础功能）
const renderedContent = computed(() => {
  let html = localValue.value
  // 基础markdown转换
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
  html = html.replace(/`(.*?)`/g, '<code>$1</code>')
  html = html.replace(/\n/g, '<br>')
  return html
})



// 上传前验证
const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt10M = file.size / 1024 / 1024 < 10

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt10M) {
    ElMessage.error('图片大小不能超过 10MB!')
    return false
  }
  return true
}

// 自定义上传方法
const handleUpload = async (options: UploadRequestOptions) => {
  const { file } = options
  
  try {
    uploading.value = true
    
    // 创建FormData对象
    const formData = new FormData()
    formData.append('file', file)
    
    // 调用真实的上传API
    const response = await assignmentApi.uploadFile(formData)
    
    // 根据服务器返回的数据结构解析图片URL
    let imageUrl = ''
    
    if (response && typeof response === 'object') {
      // 直接使用服务器返回的完整URL
      if ((response as any).url) {
        imageUrl = (response as any).url
      }
      // 如果没有完整URL，尝试使用fileName拼接
      else if ((response as any).fileName) {
        imageUrl = `http://47.103.49.29:9024${(response as any).fileName}`
      }
    }
    
    if (!imageUrl) {
      throw new Error(`服务器未返回有效的图片URL`)
    }
    
    // 添加到上传URL列表
    uploadedUrls.value.push(imageUrl)
    emit('update:uploadUrls', uploadedUrls.value)
    
    ElMessage.success('图片上传成功!')
  } catch (error: any) {
    console.error('上传失败详情:', error)
    
    let errorMessage = '图片上传失败：'
    if (error?.response?.data?.msg) {
      errorMessage += error.response.data.msg
    } else if (error?.response?.data?.message) {
      errorMessage += error.response.data.message
    } else if (error?.message) {
      errorMessage += error.message
    } else {
      errorMessage += '请重试'
    }
    
    ElMessage.error(errorMessage)
  } finally {
    uploading.value = false
  }
}
</script>

<style scoped>
.markdown-editor {
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  width: 100%;
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #dcdfe6;
  background-color: #fafbfc;
}

.toolbar-tip {
  font-size: 13px;
  color: #606266;
  font-weight: 500;
}

.toolbar-actions {
  display: flex;
  gap: 4px;
}

.markdown-textarea {
  width: 100%;
  border: none;
  outline: none;
  resize: vertical;
  padding: 16px;
  font-size: 16px;
  line-height: 1.6;
  color: #303133;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  background: transparent;
}

.markdown-textarea::placeholder {
  color: #c0c4cc;
  font-style: normal;
}

.editor-preview {
  border-top: 1px solid #dcdfe6;
  background: #f8f9fa;
}

.preview-header {
  padding: 8px 12px;
  background: #e9ecef;
  font-size: 13px;
  color: #606266;
  font-weight: 500;
}

.preview-content {
  padding: 16px;
  font-size: 16px;
  line-height: 1.6;
  color: #303133;
}

.preview-content :deep(strong) {
  font-weight: bold;
}

.preview-content :deep(em) {
  font-style: italic;
}

.preview-content :deep(code) {
  background: #f1f2f6;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  color: #e83e8c;
}
</style> 