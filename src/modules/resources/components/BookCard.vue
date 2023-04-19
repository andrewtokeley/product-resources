<template>
  <div class="resource-card">
    <img class="image" :src="imageUrl"/>
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
  padding-top:10px;
  padding-bottom:10px;
  display: flex;
  align-items: center;
  flex-direction: column;
  background: white;
}

.image {
  /* box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); */
  height:215px;
  width: 140px;
  object-fit: cover;
  transition: 0.4s;
  border: 1px solid lightgray
}

.image:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

h1 {
  font-size: var(--prr-font-size-normal);
  font-weight: bold;
  text-align: center;
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

p {
  color: lightgray;
}
</style>