<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import dayjs from 'dayjs'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref, computed } from 'vue'
import { getWeatherCurrent, getWeatherHourly, getWeatherDaily } from '@/services/weatherService'
import type { WeatherData } from '@/services/weatherService'
import HourlyWeatherCard from '@/components/weather/HourlyWeatherCard.vue'
import WeeklyWeatherCard from '@/components/weather/WeeklyWeatherCard.vue'
import { ChevronLeftIcon } from '@heroicons/vue/24/outline'
import { mapWeatherCode } from '@/helpers/weather'
import { useStore } from 'vuex'
import { key } from '@/store'

const store = useStore(key)
const router = useRouter()
const route = useRoute()
const city = route.params.city as string

const current = ref<WeatherData | null>(null)
const hourly = ref<WeatherData[]>([])
const daily = ref<WeatherData[]>([])

const errorMsg = computed(() => store.state.ui.error)

const currentWeather = computed(() => {
  return current.value ? mapWeatherCode(current.value.weather_code) : mapWeatherCode(-1)
})

onMounted(async () => {
  store.commit('ui/SET_LOADING', true, { root: true })
  store.commit('ui/SET_ERROR', null, { root: true })

  try {
    const [cur, hrs, days] = await Promise.all([
      getWeatherCurrent([city]),
      getWeatherHourly(city, 4),
      getWeatherDaily(city),
    ])
    current.value = cur[0] ?? null
    hourly.value = hrs
    daily.value = days
  } catch (err) {
    console.error(err)
    store.commit('ui/SET_ERROR', 'Failed to load weather detail', { root: true })
  } finally {
    store.commit('ui/SET_LOADING', false, { root: true })
  }
})

function goBack() {
  router.push({ name: 'WeatherList' })
}
</script>

<template>
  <DefaultLayout :title="city" :headerBgClass="currentWeather.bgClass">
    <template #left>
      <button @click="goBack" class="text-white flex items-center">
        <ChevronLeftIcon class="h-6 w-6" />
      </button>
    </template>

    <template #header-content>
      <div v-if="current" class="p-6 text-center">
        <p class="text-sm text-white/80">
          {{ dayjs(current.time).format('dddd, D MMMM YYYY') }}
        </p>
        <div class="flex flex-col items-center mt-3">
          <div class="text-6xl mb-2">{{ currentWeather.weatherIcon }}</div>
          <p class="text-4xl font-semibold">{{ Math.round(current.temperature) }}°C</p>
          <p class="text-lg mt-1">{{ currentWeather.weatherDescription }}</p>
          <p class="text-xs mt-2 text-white/70">
            Last Update {{ dayjs(current.time).format('h:mm A') }}
          </p>
        </div>
      </div>
    </template>

    <!-- White content area -->
    <div v-if="errorMsg" class="p-4 text-red-600">{{ errorMsg }}</div>
    <div v-else>
      <div class="mt-6 px-4">
        <h3 class="font-semibold mb-2">Hourly Forecast</h3>
        <div class="flex gap-4 overflow-x-auto">
          <HourlyWeatherCard v-for="h in hourly" :key="h.time.toISOString()" :forecast="h" />
        </div>
      </div>
      <div class="mt-6 px-4 pb-2">
        <h3 class="font-semibold mb-2">Weekly Forecast</h3>
        <div class="flex flex-col gap-3">
          <WeeklyWeatherCard v-for="d in daily" :key="d.time.toISOString()" :forecast="d" />
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
