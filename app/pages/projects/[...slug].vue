<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { mapContentNavigation } from '@nuxt/ui/utils/content'
import { findPageBreadcrumb } from '@nuxt/content/utils'

const route = useRoute()

const { data: project } = await useAsyncData(route.path, () =>
  queryCollection('projects').path(route.path).first()
)

if (!project.value) {
  throw createError({ 
    statusCode: 404, 
    statusMessage: 'Projekti nuk u gjet', 
    fatal: true 
  })
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () =>
  queryCollectionItemSurroundings('projects', route.path, {
    fields: ['description', 'image']
  })
)

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation', ref([]))
const projectsNavigation = computed(() => navigation.value.find(item => item.path === '/projects')?.children || [])

const breadcrumb = computed(() => mapContentNavigation(findPageBreadcrumb(projectsNavigation?.value, project.value?.path)).map(({ icon, ...link }) => link))

// Gallery modal state
const isGalleryOpen = ref(false)
const currentImageIndex = ref(0)

// Hero image navigation state
const heroImageIndex = ref(0)

const getCurrentHeroImage = () => {
  if (project.value?.gallery && project.value.gallery.length > 0) {
    return project.value.gallery[heroImageIndex.value]?.src || project.value.image
  }
  return project.value?.image
}

const nextHeroImage = () => {
  if (project.value?.gallery && project.value.gallery.length > 1) {
    heroImageIndex.value = (heroImageIndex.value + 1) % project.value.gallery.length
  }
}

const previousHeroImage = () => {
  if (project.value?.gallery && project.value.gallery.length > 1) {
    heroImageIndex.value = heroImageIndex.value === 0 
      ? project.value.gallery.length - 1 
      : heroImageIndex.value - 1
  }
}

const openGallery = (index?: number) => {
  if (project.value?.gallery && project.value.gallery.length > 0) {
    currentImageIndex.value = index !== undefined ? index : heroImageIndex.value
    isGalleryOpen.value = true
  }
}

const closeGallery = () => {
  isGalleryOpen.value = false
}

const nextImage = () => {
  if (project.value?.gallery && currentImageIndex.value < project.value.gallery.length - 1) {
    currentImageIndex.value++
  } else {
    currentImageIndex.value = 0
  }
}

const previousImage = () => {
  if (project.value?.gallery && currentImageIndex.value > 0) {
    currentImageIndex.value--
  } else if (project.value?.gallery) {
    currentImageIndex.value = project.value.gallery.length - 1
  }
}

