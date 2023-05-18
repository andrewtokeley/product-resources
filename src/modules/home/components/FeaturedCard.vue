<template>
  <div class="featured-card" @click="$emit('click', resource)">
    <resource-image class="image" :resource="resource"></resource-image>
    <review-widget class="quote" :review="review"></review-widget>
  </div>
</template>

<script>
import ResourceImage from '@/modules/resources/components/ResourceImage.vue';
import ReviewWidget from '@/modules/reviews/components/ReviewWidget.vue'

import { Review } from '@/modules/reviews/model/review';
import { getResource } from '@/modules/resources/services/resource-service';

import { ref } from 'vue'

export default {
  components: { ResourceImage, ReviewWidget},
  name: 'feature-card',
  emits: ['click'],
  data() { 
    return { 
      isLoading: true 
    } 
  },  
  props: {
    review: {
      type: Review,
      required: true
    }
  },
  async setup(props) {
    const resource = ref(null);
    resource.value = await getResource(props.review.resourceId);
    return {
      resource
    }
  },
}

</script>

<style scoped>


.featured-card {
  margin: 25px 0px 0px 20px;
  height: 240px;
  max-width: 400px;
  min-width: 300px;
  flex: 1 1 0px;
  border-radius: 10px;
  /* background: var(--prr-extralightgrey); */
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