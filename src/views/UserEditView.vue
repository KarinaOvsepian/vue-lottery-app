<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { useUsersStore } from '@/stores/users';
import type { UpdateUserDto } from '@/types/user';
import AppButton from '@/components/ui/AppButton.vue';
import AppInput from '@/components/ui/AppInput.vue';

const props = defineProps<{ id: string }>();
const router = useRouter();
const usersStore = useUsersStore();

const isLoadingUser = ref(true);
const isSaving = ref(false);

const schema = yup.object({
  firstName: yup.string().required("Ім'я є обов'язковим"),
  lastName: yup.string().required('Прізвище є обов\'язковим'),
  email: yup.string().email('Некоректний формат email').required('Email є обов\'язковим'),
  age: yup.number().min(1, 'Вік має бути більше 0').required('Вік є обов\'язковим'),
  phone: yup.string().required('Телефон є обов\'язковим')
});

const { handleSubmit, resetForm } = useForm({
  validationSchema: schema,
});

const { value: firstName, errorMessage: firstNameErr } = useField<string>('firstName');
const { value: lastName, errorMessage: lastNameErr } = useField<string>('lastName');
const { value: email, errorMessage: emailErr } = useField<string>('email');
const { value: age, errorMessage: ageErr } = useField<string | number>('age');
const { value: phone, errorMessage: phoneErr } = useField<string>('phone');

onMounted(async () => {
  try {
    const user = await usersStore.getUserById(Number(props.id));
    resetForm({
      values: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        phone: user.phone
      }
    });
  } catch (e) {
    alert('Помилка завантаження даних користувача');
    router.push('/users');
  } finally {
    isLoadingUser.value = false;
  }
});

const onSubmit = handleSubmit(async (values) => {
  isSaving.value = true;
  try {
    const updateData: UpdateUserDto = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      age: Number(values.age),
      phone: values.phone
    };

    await usersStore.updateUser(Number(props.id), updateData);

    router.push(`/users/${props.id}`);
  } catch (error) {
    alert('Помилка оновлення');
  } finally {
    isSaving.value = false;
  }
});
</script>

<template>
  <div class="user-edit-view">
    <div class="header">
      <h2>Редагування користувача #{{ id }}</h2>
      <AppButton variant="secondary" @click="router.back()">Скасувати</AppButton>
    </div>

    <div v-if="isLoadingUser" class="loading">Завантаження даних...</div>

    <div v-else class="form-card">
      <form @submit.prevent="onSubmit">
        <div class="form-row">
          <div class="form-group">
            <label>Ім'я</label>
            <AppInput v-model="firstName" :error="firstNameErr" />
          </div>
          <div class="form-group">
            <label>Прізвище</label>
            <AppInput v-model="lastName" :error="lastNameErr" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Email</label>
            <AppInput v-model="email" type="email" :error="emailErr" />
          </div>
          <div class="form-group">
            <label>Телефон</label>
            <AppInput v-model="phone" :error="phoneErr" />
          </div>
        </div>

        <div class="form-group" style="max-width: 150px;">
          <label>Вік</label>
          <AppInput v-model="age" type="number" :error="ageErr" />
        </div>

        <div class="actions">
          <AppButton type="submit" :disabled="isSaving">
            {{ isSaving ? 'Збереження...' : 'Зберегти зміни' }}
          </AppButton>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.form-card { background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.form-row { display: flex; gap: 20px; }
.form-row > .form-group { flex: 1; }
.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 6px; font-weight: 500; font-size: 0.9rem; color: #444; }
.actions { margin-top: 25px; text-align: right; }
</style>