const goToImage = (index: number) => {
  currentImageIndex.value = index
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('sq-AL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

if (project.value.image) {
  defineOgImage({ url: project.value.image })
} else {
  defineOgImageComponent('Project', {
    headline: breadcrumb.value.map(item => item.label).join(' > ')
  }, {
    fonts: ['Geist:400', 'Geist:600']
  })
}

const title = project.value?.seo?.title || project.value?.title
const description = project.value?.seo?.description || project.value?.description

useSeoMeta({
  title,
  description,
  ogDescription: description,
  ogTitle: title
})

const projectLink = computed(() => `${window?.location}`)
</script>

<template>
  <UMain class="mt-20 px-2">
    <UContainer class="relative min-h-screen">
      <UPage v-if="project">
        <ULink
          to="/projects"
          class="text-sm flex items-center gap-1"
        >
          <UIcon name="lucide:chevron-left" />
          Projektet
        </ULink>
        
        <div class="flex flex-col gap-3 mt-8">
          <!-- Metadata -->
          <div class="flex text-xs text-muted items-center justify-center gap-2">
            <span v-if="project.date">
              {{ formatDate(project.date) }}
            </span>
            <span v-if="project.tags && project.tags.length > 0">
              •
            </span>
            <div v-if="project.tags" class="flex flex-wrap gap-2 justify-center">
              <span
                v-for="tag in project.tags"
                :key="tag"
                class="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          
          <!-- Main Hero Image with Navigation -->
          <div 
            class="relative w-full rounded-lg overflow-hidden cursor-pointer group/hero"
            @click="openGallery()"
          >
            <Transition name="image-slide" mode="out-in">
              <img
                :key="getCurrentHeroImage()"
                :src="getCurrentHeroImage()"
                :alt="project.title"
                class="w-full h-[300px] md:h-[500px] object-cover object-center transition-transform duration-300 group-hover/hero:scale-105"
              />
            </Transition>
            
            <!-- Dark overlay on hover -->
            <div 
              v-if="project.gallery && project.gallery.length > 1"
              class="absolute inset-0 bg-black/0 group-hover/hero:bg-black/20 transition-all duration-300 pointer-events-none"
            />
            
            <!-- Navigation Arrows -->
            <div 
              v-if="project.gallery && project.gallery.length > 1"
              class="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 md:px-6 opacity-0 group-hover/hero:opacity-100 transition-opacity duration-300 z-30"
            >
              <button
                class="gallery-nav-btn flex items-center justify-center p-2.5 md:p-3 rounded-full bg-white/95 dark:bg-gray-900/95 hover:bg-white dark:hover:bg-gray-800 transition-all shadow-2xl backdrop-blur-sm hover:scale-110"
                @click.stop="previousHeroImage"
              >
                <UIcon name="i-lucide-chevron-left" class="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <button
                class="gallery-nav-btn flex items-center justify-center p-2.5 md:p-3 rounded-full bg-white/95 dark:bg-gray-900/95 hover:bg-white dark:hover:bg-gray-800 transition-all shadow-2xl backdrop-blur-sm hover:scale-110"
                @click.stop="nextHeroImage"
              >
                <UIcon name="i-lucide-chevron-right" class="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
            
            <!-- Image counter -->
            <div 
              v-if="project.gallery && project.gallery.length > 1"
              class="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg z-40 pointer-events-none"
            >
              {{ heroImageIndex + 1 }} / {{ project.gallery.length }}
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
          
          <!-- Title and Description -->
          <h1 class="text-4xl text-center font-medium max-w-3xl mx-auto mt-4">
            {{ project.title }}
          </h1>
          <p class="text-muted text-center max-w-2xl mx-auto">
            {{ project.description }}
          </p>
        </div>
        
        <!-- Main Content -->
        <UPageBody class="max-w-3xl mx-auto">
          <ContentRenderer
            v-if="project.body"
            :value="project"
          />

          <!-- Gallery Grid (if multiple images) -->
          <div 
            v-if="project.gallery && project.gallery.length > 1" 
            class="mt-12"
          >
            <h2 class="text-2xl font-semibold mb-6">Galeria e Projektit</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div
                v-for="(image, index) in project.gallery"
                :key="index"
                class="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                @click="openGallery(index)"
              >
                <img
                  :src="image.src"
                  :alt="image.alt"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                  <UIcon 
                    name="i-lucide-zoom-in" 
                    class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 text-sm text-muted mt-8">
            <UButton
              size="sm"
              variant="link"
              color="neutral"
              label="Kopjo linkun"
              @click="copyToClipboard(projectLink, 'Linku i projektit u kopjua')"
            />
          </div>
          
          <UContentSurround :surround />
        </UPageBody>
      </UPage>
    </UContainer>

    <!-- Gallery Modal -->
    <Teleport to="body">
      <Transition name="gallery-fade">
        <div
          v-if="isGalleryOpen && project?.gallery"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          @click.self="closeGallery"
        >
          <!-- Close Button - Top Right -->
          <button
            class="gallery-nav-btn absolute top-4 right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center"
            @click="closeGallery"
          >
            <UIcon name="i-lucide-x" class="w-6 h-6 flex-shrink-0" />
          </button>

          <!-- Previous Button - Vertically Centered -->
          <button
            v-if="project.gallery.length > 1"
            class="gallery-nav-btn absolute top-1/2 left-4 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center"
            @click="previousImage"
          >
            <UIcon name="i-lucide-chevron-left" class="w-6 h-6 flex-shrink-0" />
          </button>

          <!-- Next Button - Vertically Centered -->
          <button
            v-if="project.gallery.length > 1"
            class="gallery-nav-btn absolute top-1/2 right-4 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center"
            @click="nextImage"
          >
            <UIcon name="i-lucide-chevron-right" class="w-6 h-6 flex-shrink-0" />
          </button>

          <!-- Main Image Container -->
          <div class="relative w-full h-full flex items-center justify-center p-4 md:p-8">
            <Transition name="image-slide" mode="out-in">
              <div :key="currentImageIndex" class="relative max-w-7xl max-h-full">
                <img
                  :src="project.gallery[currentImageIndex]?.src"
                  :alt="project.gallery[currentImageIndex]?.alt"
                  class="max-w-full max-h-[85vh] object-contain rounded-lg"
                />
                
                <!-- Image Caption -->
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                  <p class="text-white text-center text-sm md:text-base">
                    {{ project.gallery[currentImageIndex]?.alt }}
                  </p>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Thumbnails -->
          <div
            v-if="project.gallery.length > 1"
            class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4 py-2 bg-black/50 rounded-full"
          >
            <button
              v-for="(image, index) in project.gallery"
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
            {{ currentImageIndex + 1 }} / {{ project.gallery.length }}
          </div>
        </div>
      </Transition>
    </Teleport>
  </UMain>
</template>

<style scoped>
/* Ensure gallery navigation buttons center their content properly */
.gallery-nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.gallery-nav-btn svg {
  display: block;
  margin: 0;
  padding: 0;
}

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
