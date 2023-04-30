<template>
  <div class="resource">
    <div @click="$emit('click', resource)" class="image">
      <img :src="resource.imageUrl"  />
    </div>
    <div v-if="showTitle" class="description">
      <h1 :title="resource.displayName" class="title">{{ resource.displayName }}</h1>
      <h2 class="subTitle">{{ authorsDisplay }}</h2>
      <p class="description">{{ resource.description }}</p>
      <base-button @click="$emit('recommend', resource)">Leave a Review</base-button>
    </div>
  </div>
</template>

<script>
import { Resource } from '@/modules/resources/model/resource'
import BaseButton from '@/core/components/BaseButton.vue';
export default {
  components: { BaseButton },
  name: 'ResourceCard',
  emits: ['recommend', 'click'],
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
.resource {
  display:flex;
  flex-direction: row;
  padding-bottom:20px;
  background: transparent;
  height: 215px;
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
  height:215px;
  width: 140px;
  border-radius: 5px;
  object-fit: cover;
  border: 1px solid lightgray;
  margin-right: 20px;
  cursor: pointer;
}

</style>