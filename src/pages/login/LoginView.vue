<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { useAuthStore } from '@/entities/session/model/auth.ts';
import AppInput from '@/shared/ui/AppInput.vue';
import AppButton from '@/shared/ui/AppButton.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const isLoading = ref(false);
const apiError = ref('');

const schema = yup.object({
  username: yup.string().required("Username є обов'язковим"),
  password: yup.string()
    .required("Пароль є обов'язковим")
    .min(6, "Пароль має містити мінімум 6 символів")
});

const { handleSubmit } = useForm({
  validationSchema: schema,
});

const { value: username, errorMessage: usernameError, meta: usernameMeta } = useField<string>('username');
const { value: password, errorMessage: passwordError, meta: passwordMeta } = useField<string>('password');

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  apiError.value = '';

  try {
    await authStore.login({
      username: values.username,
      password: values.password
    });

    const redirectPath = route.query.redirect as string || '/users';
    router.push(redirectPath);
  } catch (error: any) {
    apiError.value = 'Неправильний логін або пароль. Перевірте дані та спробуйте ще раз.';
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="login-view">
    <div class="login-header">
      <h2>Авторизація</h2>
      <p>Увійдіть, щоб отримати доступ до списку користувачів</p>
    </div>

    <div v-if="apiError" class="api-error-alert">
      {{ apiError }}
    </div>

    <form @submit.prevent="onSubmit" class="login-form">
      <div class="form-group">
        <label for="username">Username</label>
        <AppInput
          id="username"
          v-model="username"
          placeholder="Наприклад: emilys"
          :error="usernameError"
          :is-valid="usernameMeta.touched && usernameMeta.valid"
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <AppInput
          id="password"
          type="password"
          v-model="password"
          placeholder="Мінімум 6 символів (emilyspass)"
          :error="passwordError"
          :is-valid="passwordMeta.touched && passwordMeta.valid"
        />
      </div>

      <AppButton
        type="submit"
        class="submit-btn"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Завантаження...' : 'Увійти' }}
      </AppButton>
    </form>

    <div class="test-credentials">
      <strong>Тестові дані:</strong><br>
      Login: <em>emilys</em><br>
      Password: <em>emilyspass</em>
    </div>
  </div>
</template>

<style scoped>
.login-view {
  width: 100%;
}
.login-header {
  text-align: center;
  margin-bottom: 24px;
}
.login-header h2 {
  margin: 0 0 8px 0;
  color: #333;
}
.login-header p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}
.form-group {
  margin-bottom: 16px;
}
.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  font-size: 0.9rem;
  color: #444;
}
.submit-btn {
  width: 100%;
  margin-top: 8px;
  padding: 10px;
  font-size: 1rem;
}
.api-error-alert {
  background-color: #ffebee;
  color: #c62828;
  padding: 10px 14px;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-bottom: 16px;
  border-left: 4px solid #c62828;
}
.test-credentials {
  margin-top: 24px;
  padding: 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #555;
  text-align: center;
}
</style>
