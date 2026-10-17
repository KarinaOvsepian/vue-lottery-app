import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ServiceProvider } from '@/shared/api/service-provider.ts';
import type { User, CreateUserDto, UpdateUserDto } from '@/entities/user/model/user.ts';

export const useUsersStore = defineStore('users', () => {
  const usersList = ref<User[]>([]);
  const totalUsers = ref(0);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const lastParams = ref({ skip: -1, q: '' });

  const fetchUsers = async (params: { limit?: number; skip?: number; q?: string } = {}) => {
    const { limit = 10, skip = 0, q = '' } = params;

    if (usersList.value.length > 0 && lastParams.value.skip === skip && lastParams.value.q === q) {
      return;
    }

    isLoading.value = true;
    error.value = null;
    try {
      const data = await ServiceProvider.users.getAll(params);
      usersList.value = data.items;
      totalUsers.value = data.total;
      lastParams.value = { skip, q };
    } catch (err: any) {
      error.value = err.message || 'Помилка завантаження користувачів';
    } finally {
      isLoading.value = false;
    }
  };

  const getUserById = async (id: number): Promise<User> => {
    const localUser = usersList.value.find(u => u.id === id);
    if (localUser) return localUser; // Повертаємо змінену версію!

    return await ServiceProvider.users.getById(id);
  };

  const addUser = async (userData: CreateUserDto) => {
    isLoading.value = true;
    try {
      const newUser = await ServiceProvider.users.create(userData);
      const uniqueId = Date.now();
      usersList.value.unshift({ ...newUser, id: uniqueId });
      totalUsers.value++;
      return uniqueId;
    } catch (err: any) {
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateUser = async (id: number, userData: UpdateUserDto) => {
    isLoading.value = true;
    try {
      const updatedUser = await ServiceProvider.users.update(id, userData);
      const index = usersList.value.findIndex(u => u.id === id);
      if (index !== -1) {
        usersList.value[index] = { ...usersList.value[index], ...updatedUser };
      }
    } catch (err: any) {
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteUser = async (id: number) => {
    isLoading.value = true;
    try {
      await ServiceProvider.users.delete(id);
      usersList.value = usersList.value.filter(u => u.id !== id);
      totalUsers.value--;
    } catch (err: any) {
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    usersList, totalUsers, isLoading, error,
    fetchUsers, getUserById, addUser, updateUser, deleteUser
  };
});
