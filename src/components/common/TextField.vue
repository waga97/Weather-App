<script setup lang="ts">
defineProps<{
  modelValue: string
  label: string
  name: string
  type?: string
  error?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div>
    <label :for="name" class="block text-sm text-gray-500 mb-1">
      {{ label }}
    </label>
    <input
      :id="name"
      :name="name"
      :value="modelValue"
      @input="onInput"
      :type="type ?? 'text'"
      class="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <p v-if="error" class="text-red-500 text-xs mt-1">{{ error }}</p>
  </div>
</template>
