<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useToast } from 'primevue/usetoast'
import { useSessionStore } from '@/entities/session'
import { AppInput, AppButton } from '@/shared/ui'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const sessionStore = useSessionStore()

const schema = yup.object({
  username: yup.string().required("Ім'я користувача обов'язкове"),
  password: yup.string().min(6, 'Пароль має бути не менше 6 символів').required('Пароль обов’язковий')
})

const { handleSubmit, isSubmitting } = useForm({ validationSchema: schema })
const { value: username, errorMessage: usernameError } = useField<string>('username')
const { value: password, errorMessage: passwordError } = useField<string>('password')

const onSubmit = handleSubmit(async (values) => {
  try {
    await sessionStore.login(values)
    toast.add({ severity: 'success', summary: 'Успіх', detail: 'Авторизація успішна!', life: 3000 })
    const redirectPath = (route.query.redirect as string) || '/users'
    router.push(redirectPath)
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Помилка', detail: 'Невірний логін або пароль', life: 3000 })
  }
})
</script>

<template>
  <form @submit.prevent="onSubmit" class="login-form">
    <h2>Вхід у систему</h2>
    <AppInput v-model="username" label="Логін" placeholder="emilys" :error="usernameError" />
    <AppInput v-model="password" type="password" label="Пароль" placeholder="••••••••" :error="passwordError" />
    <AppButton type="submit" label="Увійти" :loading="isSubmitting" />
  </form>
</template>
