import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { LoginCredentials, AuthResponse } from './types'
import { ServiceProvider } from '@/shared/api'

const STORAGE_KEY = 'session:token'

export const useSessionStore = defineStore(
  'session',
  () => {
    const accessToken = ref<string | null>(localStorage.getItem(STORAGE_KEY))

    const isAuthenticated = computed(() => accessToken.value !== null)

    function setSession(token: string) {
      accessToken.value = token
      localStorage.setItem(STORAGE_KEY, token)
    }

    function clearSession() {
      accessToken.value = null
      localStorage.removeItem(STORAGE_KEY)
    }

    async function login(credentials: LoginCredentials): Promise<AuthResponse> {
      const authService = ServiceProvider.get<any>('auth')
      const data: AuthResponse = await authService.login(credentials)
      setSession(data.accessToken)
      return data
    }

    function logout() {
      clearSession()
    }

    return {
      accessToken,
      isAuthenticated,
      setSession,
      clearSession,
      login,
      logout
    }
  }
)
