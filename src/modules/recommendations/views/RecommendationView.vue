<template>
  <div class="page">
    <loading-symbol v-if="isLoading"></loading-symbol>
    <div v-else class="content" >
      
      <template v-if="isRecommendation">
        <h1>Recommend a New Resource</h1>
        <p>Thank you so much for recommending a new resource! </p>
      </template>
      <template v-else>
        <h1>Write a Review</h1>
        <p>Thank you so much for sharing your thoughts on this resource! </p>
      </template>

      <div v-if="isRecommendation">
        <div class="label tight">Where can people find it?</div> 
        <base-input 
          v-model="recommendation.resourceUrl" 
          :hasFocus="true"
          @blur="validateRecommendation('resourceUrl')"
          :errorMessage="errorMessage['resourceUrl']"
          :options="{ placeholder: 'Link to Resource', readOnly: isSaving, inlineErrors: false }">
        </base-input>
        <div class="label">Anything you'd like to share about the resource to help us categorise it and understand why you're recommending it?</div>
        <base-multiline-text 
          v-model="recommendation.comment"
          @blur="validateReview('comment')"
          :errorMessage="errorMessage['comment']"
          :options="{ numberOfLines: 5, 
            maximumLength: 500, 
            inlineErrors: false,
            showCharacterCount: true, 
            placeholder: 'Comment (optional)',
            readOnly: isSaving}">
        </base-multiline-text>
      </div>
      
      <div class="review">
        <h2 v-if="resource">{{ resource.displayName }}</h2>
        <resource-image v-if="resource" class="image" :resource="resource"></resource-image>
        <div class="label tight" v-if="isRecommendation">We think it's important for all recommendations to include a public review.</div>
        <div class="textarea-wrap">
          <base-multiline-text 
            v-model="review.reason"
            @blur="validateReview('reason')"
            :errorMessage="errorMessage['reason']"
            :hasFocus="!isRecommendation"
            :options="{ numberOfLines: 5, 
              maximumLength: 500, 
              inlineErrors: false,
              showCharacterCount: true, 
              placeholder: 'Your Review',
              readOnly: isSaving}">
          </base-multiline-text>
          <div class="label">Feel free to update the name that will appear with your review</div>
          <base-input v-model="review.reviewedByName"></base-input>
        </div>
      </div>
      
      

      <div class="buttons">
        <base-button :isSecondary="true" @click="$router.back()">Cancel</base-button>
        <base-button :showSpinner="isSaving" :disabled="!isValid" @click="handleSubmit">Submit</base-button>
      </div>

    </div>
  </div>
  <!-- </modal-dialog> -->
</template>

<script>
import BaseInput from '@/core/components/BaseInput.vue'
import BaseMultilineText from '@/core/components/BaseMultilineText.vue'
import BaseButton from '@/core/components/BaseButton.vue'
import LoadingSymbol from '@/core/components/LoadingSymbol.vue'
import ResourceImage from '@/modules/resources/components/ResourceImage.vue'

import { Recommendation } from '@/modules/recommendations/model/recommendation'
import { Review } from '@/modules/reviews/model/review'

import { addRecommendation } from '@/modules/recommendations/services/recommendation-service'
import { addReview } from '@/modules/reviews/services/review-service';
import { getResource } from '@/modules/resources/services/resource-service'
import { useUserStore } from '@/core/state/userStore'
import { getUser, updateUser } from '@/modules/users/services/user-services'

