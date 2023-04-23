<template>
  <div class="content">
    <header-bar></header-bar>
    <h1>Popular Books</h1>
    <h1>Popular Podcasts</h1>
  </div>
</template>

<script>
import HeaderBar from "@/core/components/HeaderBar.vue";

export default {
  name: 'ResourcesHome',
  components: {
    HeaderBar,
  }
}
</script>

<style scoped>

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>