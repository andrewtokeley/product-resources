import "../src/main.css"
import { createApp } from 'vue'
import routes from './routes'
import { createRouter, createWebHistory } from "vue-router"
import App from './App.vue'
import { createPinia } from "pinia";
import { auth } from '@/core/services/firebaseInit'
import { useUserStore } from "@/core/state/userStore"
import { useLookupStore } from "@/core/state/lookupStore"
import { logPageViewFromRouteLocation } from "./core/services/analytics"

const pinia = createPinia();

let router = createRouter({
  history: createWebHistory(),
  routes: routes,
  scrollBehavior () {
    window.scrollTo(0,0);
  }
})

// refresh lookups in the store

router.beforeEach((to) => {
  // log page view to GA
  logPageViewFromRouteLocation(to);

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
  if (storeUser) {
    await storeUser.updateAuthUser(authUser);  
  }
  
  if (!app) {
    
    app = createApp(App);
    
    // cache lookups in state
    app.use(pinia);
    const lookupStore = useLookupStore();
    await lookupStore.fetchLookups();
    
    // update state with user
    storeUser = useUserStore();
    await storeUser.updateAuthUser(authUser); 

    app.use(router);
    app.mount('#app');
  }
  
})


