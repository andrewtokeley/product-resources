<template>
  <modal-dialog 
    :subTitle="subTitle" 
    :title="resourceExists ? 'Review' : 'Recommend'" 
    :buttonActions="buttonActions" 
    @buttonClick="handleButtonClick"
    @close="$emit('close')">
    <div class="content" >

      <p v-if="!resourceExists">Thank you so much for recommending a new resource!</p>
      <!-- <p v-else>Thanks for leaving a review!</p> -->

      <base-input v-if="!resourceExists"
        v-model="recommendation.resourceUrl" 
        @blur="validate('resourceUrl')"
        :errorMessage="errorMessage['resourceUrl']"
        :options="{ placeholder: 'Link to Resource', readOnly: isSaving, inlineErrors: true }">
      </base-input>
      
      <div class="label" v-if="!resourceExists">If you'd like to leave a public review...</div>

      <base-input v-model="recommendation.name" 
          @blur="validate('name')"
          :errorMessage="errorMessage['name']"
          :options="{ placeholder: 'Your Name (optional)', readOnly: isSaving}">
        </base-input>

      <base-multiline-text 
        v-model="recommendation.reason"
        :options="{ numberOfLines: 5, 
          maximumLength: 1000, 
          showCharacterCount: true, 
          placeholder: 'Why do you like it?', 
          readOnly: isSaving}">
      </base-multiline-text>
      
      <div v-if="!resourceExists" class="label">We'll check out the resource and assuming it's relevant, publish it shortly.</div>
      <div v-else class="label">We'll publish your review shortly.</div>
      
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

export default {
name: "recommend-dialog",
components: { BaseInput, BaseMultilineText, ModalDialog },  
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
      { id: 'add', showSpinner: this.isSaving, disabled: !this.recommendation.isValid(), title: "Recommend", isPrimary: true },  
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
    if (this.recommendation.isValid) {
      this.isSaving = true;
      await addRecommendation(this.recommendation);
      setTimeout(function () {
        _this.$emit('close');
      }, 2000);
    }
  },

  validate(prop) {
    let result = this.recommendation.errorStateFor(prop);
    this.errorMessage[prop] = result.errorMessage;
    if (result.data) {
      this.recommendation[prop] = result.data;
    }
  }
    
}
}
</script>

<style scoped>

.content.centred {
  display:flex;
  align-items: center;
  justify-items: center;
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