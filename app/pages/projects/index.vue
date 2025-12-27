<script setup lang="ts">
const { data: page } = await useAsyncData('projects-page', () => {
  return queryCollection('pages').path('/projects').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

const { data: projects } = await useAsyncData('projects', () => {
  return queryCollection('projects').all()
})

// Debug: log projects to see what we're getting
if (projects.value) {
  console.log('Projects loaded:', projects.value.map(p => ({ title: p.title, path: p.path })))
}

const { global } = useAppConfig()

// Generate slug from project title
const getProjectSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Gallery modal state
const isGalleryOpen = ref(false)
const currentGallery = ref([])
const currentImageIndex = ref(0)

// Track current image index for each project card
const projectImageIndices = ref<Record<number, number>>({})

const getCurrentProjectImage = (project: any, projectIndex: number) => {
  const currentIndex = projectImageIndices.value[projectIndex] || 0
  if (project.gallery && project.gallery.length > 0) {
    return project.gallery[currentIndex]?.src || project.image
  }
  return project.image
}

const openGallery = (project: any, projectIndex: number) => {
  if (project.gallery && project.gallery.length > 0) {
    const currentIndex = projectImageIndices.value[projectIndex] || 0
    currentGallery.value = project.gallery
    currentImageIndex.value = currentIndex
    isGalleryOpen.value = true
  }
}

const closeGallery = () => {
  isGalleryOpen.value = false
  currentGallery.value = []
  currentImageIndex.value = 0
}

const nextImage = () => {
  if (currentImageIndex.value < currentGallery.value.length - 1) {
    currentImageIndex.value++
  } else {
    currentImageIndex.value = 0
  }
}

const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  } else {
    currentImageIndex.value = currentGallery.value.length - 1
  }
}

const goToImage = (index: number) => {
  currentImageIndex.value = index
}

// Navigate within project card gallery - updates the card image
const nextCardImage = (projectIndex: number) => {
  const project = projects.value[projectIndex]
  if (project.gallery && project.gallery.length > 1) {
    const currentIndex = projectImageIndices.value[projectIndex] || 0
    const nextIndex = (currentIndex + 1) % project.gallery.length
    projectImageIndices.value[projectIndex] = nextIndex
  }
}

const previousCardImage = (projectIndex: number) => {
  const project = projects.value[projectIndex]
  if (project.gallery && project.gallery.length > 1) {
    const currentIndex = projectImageIndices.value[projectIndex] || 0
    const prevIndex = currentIndex === 0 
      ? project.gallery.length - 1 
      : currentIndex - 1
    projectImageIndices.value[projectIndex] = prevIndex
  }
}

// Keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
  if (!isGalleryOpen.value) return
  
  if (e.key === 'Escape') {
    closeGallery()
  } else if (e.key === 'ArrowLeft') {
    previousImage()
  } else if (e.key === 'ArrowRight') {
    nextImage()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  // Initialize all project indices to 0
  if (projects.value) {
    projects.value.forEach((_, index) => {
      projectImageIndices.value[index] = 0
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

useSeoMeta({
  title: page.value?.seo?.title || page.value?.title,
  ogTitle: page.value?.seo?.title || page.value?.title,
  description: page.value?.seo?.description || page.value?.description,
  ogDescription: page.value?.seo?.description || page.value?.description
})
</script>

<template>
  <UPage v-if="page">
    <UPageHero
      :title="page.title"
      :description="page.description"
      :links="page.links"
      :ui="{
        title: '!mx-0 text-left',
        description: '!mx-0 text-left',
        links: 'justify-start'
      }"
    >
      <template #links>
        <div
          v-if="page.links"
          class="flex items-center gap-2"
        >
          <UButton
            :label="page.links[0]?.label"
            :to="global.meetingLink"
            v-bind="page.links[0]"
          />
          <UButton
            :to="`mailto:${global.email}`"
            v-bind="page.links[1]"
          />
        </div>
      </template>
    </UPageHero>
    <UPageSection
      :ui="{
        container: '!pt-0'
      }"
    >
      <Motion
        v-for="(project, index) in projects"
        :key="project.title"
        :initial="{ opacity: 0, transform: 'translateY(10px)' }"
        :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
        :transition="{ delay: 0.2 * index }"
        :in-view-options="{ once: true }"
      >
        <UPageCard
          :title="project.title"
          :description="project.description"
          :to="project.path"
          orientation="horizontal"
          variant="naked"
          :reverse="index % 2 === 1"
          class="group"
          :ui="{
            wrapper: 'max-sm:order-last'
          }"
        >
          <template #leading>
            <span class="text-sm text-muted">
              {{ new Date(project.date).getFullYear() }}
            </span>
          </template>
          <div 
            class="relative cursor-pointer group/image overflow-hidden rounded-lg"
            @click.prevent="openGallery(project, index)"
          >
            <!-- Image with transition -->
            <Transition name="image-slide" mode="out-in">
              <img
                :key="getCurrentProjectImage(project, index)"
                :src="getCurrentProjectImage(project, index)"
                :alt="project.title"
                class="object-cover w-full h-48 transition-transform group-hover/image:scale-105"
              >
            </Transition>
            
            <!-- Dark overlay on hover -->
            <div 
              v-if="project.gallery && project.gallery.length > 1"
              class="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-all duration-300 pointer-events-none"
            />
            
            <!-- Navigation Arrows on Project Card -->
            <div 
              v-if="project.gallery && project.gallery.length > 1"
              class="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 z-30"
            >
              <button
                class="flex items-center justify-center p-2.5 rounded-full bg-white/95 dark:bg-gray-900/95 hover:bg-white dark:hover:bg-gray-800 transition-all shadow-2xl backdrop-blur-sm hover:scale-110"
                @click.stop.prevent="previousCardImage(index)"
              >
                <UIcon name="i-lucide-chevron-left" class="w-5 h-5" />
              </button>
              <button
                class="flex items-center justify-center p-2.5 rounded-full bg-white/95 dark:bg-gray-900/95 hover:bg-white dark:hover:bg-gray-800 transition-all shadow-2xl backdrop-blur-sm hover:scale-110"
                @click.stop.prevent="nextCardImage(index)"
              >
                <UIcon name="i-lucide-chevron-right" class="w-5 h-5" />
              </button>
            </div>
            
            <!-- Center text overlay -->
            <div 
              class="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
            >
              <div class="opacity-0 group-hover/image:opacity-100 transition-opacity bg-white/90 dark:bg-gray-900/90 px-4 py-2 rounded-lg backdrop-blur-sm">
                <span class="text-sm font-medium">Shiko Galerinë</span>
              </div>
            </div>
            
            <!-- Image counter on card -->
            <div 
              v-if="project.gallery && project.gallery.length > 1"
              class="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg z-40 pointer-events-none"
            >
              {{ (projectImageIndices[index] || 0) + 1 }} / {{ project.gallery.length }}
            </div>
            
            <!-- Gallery badge -->
            <div 
              v-if="project.gallery && project.gallery.length > 1"
              class="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs flex items-center gap-2 shadow-lg z-40 pointer-events-none"
            >
              <UIcon name="i-lucide-images" class="w-3 h-3" />
              <span>{{ project.gallery.length }} foto</span>
            </div>
          </div>
        </UPageCard>
      </Motion>
    </UPageSection>
  </UPage>
</template>

<style scoped>
/* Image slide transition */
.image-slide-enter-active,
.image-slide-leave-active {
  transition: all 0.3s ease;
}

.image-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.image-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
