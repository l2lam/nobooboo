import { createRouter, createWebHistory } from 'vue-router'
import SetupScreen from '../views/SetupScreen.vue'
import GameScreen from '../views/GameScreen.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'setup',
      component: SetupScreen
    },
    {
      path: '/game',
      name: 'game',
      component: GameScreen
    },
    {
      path: '/editor',
      name: 'editor',
      component: () => import('../views/TopicsEditor.vue')
    }
  ]
})

export default router
