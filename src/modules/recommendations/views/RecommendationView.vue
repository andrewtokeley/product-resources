<template>
  <div class="page">
    <loading-symbol v-if="isLoading"></loading-symbol>
    <div v-else class="content" >
      
      <template v-if="isRecommendation">
        <h1>{{ title }}</h1>
        <p>Thank you so much for recommending a new resource!</p>
      </template>
      <template v-else>
        <h1>Write a Review</h1>
        <p>Thank you so much for sharing your thoughts! </p>
      </template>

      <div v-if="isRecommendation">
        <div class="label tight">Where can people find it?</div> 
        <base-input 
          v-model="recommendation.resourceUrl" 
          @blur="validateRecommendation('resourceUrl')"
          :hasFocus="true"
          :errorMessage="errorMessage['resourceUrl']"
          :options="{ placeholder: 'Link to Resource', readOnly: isSaving, inlineErrors: false }">
        </base-input>
        <div class="label">Anything you'd like to share about the resource to help us categorise it and understand why you're recommending it?</div>
        <base-multiline-text 
          v-model="recommendation.comment"
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
        <h2 v-if="resource"><span class="material-symbols-outlined">{{resourceImage}}</span>{{ resource.displayName }}</h2>
        <resource-image v-if="resource" class="image" :resource="resource"></resource-image>
        <div class="label tight" v-if="isRecommendation">We think it's important for all recommendations to include a public review.</div>
        <div class="textarea-wrap">
          <base-multiline-text 
            v-model="review.reason"
            :validation="{ delay: 200, callback: validateReviewReason}"
            :hasFocus="!isRecommendation"
            :errorMessage="errorMessage['reason']"
            :options="{ numberOfLines: 5, 
              maximumLength: 500, 
              inlineErrors: false,
              showCharacterCount: true, 
              placeholder: 'Your Review',
              readOnly: isSaving}">
          </base-multiline-text>
          <div class="label tight">Feel free to update the name that will appear with your review</div>
          <base-input v-model="review.reviewedByName"></base-input>
          <p>Once submitted, we'll get it published as soon as possibe.</p>
        </div>
      </div>
      
      <div>
        <base-button  class="buttons" :showSpinner="isSaving" @click="handleSubmit">Submit</base-button>
        <base-button  class="buttons" :isSecondary="true" @click="$router.back()">Cancel</base-button>
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
import { useLookupStore } from '@/core/state/lookupStore'
import { getUser, updateUser } from '@/modules/users/services/user-services'

import ResourceTypeEnum from '@/modules/resources/model/resourceTypeEnum'

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
    title: "Recommendation Something New",
    resourceImage: "menu",
  }
},
async mounted() {
  this.isLoading = true;
  
  if (this.isRecommendation) {    
    const resourceTypeId = this.$route.params.typeId;
    if (resourceTypeId) {
      // we're recommending a new resource of a specific type
      this.title = "Recommend a New " + ResourceTypeEnum.fromKey(resourceTypeId).singular;
    }
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
      const type = this.lookupStore.resourceTypes.find( r => r.key == this.resource.resourceType);
      this.resourceImage = type?.icon;
      this.review.resourceId = this.resource.id;
      this.review.resourceName = this.resource.displayName;
    }
  }
  console.log('reading displayname')
  this.review.reviewedByUid = this.userStore.uid;
  this.review.reviewedByName = this.userStore.displayName;

  this.isLoading = false;
},  
computed: {
  userStore() {
    return useUserStore();
  },
  lookupStore() {
    return useLookupStore();
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
    this.validate()
    if (this.isValid) {
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
    } else {
      console.log("not valid")
    }
  },

  validate() {
    const errorsRecommendations = this.recommendation.validate();
    errorsRecommendations.forEach( e => {
      this.errorMessage[e.propertyName] = e.errorMessage;
    }) 
    const errorsReviews = this.review.validate();
    errorsReviews.forEach( e => {
      this.errorMessage[e.propertyName] = e.errorMessage;
    })
    return (errorsRecommendations.length + errorsReviews.length) == 0;
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

  validateReviewReason(newValue) {
    this.review.reason = newValue;
    return new Promise( (resolve, reject) => {
      let result = this.review.validateProperty('reason');
      if (result.success) {
        resolve(true);
      } else {
        reject(result.errorMessage);
      }
    })
  },
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

.material-symbols-outlined {
  margin-right: 10px;
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

.buttons p {
  text-align:right;
  margin-right: 10px;
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

@media only screen and (max-width: 600px) {
  .image {
    float: none;
    margin-right: 15px;
  } 
}

</style>