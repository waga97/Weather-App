<script setup lang="ts">
defineProps<{
  title: string
  headerBgClass?: string
}>()
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Header wrapper with background -->
    <div
      class="relative"
      :class="headerBgClass ? ['bg-gradient-to-t', headerBgClass, 'text-white'] : ''"
    >
      <header class="px-4 py-3 flex items-center justify-between relative">
        <div class="absolute left-4 flex items-center">
          <slot name="left"></slot>
        </div>
        <h2 class="mx-auto font-semibold text-lg">
          <slot name="title">{{ title }}</slot>
        </h2>
        <div class="absolute right-4 flex items-center">
          <slot name="right"></slot>
        </div>
      </header>

      <!-- Extended header content (sits inside gradient) -->
      <slot name="header-content"></slot>
    </div>

    <!-- Main content -->
    <main class="flex-1 overflow-y-auto bg-white">
      <slot></slot>
    </main>
  </div>
</template>
