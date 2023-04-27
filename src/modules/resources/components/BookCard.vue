<template>
  <div class="resource-card">
    <img class="image" :src="resource.imageUrl"  />
    <div v-if="showTitle" :title="resource.displayName" class="title">{{ resource.displayName }}</div>
    <div class="subTitle">{{ authorsDisplay }}</div>
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
    },
    showTitle: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    authorsDisplay() {
      if (this.resource.authors) {
        return this.resource.authors.join(", ")
      }
      return null;
    }
  },
  
}

</script>

<style scoped>
@import 'styles.css';

.resource-card {
  /* padding-top:10px; */
  padding-bottom:10px;
  background: transparent;
  width:140px;
  cursor: pointer;
}

.image {
  height:215px;
  width: 140px;
  border-radius: 5px;
  object-fit: cover;
  border: 1px solid lightgray
}

</style>