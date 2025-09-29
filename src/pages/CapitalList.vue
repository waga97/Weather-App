<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '@/store'
import { worldCapitals, type Capital } from '@/configs/worldCapitals'
import { ChevronLeftIcon, PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const store = useStore(key)

const query = ref('')

const showSaved = ref(true)
type SortOption = 'city-asc' | 'city-desc' | 'country-asc' | 'country-desc'
const sortBy = ref<SortOption>('city-asc')

// sort capitals config alphabetically once
const sortedCapitals = [...worldCapitals].sort((a, b) => a.city.localeCompare(b.city))

// user saved capitals
const userCapitals = computed(() => store.state.user.capitals ?? [])

// check if a city is already saved
function isSaved(city: string) {
  return userCapitals.value.some((c) => c.city === city)
}

// merged + filtered + sorted list
const filteredCities = computed<Capital[]>(() => {
  const q = query.value.toLowerCase()

  // filter by city/country text
  let all = q
    ? sortedCapitals.filter(
        (c) => c.city.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
      )
    : [...sortedCapitals]

  // hide saved if toggle is off
  if (!showSaved.value) {
    all = all.filter((c) => !isSaved(c.city))
  }

  // split saved / unsaved
  const saved = all.filter((c) => isSaved(c.city))
  const unsaved = all.filter((c) => !isSaved(c.city))

  // sort helper
  const sortFn = (a: Capital, b: Capital) => {
    switch (sortBy.value) {
      case 'city-asc':
        return a.city.localeCompare(b.city)
      case 'city-desc':
        return b.city.localeCompare(a.city)
      case 'country-asc':
        return a.country.localeCompare(b.country)
      case 'country-desc':
        return b.country.localeCompare(a.country)
      default:
        return 0
    }
  }

  saved.sort(sortFn)
  unsaved.sort(sortFn)

  // saved always on top
  return [...saved, ...unsaved]
})

function addCapital(city: Capital) {
  store.dispatch('user/updateCapitals', city)
}

function removeCapital(city: string) {
  store.dispatch('user/removeCapitals', city)
}

function goBack() {
  router.push({ name: 'WeatherList' })
}
</script>

<template>
  <DefaultLayout title="Capitals">
    <template #left>
      <button @click="goBack">
        <ChevronLeftIcon class="h-6 w-6" />
      </button>
    </template>

    <!-- Search bar -->
    <div class="my-4 px-2">
      <input
        v-model="query"
        type="text"
        placeholder="Search for a city or country"
        class="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Controls -->
    <div class="flex items-center justify-between px-2 mb-4">
      <!-- Toggle saved -->
      <button
        @click="showSaved = !showSaved"
        class="px-3 py-1 rounded-full text-sm font-medium transition-colors"
        :class="
          showSaved
            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
        "
      >
        {{ showSaved ? 'Showing saved' : 'Hidden saved' }}
      </button>

      <!-- Sort dropdown -->
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-600">Sort by:</span>
        <select
          v-model="sortBy"
          class="rounded-md border border-gray-300 text-sm px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="city-asc">City Asc</option>
          <option value="city-desc">City Desc</option>
          <option value="country-asc">Country Asc</option>
          <option value="country-desc">Country Desc</option>
        </select>
      </div>
    </div>

    <!-- Search results -->
    <ul v-if="filteredCities.length" class="flex-1 overflow-y-auto">
      <li
        v-for="city in filteredCities"
        :key="city.city"
        class="px-4 py-3 border-b border-gray-400 flex items-center justify-between"
      >
        <div>
          <p class="font-medium">{{ city.city }}</p>
          <p class="text-xs text-gray-500">{{ city.country }}</p>
        </div>

        <!-- Actions -->
        <template v-if="!isSaved(city.city)">
          <button
            @click="addCapital(city)"
            class="p-2 rounded-full bg-green-100 hover:bg-green-200"
          >
            <PlusIcon class="h-5 w-5 text-green-600" />
          </button>
        </template>
        <template v-else>
          <span
            v-if="userCapitals.find((c) => c.city === city.city && c.myLocation)"
            class="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded"
          >
            My Location
          </span>
          <button
            v-else
            @click="removeCapital(city.city)"
            class="p-2 rounded-full bg-red-100 hover:bg-red-200"
          >
            <TrashIcon class="h-5 w-5 text-red-600" />
          </button>
        </template>
      </li>
    </ul>

    <div v-else class="px-4 text-gray-400 text-sm">No results found</div>
  </DefaultLayout>
</template>
