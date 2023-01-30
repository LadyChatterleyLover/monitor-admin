import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/layout/Layout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/Login.vue'),
      meta: {
        title: '登录',
      },
    },
    {
      path: '/project',
      name: 'project',
      component: () => import('@/views/project/Project.vue'),
      meta: {
        title: '项目',
      },
    },
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('@/views/dashboard/Dashboard.vue'),
          meta: {
            title: '实时大盘',
          },
        },
        {
          path: '/jsError',
          name: 'jsError',
          component: () => import('@/views/jsError/JsError.vue'),
          meta: {
            title: 'JS异常',
          },
        },
        {
          path: '/apiError',
          name: 'apiError',
          component: () => import('@/views/apiError/ApiError.vue'),
          meta: {
            title: 'API请求',
          },
        },
        {
          path: '/resourcesError',
          name: 'resourcesError',
          component: () => import('@/views/resourcesError/ResourcesError.vue'),
          meta: {
            title: '资源异常',
          },
        },
        {
          path: '/pageDetail',
          name: 'pageDetail',
          component: () => import('@/views/pageDetail/PageDetail.vue'),
          meta: {
            title: '页面访问',
          },
        },
      ],
    },
    {
      path: '/:catchAll(.*)',
      component: () => import('@/views/notFound/NotFound.vue'),
      meta: {
        title: '404',
      },
    },
  ],
})

router.beforeEach((to, _, next) => {
  document.title = to.meta.title as string
  const token = localStorage.getItem('monitor-token')
  if (to.path === '/login') {
    next()
  } else {
    if (token) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
