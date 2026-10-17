<script setup lang="ts">
import { watch } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import type { User, CreateUserDto } from '@/entities/user'
import { AppInput, AppButton } from '@/shared/ui'

const props = defineProps<{
  initialValues?: User | null
  loading?: boolean
  submitLabel?: string
}>()

const emit = defineEmits<{
  submit: [dto: CreateUserDto]
}>()

const schema = yup.object({
  firstName: yup.string().required("Ім'я обов'язкове"),
  lastName: yup.string().required('Прізвище обов’язкове'),
  email: yup.string().email('Некоректний email').required('Email обов’язковий'),
  age: yup.number().typeError('Вкажіть число').min(1, 'Вік має бути > 0').required('Вік обов’язковий'),
  phone: yup.string().required('Телефон обов’язковий')
})

const { handleSubmit, resetForm } = useForm<CreateUserDto>({ validationSchema: schema })

const { value: firstName, errorMessage: firstNameError } = useField<string>('firstName')
const { value: lastName, errorMessage: lastNameError } = useField<string>('lastName')
const { value: email, errorMessage: emailError } = useField<string>('email')
const { value: age, errorMessage: ageError } = useField<number>('age')
const { value: phone, errorMessage: phoneError } = useField<string>('phone')

watch(
  () => props.initialValues,
  (val) => {
    if (val) {
      resetForm({ values: { ...val } })
    }
  },
  { immediate: true }
)

const onSubmit = handleSubmit((values) => {
  emit('submit', values)
})
</script>

<template>
  <form @submit.prevent="onSubmit" class="user-form">
    <AppInput v-model="firstName" label="Ім'я" :error="firstNameError" />
    <AppInput v-model="lastName" label="Прізвище" :error="lastNameError" />
    <AppInput v-model="email" label="Email" :error="emailError" />
    <AppInput v-model="age" type="number" label="Вік" :error="ageError" />
    <AppInput v-model="phone" label="Телефон" :error="phoneError" />
    <AppButton type="submit" :label="submitLabel || 'Зберегти'" :loading="loading" />
  </form>
</template>
