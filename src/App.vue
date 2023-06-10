<template>
  <div class="outer">
    <div class="app">
      <header-bar class="header" v-show="!($route.meta.hideHeader ?? false)"></header-bar>
      <div class="page">
        <router-view :key="$route.fullPath" />
      </div>
    </div>
    <footer-bar></footer-bar>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import HeaderBar from "./core/components/HeaderBar.vue";
import { useLookupStore } from "@/core/state/lookupStore"
import FooterBar from "./core/components/FooterBar.vue";

export default defineComponent({
  components: { HeaderBar, FooterBar },
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
  }
});
</script>

<style>
body { 
  margin: 0px;
}
.app {
  max-width: 2000px;
  min-height: 100%;
  margin: 0 auto;
}

.page {
  max-width: 900px;
  min-height: 500px;
  margin: 0 auto;
  margin-bottom: 100px;
  padding: 0px 20px;

}

</style>

