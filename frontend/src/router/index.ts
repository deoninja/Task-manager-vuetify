import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Task.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_API_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
    // {
    //   path: '/task',
    //   name: 'task',
    //   component: () => import('../views/Task.vue'),
    // },
  ],
})

export default router
