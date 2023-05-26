<template>
  <div class="review-widget">
    <p class="draft-heading" v-if="!review.approved">DRAFT</p>
    <p v-if="review.reason" class="quote">"{{ review.reason }}"</p>
    <p v-else class="quote">"I like this resource because..."</p>
    <div class="by">
      <a v-if="review.reviewedByUid" @click="handleUserClick(review.reviewedByUid)">{{ review.reviewedByName }}</a>
      <span v-else>{{ review.reviewedByName ?? 'Anon'}}</span>
    </div>
    <hr/>
  </div>
</template>

<script>
import { Review } from "@/modules/reviews/model/review";

export default {
  name: "review-widget",
  
  props: {
    review: {
      required: true,
      type: Review
    }
  },

  methods: {
    handleUserClick(userUid) {
      this.$router.push(`/user/${userUid}`);
    }
  }
}

</script>

<style scoped>
.review-widget {
  margin-top: 20px;  
  /* min-width: 200px; */
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

.draft-heading {
  color: red;
}
</style>