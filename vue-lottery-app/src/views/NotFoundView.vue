<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="not-found">
    <h1>404</h1>
    <h2>Сторінку не знайдено</h2>
    <p>Здається, ви перейшли за неіснуючим посиланням.</p>
    <AppButton @click="goHome">Повернутися на головну</AppButton>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 50px 20px;
}
h1 {
  font-size: 6rem;
  color: #d32f2f;
  margin: 0;
}
h2 {
  font-size: 2rem;
  color: #333;
}
p {
  color: #666;
  margin-bottom: 30px;
}
</style>
