<template>
  <div class="recommendation">
    <div v-if="recommendation.reason" class="quote">"{{ recommendation.reason }}"</div>
    <div v-else class="quote noreason">Recommended By</div>
    <div class="by">
      <a v-if="recommendation.website" @click="openUrl(recommendation.website)">{{ recommendation.name }}</a>
      <span v-else>{{ recommendation.name }}</span>
    </div>
    <hr/>
  </div>
</template>

<script>
import { Recommendation } from "@/modules/recommendations/model/recommendation";

export default {
  name: "recommendation-widget",
  props: {
    recommendation: {
      required: true,
      type: Recommendation
    }
  },
  methods: {
    openUrl(url) {
      window.open(url, '_blank');
    }
  }
}

</script>

<style scoped>
.recommendation {
  margin-top: 20px;  
  min-width: 200px;
  max-width: 500px;
  text-align: center;
}

.quote {
  color: var(--prr-darkgrey);
  font-size: var(--prr-font-size-normal);
  font-style: italic;
}
.quote.noreason {
  font-size: var(--prr-font-size-normal);
  font-style:normal;
}
.by {
  padding-top: 5px;
  color: var(--prr-mediumgrey)
}

hr {
  width: 40%;
  border: 0px;
  border-bottom: 1px solid var(--prr-mediumgrey);
  margin-bottom: 30px;
}
</style>