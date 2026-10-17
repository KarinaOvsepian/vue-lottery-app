import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { registerServices } from './services.ts'
import { setupUI } from './ui.ts'

registerServices()

const app = createApp(App)
setupUI(app)
app.use(createPinia())
app.use(router)
app.mount('#app')
