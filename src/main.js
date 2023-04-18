import "../src/main.css"
import { createApp } from 'vue'
import routes from './routes'
import { createRouter, createWebHistory } from "vue-router"
import App from './App.vue'

let router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

let app = createApp(App)
app.use(router);
app.mount('#app')
