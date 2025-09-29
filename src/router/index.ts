import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import WeatherList from '@/pages/WeatherList.vue'
import Profile from '@/pages/Profile.vue'
import WeatherDetail from '@/pages/WeatherDetail.vue'
import CapitalList from '@/pages/CapitalList.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'WeatherList',
    component: WeatherList,
  },
  { path: '/weather/:city', name: 'WeatherDetail', component: WeatherDetail, props: true },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
  },
  {
    path: '/search-capitals',
    name: 'CapitalList',
    component: CapitalList,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'WeatherList' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
