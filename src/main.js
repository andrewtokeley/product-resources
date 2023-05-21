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

// mount the app

const storeUser = useUserStore();
const lookupStore = useLookupStore();
lookupStore.fetchLookups();

router.beforeEach((to) => {
  console.log('beforeEachRoute')
  const store = useUserStore();
  if (to.meta.requiresAuth) {
    if (!store.isLoggedIn) {
      if (to.meta.requiresAdmin) {
        return '/login?go';  
      } else {
        const action = to.fullPath.includes('review') ? "Review" : "Recommendation";
        // redirect to login but say why - this is when someone unauthenticated wants to review/recommend
        return `/login?reason=true&redirect=${to.fullPath}&action=${action}`;
      }
    } 
  } 

  // just continue to the destination
  return true;

});

auth.onAuthStateChanged(async (authUser) => { 
  await storeUser.updateAuthUser(authUser);
  const app = createApp(App);
  app.use(router);
  app.use(pinia);
  app.mount('#app');
});


