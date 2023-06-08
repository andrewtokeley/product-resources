<template> 
  <div class="user-reviews">
    <loading-symbol v-if="isLoading"></loading-symbol>
    <div v-else class="content">
      <h1>{{userName}}'s Reviews</h1>
      <p>Here's what {{ userName }} has reviewed.</p>

      <div class="cards">
        <div v-for="review in reviews" :key="review.id" >
          <featured-card
            :showImage="true"
            :review="review"
            @click="handleClick">
          </featured-card>
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
import FeaturedCard from '@/modules/home/components/FeaturedCard.vue';
import ResourceDetail from '@/modules/resources/views/ResourceDetail.vue';

export default {
  name: 'user-reviews',

  components: { LoadingSymbol, FeaturedCard, ResourceDetail },

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

/* .cards {
  display:flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
} */

/* .content {
  text-align: center;
} */
</style>
