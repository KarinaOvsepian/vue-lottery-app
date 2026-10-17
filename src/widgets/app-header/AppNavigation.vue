<script setup lang="ts">
import { useAuthStore } from '@/entities/session/model/auth.ts';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<template>
  <nav class="app-navigation">
    <router-link to="/" class="nav-link" exact-active-class="active">Home</router-link>
    <router-link to="/about" class="nav-link" exact-active-class="active">About author</router-link>
    <router-link to="/users" class="nav-link" active-class="active">Users</router-link>

    <a v-if="authStore.isAuthenticated" href="#" class="nav-link logout-btn" @click.prevent="handleLogout">Logout</a>
    <router-link v-else to="/login" class="nav-link" exact-active-class="active">Login</router-link>
  </nav>
</template>

<style scoped>
.app-navigation {
  display: flex;
  gap: 20px;
  align-items: center;
}

.nav-link {
  font-size: 1rem;
  color: #555;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #29b6f6;
}

.active {
  color: #0288d1;
  font-weight: bold;
  border-bottom: 2px solid #0288d1;
}

.logout-btn {
  color: #d32f2f;
}
.logout-btn:hover {
  color: #b71c1c;
}
</style>
