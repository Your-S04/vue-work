// 后端接口地址
const BASE_URL = 'https://m1.apifoxmock.com/m1/8648730-8429883-default'

// 登录接口
export const loginAPI = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || '登录失败')
    }

    return result
  } catch (error) {
    throw error
  }
}

// 获取用户信息（受保护接口）
export const getUserInfoAPI = async () => {
  const token = localStorage.getItem('token')

  try {
    const response = await fetch(`${BASE_URL}/user/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    const result = await response.json()

    // 如果 token 过期或无效
    if (response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      window.location.href = '/login'
      throw new Error('登录已过期，请重新登录')
    }

    if (!response.ok) {
      throw new Error(result.message || '请求失败')
    }

    return result
  } catch (error) {
    throw error
  }
}