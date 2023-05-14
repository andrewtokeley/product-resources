<template>
  <div class="page">
    <h1>I'd Like to Recommend Something!</h1>
    <div class="content" >
      
      <p>Thank you so much for recommending a new resource! </p>
      <p>This site is founded on the principle of sharing, and you're making it happen :-)</p>
      
      
      <div class="double-line">
        <div>
          <div class="label">What sort of resource is?</div>
          <resource-type-select v-model="this.recommendation.resourceType"></resource-type-select>
        </div>
        <div>
          <div class="label">&nbsp;</div>
          <base-input 
            v-model="recommendation.resourceUrl" 
            @blur="validate('resourceUrl')"
            :hasFocus="true"
            :errorMessage="errorMessage['resourceUrl']"
            :options="{ placeholder: 'Link to Resource', readOnly: isSaving, inlineErrors: false }">
          </base-input>
        </div>
      </div>

      <div class="double-line">
        <div>
          <div class="label">We think it's important for all resources to have at least one written recommendation. Here's your chance to share why you think this is a great resource.</div>
          <base-multiline-text 
            v-model="recommendation.reason"
            @blur="validate('reason')"
            :errorMessage="errorMessage['reason']"
            :options="{ numberOfLines: 10, 
              maximumLength: 500, 
              inlineErrors: false,
              showCharacterCount: true, 
              placeholder: 'Reason for recommending', 
              readOnly: isSaving}">
          </base-multiline-text>

          <div class="label">Personalise your review (optional)</div>

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
        </div>
        <div class="recommendation-preview">
          <h2>Preview</h2>
          <p>This is how people will see your recommendation. If you include your name, clicking it will show all your recommendations.</p>
          <recommendation-widget :recommendation="recommendation"></recommendation-widget>
        </div>
      </div>
      <div class="label">We'll publish your review shortly.</div>
      <div class="buttons">
        <base-button :isSecondary="true" @click="$router.back()">Cancel</base-button>
        <base-button :disabled="!canSubmit">Submit</base-button>
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
import RecommendationWidget from '../components/RecommendationWidget.vue'
import { Recommendation } from '@/modules/recommendations/model/recommendation'
import { Resource } from '@/modules/resources/model/resource'

import { addRecommendation } from '@/modules/recommendations/services/recommendation-service'
import { isObjectValid, validateObject, validateProperty } from '@/core/model/validation'

export default {
name: "recommend-view",
components: { 
  BaseInput, 
  BaseMultilineText, 
  ResourceTypeSelect,
  BaseButton,
  RecommendationWidget,
},  
props: {
  resource: {
    type: Resource,
    default: null
  }
},
beforeCreate() {
  // this is needed to avoid circular references - the recommend dialog contains the resource image which contains the dialog
  this.$options.components.ResourceImage = require("@/modules/resources/components/ResourceImage.vue").default;
},
data() {
  return {
    isSaving: false,
    recommendation: Recommendation.default(),
    errorMessage: [],
  }
},
mounted() {
  this.recommendation.resourceType = this.$route.params.typeId ?? 'books';
},  
computed: {
  canSubmit() {
    return validateObject(this.recommendation, this.recommendation.schema).length == 0;
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


.double-line{
  width: 100%;
  display: flex;
  justify-content: space-between;
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
}
.label.tight {
margin-top: 0px;
}

.recommendation-preview {
  background: var(--prr-extralightgrey);
  border-radius: 5px;
  padding: 10px;
  display:flex;
  flex-direction: column;
  align-items: top;
  justify-items: center;
}
.recommendation-preview h2 {
  text-align: center;
}
.buttons {
  float: right;
}
</style>