<template>
  <div class="recommend">
    <loading-symbol v-if="isLoading"></loading-symbol>
    <div v-else class="content" >
      
      <h1 class="giant">RECOMMEND</h1>
      <h2>for the community, by the community</h2>
    <!-- <template v-if="isRecommendation">
      <h1 class="giant">RECOMMEND</h1>
      <h2>for the community, by the community</h2>
    </template>
    <template v-else>
      <h1 class="giant">REVIEW</h1>
      <h2>for the community, by the community</h2>
    </template> -->

      <div v-if="isRecommendation">
        <div class="label tight">{{  whereText }}</div> 
        <base-input 
          v-model="recommendation.resourceUrl" 
          @blur="validateRecommendation('resourceUrl')"
          :hasFocus="true"
          :errorMessage="errorMessage['resourceUrl']"
          :options="{ placeholder: 'Link', readOnly: isSaving, inlineErrors: false }">
        </base-input>
      </div>
      
      <div class="review">
        <!-- <h2 v-if="resource"><span class="material-symbols-outlined">{{resourceImage}}</span>{{ resource.displayName }}</h2> -->
        <template v-if="!isRecommendation">
          <p>Recommending this resource adds it to <router-link :to="`/${userStore.username}`">your profile</router-link>.</p>
          <base-check-box 
            class="review-check"
            :leftAlign="true" 
            v-model="includeReview"
            label="Do you want to also include a review?">
          </base-check-box>
        </template>
        <resource-image v-if="resource" class="image" :resource="resource" :showTitle="true"></resource-image>
        <div class="label tight" v-if="isRecommendation">We think it's important for all new recommendations to include a public review.</div>
        <div class="textarea-wrap">
          <base-multiline-text 
            v-model="review.reason"
            :validation="{ delay: 200, callback: validateReviewReason}"
            :hasFocus="!isRecommendation"
            :errorMessage="errorMessage['reason']"
            :disabled="isSaving || !includeReview"
            :options="{ numberOfLines: 5, 
              maximumLength: 500, 
              inlineErrors: false,
              showCharacterCount: true, 
              placeholder: 'Your Review'}">
          </base-multiline-text>
          <div class="label tight">The name and job title that will appear with your review</div>
          <base-input 
            v-model="review.reviewedByName"
            :disabled="!includeReview">
          </base-input>
          <base-input 
            v-model="review.reviewedByJobTitle"
            :disabled="!includeReview">
          </base-input>
        </div>
      </div>
      
      <div v-if="isRecommendation">
        <div class="label">
          Anything you'd like to share about the resource to help us categorise it? For example, 
          What's the primary topic? Who would it be good for? 
        </div>
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

      

      <p class="closing" v-if="isRecommendation">We'll get your recommendation published as soon as possible.</p>
      <div>
        <base-button  class="buttons" :showSpinner="isSaving" @click="handleSubmit">Submit</base-button>
        <base-button  class="buttons" :isSecondary="true" @click="handleCancel">Cancel</base-button>
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
import BaseCheckBox from '@/core/components/BaseCheckBox.vue'

export default {
name: "recommend-view",
components: { 
  BaseInput, 
  BaseMultilineText,
  BaseButton,
  LoadingSymbol,
  ResourceImage,
BaseCheckBox,
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
    resourceImage: "menu",
    includeReview: false,
  }
},
async mounted() {
  this.isLoading = true;
  
  if (this.isRecommendation) {    
    // we're reviewing a new (unapproved) recommended resource
    // this.recommendation.resourceType = this.$route.params.typeId ?? 'books';
    this.includeReview = true;
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
  this.review.reviewedByUid = this.userStore.uid;
  this.review.reviewedByName = this.userStore.displayName;
  this.review.reviewedByJobTitle = this.userStore.jobTitle;

  this.isLoading = false;
},  
computed: {
  whereText() {
    const resourceTypeId = this.$route.params.typeId;
    let text = "Where can people find out more about ";
    if (resourceTypeId) {
      if (resourceTypeId == ResourceTypeEnum.People.key) {
        text += "them?"
      } else {
        const typeEnum = ResourceTypeEnum.fromKey(resourceTypeId);
        if (typeEnum) {
          text += `the ${typeEnum.singular.toLowerCase()}?`;
        } else {
          text += "the resource?";
        }        
      }
    } else {
      text += "the resource or product person?"
    }
    return text;
  },
  resourceTypeName() {
    const resourceTypeId = this.$route.params.typeId;
    if (resourceTypeId) {
      return ResourceTypeEnum.fromKey(resourceTypeId).singular
    }
    return "resource or person";    
  },
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
  handleCancel() {
    if (document.referrer.indexOf(location.protocol + "//" + location.host) === 0) {
      this.$router.back();
    } else {
      this.$router.push('/');
    }
  },
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
      if (this.review.reviewedByName != this.userStore.displayName || this.review.reviewedByJobTitle != this.userStore.jobTitle) {
        this.userStore.setDisplayName(this.review.reviewedByName);
        const user = await getUser(this.userStore.uid);
        user.displayName = this.review.reviewedByName;
        user.jobTitle = this.review.reviewedByJobTitle;
        await updateUser(user);
      }

      setTimeout(function () {
        _this.isSaving = false;
        _this.$router.push({ path: '/recommend/confirm', query: {'action': _this.isRecommendation ? "recommendation" : "review"}});
        
      }, 2000);
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

.material-symbols-outlined {
  margin-right: 10px;
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

.closing {
  text-align: right;
}

.review-check {
  margin: 30px 0px 10px 0px;
}
@media only screen and (max-width: 600px) {
  .image {
    float: none;
    margin-right: 15px;
  } 
}

</style>