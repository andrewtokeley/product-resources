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

export default defineComponent({
  components: { HeaderBar },
  name: "App",
  data() {
    return {
      hideHeader: true,
    }
  },
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
  width: 90%;
  margin: 0 auto;
  height: 100%;
  width: 100%;
  min-height: 100%;
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

