<template>
  
    <div class="content">
      <p>Thank you so much for taking the time to share a resource with other product people. You Rock!</p>
      
      <div v-if="showResourceUrl">
        <!-- <div class="label">Enter a link where people can find this resource</div> -->
        <base-input v-model="recommendation.resourceUrl" 
          @blur="validate('resourceUrl')"
          :errorMessage="errorMessage['resourceUrl']"
          :inlineErrors="true"
          :options="{ placeholder: 'Link to Resource' }">
        </base-input>
      </div>
      
      <!-- <div class="label tight">Why do like this resource?</div> -->
      <base-multiline-text 
        v-model="recommendation.reason"
        
        :options="{ numberOfLines: 5, maximumLength: 1000, showCharacterCount: true, placeholder: 'Why do you like it?'}">
      </base-multiline-text>
      
      <div class="label">At least a name, so I know you're a human :-)</div>
      <div class="double-line">
        <base-input v-model="recommendation.name" 
          @blur="validate('name')"
          :errorMessage="errorMessage['name']"
          :options="{ placeholder: 'Your Name'}">
        </base-input>
        
        <base-input v-model="recommendation.website"
          @blur="validate('website')"
          :errorMessage="errorMessage['website']"
          :options="{ placeholder: 'Linkedin/Twitter Link (Optional)'}"
        >
        </base-input>
      </div>

      <base-check-box class="label" 
        v-model="recommendation.allowPublishReason"
        label="Can we publish your reason for recommending?"
        :leftAlign="true">
      </base-check-box>

      <base-check-box class="label" 
        v-model="recommendation.allowPublishName"
        label="Can we also publish your name, alongside the recommendation?"
        @change="validate('name')"
        :leftAlign="true">
      </base-check-box>
      
    </div>
</template>

<script>
import BaseInput from '@/core/components/BaseInput.vue'
import BaseMultilineText from '@/core/components/BaseMultilineText.vue'
import BaseCheckBox from '@/core/components/BaseCheckBox.vue'
import { Recommendation } from '../model/recommendation'
import { Resource } from '@/modules/resources/model/resource'

export default {
  name: "recommend-resource",
  components: { BaseInput, BaseMultilineText, BaseCheckBox },  
  emits: ['close', 'save'],
  props: {
    resource: {
      type: Resource,
      default: null
    }
  },
  data() {
    return {
      recommendation: Recommendation.default(),
      showResourceUrl : true,
      errorMessage: [],
    }
  },
  mounted() {
    if (this.resource) {
      this.recommendation.resourceUrl = this.resource.resourceUrl;
      this.showResourceUrl = false;
    }
  },  

  methods: {
    handleButtonClick(action) {
      if (action.id == 'cancel') {
        this.$emit('close');
      } else if (action.id == 'add') {
        this.handleAdd();
      }
    },

    validate(prop) {
      console.log('val');
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