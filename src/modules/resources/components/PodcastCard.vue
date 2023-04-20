<template>
  <div class="resource-card">
    <img class="image" :src="imageUrl"/>
    <div class="title">{{ podcastName }}</div>
    <a class="subTitle">{{ authorsDisplay }}</a>
  </div>
</template>

<script>

export default {
  name: 'ResourceCard',
  
  props: {
    podcastName: String,
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
@import 'styles.css';
.resource-card {
  padding-top:10px;
  padding-bottom:10px;
  display: flex;
  align-items: left;
  flex-direction: column;
  background: white;
}

.image {
  height:112px;
  width: 112px;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid lightgray
}

</style>