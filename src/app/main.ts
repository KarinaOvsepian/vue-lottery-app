import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './providers/router'
import { registerServices } from './providers/services'
import { setupUI } from './providers/ui'

registerServices()

const app = createApp(App)
setupUI(app)
app.use(createPinia())
app.use(router)
app.mount('#app')
