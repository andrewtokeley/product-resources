<template>
  <div class="resource">
    <resource-image 
      :preview="showDescription" 
      :resource="resource" 
      :showTitle="showTitle"
      :showAddPlaceholder="showAddPlaceholder" 
      @click="$emit('click', resource)"
      @addRecommend="$emit('addRecommend', resource)">
    </resource-image>
    <div v-if="showDescription" class="description" @click="$emit('click', resource)">
      <h1>{{resource.displayName}}</h1>
      <p>{{ summary }}</p>
    </div>
    <!-- <resource-detail v-if="showDetails" :resource="resource" @close="showDetails = false"></resource-detail> -->
  </div>
</template>

<script>
import { Resource } from '@/modules/resources/model/resource'
import ResourceImage from '@/modules/resources/components/ResourceImage.vue';
// import ResourceDetail from '@/modules/resources/views/ResourceDetail.vue';

export default {
  components: { ResourceImage },
  name: 'ResourceCard',
  emits: ['click', 'addRecommend'],
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
  
  computed: {
    summary() {
      const MAX = 200;
      var summary = this.resource.description;
      if (summary.length > MAX) {
        summary = summary.slice(0,MAX) + "...";
      }
      return summary;
    },
    tileView() {
      return (!this.showDescription);
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

.description h1 {
  font-size: var(--prr-font-size-normal);
  font-weight: 600;
  margin: 0px 0px 5px 0px;
  padding-bottom: 0px;
  overflow: hidden;
   display: -webkit-box;
   -webkit-line-clamp: 2; /* number of lines to show */
           line-clamp: 2; 
   -webkit-box-orient: vertical;
}

.description h2 {
  font-size: var(--prr-font-size-normal);
  margin: 5px 0px 5px 0px;
  font-weight: 400;
  color: var(--prr-mediumgrey)
}

.description {
  max-width: 300px;
  margin-left: 20px;
  cursor: pointer;
  overflow: hidden;
   display: -webkit-box;
   -webkit-line-clamp: 5; /* number of lines to show */
           line-clamp: 5; 
   -webkit-box-orient: vertical;
}

</style>