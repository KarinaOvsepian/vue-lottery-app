<script setup lang="ts">
interface Props {
  type?: string;
  placeholder?: string;
  error?: string;
  isValid?: boolean;
  id?: string;
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  error: '',
  isValid: false,
  id: ''
});

const modelValue = defineModel<string | number>();
</script>

<template>
  <div class="app-input-wrapper">
    <div class="app-input-container">
      <input
        :id="id"
        v-model="modelValue"
        :type="type"
        :placeholder="placeholder"
        :class="[
          'app-input',
          {
            'app-input--error': error,
            'app-input--valid': isValid && !error
          }
        ]"
      />
      <span v-if="isValid && !error" class="valid-icon">✓</span>
    </div>
    <span v-if="error" class="error-message">{{ error }}</span>
  </div>

</template>

<style scoped lang="scss">
.app-input-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 12px;
}

.app-input-container {
  position: relative;
  width: 100%;
}

.app-input {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  outline: none;
  background-color: #fbfbfb;
  transition: border-color 0.2s;

  &:focus {
    background-color: #fff;
    border-color: #80bdff;
  }

  &--error {
    border-color: #e57373 !important;
    background-color: #fff;
  }

  &--valid {
    border-color: #4db6ac !important;
    background-color: #fff;
    padding-right: 32px;
  }
}

.valid-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #2e7d32;
  font-weight: bold;
}

.error-message {
  margin-top: 4px;
  font-size: 12px;
  color: #e57373;
}
</style>
