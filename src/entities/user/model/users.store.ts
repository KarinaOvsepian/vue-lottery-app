import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ServiceProvider } from '@/shared/api'
import type { UserService } from '../api/user.service'
import type { User, CreateUserDto, UpdateUserDto } from './types'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const currentUser = ref<User | null>(null)
  const total = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const hasUsers = computed(() => users.value.length > 0)

  const getService = () => ServiceProvider.get<UserService>('users')

  async function fetchUsers(limit = 10, skip = 0, q = '') {
    isLoading.value = true
    error.value = null
    try {
      const data = await getService().getAll({ limit, skip, q })
      users.value = data.items
      total.value = data.total
    } catch (e) {
      error.value = (e as Error).message || 'Помилка завантаження користувачів'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchUser(id: number) {
    isLoading.value = true
    error.value = null
    try {
      const data = await getService().getById(id)
      currentUser.value = data
      return data
    } catch (e) {
      error.value = (e as Error).message || 'Користувача не знайдено'
    } finally {
      isLoading.value = false
    }
  }

  async function createUser(dto: CreateUserDto) {
    isLoading.value = true
    error.value = null
    try {
      const newUser = await getService().create(dto)
      const localUser = { ...newUser, id: Date.now() }
      users.value.unshift(localUser)
      total.value++
      return localUser
    } catch (e) {
      error.value = (e as Error).message || 'Помилка створення'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function updateUser(id: number, dto: UpdateUserDto) {
    isLoading.value = true
    error.value = null
    try {
      const updated = await getService().update(id, dto)
      const index = users.value.findIndex((u) => u.id === id)
      if (index !== -1) {
        users.value[index] = { ...users.value[index], ...updated }
      }
      if (currentUser.value?.id === id) {
        currentUser.value = { ...currentUser.value, ...updated }
      }
      return updated
    } catch (e) {
      error.value = (e as Error).message || 'Помилка оновлення'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function removeUser(id: number) {
    isLoading.value = true
    error.value = null
    try {
      await getService().delete(id)
      users.value = users.value.filter((u) => u.id !== id)
      total.value--
    } catch (e) {
      error.value = (e as Error).message || 'Помилка видалення'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    users,
    currentUser,
    total,
    isLoading,
    error,
    hasUsers,
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    removeUser
  }
})
