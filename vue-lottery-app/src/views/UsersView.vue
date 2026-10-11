<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUsersStore } from '@/stores/users';
import AppButton from '@/components/ui/AppButton.vue';
import AppInput from '@/components/ui/AppInput.vue';
import AppModal from '@/components/ui/AppModal.vue';

const route = useRoute();
const router = useRouter();
const usersStore = useUsersStore();

const limit = 10;
const searchQuery = ref((route.query.q as string) || '');
const currentPage = ref(Number(route.query.page) || 1);
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

const isDeleteModalOpen = ref(false);
const userToDelete = ref<{ id: number; name: string } | null>(null);

const updateQueryUrl = (page: number, q: string) => {
  router.push({
    path: '/users',
    query: {
      page: page > 1 ? page : undefined,
      q: q || undefined
    }
  });
};

watch(
  () => route.query,
  async (newQuery) => {
    currentPage.value = Number(newQuery.page) || 1;
    searchQuery.value = (newQuery.q as string) || '';

    const skip = (currentPage.value - 1) * limit;
    await usersStore.fetchUsers({ limit, skip, q: searchQuery.value });
  },
  { immediate: true, deep: true }
);

const handleSearchInput = (val: string | number | undefined) => {
  const query = String(val ?? '');
  if (debounceTimer) clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    updateQueryUrl(1, query);
  }, 500);
};

const changePage = (newPage: number) => {
  const totalPages = Math.ceil(usersStore.totalUsers / limit);
  if (newPage >= 1 && newPage <= totalPages) {
    updateQueryUrl(newPage, searchQuery.value);
  }
};

const openDeleteModal = (id: number, name: string) => {
  userToDelete.value = { id, name };
  isDeleteModalOpen.value = true;
};

const confirmDelete = async () => {
  if (userToDelete.value) {
    try {
      await usersStore.deleteUser(userToDelete.value.id);
      if (usersStore.usersList.length === 0 && currentPage.value > 1) {
        updateQueryUrl(currentPage.value - 1, searchQuery.value);
      }
    } catch (e) {
      console.error('Помилка видалення');
    }
  }
  isDeleteModalOpen.value = false;
  userToDelete.value = null;
};
</script>

<template>
  <div class="users-view">
    <div class="users-header">
      <h2>Список користувачів</h2>
      <router-link to="/users/add">
        <AppButton variant="success">Додати користувача</AppButton>
      </router-link>
    </div>

    <div class="toolbar">
      <AppInput
        v-model="searchQuery"
        placeholder="Пошук користувачів..."
        @input="handleSearchInput(searchQuery)"
      />
    </div>

    <div v-if="usersStore.isLoading" class="loading">Завантаження...</div>
    <div v-else-if="usersStore.error" class="error">{{ usersStore.error }}</div>

    <div v-else class="table-container">
      <table class="users-table">
        <thead>
        <tr>
          <th>ID</th>
          <th>Ім'я</th>
          <th>Email</th>
          <th>Телефон</th>
          <th>Вік</th>
          <th class="actions">Дії</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in usersStore.usersList" :key="user.id">
          <td>{{ user.id }}</td>
          <td>
            <img v-if="user.image" :src="user.image" class="avatar" alt="avatar" />
            {{ user.firstName }} {{ user.lastName }}
          </td>
          <td>{{ user.email }}</td>
          <td>{{ user.phone }}</td>
          <td>{{ user.age }}</td>
          <td class="action-buttons">
            <router-link :to="`/users/${user.id}`">
              <AppButton variant="secondary">Деталі</AppButton>
            </router-link>
            <AppButton variant="danger" @click="openDeleteModal(user.id, user.firstName)">
              Видалити
            </AppButton>
          </td>
        </tr>
        <tr v-if="usersStore.usersList.length === 0">
          <td colspan="6" class="empty">Користувачів не знайдено</td>
        </tr>
        </tbody>
      </table>

      <div class="pagination" v-if="usersStore.totalUsers > limit">
        <AppButton
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          Попередня
        </AppButton>
        <span class="page-info">
          Сторінка {{ currentPage }} з {{ Math.ceil(usersStore.totalUsers / limit) }}
        </span>
        <AppButton
          :disabled="currentPage === Math.ceil(usersStore.totalUsers / limit)"
          @click="changePage(currentPage + 1)"
        >
          Наступна
        </AppButton>
      </div>
    </div>

    <!-- Модальне вікно підтвердження видалення -->
    <AppModal :is-open="isDeleteModalOpen" @close="isDeleteModalOpen = false">
      <template #header>Підтвердження видалення</template>
      <template #body>
        <p v-if="userToDelete">
          Ви дійсно бажаєте видалити користувача <strong>{{ userToDelete.name }}</strong>?
        </p>
      </template>
      <template #footer>
        <AppButton variant="secondary" @click="isDeleteModalOpen = false">Ні</AppButton>
        <AppButton variant="danger" @click="confirmDelete">Так</AppButton>
      </template>
    </AppModal>
  </div>
</template>

<style scoped>
.users-view { width: 100%; }
.users-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.toolbar { margin-bottom: 20px; max-width: 400px; }
.table-container { background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden; padding: 15px; }
.users-table { width: 100%; border-collapse: collapse; text-align: left; }
.users-table th, .users-table td { padding: 12px; border-bottom: 1px solid #eee; }
.users-table th { background-color: #f8f9fa; font-weight: 600; color: #444; }
.avatar { width: 30px; height: 30px; border-radius: 50%; vertical-align: middle; margin-right: 10px; }
.action-buttons { display: flex; gap: 8px; }
.empty { text-align: center; color: #888; padding: 20px !important; }
.loading, .error { text-align: center; padding: 40px; font-size: 1.2rem; }
.error { color: #d32f2f; }
.pagination { display: flex; justify-content: center; align-items: center; gap: 15px; margin-top: 20px; }
.page-info { font-weight: 500; }
</style>
