<template>
  <div class="page">
    <loading-symbol v-if="isLoading"></loading-symbol>
    <div v-else class="content" >
      {{validationErrors}}
      <template v-if="isRecommendation">
        <h1>I'd Like to Recommend Something!</h1>
        <p>Thank you so much for recommending a new resource! </p>
      </template>
      <template v-else>
        <h1>I'd like to Write a Review!</h1>
        <p>Thank you so much for sharing your thoughts on this resource! </p>
      </template>

      <p>This site is founded on the principle of sharing, and you're making it happen :-)</p>

      <base-input 
        v-model="recommendation.resourceName"
        v-if="isRecommendation"
        @blur="validateRecommendation('resourceName')"
        :errorMessage="errorMessage['resourceName']"
        :hasFocus="isRecommendation"
        :options="{ placeholder: 'Name of Resource'}">
      </base-input>
      <div v-if="isRecommendation" class="double-line">
        <div>
          <div class="label">Where should the resource be categorised?</div>
          <resource-type-select v-model="this.recommendation.resourceType"></resource-type-select>
        </div>
        <div>
          <div class="label">&nbsp;</div>
          <base-input 
            v-model="recommendation.resourceUrl" 
            @blur="validateRecommendation('resourceUrl')"
            :errorMessage="errorMessage['resourceUrl']"
            :options="{ placeholder: 'Link to Resource', readOnly: isSaving, inlineErrors: false }">
          </base-input>
        </div>
      </div>
      <div v-else>
        <h2>{{ resource.displayName }}</h2>
      </div>
      
      <h2 v-if="isRecommendation">Include a Review</h2>
      <p v-if="isRecommendation">We think it's important for all recommendations to also include a public review.</p>
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
import ResourceTypeSelect from '@/modules/resources/components/ResourceTypeSelect.vue'
import BaseButton from '@/core/components/BaseButton.vue'
import LoadingSymbol from '@/core/components/LoadingSymbol.vue'

import { Recommendation } from '@/modules/recommendations/model/recommendation'
import { Review } from '@/modules/reviews/model/review'

import { addRecommendation } from '@/modules/recommendations/services/recommendation-service'
import { addReview } from '@/modules/reviews/services/review-service';
import { getResource } from '@/modules/resources/services/resource-service'
import { useUserStore } from '@/core/state/userStore'

export default {
name: "recommend-view",
components: { 
  BaseInput, 
  BaseMultilineText, 
  ResourceTypeSelect,
  BaseButton,
  LoadingSymbol,
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
  const store = useUserStore();
  console.log(store.displayName);
  
  if (this.isRecommendation) {    
    // we're reviewing a new (unapproved) recommended resource
    this.recommendation.resourceType = this.$route.params.typeId ?? 'books';
    this.recommendation.recommendedByUid = store.uid;
    this.recommendation.recommendedByName = store.displayName;
    
    this.review.resourceId = null;
  } else {
    // we're reviewing an existing resource
    const resourceId = this.$route.params.resourceId;
    this.resource = await getResource(resourceId);
    if (this.resource == null) {
      // invalid resourceid
      this.$router.push('/');
    }
    this.review.resourceId = this.resource.id;
    this.review.resourceName = this.resource.displayName;
  }
  
  this.review.reviewedByUid = store.uid;
  this.review.reviewedByName = store.displayName;

  this.isLoading = false;
},  
computed: {
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
    await addReview(this.review);
    setTimeout(function () {
      _this.isSaving = false;
      _this.$router.back();
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
</style>