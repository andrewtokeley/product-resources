<template>
  <div class="review-widget">
    <p class="draft-heading" v-if="!review.approved">DRAFT</p>
    <p v-if="review.reason" class="quote" :class="{ short: short}">"{{ review.reason }}"</p>
    <div v-if="showBy" class="by">
      <router-link class="link" v-if="review.reviewedByUid" :to="`/user/${review.reviewedByUid}`">{{ review.reviewedByName }}</router-link>
      <span v-else>{{ review.reviewedByName ?? 'Anon'}}</span>
      <div class="jobtitle" v-if="review.reviewedByJobTitle">{{ review.reviewedByJobTitle }}</div>
    </div>
    
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
    },
    showBy: {
      type: Boolean,
      default: true,
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
  max-width: 500px;
  text-align: center;
}

.quote {
  display: -webkit-box;
  /* padding: 0px 20px; */
  max-width: 650px;
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
  font-style:normal;
  /* font-weight: bold; */
  font-size: var(--prr-font-size-medium);
}

.by .jobtitle {
  font-weight: normal;
}

hr {
  width: 40%;
  margin-bottom: 30px;
}

.link {
  text-decoration: none;
  font-weight: 600;
}
.draft-heading {
  color: red;
}
</style>