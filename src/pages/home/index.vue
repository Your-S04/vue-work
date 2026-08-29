<template>
  <div class="home-container">
    <header class="home-header">
      <h1>论坛首页</h1>
      <div>
        <router-link to="/posts">发布帖子</router-link>
        <button class="logout-btn" @click="logout">退出登录</button>
      </div>
    </header>

    <main class="home-content">
      <p>欢迎你，{{ user.name }}</p>
      <p v-if="loading">正在加载帖子...</p>
      <p v-else-if="posts.length === 0">暂时没有帖子。</p>

      <div v-for="post in posts" :key="post.id" class="post-item">
        <router-link :to="`/posts/${post.id}`">{{ post.content }}</router-link>
        <p class="info">作者：{{ post.author.name }}</p>
      </div>

      <div class="pagination">
        <button @click="changePage(-1)" :disabled="page === 1">上一页</button>
        <span>第 {{ page }} 页</span>
        <button @click="changePage(1)" :disabled="posts.length < pageSize">下一页</button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import './index.css'
// 本地测试代码开始：导入本地帖子数据和测试账号判断方法。
import { getTestPosts, isTestUser } from '../../test'
// 本地测试代码结束。

const router = useRouter()
const posts = ref([])
const loading = ref(false)
const page = ref(1)
const pageSize = 20
const user = JSON.parse(localStorage.getItem('user') || '{}')
const url = 'https://m1.apifoxmock.com/m1/8648730-8429883-default/api/v1'

const loadPosts = async () => {
  loading.value = true

  // 本地测试代码开始：测试账号从 localStorage 读取帖子并按页显示。
  if (isTestUser()) {
    const allPosts = getTestPosts()
    const start = (page.value - 1) * pageSize
    posts.value = allPosts.slice(start, start + pageSize)
    loading.value = false
    return
  }
  // 本地测试代码结束。

  try {
    const response = await axios.get(url + '/posts', {
      params: { page: page.value, page_size: pageSize },
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    })

    const data = response.data
    if (data.code === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/login')
      alert(data.msg)
      return
    }

    posts.value = data.data.items
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}

const changePage = (number) => {
  page.value += number
  loadPosts()
}

const logout = () => {
  localStorage.clear()
  router.push('/login')
}

onMounted(loadPosts)
</script>
