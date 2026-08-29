<template>
  <div class="container">
    <div class="login-container">
      <h1>用户登录</h1>

      <label>学号</label>
      <input v-model="username" type="text" inputmode="numeric" pattern="[0-9]*" placeholder="请输入学号">

      <label>密码</label>
      <input v-model="password" type="password" placeholder="请输入密码">

      <button @click="handleLogin">登录</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import './index.css'
// 本地测试代码开始：导入本地测试账号。
import { testUsers } from '../../test'
// 本地测试代码结束。

const username = ref('')
const password = ref('')
const router = useRouter()
const url = 'https://m1.apifoxmock.com/m1/8648730-8429883-default/api/v1'

const handleLogin = async () => {
  if (!username.value || !password.value) {
    alert('请输入学号和密码')
    return
  }

  if (isNaN(username.value)) {
    alert('学号只能由数字组成')
    return
  }

  // 本地测试代码开始：账号正确时保存本地登录信息，不发送登录请求。
  const testUser = testUsers[username.value]
  if (testUser && testUser.password === password.value) {
    localStorage.setItem('token', 'test-' + username.value)
    localStorage.setItem('user', JSON.stringify(testUser))
    router.push('/home')
    return
  }
  // 本地测试代码结束。

  try {
    const response = await axios.post(url + '/auth/login', {
      username: username.value,
      password: password.value
    })
    const data = response.data
    const token = data.access_token
    if (response.code === 400 || response.code === 401) throw new Error(response.msg)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(data.user))
    router.push('/home')
  } catch (error) {
    alert(error.message)
  }
}
</script>
