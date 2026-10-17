<script setup lang="ts">
import AppHeader from '@/widgets/app-header/AppHeader.vue';
import Toast from 'primevue/toast'
</script>

<template>
  <Toast />
  <router-view />
  <div class="default-layout">
    <AppHeader />
    <main class="main-content">
      <router-view />
    </main>
    <footer class="app-footer">
      <p>&copy; 2026 Vue Lottery App</p>
    </footer>
  </div>
</template>

<style scoped>
.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}
.app-footer {
  text-align: center;
  padding: 1rem;
  background-color: #f8f9fa;
  color: #6c757d;
}
</style>
