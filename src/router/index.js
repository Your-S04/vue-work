import { createRouter, createWebHistory } from 'vue-router'
import home from '../pages/home/index.vue'
import about from '../pages/about/index.vue'
import login from '../pages/login/index.vue'
import posts from '../pages/post/index.vue'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: home, meta: { requiresAuth: true } },
  { path: '/about', component: about },
  { path: '/login', component: login },
  { path: '/posts', component: posts, meta: { requiresAuth: true } },
  { path: '/posts/:id', component: posts, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

router.beforeEach((to) => {
  // 需要登录的页面，没有令牌时跳转到登录页。
  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    return '/login'
  }
  return true
})

export default router
