<template>
  <div class="featured-card" @click="$emit('click', resource)">
    <resource-image class="image" :resource="resource"></resource-image>
    <recommendation-widget class="quote" :recommendation="recommendation"></recommendation-widget>
  </div>
</template>

<script>
import ResourceImage from '@/modules/resources/components/ResourceImage.vue';
import RecommendationWidget from '@/modules/recommendations/components/RecommendationWidget.vue'

import { Recommendation } from '@/modules/recommendations/model/recommendation';
import { getResource } from '@/modules/resources/services/resource-service';

import { ref } from 'vue'

export default {
  components: { ResourceImage, RecommendationWidget},
  name: 'feature-card',
  emits: ['recommend', 'click'],
  data() { return { isLoading: true } },  
  props: {
    recommendation: {
      type: Recommendation,
      required: true
    }
  },
  async setup(props) {
    const resource = ref(null);
    resource.value = await getResource(props.recommendation.resourceId);
    return {
      resource
    }
  },
  mounted() {
    this.isloading = false;
  },
  methods: {
    // openResource(url) {
    //   window.open(url, '_blank');
    // }
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