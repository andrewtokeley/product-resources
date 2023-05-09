<template>
  <div class="resource">
    <figure>
      <resource-image :resource="resource" :showAddPlaceholder="showAddPlaceholder" @info="$emit('click', resource)" @recommend="$emit('recommend', resource)"></resource-image>
      <figcaption v-if="showTitle && !showAddPlaceholder" >
        <h1 :title="resource.displayName">{{ resource.displayName }}</h1>
        <h2>{{ authorsDisplay }}</h2>
      </figcaption>
    </figure>
    <div v-if="showDescription" class="description" @click="showDetails = true">
      <p class="description">{{ resource.description }}</p>
    </div>
    <resource-detail v-if="showDetails" :resource="resource" @close="showDetails = false"></resource-detail>
  </div>
</template>

<script>
import { Resource } from '@/modules/resources/model/resource'
import ResourceImage from '@/modules/resources/components/ResourceImage.vue';
import ResourceDetail from '@/modules/resources/views/ResourceDetail.vue';

export default {
  components: { ResourceImage, ResourceDetail },
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
    },
    showAddPlaceholder: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      showDetails: false,
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
  position: relative;
  display:flex;
  flex-direction: row;
  background: transparent;
  margin-bottom: 20px;
}

figure {
  display: table;
  margin: 0px;
  margin-right: 15px;
  height: fit-content;
}

figcaption {
  display:table-caption;
  caption-side:bottom;
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
  cursor: pointer;
  overflow: hidden;
   display: -webkit-box;
   -webkit-line-clamp: 5; /* number of lines to show */
           line-clamp: 5; 
   -webkit-box-orient: vertical;
}

</style>