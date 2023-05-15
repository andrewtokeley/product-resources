import "../src/main.css"
import { createApp } from 'vue'
import routes from './routes'
import { createRouter, createWebHistory } from "vue-router"
import App from './App.vue'
import { createPinia } from "pinia";
import { auth } from '@/core/services/firebaseInit'
import { useUserStore } from "@/core/state/userStore"
import { useLookupStore } from "@/core/state/lookupStore"
import { DateTime } from "luxon"
import { addUser, getUser, recordUserLogin } from "./modules/users/services/user-services"

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

auth.onAuthStateChanged(async (user) => { 
  
  // record the user's login
  if (user) {
    let userRecord = await getUser(user.uid)
    if (!userRecord) {
      await addUser(user);
    }
    await recordUserLogin(user.uid, DateTime.local());
  }

  // Create the app
  let app = createApp(App);
  app.use(router);
  app.use(pinia);

  const storeUser = useUserStore();
  await storeUser.login(user);

  let storeLookup = useLookupStore();
  await storeLookup.fetchLookups()
  
  app.mount('#app');
  
});


