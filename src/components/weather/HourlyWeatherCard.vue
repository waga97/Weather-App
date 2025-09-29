<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
import type { WeatherData } from '@/services/weatherService'
import { mapWeatherCode } from '@/helpers/weather'

const props = defineProps<{ forecast: WeatherData }>()

const { weatherIcon } = computed(() => mapWeatherCode(props.forecast.weather_code)).value

const formattedHour = computed(() => {
  return dayjs(props.forecast.time).format('h:00 A')
})
</script>

<template>
  <div class="p-3 rounded-xl bg-gray-100 text-center w-1/4 flex flex-col items-center shadow-sm">
    <div class="text-2xl mb-1">{{ weatherIcon }}</div>
    <p class="font-medium">{{ Math.round(forecast.temperature) }}°C</p>
    <p class="text-xs text-gray-500">{{ formattedHour }}</p>
  </div>
</template>
