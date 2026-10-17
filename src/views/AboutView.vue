<template>
  <div class="about-view">
    <h1>About Author</h1>
    <div class="author-card">
      <h2 class="name">Овсепян Карина Артурівна</h2>

      <div class="skills">
        <h3>Technical Skills:</h3>
        <ul>
          <li>HTML / CSS (SCSS)</li>
          <li>JavaScript (ES6+) / TypeScript</li>
          <li>Vue.js 3 / Pinia / Vue Router</li>
          <li>Git / GitHub</li>
        </ul>
      </div>

      <div class="profile-link">
        <a href="https://github.com/KarinaOvsepian" target="_blank" rel="noopener noreferrer">
          Мій профіль GitHub
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-view {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}
.name {
  color: #0288d1;
}
.skills {
  margin-top: 20px;
}
ul {
  padding-left: 20px;
}
.profile-link {
  margin-top: 20px;
}
.profile-link a {
  color: #29b6f6;
  font-weight: bold;
}
</style>
