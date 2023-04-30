<template>
  <div class="resource">
    <div class="image">
      <img :src="resource.imageUrl"  />
    </div>
    <div v-if="showTitle" class="description">
      <h1 :title="resource.displayName" class="title">{{ resource.displayName }}</h1>
      <h2 class="subTitle">{{ authorsDisplay }}</h2>
      <p >{{ resource.description }}</p>
    </div>
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
  }
}

</script>

<style scoped>
.resource {
  display:flex;
  flex-direction: row;
  padding-bottom:20px;
  background: transparent;
  height: 112px;
  cursor: pointer;
  overflow: hidden;
}
.title {
  font-size: var(--prr-font-size-normal);
  margin: 0px 0px 5px 0px;
  padding-bottom: 0px;
}
.subTitle {
  font-size: var(--prr-font-size-small);
  margin: 5px 0px 5px 0px;
}

.description {
  overflow: hidden;
   display: -webkit-box;
   -webkit-line-clamp: 5; /* number of lines to show */
           line-clamp: 5; 
   -webkit-box-orient: vertical;
}
.image img {
  height:112px;
  width: 112px;
  border-radius: 5px;
  object-fit: cover;
  border: 1px solid lightgray;
  margin-right: 20px;
}
</style>