<template>
  <div class="recommendation">
    <p v-if="recommendation.reason" class="quote">"{{ recommendation.reason }}"</p>
    <p v-else class="quote no-reason">Recommended By</p>
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
  font-style: italic;
  white-space: pre-wrap;
  color: var(--prr-darkgrey);
  font-size: var(--prr-font-size-medium);
  display: -webkit-box;
  max-width: 450px;
  -webkit-line-clamp: 12;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.quote.no-reason {
  font-size: var(--prr-font-size-medium);
  font-style:normal;
}
.by {
  padding-top: 5px;
  color: var(--prr-mediumgrey)
}

hr {
  width: 40%;
  margin-bottom: 30px;
}

</style>