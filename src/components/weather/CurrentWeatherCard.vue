<script setup lang="ts">
import type { WeatherData } from '@/services/weatherService'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { mapWeatherCode } from '@/helpers/weather'

const router = useRouter()
const props = defineProps<{ weather: WeatherData }>()

const weatherInfo = computed(() => mapWeatherCode(props.weather.weather_code))

function goToDetail() {
  router.push({ name: 'WeatherDetail', params: { city: props.weather.city } })
}
</script>

<template>
  <div
    class="rounded-2xl p-5 text-white shadow-sm cursor-pointer"
    :class="weatherInfo.bgClass"
    @click="goToDetail"
  >
    <div class="flex justify-between items-start">
      <div>
        <p class="font-bold text-base flex items-center gap-2">
          {{ weather.city }}
          <slot></slot>
        </p>
        <p class="text-sm text-gray-200">
          {{ weather.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
        </p>
      </div>
      <p class="text-4xl font-semibold">{{ Math.round(weather.temperature) }}°</p>
    </div>
    <p class="mt-2 text-sm text-gray-200">{{ weatherInfo.weatherDescription }}</p>
  </div>
</template>
