<template>
  <div class="review-widget">
    <p class="draft-heading" v-if="!review.approved">DRAFT</p>
    <p v-if="review.reason" class="quote" :class="{ short: short}">"{{ review.reason }}"</p>
    <p v-else class="quote" >"I like this resource because..."</p>
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
    },
    short: { 
      type: Boolean,
      default: false,
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
  margin-top: 5px;  
  /* min-width: 200px; */
  max-width: 500px;
  text-align: center;
}

.quote {
  display: -webkit-box;
  padding: 0px 20px;
  max-width: 450px;
  overflow: hidden;
  white-space: pre-wrap;
  color: var(--prr-darkgrey);
  font-style: italic;  
  font-size: var(--prr-font-size-medium);
  -webkit-box-orient: vertical;
}

.quote.short {
  -webkit-line-clamp: 4;
}
.quote.no-reason {
  font-size: var(--prr-font-size-medium);
  font-style:normal;
}
.by {
  padding-top: 5px;
  font-style: normal;
  font-size: var(--prr-font-size-medium);
}

hr {
  width: 40%;
  margin-bottom: 30px;
}

.draft-heading {
  color: red;
}
</style>