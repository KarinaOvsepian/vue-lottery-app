<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

interface Props {
  isOpen: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('close');
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="modal-backdrop" @click.self="emit('close')">
      <div class="modal-card">
        <header v-if="$slots.header" class="modal-header">
          <slot name="header" />
          <button class="modal-close-btn" type="button" @click="emit('close')">×</button>
        </header>

        <section class="modal-body">
          <slot name="body">
            <slot />
          </slot>
        </section>

        <footer v-if="$slots.footer" class="modal-footer">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-card {
  background: #ffffff;
  border-radius: 6px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 16px;
  border-bottom: 1px solid #eeeeee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.modal-close-btn {
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
  line-height: 1;
}

.modal-body {
  padding: 16px;
}

.modal-footer {
  padding: 12px 16px;
  border-top: 1px solid #eeeeee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;

  .modal-card {
    transition: transform 0.25s ease;
  }
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;

  .modal-card {
    transform: scale(0.95);
  }
}
</style>
