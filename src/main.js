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

// refresh lookups in the store

router.beforeEach((to) => {
  console.log('beforeEachRoute')
  const store = useUserStore();
  if (to.meta.requiresAuth) {
    if (!store.isLoggedIn) {
      if (to.meta.requiresAdmin) {
        return '/login?invalid';  
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

let app;
let storeUser;
auth.onAuthStateChanged(async (authUser) => {
  if (!app) {
    console.log('first load');
    
    app = createApp(App).use(pinia);
    
    // update lookups
    storeUser = useUserStore();
    const lookupStore = useLookupStore();
    await lookupStore.fetchLookups();
    console.log('lookups fetched');
    
    app.use(router);
    app.mount('#app');
    console.log('app mounted');
  }
  // update store with user
  if (storeUser) {
    await storeUser.updateAuthUser(authUser);  
  }
})


