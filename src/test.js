// 本地测试代码开始：用于未连接后端时演示登录和帖子功能。
export const testUsers = {
  '20240001': { password: 'student123', id: 1, username: '20240001', name: '学生用户', role: 'user' },
  '20240002': { password: 'admin123', id: 2, username: '20240002', name: '管理员', role: 'admin' }
}

export const testPosts = [
  {
    id: 1,
    content: '这是第一条示例帖子。',
    author: { id: 1, username: '20240001', name: '学生用户', role: 'user' },
    like_count: 2,
    comment_count: 0,
    comments: []
  },
  {
    id: 2,
    content: '这是第二条示例帖子。',
    author: { id: 2, username: '20240002', name: '管理员', role: 'admin' },
    like_count: 1,
    comment_count: 0,
    comments: []
  }
]

export function isTestUser() {
  const token = localStorage.getItem('token')
  return token && token.indexOf('test-') === 0
}

export function getTestPosts() {
  const savedPosts = localStorage.getItem('testPosts')
  if (savedPosts) return JSON.parse(savedPosts)

  localStorage.setItem('testPosts', JSON.stringify(testPosts))
  return testPosts
}

export function saveTestPosts(posts) {
  localStorage.setItem('testPosts', JSON.stringify(posts))
}
// 本地测试代码结束。
