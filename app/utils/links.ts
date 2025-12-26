import type { NavigationMenuItem } from '@nuxt/ui'

export const navLinks: NavigationMenuItem[] = [{
  label: 'Hyrja',
  icon: 'i-lucide-home',
  to: '/'
}, {
  label: 'Projektet',
  icon: 'i-lucide-folder',
  to: '/projects'
}, {
  label: 'Blog',
  icon: 'i-lucide-file-text',
  to: '/blog'
},{
  label: 'Biografia',
  icon: 'i-lucide-user',
  to: '/about'
}]
