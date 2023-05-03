<template>
  <div class="resource">
    <div class="left">
      <resource-image :resource="resource" @info="$emit('click', resource)" @recommend="$emit('recommend', resource)"></resource-image>
      <div v-if="showTitle">
        <h1 :title="resource.displayName">{{ resource.displayName }}</h1>
        <h2>{{ authorsDisplay }}</h2>
      </div>
    </div>
    <div v-if="showDescription" class="description">
      <p class="description">{{ resource.description }}</p>
    </div>
  </div>
</template>

<script>
import { Resource } from '@/modules/resources/model/resource'
import ResourceImage from '@/modules/resources/components/ResourceImage.vue';

export default {
  components: { ResourceImage },
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
    },
    showDescription: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    openResource(url) {
      window.open(url, '_blank');
    }
  },
  computed: {
    squareImage() {
      return this.resource.resourceType.value.toLowerCase().includes('podcast');
    },
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
  position: relative;
  display:flex;
  flex-direction: row;
  background: transparent;
  margin-bottom: 20px;
}

.left {
  display: block;
  margin-right: 10px;
  display:flex;
  flex-direction: column;
  align-items: left;
  width: 140px;
}

h1 {
  font-size: var(--prr-font-size-small);
  font-weight: 500;
  margin: 0px 0px 5px 0px;
  padding-bottom: 0px;
  overflow: hidden;
   display: -webkit-box;
   -webkit-line-clamp: 2; /* number of lines to show */
           line-clamp: 2; 
   -webkit-box-orient: vertical;
}

h2 {
  font-size: var(--prr-font-size-small);
  margin: 5px 0px 5px 0px;
  font-weight: 400;
  color: var(--prr-mediumgrey)
}

.description {
  overflow: hidden;
   display: -webkit-box;
   -webkit-line-clamp: 5; /* number of lines to show */
           line-clamp: 5; 
   -webkit-box-orient: vertical;
}

</style>