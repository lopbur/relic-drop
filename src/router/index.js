import Vue from 'vue'
import VueRouter from 'vue-router'
import Relics from '../views/wd-relics.vue'
import Stats from '../views/wd-stats.vue'

Vue.use(VueRouter)

  const routes = [
    {
      path: '/',
      name: 'relics',
      component: Relics,
    },
    {
      path: '/stats',
      name: 'stats',
      component: Stats,
    }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
