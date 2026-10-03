<script setup lang="ts">
import { reactive } from 'vue';
import type { Participant, ParticipantFormData, FormErrors } from '@/types/lottery';
import AppInput from '@/components/ui/AppInput.vue';
import AppButton from '@/components/ui/AppButton.vue';

const props = defineProps<{
  existingParticipants: Participant[];
}>();

const emit = defineEmits<{
  (e: 'submit-participant', data: ParticipantFormData): void;
}>();

const form = reactive<ParticipantFormData>({
  name: '',
  dateOfBirth: '',
  email: '',
  phone: ''
});

const errors = reactive<FormErrors>({});
const touched = reactive<Record<keyof ParticipantFormData, boolean>>({
  name: false,
  dateOfBirth: false,
  email: false,
  phone: false
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+380\d{9}$/;

const validate = (): boolean => {
  let isValid = true;
  Object.keys(errors).forEach((key) => delete errors[key as keyof FormErrors]);

  if (!form.name.trim()) {
    errors.name = 'This value is required';
    isValid = false;
  }

  if (!form.dateOfBirth) {
    errors.dateOfBirth = 'This value is required';
    isValid = false;
  } else {
    const selectedDate = new Date(form.dateOfBirth);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate > today) {
      errors.dateOfBirth = 'Date of birth cannot be in the future';
      isValid = false;
    }
  }

  if (!form.email.trim()) {
    errors.email = 'This value is required';
    isValid = false;
  } else if (!emailRegex.test(form.email)) {
    errors.email = 'Please enter a valid email address';
    isValid = false;
  } else {
    const isDuplicate = props.existingParticipants.some(
      (p) => p.email.toLowerCase() === form.email.trim().toLowerCase()
    );
    if (isDuplicate) {
      errors.email = 'Participant with this email already exists';
      isValid = false;
    }
  }

  if (!form.phone.trim()) {
    errors.phone = 'This value is required';
    isValid = false;
  } else if (!phoneRegex.test(form.phone.trim())) {
    errors.phone = 'Format must be +380XXXXXXXXX (9 digits after code)';
    isValid = false;
  }

  return isValid;
};

const resetForm = () => {
  form.name = '';
  form.dateOfBirth = '';
  form.email = '';
  form.phone = '';

  (Object.keys(touched) as (keyof ParticipantFormData)[]).forEach((key) => {
    touched[key] = false;
  });
  Object.keys(errors).forEach((key) => delete errors[key as keyof FormErrors]);
};

const handleSubmit = () => {
  (Object.keys(touched) as (keyof ParticipantFormData)[]).forEach((key) => {
    touched[key] = true;
  });

  if (validate()) {
    emit('submit-participant', {
      name: form.name.trim(),
      dateOfBirth: form.dateOfBirth,
      email: form.email.trim(),
      phone: form.phone.trim()
    });
    resetForm();
  }
};
</script>

<template>
  <div class="register-card">
    <div class="card-header">
      <h3 class="card-title">REGISTER FORM</h3>
      <p class="card-subtitle">Please fill in all the fields.</p>
    </div>

    <form class="register-form" @submit.prevent="handleSubmit" @keydown.enter.prevent="handleSubmit">
      <div class="form-group">
        <label for="reg-name">Name</label>
        <AppInput
          id="reg-name"
          v-model="form.name"
          placeholder="Enter user name"
          :error="errors.name"
          :is-valid="touched.name && !errors.name"
          @blur="touched.name = true"
        />
      </div>

      <div class="form-group">
        <label for="reg-dob">Date of Birth</label>
        <AppInput
          id="reg-dob"
          v-model="form.dateOfBirth"
          type="date"
          :error="errors.dateOfBirth"
          :is-valid="touched.dateOfBirth && !errors.dateOfBirth"
          @blur="touched.dateOfBirth = true"
        />
      </div>

      <div class="form-group">
        <label for="reg-email">Email</label>
        <AppInput
          id="reg-email"
          v-model="form.email"
          type="email"
          placeholder="Enter email"
          :error="errors.email"
          :is-valid="touched.email && !errors.email"
          @blur="touched.email = true"
        />
      </div>

      <div class="form-group">
        <label for="reg-phone">Phone number</label>
        <AppInput
          id="reg-phone"
          v-model="form.phone"
          placeholder="Enter Phone number"
          :error="errors.phone"
          :is-valid="touched.phone && !errors.phone"
          @blur="touched.phone = true"
        />
      </div>

      <div class="form-actions">
        <AppButton type="submit">Save</AppButton>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
.register-card {
  background-color: #ffffff;
  padding: 24px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}

.card-title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #424242;
}

.card-subtitle {
  margin: 4px 0 16px 0;
  font-size: 12px;
  color: #9e9e9e;
}

.form-group {
  margin-bottom: 12px;

  label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #424242;
    margin-bottom: 6px;
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
