<template>
  <div class="resource-card">
    <img class="image" :src="imageUrl"/>
    <div>
      <h1>{{ displayName }}</h1>
      <h2>{{ description }}</h2>
      play
    </div>
  </div>
</template>

<script>

export default {
  name: 'PodcastCard',
  
  props: {
    displayName: String,
    description: String,
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
  display: flex;
  flex-direction: row;
  background: lightgrey;
}
.image {
  height:140px;
  width: 140px;
  object-fit: cover;
}
h1 {
  font-size: var(--prr-font-size-large);
  font-weight: var(--font-weight);
}

h2 {
  font-size: var(--prr-font-size-normal);
  font-weight: var(--font-weight);
}
</style>