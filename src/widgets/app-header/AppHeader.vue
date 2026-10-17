<!-- src/widgets/app-header/ui/AppHeader.vue -->
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/entities/session'
import { useThemeStore } from '@/entities/theme'
import { AppButton } from '@/shared/ui'

const router = useRouter()
const sessionStore = useSessionStore()
const themeStore = useThemeStore()

function handleLogout() {
  sessionStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="app-header">
    <div class="header-content">
      <router-link to="/" class="logo">Vue Lottery App</router-link>
      <nav class="nav-links">
        <router-link to="/">Головна</router-link>
        <router-link to="/about">Про автора</router-link>
        <router-link to="/users" v-if="sessionStore.isAuthenticated">Користувачі</router-link>
      </nav>
      <div class="header-actions">
        <AppButton
          :label="themeStore.currentTheme === 'dark' ? 'Світла' : 'Темна'"
          severity="secondary"
          @click="themeStore.toggleTheme"
        />
        <AppButton
          v-if="sessionStore.isAuthenticated"
          label="Вийти"
          severity="danger"
          @click="handleLogout"
        />
        <router-link v-else to="/login">
          <AppButton label="Увійти" />
        </router-link>
      </div>
    </div>
  </header>
</template>
