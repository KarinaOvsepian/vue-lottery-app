<script setup lang="ts">
import InputText from 'primevue/inputtext'

defineProps<{
  modelValue?: string | number
  label?: string
  placeholder?: string
  type?: string
  error?: string
  disabled?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="app-input-field">
    <label v-if="label" class="app-input-label">{{ label }}</label>
    <InputText
      :value="modelValue"
      :type="type || 'text'"
      :placeholder="placeholder"
      :invalid="!!error"
      :disabled="disabled"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <small v-if="error" class="app-input-error">{{ error }}</small>
  </div>
</template>

<style scoped>
.app-input-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1rem;
}
.app-input-label {
  font-weight: 500;
  font-size: 0.875rem;
}
.app-input-error {
  color: var(--p-red-500, #ef4444);
  font-size: 0.75rem;
}
</style>
