<script setup lang="ts">
import { ref, watch } from 'vue';

const emit = defineEmits<{
  (e: 'filter-by-name', query: string): void;
}>();

const searchTerm = ref('');
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

watch(searchTerm, (newValue) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(() => {
    emit('filter-by-name', newValue.trim());
  }, 300);
});
</script>

<template>
  <div class="search-bar">
    <input
      v-model="searchTerm"
      type="text"
      placeholder="Search participants by name..."
      class="search-input"
    />
  </div>
</template>

<style scoped lang="scss">
.search-bar {
  margin-bottom: 16px;
}

.search-input {
  width: 100%;
  padding: 10px 14px;
  font-size: 14px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  outline: none;
  background-color: #fbfbfb;

  &:focus {
    background-color: #ffffff;
    border-color: #80bdff;
  }
}
</style>
