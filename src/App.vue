<template>
  <router-view :key="$route.fullPath" />
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
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