export default {
name: "recommend-view",
components: { 
  BaseInput, 
  BaseMultilineText,
  BaseButton,
  LoadingSymbol,
  ResourceImage,
},  
beforeCreate() {
  // this is needed to avoid circular references - the recommend dialog contains the resource image which contains the dialog
  this.$options.components.ResourceImage = require("@/modules/resources/components/ResourceImage.vue").default;
},
data() {
  return {
    isSaving: false,
    isLoading: true,
    recommendation: Recommendation.default(),
    review: Review.default(),
    resource: null,
    errorMessage: [],
  }
},
async mounted() {
  this.isLoading = true;
  
  if (this.isRecommendation) {    
    // we're reviewing a new (unapproved) recommended resource
    // this.recommendation.resourceType = this.$route.params.typeId ?? 'books';
    this.recommendation.recommendedByUid = this.userStore.uid;
    this.recommendation.recommendedByName = this.userStore.displayName;
    
    this.review.resourceId = null;
  } else {
    // we're reviewing an existing resource
    const resourceId = this.$route.params.resourceId;
    this.resource = await getResource(resourceId);
    if (this.resource == null) {
      // invalid resourceid
      this.$router.push('/');
    } else {
      this.review.resourceId = this.resource.id;
      this.review.resourceName = this.resource.displayName;
    }
  }

  this.review.reviewedByUid = this.userStore.uid;
  this.review.reviewedByName = this.userStore.displayName;

  this.isLoading = false;
},  
computed: {
  userStore() {
    return useUserStore();
  },
  validationErrors() {
    const errorsRecommendations = this.recommendation.validate();
    const errorsReviews = this.review.validate();
    const errors = [...errorsRecommendations, ...errorsReviews];
    if (errors.length > 0) {
      return errors.map( e => e.propertyName + ":" + e.errorMessage );
    }
    return null;
  },
  isValid() {
    
    if (this.isRecommendation) {
      // both the rec and review need to be valid
      return this.recommendation.isValid && this.review.isValid;
    } else {
      return this.review.isValid;
    }
  },
  isRecommendation() {
    return this.$route.params.resourceId == null;
  },
},

methods: {
  
  async handleSubmit() {
    const _this = this;
    this.isSaving = true;
    if (this.isRecommendation) {
      const recommendationId = await addRecommendation(this.recommendation);
      this.review.recommendationId = recommendationId;
    } 
    
    // add the review
    await addReview(this.review);

    // update the user's display name if they've updated it for this review
    if (this.review.reviewedByName != this.userStore.displayName) {
      this.userStore.setDisplayName(this.review.reviewedByName);
      const user = await getUser(this.userStore.uid);
      user.displayName = this.review.reviewedByName;
      await updateUser(user);
    }

    setTimeout(function () {
      _this.isSaving = false;
      _this.$router.push({ path: '/recommend/confirm', query: {'action': _this.isRecommendation ? "recommendation" : "review"}});
      
    }, 2000);
  },

  validateRecommendation(prop) {
    let result = this.recommendation.validateProperty(prop);
    this.errorMessage[prop] = result.errorMessage;
    if (result.data) {
      this.recommendation[prop] = result.data;
    }
    if (prop == 'resourceName') {
      // mirror the resource name into the review so we know the proposed resource name the review is for
      this.review.resourceName = this.recommendation.resourceName;
    }
  },

  validateReview(prop) {
    let result = this.review.validateProperty(prop);
    this.errorMessage[prop] = result.errorMessage;
    if (result.data) {
      this.review[prop] = result.data;
    }
  }
   
}
}
</script>

<style scoped>
.page {
  display: flex;
  justify-content: center;
}

.content {
  width: 600px;
}

h2 {
  margin-bottom: 0px;
}
.subtitle {
  color: var(--prr-lightgrey);
  margin:0px;
}
.double-line{
  width: 100%;
  display: flex;
  flex-direction: row;
  gap:20px;
} 

.double-line :nth-child(2){
  width: 100%;
}
.label {
  /* font-weight:bold; */
  color: var(--prr-darkgrey);
  margin-top: 20px;
  margin-bottom: 5px;
  width: 100%;
}
.label.tight {
margin-top: 0px;
}

.recommendation-preview h2 {
  height: 20px;
}
.recommendation-preview p {
  height: 40px;
}
.recommendation-preview {
  background: var(--prr-extralightgrey);
  border-radius: 5px;
  padding: 10px;
  display:flex;
  flex-direction: column;
  justify-items:flex-start;
  height: 400px;
}
.recommendation-preview h2, .recommendation-preview p {
  text-align: center;
}
.buttons {
  margin-top: 20px;
  float: right;
}

.review {
  position: relative;
}
.image {
  float: left;
  margin-right: 15px;
}

.textarea-wrap {
  overflow: hidden;
  padding: 0 4px 0 0px;
}
</style>