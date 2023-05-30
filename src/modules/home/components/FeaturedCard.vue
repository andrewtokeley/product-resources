<template>
  <div v-if="resource" class="container">
    <div class="featured-card" @click="$emit('click', resource)">
      <resource-image v-if="showImage && resource" class="image" :resource="resource"></resource-image>
      <div class="heading"><h1>{{resource.displayName}}</h1></div>
      <h2>{{resource.authorsList}}</h2>
      <review-widget class="quote" :short="true" :review="review"></review-widget>
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
      default: false,
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

.heading {
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
h1 {
  font-size: var(--prr-font-size-medium);
  font-weight: bold;
  margin: 15px 0px 0px 0px;
  overflow: hidden;
  text-overflow: ellipsis;
}
h2 {
  font-size: var(--prr-font-size-medium);
  color: var(--prr-mediumgrey);
  margin: 5px 0px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.container {
  /* background: blanchedalmond; */
  margin: 0px 50px;
}
.featured-card {
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* margin: 0px 20px; */
  /* margin: 0px auto; */
  /* max-width: 600px; */
  cursor: pointer; 
  gap: 0px;
  overflow: hidden;
}
.quote {
  margin-left: 20px;
}
.image {
  float: left;
  vertical-align: middle;
}

@media only screen and (max-width: 600px) {
  .container {
    margin: 0px 45px;
  }
}
</style>