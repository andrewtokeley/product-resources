import "../src/main.css"
import { createApp } from 'vue'
import routes from './routes'
import { createRouter, createWebHistory } from "vue-router"
import App from './App.vue'
import { createPinia } from "pinia";
import { auth } from '@/core/services/firebaseInit'
import { useUserStore } from "./core/state/userStore"

const pinia = createPinia();

let router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

// Create the app
let app = createApp(App)
app.use(router);
app.use(pinia);

const userStore = useUserStore()
app.use(userStore);

app.mount('#app')

auth.onAuthStateChanged(async (user) => { 
  const store = useUserStore()
  await store.login(user);
});


