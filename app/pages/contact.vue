<script setup lang="ts">
const { data: page } = await useAsyncData('contact-page', () => {
  return queryCollection('pages').path('/contact').first()
})

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Faqja nuk u gjet',
    fatal: true
  })
}

const toast = useToast()

// Function to copy email to clipboard
const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText('jehonaxhoxhajj@gmail.com')
    toast.add({
      title: 'Email u kopjua!',
      description: 'Adresa e emailit u kopjua në clipboard',
      color: 'green',
      icon: 'i-lucide-check-circle'
    })
  } catch (error) {
    toast.add({
      title: 'Gabim',
      description: 'Nuk u arrit të kopjohet emaili',
      color: 'red',
      icon: 'i-lucide-alert-circle'
    })
  }
}

// Contact information
const contactInfo = [
  {
    icon: 'i-lucide-mail',
    label: 'Email',
    value: 'jehonaxhoxhajj@gmail.com',
    href: 'mailto:jehonaxhoxhajj@gmail.com'
  },
  {
    icon: 'i-lucide-phone',
    label: 'Telefon',
    value: '+383 (0) 45 824 442',
    href: 'tel:+38345824442'
  },
  {
    icon: 'i-lucide-map-pin',
    label: 'Vendndodhja',
    value: 'Prizren, Kosovë',
    href: 'https://maps.google.com/?q=Prizren,Kosovo'
  }
]

// Social media links
// const socialLinks = [
//   {
//     icon: 'i-simple-icons-instagram',
//     label: 'Instagram',
//     href: 'https://www.instagram.com/jehonaxhoxhajj',
//     color: 'pink'
//   },
//   {
//     icon: 'i-simple-icons-linkedin',
//     label: 'LinkedIn',
//     href: 'https://linkedin.com',
//     color: 'sky'
//   }
// ]

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
      :ui="{
        title: '!mx-0 text-left',
        description: '!mx-0 text-left'
      }"
    />
    
    <UPageSection
      :ui="{
        container: '!pt-0'
      }"
    >
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        <!-- Main Contact Card -->
        <div class="lg:col-span-3">
          <UCard>
            <template #header>
              <h2 class="text-2xl font-semibold">Më dërgoni mesazh</h2>
              <p class="text-sm text-muted mt-1">
                Zgjidhni shërbimin tuaj të preferuar të emailit për të më kontaktuar direkt.
              </p>
            </template>

            <div class="flex flex-col items-center justify-center py-12 space-y-6">
              <div class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <UIcon name="i-lucide-mail" class="w-10 h-10 text-primary" />
              </div>
              
              <div class="text-center space-y-2">
                <h3 class="text-xl font-semibold">jehonaxhoxhajj@gmail.com</h3>
                <p class="text-muted">Klikoni butonin e shërbimit tuaj të emailit</p>
              </div>

              <!-- Email service buttons -->
              <div class="flex flex-col sm:flex-row gap-3 w-full max-w-md pt-4">
                <UButton
                  tag="a"
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=jehonaxhoxhajj@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                  icon="i-lucide-mail"
                  variant="outline"
                  class="flex-1 justify-center"
                >
                  Gmail
                </UButton>
                <UButton
                  tag="a"
                  href="https://outlook.live.com/mail/0/deeplink/compose?to=jehonaxhoxhajj@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                  icon="i-lucide-mail"
                  variant="outline"
                  class="flex-1 justify-center"
                >
                  Outlook
                </UButton>
                <UButton
                  tag="a"
                  href="https://mail.yahoo.com/d/compose?to=jehonaxhoxhajj@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                  icon="i-lucide-mail"
                  variant="outline"
                  class="flex-1 justify-center"
                >
                  Yahoo
                </UButton>
              </div>

              <!-- Copy email option -->
              <div class="pt-4 border-t border-gray-200 dark:border-gray-800 w-full max-w-md">
                <p class="text-sm text-center text-muted mb-3">
                  Ose kopjoni adresën e emailit:
                </p>
                <UButton
                  size="lg"
                  icon="i-lucide-copy"
                  color="neutral"
                  variant="soft"
                  class="w-full justify-center"
                  @click="copyEmail"
                >
                  Kopjo Emailin
                </UButton>
              </div>
            </div>
          </UCard>

          <!-- Additional Info Card -->
          <UCard class="mt-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="text-center">
                <div class="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
                  <UIcon name="i-lucide-clock" class="w-6 h-6 text-green-500" />
                </div>
                <h4 class="font-semibold mb-1">Përgjigje e shpejtë</h4>
                <p class="text-sm text-muted">Brenda 24 orëve</p>
              </div>

              <div class="text-center">
                <div class="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-3">
                  <UIcon name="i-lucide-shield-check" class="w-6 h-6 text-blue-500" />
                </div>
                <h4 class="font-semibold mb-1">Konsultime falas</h4>
                <p class="text-sm text-muted">Fillestare pa pagesë</p>
              </div>

              <div class="text-center">
                <div class="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-3">
                  <UIcon name="i-lucide-award" class="w-6 h-6 text-purple-500" />
                </div>
                <h4 class="font-semibold mb-1">Profesionale</h4>
                <p class="text-sm text-muted">Projekte të personalizuara</p>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Contact Information Sidebar -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Contact Info Card -->
          <UCard>
            <template #header>
              <h3 class="text-xl font-semibold">Informacioni i Kontaktit</h3>
            </template>

            <div class="space-y-4">
              <div
                v-for="info in contactInfo"
                :key="info.label"
                class="flex items-start gap-3"
              >
                <div class="flex-shrink-0 mt-0.5">
                  <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <UIcon :name="info.icon" class="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-muted">{{ info.label }}</p>
                  <a
                    :href="info.href"
                    class="text-sm hover:text-primary transition-colors break-all"
                    target="_blank"
                  >
                    {{ info.value }}
                  </a>
                </div>
              </div>
            </div>
          </UCard>

          <!-- Social Media Card -->
          <!-- <UCard>
            <template #header>
              <h3 class="text-xl font-semibold">Më ndiqni</h3>
            </template>

            <div class="flex gap-3">
              <UButton
                v-for="social in socialLinks"
                :key="social.label"
                :icon="social.icon"
                :aria-label="social.label"
                :to="social.href"
                target="_blank"
                size="lg"
                variant="outline"
                color="neutral"
                square
              />
            </div>
          </UCard> -->

          <!-- Working Hours Card -->
          <UCard>
            <template #header>
              <h3 class="text-xl font-semibold">Orari i Punës</h3>
            </template>

            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-muted">E Hënë - E Premte</span>
                <span class="font-medium">9:00 - 17:00</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted">E Shtunë</span>
                <span class="font-medium">10:00 - 14:00</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted">E Diel</span>
                <span class="font-medium text-red-500">Mbyllur</span>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </UPageSection>
  </UPage>
</template>
