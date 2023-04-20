<template>
  <div class="resource-card">
    <img class="image" :src="resource.imageUrl"/>
    <div :title="resource.displayName" class="title">{{ resource.displayName }}</div>
    <a class="subTitle">{{ authorsDisplay }}</a>
  </div>
</template>

<script>
import { Resource } from '@/modules/resources/model/resource'
export default {
  name: 'ResourceCard',
  
  props: {
    resource: {
      type: Resource,
      default: null
    }
  },

  computed: {
    authorsDisplay() {
      return this.resource.authors.join(", ")
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
  width:140px;
}

.image {
  height:215px;
  width: 140px;
  border-radius: 5px;
  object-fit: cover;
  border: 1px solid lightgray
}

</style>