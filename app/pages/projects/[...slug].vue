<script setup lang="ts">
const route = useRoute()

const { data: project } = await useAsyncData(route.path, () =>
  queryCollection('projects').path(route.path).first()
)

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('sq-AL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

useSeoMeta({
  title: project.value?.title,
  ogTitle: project.value?.title,
  description: project.value?.description,
  ogDescription: project.value?.description
})
</script>

<template>
  <UMain class="mt-20 px-2">
    <UContainer class="relative min-h-screen">
      <UPage v-if="project">
        <ULink
          to="/projects"
          class="text-sm flex items-center gap-1 hover:text-primary transition-colors mb-8"
        >
          <UIcon name="lucide:chevron-left" />
          Projektet
        </ULink>
        
        <div class="flex flex-col gap-6">
          <!-- Project Header -->
          <div class="flex flex-col gap-3">
            <div class="flex text-xs text-muted items-center gap-2">
              <span v-if="project.date">
                {{ formatDate(project.date) }}
              </span>
              <span v-if="project.tags && project.tags.length > 0">
                •
              </span>
              <div v-if="project.tags" class="flex gap-2">
                <span
                  v-for="tag in project.tags"
                  :key="tag"
                  class="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
            
            <h1 class="text-4xl md:text-5xl font-bold max-w-4xl">
              {{ project.title }}
            </h1>
            
            <p class="text-lg text-muted max-w-3xl">
              {{ project.description }}
            </p>
          </div>

          <!-- Main Hero Image -->
          <div class="relative w-full aspect-video rounded-lg overflow-hidden">
            <img
              :src="project.image"
              :alt="project.title"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Gallery Grid -->
          <div v-if="project.gallery && project.gallery.length > 1" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div
              v-for="(image, index) in project.gallery.slice(1)"
              :key="index"
              class="relative aspect-square rounded-lg overflow-hidden"
            >
              <img
                :src="image.src"
                :alt="image.alt"
                class="w-full h-full object-cover"
              />
            </div>
          </div>

          <!-- Project Content -->
          <UPageBody class="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
            <ContentRenderer v-if="project.body" :value="project" />
          </UPageBody>
        </div>
      </UPage>
    </UContainer>
  </UMain>
</template>
