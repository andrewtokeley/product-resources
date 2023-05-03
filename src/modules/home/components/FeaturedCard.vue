<template>
  <div class="featured-card">
    <resource-image class="image" :resource="resource"></resource-image>
    <recommendation-widget class="quote" :recommendation="recommendation"></recommendation-widget>
  </div>
</template>

<script>
import ResourceImage from '@/modules/resources/components/ResourceImage.vue';
import RecommendationWidget from '@/modules/recommendations/components/RecommendationWidget.vue'

import { Resource } from '@/modules/resources/model/resource'
import { Recommendation } from '@/modules/recommendations/model/recommendation';
import { getResource } from '@/modules/resources/services/resource-service';

export default {
  components: { ResourceImage, RecommendationWidget },
  name: 'feature-card',
  emits: ['recommend', 'click'],
  props: {
    recommendation: {
      type: Recommendation,
      required: true
    }
  },
  data() {
    return {
      resource: Resource.default(),
    }
  },

  async mounted() {
    //get the resource related to the recommendation
    this.resource = await getResource(this.recommendation.resourceId);
  },

  methods: {
    openResource(url) {
      window.open(url, '_blank');
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


.featured-card {
  /* display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0px; */
  padding:10px;
  height: 240px;
  border-radius: 10px;
  background: var(--prr-extralightgrey);
}
.quote {
  margin-top:40px;
  padding: 10px;
  /* flex-grow:1; */
}
.image {
  float: left;
  vertical-align: middle;
  /* flex-grow: 2; */
}
</style>