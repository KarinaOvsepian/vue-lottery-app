<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';

const route = useRoute();

const layouts = {
  DefaultLayout,
  AuthLayout
};

const currentLayout = computed(() => {
  const layoutName = route.meta.layout as keyof typeof layouts;
  return layouts[layoutName] || DefaultLayout;
});
</script>

<template>
  <component :is="currentLayout" />
</template>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #333;
}
* {
  box-sizing: border-box;
}
a {
  text-decoration: none;
  color: inherit;
}
</style>
