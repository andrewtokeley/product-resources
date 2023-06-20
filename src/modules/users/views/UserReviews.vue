<template> 
  <div class="user-reviews">
    <loading-symbol v-if="isLoading"></loading-symbol>
    <div v-else class="content">
      <h1 class="giant">Recommendations</h1>
      <h2><span>by </span>{{user?.displayName}}</h2>
      
      <div v-if="isOwner">
        <p>Let people know what you recommend!</p>
        <base-button iconName="share">Share</base-button>
      </div>
      <p v-else>{{user?.summary}}</p>

      <div class="cards">
        <div v-for="review in reviews" :key="review.id" class="card">
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
import { getUserByUsername, updateUser } from '@/modules/users/services/user-services';
import LoadingSymbol from '@/core/components/LoadingSymbol.vue';
import ResourceDetail from '@/modules/resources/views/ResourceDetail.vue';
import ReviewWithImage from '@/modules/reviews/components/ReviewWithImage.vue';
import { useUserStore } from '@/core/state/userStore';
import BaseButton from '@/core/components/BaseButton.vue';

export default {
  name: 'user-reviews',

  components: { LoadingSymbol, ReviewWithImage, ResourceDetail, BaseButton },

  data() {
    return {
      isLoading: false,
      reviews: [],
      userName: String,
      selectedResource: null,
      user: null,
    }
  },
  computed: { 
    username() {
      return this.$route.params.username;
    },
    userStore() {
      return useUserStore();
    },
    isOwner() {
      if (!this.user) return false;
      return (this.userStore.username == this.username);
    },
  },

  async mounted() {
    if (!this.username) {
      this.$router.push('/');
    } else {
      this.isLoading = true;
      this.user = await getUserByUsername(this.username);
      this.reviews = await getReviewsByUser(this.user.uid);
      this.isLoading = false;
    }
  },

  methods: {
    handleClick(resource) {
      this.selectedResource = resource;
    },
    handleClose() {
      this.selectedResource = null;
    },
    handleSaveUser() {
      updateUser(this.user);
    }
  }

}

</script>

<style scoped>

.cards {
  display:flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 40px;
  justify-content: space-between;
  gap:20px;
}

.card {
  flex-basis: 100%;
}
h2 span {
  color: var(--prr-mediumgrey);
}
</style>
