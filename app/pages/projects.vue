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

const { global } = useAppConfig()

// Gallery modal state
const isGalleryOpen = ref(false)
const currentGallery = ref([])
const currentImageIndex = ref(0)
const currentProjectIndex = ref(0)

const openGallery = (project: any, imageIndex: number = 0) => {
  if (project.gallery && project.gallery.length > 0) {
    currentGallery.value = project.gallery
    currentImageIndex.value = imageIndex
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

// Navigate within project card gallery
const nextCardImage = (projectIndex: number) => {
  const project = projects.value[projectIndex]
  if (project.gallery && project.gallery.length > 1) {
    const nextIndex = (currentProjectIndex.value + 1) % project.gallery.length
    currentProjectIndex.value = nextIndex
    openGallery(project, nextIndex)
  }
}

const previousCardImage = (projectIndex: number) => {
  const project = projects.value[projectIndex]
  if (project.gallery && project.gallery.length > 1) {
    const prevIndex = currentProjectIndex.value === 0 
      ? project.gallery.length - 1 
      : currentProjectIndex.value - 1
    currentProjectIndex.value = prevIndex
    openGallery(project, prevIndex)
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
          :to="project.url"
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
          <template #footer>
            <div class="flex items-center gap-4">
              <ULink
                :to="project.url"
                class="text-sm text-primary flex items-center"
              >
                View Project
                <UIcon
                  name="i-lucide-arrow-right"
                  class="size-4 text-primary transition-all opacity-0 group-hover:translate-x-1 group-hover:opacity-100"
                />
              </ULink>
              <UButton
                v-if="project.gallery && project.gallery.length > 0"
                size="xs"
                color="gray"
                variant="ghost"
                icon="i-lucide-images"
                @click.prevent="openGallery(project, 0)"
              >
                Galeria ({{ project.gallery.length }})
              </UButton>
            </div>
          </template>
          <div 
            class="relative cursor-pointer group/image"
            @click.prevent="openGallery(project, 0)"
          >
            <img
              :src="project.image"
              :alt="project.title"
              class="object-cover w-full h-48 rounded-lg transition-transform group-hover/image:scale-105"
            >
            
            <!-- Navigation Arrows on Project Card -->
            <div 
              v-if="project.gallery && project.gallery.length > 1"
              class="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"
            >
              <button
                class="p-2 rounded-full bg-white/95 dark:bg-gray-900/95 hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-xl backdrop-blur-sm z-10"
                @click.stop.prevent="previousCardImage(index)"
              >
                <UIcon name="i-lucide-chevron-left" class="w-5 h-5" />
              </button>
              <button
                class="p-2 rounded-full bg-white/95 dark:bg-gray-900/95 hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-xl backdrop-blur-sm z-10"
                @click.stop.prevent="nextCardImage(index)"
              >
                <UIcon name="i-lucide-chevron-right" class="w-5 h-5" />
              </button>
            </div>
            
            <div 
              v-if="project.gallery && project.gallery.length > 1"
              class="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-all duration-300 rounded-lg flex items-center justify-center"
            >
              <div class="opacity-0 group-hover/image:opacity-100 transition-opacity bg-white/90 dark:bg-gray-900/90 px-4 py-2 rounded-lg backdrop-blur-sm">
                <span class="text-sm font-medium">Shiko Galerinë</span>
              </div>
            </div>
            <div 
              v-if="project.gallery && project.gallery.length > 1"
              class="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs flex items-center gap-2 shadow-lg z-20"
            >
              <UIcon name="i-lucide-images" class="w-3 h-3" />
              <span>{{ project.gallery.length }} foto</span>
            </div>
          </div>
        </UPageCard>
      </Motion>
    </UPageSection>

    <!-- Gallery Modal -->
    <Teleport to="body">
      <Transition name="gallery-fade">
        <div
          v-if="isGalleryOpen"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          @click.self="closeGallery"
        >
          <!-- Close Button -->
          <button
            class="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            @click="closeGallery"
          >
            <UIcon name="i-lucide-x" class="w-6 h-6" />
          </button>

          <!-- Previous Button -->
          <button
            v-if="currentGallery.length > 1"
            class="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            @click="previousImage"
          >
            <UIcon name="i-lucide-chevron-left" class="w-6 h-6" />
          </button>

          <!-- Next Button -->
          <button
            v-if="currentGallery.length > 1"
            class="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            @click="nextImage"
          >
            <UIcon name="i-lucide-chevron-right" class="w-6 h-6" />
          </button>

          <!-- Main Image Container -->
          <div class="relative w-full h-full flex items-center justify-center p-4 md:p-8">
            <Transition name="image-slide" mode="out-in">
              <div :key="currentImageIndex" class="relative max-w-7xl max-h-full">
                <img
                  :src="currentGallery[currentImageIndex]?.src"
                  :alt="currentGallery[currentImageIndex]?.alt"
                  class="max-w-full max-h-[85vh] object-contain rounded-lg"
                />
                
                <!-- Image Caption -->
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                  <p class="text-white text-center text-sm md:text-base">
                    {{ currentGallery[currentImageIndex]?.alt }}
                  </p>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Thumbnails -->
          <div
            v-if="currentGallery.length > 1"
            class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4 py-2 bg-black/50 rounded-full"
          >
            <button
              v-for="(image, index) in currentGallery"
              :key="index"
              class="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all"
              :class="[
                currentImageIndex === index
                  ? 'ring-2 ring-white scale-110'
                  : 'opacity-50 hover:opacity-100'
              ]"
              @click="goToImage(index)"
            >
              <img
                :src="image.src"
                :alt="image.alt"
                class="w-full h-full object-cover"
              />
            </button>
          </div>

          <!-- Image Counter -->
          <div class="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
            {{ currentImageIndex + 1 }} / {{ currentGallery.length }}
          </div>
        </div>
      </Transition>
    </Teleport>
  </UPage>
</template>

<style scoped>
/* Gallery fade transition */
.gallery-fade-enter-active,
.gallery-fade-leave-active {
  transition: opacity 0.3s ease;
}

.gallery-fade-enter-from,
.gallery-fade-leave-to {
  opacity: 0;
}

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

/* Hide scrollbar for thumbnails but keep functionality */
.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
