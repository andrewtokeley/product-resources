<template>
  <div v-if="resource">
    <div class="featured-card" @click="$emit('click', resource)">
      <resource-image class="image" :resource="resource"></resource-image>
      <review-widget class="quote" :review="review"></review-widget>
    </div>
  </div>
</template>

<script>
import ResourceImage from '@/modules/resources/components/ResourceImage.vue';
import ReviewWidget from '@/modules/reviews/components/ReviewWidget.vue'

import { Review } from '@/modules/reviews/model/review';
import { getResource } from '@/modules/resources/services/resource-service';

export default {
  components: { ResourceImage, ReviewWidget },

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
  /* margin: 25px 0px 0px 20px; */
  /* height: 240px; */
  padding: 0px 15px;
  width: 100%;
  /* max-width: 400px; */
  /* min-width: 300px; */
  /* width: 400px; */
  flex: 1 1 0px;
  border-radius: 10px;
  background: white;
  cursor: pointer;
}
.quote {
  margin-left: 20px;
}
.image {
  float: left;
  vertical-align: middle;
}
</style>