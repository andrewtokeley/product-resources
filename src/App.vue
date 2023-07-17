<template>
  <div v-if="!isOffline" class="app">
    <admin-header v-if="$route.meta.requiresAdmin"></admin-header>
    <header-bar 
      v-show="!$route.meta.requiresAdmin && !($route.meta.hideHeader ?? false)">
    </header-bar>
    <div class="page">
      <router-view :key="$route.fullPath" />
    </div>
    <footer-bar></footer-bar>
  </div>
  <div v-else class="app-offline">
    <div class="box">
      looks like you're offline :-(
    </div>
  </div>
  
</template>

<script>
import { defineComponent } from "vue";
import HeaderBar from "./core/components/HeaderBar.vue";
import AdminHeader from "./core/components/AdminHeader.vue";
import { useLookupStore } from "@/core/state/lookupStore"
import FooterBar from "./core/components/FooterBar.vue";

export default defineComponent({
  components: { HeaderBar, AdminHeader, FooterBar },
  name: "App",
  data() {
    return {
      hideHeader: true,
      isOffline: false,
    }
  },
  async mounted() {
    window.addEventListener('online', () => this.isOffline = false );
    window.addEventListener('offline', () => this.isOffline = true );
    // load up some data into the state stores
    let store = useLookupStore();
    await store.fetchLookups();
  }
});
</script>

<style>
/* html, body { 
  margin: 0px;
  height: 100%;
} */
.app {
  max-width: 2000px;
  min-height: 100%;
  margin: 0 auto;
}

.app-offline {
  height: 100vh;
  display:flex;
  align-items: center;
  justify-content: center;
}

.box {
  border: 0.5px solid var(--prr-mediumgrey);
  padding: 10px 30px;
}

.page {
  max-width: 900px;
  min-height: 500px;
  margin: 0 auto;
  margin-bottom: 100px;
  padding: 0px 20px;

}

</style>

