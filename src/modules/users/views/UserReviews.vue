<template> 
  <div class="user-reviews">
    <loading-symbol v-if="isLoading"></loading-symbol>
    <div v-else class="content">
      <h1 class="giant">Reviews</h1>
      <h2><span>by </span>{{userName}}</h2>

      <div class="cards">
        <div v-for="review in reviews" :key="review.id" >
          <review-with-image
            :showImage="true"
            :review="review"
            @click="handleClick">
          </review-with-image>
          <hr class="divider" />
        </div>
      </div>
    </div>
    <resource-detail v-if="selectedResource != null" :resource="selectedResource" @close="handleClose"></resource-detail>
  </div>
</template>

<script>
import { getReviewsByUser } from '@/modules/reviews/services/review-service'
import { getUser } from '@/modules/users/services/user-services';
import LoadingSymbol from '@/core/components/LoadingSymbol.vue';
import ResourceDetail from '@/modules/resources/views/ResourceDetail.vue';
import ReviewWithImage from '@/modules/reviews/components/ReviewWithImage.vue';

export default {
  name: 'user-reviews',

  components: { LoadingSymbol, ReviewWithImage, ResourceDetail },

  data() {
    return {
      isLoading: false,
      reviews: [],
      userName: String,
      selectedResource: null,
    }
  },
  computed: { 
    userUid() {
      return this.$route.params.userUid;
    },
  },

  async mounted() {
    if (!this.userUid) {
      this.$router.push('/');
    }
    this.isLoading = true;
    if (this.userUid) {
      this.reviews = await getReviewsByUser(this.userUid);  
      const user = await getUser(this.userUid);
      this.userName = user.displayName;
    }
    this.isLoading = false;
  },

  methods: {
    handleClick(resource) {
      this.selectedResource = resource;
    },
    handleClose() {
      this.selectedResource = null;
    }
  }

}

</script>

<style scoped>

.cards {
  margin-top: 40px;
}

h2 span {
  color: var(--prr-mediumgrey);
}
</style>
