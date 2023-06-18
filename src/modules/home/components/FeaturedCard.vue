<template>
  <div v-if="resource" class="featured-card">
    <div class="container" @click="$emit('click', resource)">
      <resource-image v-if="showImage && resource" :preview="true" class="image" :resource="resource"></resource-image>
      <div class="review">
        <!-- <div class="heading"><h1>{{resource.displayName}}</h1></div>
        <h2>{{resource.authorsList}}</h2> -->
        <review-widget class="quote" :short="true" :review="review"></review-widget>
      </div>
    </div>
  </div>
</template>

<script>
import ResourceImage from '@/modules/resources/components/ResourceImage.vue';
import ReviewWidget from '@/modules/reviews/components/ReviewWidget.vue'

import { Review } from '@/modules/reviews/model/review';
import { getResource } from '@/modules/resources/services/resource-service';

export default {
  components: { ReviewWidget, ResourceImage },

  name: 'feature-card',
  
  emits: ['click'],
  
  data() { 
    return { 
      isLoading: true,
      resource: null,
    } 
  },  

  props: {
    review: {
      type: Review,
      required: true
    },
    showImage: {
      type: Boolean,
      default: true,
    }
  },
  
  async mounted() {
    this.isLoading = true;
    this.resource = await getResource(this.review.resourceId);
    this.isLoading = false;
  },

}

</script>

<style scoped>

.featured-card {
  margin-left: 70px;
  margin-right: 70px;
}
.container {
  background: transparent;
  display: flex;
  align-items: center;
  flex-direction: row;
  margin: 0px auto;
  max-width: 600px;
  cursor: pointer;
  gap: 0px;
  overflow: hidden;
}

.review {
  flex-grow: 2;
  width:100%;
  margin-left: 15px;
}
.quote {
  margin-left: auto;
  margin-right: auto;
}

.heading {
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
h1 {
  font-size: var(--prr-font-size-medium);
  font-weight: 600;
  margin: 15px 0px 0px 0px;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}
h2 {
  text-align: center;
  font-size: var(--prr-font-size-medium);
  color: var(--prr-mediumgrey);
  font-weight: normal;
  margin: 5px 0px;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media only screen and (max-width: 600px) {
  .featured-card {
    margin-left: 10px;
    margin-right: 10px;
  }
}
</style>