import "../src/main.css"
import { createApp } from 'vue'
import routes from './routes'
import { createRouter, createWebHistory } from "vue-router"
import App from './App.vue'
import { createPinia } from "pinia";
import { auth } from '@/core/services/firebaseInit'
import { useUserStore } from "@/core/state/userStore"
import { useLookupStore } from "@/core/state/lookupStore"

const pinia = createPinia();

let router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

router.beforeEach((to) => {
  // analytics.logEvent('page_view', {
  //   page_location: to.fullPath,
  //   page_path: to.path,
  //   page_title: to.meta.page_title
  // });
  const store = useUserStore();
  if (to.meta.requiresAuth) {
     if ((!store.isLoggedIn) || (to.meta.requiresAdmin && !store.isAdmin)) {
        // redirect to home
        return "/";
     }
  } else {
    // continue to the url
    return true;
  }
})

// Create the app
let app = createApp(App);
app.use(router);
app.use(pinia);

let store = useLookupStore();
store.fetchLookups().then ( () => {
  app.mount('#app');
})

auth.onAuthStateChanged(async (user) => { 
  const store = useUserStore();
  await store.login(user);
});


