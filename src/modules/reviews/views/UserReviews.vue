<template> 
  <div class="user-reviews">
    <loading-symbol v-if="isLoading"></loading-symbol>
    <div v-else class="content">
      <h1 class="giant">Reviews</h1>
      <h2 v-if="user"><span>by </span>{{user.displayName}}</h2>
      <div  v-if="user">
        <div v-for="reviewGroup in groupedReviews" :key="reviewGroup.resourceType" >
          <h1 class="group-heading">
            <span class="material-symbols-outlined">{{ reviewGroup.icon }}</span>
            {{ reviewGroup.resourceType }}
          </h1>
          <hr class="divider grey" />
          <div class="cards">
            <review-with-image
              v-for="review in reviewGroup.reviews" :key="review.id"
              class="card"
              :showImage="true"
              :resource="review.resource"
              :review="review"
              @click="handleClick"
              @edit="handleEdit"
              @delete="handleDelete">
            </review-with-image>
          </div>
        </div>
      </div>
      <div v-else>
        <p>Mmmm, we can't find anyone with a username of "{{ $route.params.usernameOrUid }}"</p>
    </div>
    </div>
    
    <resource-detail v-if="selectedResource != null" :resource="selectedResource" @close="handleClose"></resource-detail>
    <edit-review 
      v-if="showEdit" 
      :review="selectedReview"
      @saved="handleSaved"
      @close="showEdit = false">
    </edit-review>
    <confirmation-dialog
      v-if="showDelete"
      title="Delete Review"
      :subTitle="selectedReview?.resourceName"
      confirmLabel="Yes"
      message="Are you sure you want to permanently delete this review?"
      :isPerformingAction="isDeleting"
      @confirm="doDelete"
      @close="showDelete = false">
    </confirmation-dialog>
  </div>
</template>

<script>
import LoadingSymbol from '@/core/components/LoadingSymbol.vue';
import ResourceDetail from '@/modules/resources/views/ResourceDetail.vue';
import ReviewWithImage from '@/modules/reviews/components/ReviewWithImage.vue';
import ConfirmationDialog from '@/core/components/ConfirmationDialog.vue';
import EditReview from '@/modules/reviews/views/EditReview.vue';

import { deleteReview, getReviewsByUser } from '@/modules/reviews/services/review-service'
import { getUser, getUserByUsername, updateUser } from '@/modules/users/services/user-services';
import { useUserStore } from '@/core/state/userStore';
import { getResource } from '@/modules/resources/services/resource-service';
import { useLookupStore } from '@/core/state/lookupStore';

export default {
  name: 'user-reviews',

  components: { 
    LoadingSymbol, 
    ReviewWithImage, 
    ResourceDetail, 
    EditReview, 
    ConfirmationDialog,
  },

  data() {
    return {
      isLoading: false,
      reviews: [],
      userName: String,
      selectedResource: null,
      user: null,
      username: null,
      showEdit: false,
      showDelete: false,
      isDeleting: false,
    }
  },

  computed: { 
    userStore() {
      return useUserStore();
    },
    lookupStore() {
      return useLookupStore();
    },
    isOwner() {
      if (!this.user) return false;
      return (this.userStore.username == this.username);
    },
    groupedReviews() {
      let allResourceTypes = this.reviews.map ( r => r.resource.resourceType );
      let uniqueTypes = new Set(allResourceTypes.flat());

      var result = [];
      uniqueTypes.forEach( t => {
        let reviews = this.reviews.filter ( r => r.resource.resourceType == t );
        const icon = this.lookupStore.resourceTypes.find( r => r.key == t)?.icon;
        let group = {resourceType: t, reviews: reviews, icon: icon};        
        result.push(group);
      });
      return result;
    }
  },

  async mounted() {
    let uid = null;
    this.isLoading = true;
    const id = this.$route.params.usernameOrUid;
    if (this.$route.query.isUID == 'true') {
      uid = id
    } else {
      this.username = id;
    }
    if (uid) {
      this.user = await getUser(uid);
      this.username = this.user.username;
      if (this.username) {
        this.$router.replace({ path: `/${this.username}`});
      }
    } else if (this.username) {
      this.user = await getUserByUsername(this.username);  
    }
    
    if (this.user) {
      this.noUser = false;
      this.reviews = await getReviewsByUser(this.user.uid);

      // add the full resource to the review
      for (let i = 0; i<this.reviews.length; i++) {
        let review = this.reviews[i];
        const resource = await getResource(review.resourceId);
        review.resource = resource;
      }

    }
    this.isLoading = false;
  },

  methods: {
    handleEdit(review) {
      this.selectedReview = review;
      this.showEdit = true;
    },
    handleSaved(review) {
      let r = this.reviews.find( r => r.id == review.id );
      r.reason = review.reason;
      this.showEdit = false;
    },
    handleDelete(review) {
      this.selectedReview = review;
      this.showDelete = true;
    },
    doDelete() {
      this.isDeleting = true;
      const review = this.selectedReview;
      if (review) {
        deleteReview(review);
        const index = this.reviews.findIndex( r => r.id == review.id );
        if (index >= 0) {
          this.reviews.splice(index, 1)
        }
      }
      this.isDeleting = false;
      this.showDelete = false;
    },
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
  margin-top: 10px;
  justify-content: space-between;
  gap:20px;
}

.card {
  flex-basis: 100%;
}

.group-heading {
  text-transform: capitalize;
  display:flex;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 0px;
  font-size: var(--prr-font-size-large);
  text-transform: uppercase;
}
.group-heading span {
  margin-right: 5px;
}
.divider.grey {
  border-width: 2px;
  border-color: var(--prr-lightgrey);
  margin-top: 0px;
  /* margin: 20px 70px 0px 70px; */
}
h2 span {
  color: var(--prr-mediumgrey);
}

@media only screen and (max-width: 600px) {
  .card {
   flex-basis: 100%;
  }
}

</style>
