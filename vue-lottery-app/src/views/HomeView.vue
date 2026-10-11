<template>
  <div class="home-view">
    <h1>Welcome to Vue Lottery App</h1>
    <p class="description">
      Цей проєкт є односторінковим застосунком (SPA), створеним у рамках лабораторної роботи №5.
      Він демонструє роботу з маршрутизацією, глобальним керуванням станом, авторизацією за JWT
      та застосуванням патерну Repository для взаємодії з REST API (DummyJSON).
    </p>
    <div class="tech-stack">
      <h2>Технології:</h2>
      <ul>
        <li>Vue 3 (Composition API)</li>
        <li>Vue Router</li>
        <li>Pinia</li>
        <li>TypeScript</li>
        <li>VeeValidate + Yup/Zod</li>
      </ul>
    </div>
    <div class="links">
      <a href="https://github.com/ваший-логін/vue-lottery-app" target="_blank" rel="noopener noreferrer">
        Переглянути код на GitHub
      </a>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}
.description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #444;
}
h1, h2 {
  color: #333;
}
ul {
  padding-left: 20px;
}
.links {
  margin-top: 30px;
}
.links a {
  color: #29b6f6;
  font-weight: bold;
}
</style>
