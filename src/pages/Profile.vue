<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ChevronLeftIcon } from '@heroicons/vue/24/outline'
import Form from '@/components/common/Form.vue'
import { profileSchema } from '@/schemas/profile'
import type { RootState } from '@/store'
import { key } from '@/store'

const router = useRouter()
const store = useStore<RootState>(key)

function goBack() {
  router.back()
}

const profile = computed(
  () =>
    store.state.user.profile ?? {
      fullName: '',
      email: '',
      phone: '',
    }
)

const isProfileLoaded = computed(() => !!store.state.user.profile)

onMounted(() => {
  store.dispatch('user/fetchProfile')
})

const fields = [
  { name: 'fullName', label: 'Full name' },
  { name: 'email', label: 'Email' },
  { name: 'phone', label: 'Phone Number' },
]

async function handleSubmit(values: Record<string, string>) {
  await store.dispatch('user/updateProfile', values)
}
</script>

<template>
  <DefaultLayout title="Profile">
    <template #left>
      <button @click="goBack">
        <ChevronLeftIcon class="h-6 w-6" />
      </button>
    </template>

    <div class="flex flex-col grow px-4">
      <!-- Avatar -->
      <div class="flex flex-col items-center mt-6">
        <img
          src="https://i.pravatar.cc/150?img=32"
          alt="Profile Avatar"
          class="w-24 h-24 rounded-full border-4 border-gray-200"
        />
        <h2 class="mt-4 text-lg font-semibold text-gray-800">{{ profile.fullName }}</h2>
        <p class="text-sm text-gray-500">{{ profile.email }} | {{ profile.phone }}</p>
      </div>

      <!-- Reusable form -->
      <div class="mt-8 flex-1 overflow-y-auto">
        <Form
          v-if="isProfileLoaded"
          :fields="fields"
          :schema="profileSchema"
          :initial-values="{
            fullName: profile.fullName,
            email: profile.email,
            phone: profile.phone,
          }"
          @submit="handleSubmit"
        >
          <button
            type="submit"
            class="w-full rounded-lg bg-blue-500 py-3 text-white font-semibold shadow-md mt-4 cursor-pointer"
          >
            Update
          </button>
        </Form>
      </div>
    </div>
  </DefaultLayout>
</template>
