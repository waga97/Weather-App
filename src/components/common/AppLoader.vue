<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'

const store = useStore(key)
const loading = computed(() => store.state.ui.loading)
</script>

<template>
  <div v-if="loading" class="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
    <div class="bg-gray-100 p-10 rounded-lg shadow-2xl flex items-center gap-3">
      <svg
        class="animate-spin h-10 w-10 text-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
    </div>
  </div>
</template>
