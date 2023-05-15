<template>
  <div class="page">
    <loading-symbol v-if="isLoading"></loading-symbol>
    <div v-else class="content" >
      
      <template v-if="!isReview">
        <h1>I'd Like to Recommend Something!</h1>
        <p>Thank you so much for recommending a new resource! </p>
      </template>
      <template v-else>
        <h1>I'd like to Write a Review!</h1>
        <p>Thank you so much for sharing your thoughts on this resource! </p>
      </template>

      <p>This site is founded on the principle of sharing, and you're making it happen :-)</p>

      <div v-if="!isReview" class="double-line">
        <div>
          <div class="label">Where should the resource be categorised?</div>
          <resource-type-select v-model="this.recommendation.resourceType"></resource-type-select>
        </div>
        <div>
          <div class="label">&nbsp;</div>
          <base-input 
            v-model="recommendation.resourceUrl" 
            @blur="validate('resourceUrl')"
            :hasFocus="!isReview"
            :errorMessage="errorMessage['resourceUrl']"
            :options="{ placeholder: 'Link to Resource', readOnly: isSaving, inlineErrors: false }">
          </base-input>
        </div>
      </div>
      <div v-else>
        <h2>{{ resource.displayName }}</h2>
      </div>
      
      <div v-if="!isReview" class="label">We think it's important for all recommendations to also include a public review.</div>
      <base-multiline-text 
        v-model="recommendation.reason"
        @blur="validate('reason')"
        :errorMessage="errorMessage['reason']"
        :hasFocus="isReview"
        :options="{ numberOfLines: 5, 
          maximumLength: 500, 
          inlineErrors: false,
          showCharacterCount: true, 
          placeholder: 'Your Review',
          readOnly: isSaving}">
      </base-multiline-text>

      <div class="buttons">
        <base-button :isSecondary="true" @click="$router.back()">Cancel</base-button>
        <base-button :showSpinner="isSaving" :disabled="!canSubmit" @click="handleSubmit">Submit</base-button>
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
// import RecommendationWidget from '../components/RecommendationWidget.vue'
import LoadingSymbol from '@/core/components/LoadingSymbol.vue'

import { Recommendation } from '@/modules/recommendations/model/recommendation'

import { addRecommendation } from '@/modules/recommendations/services/recommendation-service'
import { validateObject, validateProperty } from '@/core/model/validation'
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
    resource: null,
    errorMessage: [],
  }
},
async mounted() {
  this.isLoading = true;
  const store = useUserStore();
  if (this.isReview) {
    const resourceId = this.$route.params.resourceId;
    this.resource = await getResource(resourceId);
    if (this.resource == null) {
      // invalid resourceid
      this.$router.push('/');
    }
    this.recommendation.resourceId = this.resource.id;
    this.recommendation.resourceType = this.resource.resourceType;
    this.recommendation.resourceUrl = this.resource.resourceUrl;
  } else {
    this.recommendation.resourceType = this.$route.params.typeId ?? 'books';
  }
  this.recommendation.uid = store.uid;
  this.recommendation.name = store.displayName;
  this.isLoading = false;
},  
computed: {
  // reasonPlaceholder() {
  //   return this.isReview ? "Your Review" : "Reason for recommending";
  // },
  isReview() {
    return this.$route.params.resourceId != null;
  },
  canSubmit() {
    return validateObject(this.recommendation, this.recommendation.schema).length == 0;
  },
},

methods: {
  
  async handleSubmit() {
    const _this = this;
    this.isSaving = true;
    await addRecommendation(this.recommendation);
    setTimeout(function () {
      _this.isSaving = false;
      _this.$router.back();
    }, 2000);
  },

  validate(prop) {
    let result = validateProperty(this.recommendation, this.recommendation.schema, prop);
    this.errorMessage[prop] = result.errorMessage;
    if (result.data) {
      this.recommendation[prop] = result.data;
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
  float: right;
}
</style>