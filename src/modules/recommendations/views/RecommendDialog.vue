<template>
  <modal-dialog 
    :subTitle="subTitle" 
    :title="resourceExists ? 'Review' : 'Recommend'" 
    :buttonActions="buttonActions" 
    :isLoading="false"
    @buttonClick="handleButtonClick"
    @close="$emit('close')">
    <div class="content" >

      <div class="left">
        <p v-if="!resourceExists">Thank you so much for recommending a new resource!</p>
        
        <base-input v-if="!resourceExists"
          v-model="recommendation.resourceUrl" 
          @blur="validate('resourceUrl')"
          :errorMessage="errorMessage['resourceUrl']"
          :options="{ placeholder: 'Link to Resource', readOnly: isSaving, inlineErrors: false }">
        </base-input>

        <div class="label">We think it's important for all resources to have at least one written recommendation.</div>
        <base-multiline-text 
          v-model="recommendation.reason"
          @blur="validate('reason')"
          :errorMessage="errorMessage['reason']"
          :options="{ numberOfLines: 5, 
            maximumLength: 1000, 
            inlineErrors: false,
            showCharacterCount: true, 
            placeholder: 'Reason for recommending', 
            readOnly: isSaving}">
        </base-multiline-text>

        <div class="label" v-if="!resourceExists">Personalise your review (optional)</div>

        <div class="double-line">
          <base-input v-model="recommendation.name" 
              @blur="validate('name')"
              :errorMessage="errorMessage['name']"
              :options="{ placeholder: 'Your Name', readOnly: isSaving}">
            </base-input>
            
          <base-input v-model="recommendation.website" 
            @blur="validate('website')"
            :errorMessage="errorMessage['website']"
            :options="{ placeholder: 'Your LinkedIn/Website', inlineErrors: true, readOnly: isSaving}">
          </base-input>
        </div>
        <div v-if="!resourceExists" class="label">We'll check out the resource and assuming it's relevant, publish it shortly.</div>
        <div v-else class="label">We'll publish your review shortly.</div>
      </div>
      
      <div class="right" >
        <p v-if="!recommendation.reason">- Preview -</p>
        <recommendation-widget v-if="recommendation.reason" :recommendation="recommendation"></recommendation-widget>
      </div>
      
      
      
    </div>
  </modal-dialog>
</template>

<script>
import BaseInput from '@/core/components/BaseInput.vue'
import BaseMultilineText from '@/core/components/BaseMultilineText.vue'
import ModalDialog from '@/core/components/ModalDialog.vue'

import { Recommendation } from '../model/recommendation'
import { Resource } from '@/modules/resources/model/resource'

import { addRecommendation } from '@/modules/recommendations/services/recommendation-service'
import { isObjectValid, validateProperty } from '@/core/model/validation'
import RecommendationWidget from '../components/RecommendationWidget.vue'

export default {
name: "recommend-dialog",
components: { BaseInput, BaseMultilineText, ModalDialog, RecommendationWidget },  
emits: ['close','save'],
props: {
  resource: {
    type: Resource,
    default: null
  }
},
data() {
  return {
    isSaving: false,
    recommendation: Recommendation.default(),
    resourceExists : false,
    errorMessage: [],
  }
},
mounted() {
  if (this.resource) {
    this.recommendation.resourceUrl = this.resource.resourceUrl;
    this.recommendation.resourceId = this.resource.id;
    this.recommendation.resourceType = this.resource.resourceType;
    this.resourceExists = true;
  } else {
    this.resourceExists = false;
  }
},  
computed: {
  subTitle() {
    if (this.resource) {
      return this.resource.displayName;
    }
    return null;
  },
  buttonActions() {
    return [
      { id: 'cancel', disabled: this.isSaving, title: "Cancel", isSecondary: true },
      { id: 'add', showSpinner: this.isSaving, disabled: !this.recommendation.isValid, title: "Recommend", isPrimary: true },  
    ]
  },
},

methods: {
  handleButtonClick(action) {
    if (action.id == 'cancel') {
      this.$emit('close');
    } else if (action.id == 'add') {
      this.handleAdd();
    }
  },

  async handleAdd() {
    const _this = this;
    let valid = isObjectValid(this.recommendation, this.recommendation.schema);
    if (valid) {
      this.isSaving = true;
      await addRecommendation(this.recommendation);
      setTimeout(function () {
        _this.$emit('close');
      }, 2000);
    }
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

.content {
  display:flex;
  align-items: center;
  justify-items: center;
  /* justify-content: center; */
}
.left {
  width: 400px;
}
.right {
  margin-left: 30px;
  width: 300px;
  /* background: var(--prr-extralightgrey);
  border-radius: 15px; */
}
.right p {
  width: 100%;
  text-align: center;
  font-weight: bold;
}
.double-line{
display: flex;
flex-direction: row;
gap:20px;
/* not sure why I need to set this? */
height: 50px;
}
.double-line :nth-child(2) {
flex-grow: 3;
}
.label {
color: var(--prr-darkgrey);
margin-top: 20px;
margin-bottom: 5px;
}

.label.tight {
margin-top: 0px;
}
</style>