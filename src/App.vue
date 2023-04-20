<template>
  <header-bar></header-bar>
  <router-view :key="$route.fullPath" />
</template>

<script>
import { defineComponent } from "vue";
import HeaderBar from "./core/components/HeaderBar.vue";

export default defineComponent({
  name: "App",
  components: {
    HeaderBar,
  },
});
</script>

<style>
html,
body,
#app {
  margin: 0;
  height: 100%;
  width: 100%;
  min-height: 100%;
}

body,
#app {
  display: flex;
  flex-direction: column;
}
</style>

