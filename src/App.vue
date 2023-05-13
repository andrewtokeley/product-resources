<template>
  <div class="app">
    <header-bar v-show="!($route.meta.hideHeader ?? false)"></header-bar>
    <div class="page">
      <router-view :key="$route.fullPath" />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import HeaderBar from "./core/components/HeaderBar.vue";
import { useLookupStore } from "@/core/state/lookupStore"

export default defineComponent({
  components: { HeaderBar },
  name: "App",
  data() {
    return {
      hideHeader: true,
    }
  },
  async mounted() {
    // load up some data into the state stores
    let store = useLookupStore();
    await store.fetchLookups();
    console.log("store loaded")
  }
});
</script>

<style>
html,
body,
.app {
  /* display: flex;
  flex-direction: column;
  align-items: center;
   */
  max-width: 2000px;
  min-height: 100%;
  margin: 0 auto;
}

.page {
  /* width: 80%; */
  /* width: 900px; */
  max-width: 900px;
  margin: 0 auto;
  /* display: flex;
  flex-direction: column;
  justify-content: center; */
}
</style>

