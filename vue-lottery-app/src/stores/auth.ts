import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { ServiceProvider } from '@/services/service-provider';
import type { User } from '@/types/user';
import type { LoginCredentials } from '@/types/auth';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const accessToken = ref<string | null>(localStorage.getItem('accessToken'));
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'));

  const isAuthenticated = computed(() => !!accessToken.value);

  const setTokens = (access: string, refresh: string) => {
    accessToken.value = access;
    refreshToken.value = refresh;
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
  };

  const clearSession = () => {
    accessToken.value = null;
    refreshToken.value = null;
    user.value = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const data = await ServiceProvider.auth.login(credentials);

      setTokens(data.accessToken, data.refreshToken);

      const loggedInUser: User = {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        image: data.image,
        age: 0,
        phone: '',
      };

      user.value = loggedInUser;
      localStorage.setItem('user', JSON.stringify(loggedInUser));
    } catch (error) {
      clearSession();
      throw error;
    }
  };

  const logout = () => {
    clearSession();
  };

  const fetchMe = async () => {
    if (!accessToken.value) return;
    try {
      const data = await ServiceProvider.auth.getMe();
      user.value = data;
      localStorage.setItem('user', JSON.stringify(data));
    } catch (error) {
      clearSession();
    }
  };

  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser);
    } catch (e) {
      console.error('Failed to parse stored user', e);
    }
  }

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    login,
    logout,
    fetchMe,
  };
});
