<script setup lang="ts">
import type { Participant } from '@/types/lottery';

defineProps<{
  winner: Participant;
}>();

const emit = defineEmits<{
  (e: 'remove', id: string): void;
}>();
</script>

<template>
  <div class="winner-tag">
    <span class="winner-tag__name">{{ winner.name }}</span>
    <button
      type="button"
      class="winner-tag__close-btn"
      title="Видалити переможця"
      @click="emit('remove', winner.id)"
    >
      ×
    </button>
  </div>
</template>

<style scoped lang="scss">
.winner-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: #29b6f6;
  color: #ffffff;
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 13px;

  &__name {
    font-weight: 500;
  }

  &__close-btn {
    background: transparent;
    border: none;
    color: #ffffff;
    font-size: 16px;
    line-height: 1;
    cursor: pointer;
    padding: 0;
    opacity: 0.8;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
