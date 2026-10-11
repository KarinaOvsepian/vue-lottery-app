import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ServiceProvider } from '@/services/service-provider';
import type { User, CreateUserDto, UpdateUserDto } from '@/types/user';

export const useUsersStore = defineStore('users', () => {
  const usersList = ref<User[]>([]);
  const totalUsers = ref(0);
  const isLoading = ref(false);
  const error = ref<string | null>(null);


  const fetchUsers = async (params: { limit?: number; skip?: number; q?: string } = {}) => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await ServiceProvider.users.getAll(params);
      usersList.value = data.items;
      totalUsers.value = data.total;
    } catch (err: any) {
      error.value = err.message || 'Помилка завантаження користувачів';
    } finally {
      isLoading.value = false;
    }
  };

  const addUser = async (userData: CreateUserDto) => {
    isLoading.value = true;
    error.value = null;
    try {
      const newUser = await ServiceProvider.users.create(userData);

      usersList.value.unshift({ ...newUser, id: Date.now() });
      totalUsers.value++;
    } catch (err: any) {
      error.value = err.message || 'Помилка створення користувача';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateUser = async (id: number, userData: UpdateUserDto) => {
    isLoading.value = true;
    error.value = null;
    try {
      const updatedUser = await ServiceProvider.users.update(id, userData);

      const index = usersList.value.findIndex(u => u.id === id);
      if (index !== -1) {
        usersList.value[index] = { ...usersList.value[index], ...updatedUser };
      }
    } catch (err: any) {
      error.value = err.message || 'Помилка оновлення користувача';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteUser = async (id: number) => {
    isLoading.value = true;
    error.value = null;
    try {
      await ServiceProvider.users.delete(id);

      usersList.value = usersList.value.filter(u => u.id !== id);
      totalUsers.value--;
    } catch (err: any) {
      error.value = err.message || 'Помилка видалення користувача';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    usersList,
    totalUsers,
    isLoading,
    error,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
  };
});
