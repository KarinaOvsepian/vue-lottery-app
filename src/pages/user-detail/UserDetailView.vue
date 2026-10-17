<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUsersStore } from '@/entities/user/model/users.ts';
import type { User } from '@/entities/user/model/user.ts';
import AppButton from '@/shared/ui/AppButton.vue';

const props = defineProps<{ id: string }>();
const router = useRouter();
const usersStore = useUsersStore(); // Використовуємо стор

const user = ref<User | null>(null);
const isLoading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    user.value = await usersStore.getUserById(Number(props.id));
  } catch (err: any) {
    error.value = 'Користувача не знайдено';
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="user-detail-view">
    <div class="header">
      <AppButton variant="secondary" @click="router.push('/users')">Назад до списку</AppButton>
      <router-link v-if="user" :to="`/users/${user.id}/edit`">
        <AppButton>Редагувати користувача</AppButton>
      </router-link>
    </div>

    <div v-if="isLoading" class="loading">Завантаження...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else-if="user" class="user-card">
      <img v-if="user.image" :src="user.image" class="profile-pic" alt="avatar" />
      <div class="info">
        <h1>{{ user.firstName }} {{ user.lastName }}</h1>
        <p><strong>Username:</strong> {{ user.username }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Phone:</strong> {{ user.phone }}</p>
        <p><strong>Age:</strong> {{ user.age }} ({{ user.gender }})</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header { display: flex; justify-content: space-between; margin-bottom: 20px; }
.user-card { display: flex; gap: 30px; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.profile-pic { width: 150px; height: 150px; border-radius: 8px; object-fit: cover; background: #f0f0f0; }
.info h1 { margin-top: 0; color: #333; }
.info p { font-size: 1.1rem; color: #555; margin: 8px 0; }
</style>
