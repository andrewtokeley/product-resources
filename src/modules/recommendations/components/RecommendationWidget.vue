<template>
  <div class="recommendation">
    <div>{{ recommendation.reason }}</div>
    <span>by </span>
    <router-link v-if="recommendation.website">{{ recommendation.name }}</router-link>
    <span v-else>{{ recommendation.name }}</span>
    <div></div>
  </div>
</template>

<script>
import Recommendation from "@core/modules/recommendations/model/recommendation";

export default {
  name: "recommendation-widget",
  props: {
    recommendation: {
      required: true,
      type: Recommendation
    }
  },
}

</script>

<style scoped>
.recommendation {
  width: 100px;
}
</style>