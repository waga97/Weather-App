<script setup lang="ts">
import CurrentWeatherCard from '@/components/weather/CurrentWeatherCard.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { computed, onMounted, onActivated, watch } from 'vue'
import { key } from '@/store'
import { UserIcon } from '@heroicons/vue/24/outline'
import type { UserCapital } from '@/services/capitalService'
import type { WeatherData } from '@/services/weatherService'

const store = useStore(key)
const router = useRouter()

const capitals = computed<UserCapital[]>(() => store.state.user.capitals ?? [])

const currentWeatherOrdered = computed(() => {
  const ordered = capitals.value
    .map((c) => store.state.weather.currentWeather?.find((w) => w.city === c.city))
    .filter((w): w is WeatherData => !!w)

  // Always keep My Location on top
  return ordered.sort((a, b) => Number(isMyLocation(b.city)) - Number(isMyLocation(a.city)))
})

function isMyLocation(city: string): boolean {
  return capitals.value.some((c) => c.city === city && c.myLocation)
}

function goToProfile() {
  router.push({ name: 'Profile' })
}

onMounted(() => {
  store.dispatch('user/fetchCapitals')
})

onActivated(() => {
  store.dispatch('user/fetchCapitals')
})

watch(
  capitals,
  (newCapitals, oldCapitals) => {
    const newCities = newCapitals
      .map((c) => c.city)
      .sort()
      .join('|')
    const oldCities = (oldCapitals ?? [])
      .map((c) => c.city)
      .sort()
      .join('|')

    if (newCities === oldCities) return

    if (newCapitals.length > 0) {
      store.dispatch('weather/fetchCurrentWeather', {
        cities: newCapitals.map((c) => c.city),
      })
    } else {
      store.commit('weather/CLEAR_CURRENT_WEATHER')
    }
  },
  { immediate: true }
)
</script>

<template>
  <DefaultLayout title="Home">
    <template #right>
      <button @click="goToProfile">
        <UserIcon class="h-6 w-6" />
      </button>
    </template>

    <!-- Content -->
    <div class="my-4 px-2">
      <input
        type="text"
        placeholder="Search for a city"
        readonly
        class="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        @click="$router.push({ name: 'CapitalList' })"
      />
    </div>

    <div class="flex flex-col gap-4 px-2 pb-2">
      <CurrentWeatherCard v-for="w in currentWeatherOrdered" :key="w.city" :weather="w">
        <template v-if="isMyLocation(w.city)">
          <span class="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded">
            My Location
          </span>
        </template>
      </CurrentWeatherCard>
    </div>
  </DefaultLayout>
</template>
