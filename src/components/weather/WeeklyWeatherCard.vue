<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
import type { WeatherData } from '@/services/weatherService'
import { mapWeatherCode } from '@/helpers/weather'

const props = defineProps<{ forecast: WeatherData }>()

// map weather code
const { weatherDescription, weatherIcon } = computed(() =>
  mapWeatherCode(props.forecast.weather_code)
).value

// day name (Mon, Tue, etc.)
const formattedDayName = computed(() => dayjs(props.forecast.time).format('dddd'))

// check if it's today
const isToday = computed(() => dayjs(props.forecast.time).isSame(dayjs(), 'day'))

// bg color class
const bgClass = computed(() => (isToday.value ? 'bg-yellow-100' : 'bg-blue-100'))
</script>

<template>
  <div class="p-4 rounded-2xl flex justify-between items-center shadow-sm" :class="bgClass">
    <div class="flex items-center gap-3">
      <div class="text-3xl">{{ weatherIcon }}</div>
      <div>
        <p class="font-bold">{{ formattedDayName }}</p>
        <p class="text-sm text-gray-600">{{ weatherDescription }}</p>
      </div>
    </div>
    <p class="text-lg font-semibold">{{ Math.round(forecast.temperature) }}°C</p>
  </div>
</template>
