<template>
  <div v-if="isDetail" class="detail-page">
    <header class="detail-header">
      <router-link to="/home">返回帖子列表</router-link>
      <button @click="logout">退出登录</button>
    </header>

    <main v-if="post" class="detail-content">
      <div class="post-container">
        <p>{{ post.content }}</p>
        <p>作者：{{ post.author.name }}</p>
        <p>点赞数：{{ post.like_count }}</p>
        <p>评论数：{{ post.comment_count }}</p>
        <button @click="likePost">{{ liked? '取消点赞' : '点赞' }}</button>
        <button v-if="canDelete" class="delete-button" @click="removePost">删除帖子</button>
      </div>

      <div class="post-container">
        <h2>评论</h2>
        <p v-if="post.comments.length === 0">暂时没有评论。</p>
        <div v-for="comment in post.comments" :key="comment.id" class="comment-item">
          <p>{{ comment.content }}</p>
          <p>作者：{{ comment.author.name }}</p>
        </div>

        <textarea v-model="commentContent" placeholder="请输入评论内容"></textarea>
        <button @click="sendComment">发表评论</button>
      </div>
    </main>

    <p v-else class="loading-text">正在加载帖子...</p>
  </div>

  <div v-else class="post-only-container">
    <div class="post-container">
      <h1>发布帖子</h1>
      <label>内容</label>
      <textarea v-model="content" placeholder="请输入内容"></textarea>
      <button @click="handlePost">发布</button>
      <router-link to="/home">返回</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import './index.css'
// 本地测试代码开始：导入本地测试用户和帖子数据。
import { getTestPosts, isTestUser, saveTestPosts } from '../../test'
// 本地测试代码结束。

const route = useRoute()
const router = useRouter()
const isDetail = !!route.params.id
const post = ref(null)
const title = ref('')
const content = ref('')
const commentContent = ref('')
const liked = ref(false)
const url = 'https://m1.apifoxmock.com/m1/8648730-8429883-default/api/v1'
const user = JSON.parse(localStorage.getItem('user'))

const canDelete = computed(() => {
  return post.value && (user.role === 'admin' || post.value.author.username === user.username)
})

const getHeaders = () => {
  return { Authorization: 'Bearer ' + localStorage.getItem('token') }
}

const handleResponse = (data) => {
  if (data.code === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
    return false
  }
  if (data.code !== 0) {
    alert(data.msg)
    return false
  }
  return true
}

const loadPost = async () => {
  // 本地测试代码开始：测试账号从浏览器本地数据读取帖子。
  if (isTestUser()) {
    post.value = getTestPosts().find((item) => String(item.id) === String(route.params.id))
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]')
    liked.value = likedPosts.includes(post.value.id)
    return
  }
  // 本地测试代码结束。

  try {
    const response = await axios.get(url + '/posts/' + route.params.id, {
      headers: getHeaders()
    })

    if (!handleResponse(response.data)) return
    post.value = response.data.data
  } catch (error) {
    alert(error.message)
  }
}

const handlePost = async () => {
  if (!content.value.trim()) {
    alert('帖子内容不能为空')
    return
  }

  // 本地测试代码开始：测试账号将新帖子保存到 localStorage。
  if (isTestUser()) {
    const posts = getTestPosts()
    posts.push({
      id: Date.now(),
      content: content.value,
      author: user,
      like_count: 0,
      comment_count: 0,
      comments: []
    })
    saveTestPosts(posts)
    alert('帖子发布成功')
    router.push('/home')
    return
  }
  // 本地测试代码结束。

  try {
    const response = await axios.post(url + '/posts', {
      title: title.value,
      content: content.value
    }, {
      headers: getHeaders()
    })

    if (!handleResponse(response.data)) return
    alert('帖子发布成功')
    router.push('/home')
  } catch (error) {
    alert(error.message)
  }
}

const likePost = async () => {
  // 本地测试代码开始：测试账号再次点击时取消点赞，并更新本地点赞数。
  if (isTestUser()) {
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]')

    if (liked.value) {
      post.value.like_count -= 1
      likedPosts.splice(likedPosts.indexOf(post.value.id), 1)
    } else {
      post.value.like_count += 1
      likedPosts.push(post.value.id)
    }

    liked.value = !liked.value
    localStorage.setItem('likedPosts', JSON.stringify(likedPosts))
    saveTestPosts(getTestPosts())
    return
  }
  // 本地测试代码结束。

  try {
    const response = await axios.post(url + '/posts/' + route.params.id + '/like', {}, {
      headers: getHeaders()
    })

    if (!handleResponse(response.data)) return
    if (response.data.data && response.data.data.liked !== undefined) {
      liked.value = response.data.data.liked
    } else {
      liked.value = !liked.value
    }
    await loadPost()
  } catch (error) {
    alert(error.message)
  }
}

const sendComment = async () => {
  if (!commentContent.value.trim()) {
    alert('评论内容不能为空')
    return
  }

  // 本地测试代码开始：测试账号在本地添加评论。
  if (isTestUser()) {
    post.value.comments.push({
      id: Date.now(),
      post_id: post.value.id,
      content: commentContent.value,
      author: user
    })
    post.value.comment_count += 1
    saveTestPosts(getTestPosts())
    commentContent.value = ''
    return
  }
  // 本地测试代码结束。

  try {
    const response = await axios.post(url + '/posts/' + route.params.id + '/comments', {
      content: commentContent.value
    }, {
      headers: getHeaders()
    })

    if (!handleResponse(response.data)) return
    commentContent.value = ''
    await loadPost()
  } catch (error) {
    alert(error.message)
  }
}

const removePost = async () => {
  if (!confirm('确定删除这条帖子吗？')) return

  // 本地测试代码开始：测试账号从本地数据删除帖子。
  if (isTestUser()) {
    const posts = getTestPosts()
    const index = posts.findIndex((item) => String(item.id) === String(route.params.id))
    posts.splice(index, 1)
    saveTestPosts(posts)
    router.push('/home')
    return
  }
  // 本地测试代码结束。

  try {
    const response = await axios.delete(url + '/posts/' + route.params.id, {
      headers: getHeaders()
    })

    if (!handleResponse(response.data)) return
    router.push('/home')
  } catch (error) {
    alert(error.message)
  }
}

const logout = () => {
  localStorage.clear()
  router.push('/login')
}

onMounted(() => {
  if (isDetail) loadPost()
})
</script>
