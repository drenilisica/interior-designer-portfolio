<script setup lang="ts">
defineProps<{
  project: {
    slug: string
    image: string
    title: string
  }
  index: number
}>()
</script>

<template>
  <NuxtLink
    :to="`/projects/${project.slug}`"
    class="bg-white p-2 flex flex-col drop-shadow-2xl transition-transform duration-300 ease-in-out hover:scale-105 hover:rotate-0 hover:z-10 cursor-pointer"
    :class="[
      index % 2 === 0 ? '-rotate-5' : 'rotate-5',
      index % 2 === 0 ? 'hover:-translate-x-4' : 'hover:translate-x-4'
    ]"
  >
    <img
      :src="project.image"
      :alt="project.title"
      class="size-32 object-cover"
    >
    <span class="w-32 text-xs text-black font-serif font-medium text-center mt-2">
      {{ project.title }}
    </span>
  </NuxtLink>
</template>
