<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  type: 'button',
  disabled: false
});

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="['app-btn', `app-btn--${variant}`]"
    @click="emit('click', $event)"
  >
    <slot />
  </button>
</template>

<style scoped lang="scss">
.app-btn {
  padding: 8px 18px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 4px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &--primary {
    background-color: #29b6f6;
    color: #fff;
    &:hover:not(:disabled) {
      background-color: #0288d1;
    }
  }

  &--danger {
    background-color: #ef5350;
    color: #fff;
    &:hover:not(:disabled) {
      background-color: #d32f2f;
    }
  }

  &--secondary {
    background-color: #e0e0e0;
    color: #333;
    &:hover:not(:disabled) {
      background-color: #bdbdbd;
    }
  }
}
</style>
