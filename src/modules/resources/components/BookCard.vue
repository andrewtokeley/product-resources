<template>
  <div class="resource-card">
    <img class="image" :src="imageUrl"/>
    <div>
      <h1 :title="title">{{ title }}</h1>
      <h2>{{ authorsDisplay }}</h2>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ResourceCard',
  
  props: {
    title: String,
    authors: [],
    imageUrl: String
  },

  computed: {
    authorsDisplay() {
      return this.authors.join(", ")
    }
  }
}

</script>

<style scoped>

.resource-card {
  padding:20px;
  display: flex;
  flex-direction: column;
  background: white;
  transition: 0.4s;
  height:300px;
}

.resource-card:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.image {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  height:215px;
  width: 140px;
  object-fit: cover;
}
h1 {
  font-size: var(--prr-font-size-medium);
  font-weight: var(--font-weight);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

h2 {
  font-size: var(--prr-font-size-normal);
  font-weight: var(--font-weight);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>