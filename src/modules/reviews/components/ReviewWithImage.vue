<template>
  <div class="review-with-image" @click="$emit('click', resource)">
    <div class="image">
      <resource-image 
        v-if="resource" 
        :show-title="true"
        :resource="resource">
      </resource-image>
    </div>
    <div class="review">
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

.review-with-image {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 10px;
  overflow: hidden;
  cursor: pointer;
  margin-top: 20px;
}

.image {
  width: 20%;
  min-width:180px;
}
.review {
  /* max-width:700px; */
  width: 80%;
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
  .review-with-image {
    flex-direction: column;
    justify-content: center;
  }

  .image, .review {
    display: flex;
    width:100%;
    justify-content: center;
  }
}

</style>